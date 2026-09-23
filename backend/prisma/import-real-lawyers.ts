// One-time admin import of the firm's 21 real lawyer profiles into PostgreSQL.
// Run: npx tsx prisma/import-real-lawyers.ts   (idempotent — safe to re-run)
//
// ---- Honesty policy (see MEMORY.md, 2026-09-23) ----
// Imported as-is from the firm sites (karachilegalhouse.com / shamslawchamber.com):
//   names, titles, bios, education, practice areas, languages, chamber info.
// consultationFeePaisa: ONLY the 4 user-confirmed fees below. 0 = "fee on request".
// yearsExperience: ONLY Shamsuddin's 24 (site-confirmed). 0 = "not specified".
// photoUrl: ONLY the 4 real portraits in backend/public/lawyers/. null = initials avatar.
// Office-city grouping for Shams Law Chamber lawyers follows the team page's
// sections (inferred) — flagged for client confirmation, not asserted as fact.
// Lawyer User rows get reserved-range phones (+999…) that can never be real
// numbers; they are internal only and never exposed by the public API.

import { PrismaClient } from "@prisma/client";
import { LAWYERS } from "../../frontend/lib/data.js";

const prisma = new PrismaClient();

const CONFIRMED_FEES_PAISA: Record<string, number> = {
  "shamsuddin-rajper": 1_500_000, // Rs. 15,000 — confirmed by client 2026-09-23
  "fayazuddin-rajper": 800_000, // Rs. 8,000 — confirmed by client 2026-09-23
  "jahangir-shams": 800_000, // Rs. 8,000 — confirmed by client 2026-09-23
  "raheem-dad-shujrah": 600_000, // Rs. 6,000 — confirmed by client 2026-09-23
};

const CONFIRMED_EXPERIENCE: Record<string, number> = {
  "shamsuddin-rajper": 24, // 24 yrs continuous practice since 2002 — per firm site
};

const REAL_PHOTOS = new Set([
  "shamsuddin-rajper",
  "fayazuddin-rajper",
  "jahangir-shams",
  "raheem-dad-shujrah",
]);

// Firm office hours (per firm site): Mon–Sat, 9:00 AM – 8:00 PM PKT.
const WEEKLY_WINDOWS = [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
  dayOfWeek,
  startTime: 540, // 09:00
  endTime: 1200, // 20:00
  isActive: true,
}));

async function main() {
  const real = LAWYERS.filter((l) => !l.isDemo);
  console.log(`Importing ${real.length} real lawyers...`);

  const admin = await prisma.user.upsert({
    where: { phone: "+99900000000" },
    update: {},
    create: { phone: "+99900000000", fullName: "Platform Admin", role: "ADMIN" },
  });

  const cityBySlug = new Map(
    (await prisma.city.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]),
  );
  const areaBySlug = new Map(
    (await prisma.practiceArea.findMany({ select: { id: true, slug: true } })).map((a) => [a.slug, a.id]),
  );
  const knownLangs = new Set(
    (await prisma.language.findMany({ select: { code: true } })).map((l) => l.code),
  );

  for (const [i, l] of real.entries()) {
    const cityId = cityBySlug.get(l.citySlug);
    if (!cityId) throw new Error(`Unknown city slug "${l.citySlug}" for lawyer "${l.slug}"`);

    const phone = `+999000001${String(i + 1).padStart(2, "0")}`;
    const user = await prisma.user.upsert({
      where: { phone },
      update: { fullName: l.displayName, role: "LAWYER" },
      create: { phone, fullName: l.displayName, role: "LAWYER" },
    });

    const core = {
      displayName: l.displayName,
      headline: l.headline,
      bio: l.bio,
      bioUrdu: l.bioUrdu,
      gender: l.gender === "female" ? ("FEMALE" as const) : ("MALE" as const),
      cityId,
      yearsExperience: CONFIRMED_EXPERIENCE[l.slug] ?? 0,
      consultationFeePaisa: CONFIRMED_FEES_PAISA[l.slug] ?? 0,
      courts: l.courts,
      barCouncil: l.barCouncil,
      photoUrl: REAL_PHOTOS.has(l.slug) ? `/lawyers/${l.slug}.jpg` : null,
      verificationStatus: "APPROVED" as const,
      verifiedAt: new Date(),
      isListed: true,
      isSeedData: false,
    };

    const lawyer = await prisma.lawyer.upsert({
      where: { slug: l.slug },
      update: core,
      create: { ...core, slug: l.slug, userId: user.id },
    });

    // Relations: wipe + recreate for idempotency.
    await prisma.$transaction([
      prisma.lawyerPracticeArea.deleteMany({ where: { lawyerId: lawyer.id } }),
      prisma.lawyerLanguage.deleteMany({ where: { lawyerId: lawyer.id } }),
      prisma.education.deleteMany({ where: { lawyerId: lawyer.id } }),
      prisma.chamber.deleteMany({ where: { lawyerId: lawyer.id } }),
      prisma.weeklyAvailability.deleteMany({ where: { lawyerId: lawyer.id } }),
    ]);

    const areaLinks = l.practiceAreaSlugs.map((slug, idx) => {
      const practiceAreaId = areaBySlug.get(slug);
      if (!practiceAreaId) throw new Error(`Unknown practice area "${slug}" for lawyer "${l.slug}"`);
      return { lawyerId: lawyer.id, practiceAreaId, isPrimary: idx === 0 };
    });
    if (areaLinks.length > 0) await prisma.lawyerPracticeArea.createMany({ data: areaLinks });

    const langLinks = l.langCodes
      .filter((c) => knownLangs.has(c))
      .map((langCode) => ({ lawyerId: lawyer.id, langCode }));
    if (langLinks.length > 0) await prisma.lawyerLanguage.createMany({ data: langLinks });

    if (l.education.length > 0) {
      await prisma.education.createMany({
        data: l.education.map((e) => ({
          lawyerId: lawyer.id,
          degree: e.degree,
          institution: e.institution || "",
          year: e.year || null,
        })),
      });
    }

    await prisma.chamber.create({
      data: {
        lawyerId: lawyer.id,
        name: l.chamberName,
        address: l.chamberAddress,
        cityId,
        isPrimary: true,
      },
    });

    await prisma.weeklyAvailability.createMany({
      data: WEEKLY_WINDOWS.map((w) => ({ ...w, lawyerId: lawyer.id })),
    });

    const existingDecision = await prisma.verificationDecision.findFirst({
      where: { lawyerId: lawyer.id, toStatus: "APPROVED" },
      select: { id: true },
    });
    if (!existingDecision) {
      await prisma.verificationDecision.create({
        data: {
          lawyerId: lawyer.id,
          adminId: admin.id,
          fromStatus: "PENDING",
          toStatus: "APPROVED",
          note: "Admin import from firm website (karachilegalhouse.com / shamslawchamber.com). Fees and experience stored only where confirmed by the firm; otherwise shown as unspecified.",
        },
      });
    }

    console.log(`  ✓ ${l.slug}`);
  }

  const listed = await prisma.lawyer.count({
    where: { isListed: true, verificationStatus: "APPROVED", isSeedData: false },
  });
  console.log(`Done. Public directory now lists ${listed} real lawyers.`);
}

main()
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
