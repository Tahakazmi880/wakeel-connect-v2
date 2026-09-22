// ============================================================
// wakeel.connect — database seed (Phase 1)
// Reference data: cities, practice areas, languages.
// Demo lawyers are flagged isSeedData = true and carry "(Demo)"
// in their display names. They must NEVER be presented as real
// verified lawyers — the frontend filters them out of public
// listings (see Phase 2).
//
// Idempotent: safe to run multiple times (upserts everywhere).
// ============================================================

import { PrismaClient, Role, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------- Reference data ----------------

const CITIES = [
  { slug: "karachi", nameEn: "Karachi", nameUr: "کراچی", province: "Sindh" },
  { slug: "lahore", nameEn: "Lahore", nameUr: "لاہور", province: "Punjab" },
  { slug: "islamabad", nameEn: "Islamabad", nameUr: "اسلام آباد", province: "Islamabad Capital Territory" },
  { slug: "rawalpindi", nameEn: "Rawalpindi", nameUr: "راولپنڈی", province: "Punjab" },
  { slug: "faisalabad", nameEn: "Faisalabad", nameUr: "فیصل آباد", province: "Punjab" },
  { slug: "multan", nameEn: "Multan", nameUr: "ملتان", province: "Punjab" },
  { slug: "peshawar", nameEn: "Peshawar", nameUr: "پشاور", province: "Khyber Pakhtunkhwa" },
  { slug: "quetta", nameEn: "Quetta", nameUr: "کوئٹہ", province: "Balochistan" },
  { slug: "hyderabad", nameEn: "Hyderabad", nameUr: "حیدرآباد", province: "Sindh" },
  { slug: "sialkot", nameEn: "Sialkot", nameUr: "سیالکوٹ", province: "Punjab" },
  { slug: "gujranwala", nameEn: "Gujranwala", nameUr: "گوجرانوالہ", province: "Punjab" },
  { slug: "bahawalpur", nameEn: "Bahawalpur", nameUr: "بہاولپور", province: "Punjab" },
];

const PRACTICE_AREAS = [
  { slug: "family-law", nameEn: "Family Law", nameUr: "خاندانی قانون", description: "Divorce, khula, child custody, maintenance and inheritance matters.", sortOrder: 1 },
  { slug: "criminal-law", nameEn: "Criminal Law", nameUr: "فوجداری قانون", description: "Bail, trials, appeals and quashment petitions.", sortOrder: 2 },
  { slug: "property-law", nameEn: "Property Law", nameUr: "جائیداد کا قانون", description: "Title disputes, possession suits, registry and transfer matters.", sortOrder: 3 },
  { slug: "corporate-law", nameEn: "Corporate Law", nameUr: "کارپوریٹ قانون", description: "Company formation, contracts, compliance and mergers.", sortOrder: 4 },
  { slug: "tax-law", nameEn: "Tax Law", nameUr: "ٹیکس قانون", description: "Income tax, sales tax, FBR notices and tribunal appeals.", sortOrder: 5 },
  { slug: "immigration-law", nameEn: "Immigration Law", nameUr: "امیگریشن قانون", description: "Visas, deportation defence and citizenship matters.", sortOrder: 6 },
  { slug: "labour-law", nameEn: "Labour & Employment", nameUr: "محنت کشوں کا قانون", description: "Wrongful termination, wages, and workplace disputes.", sortOrder: 7 },
  { slug: "banking-finance", nameEn: "Banking & Finance", nameUr: "بینکاری و مالیات", description: "Loan defaults, banking court cases and recovery suits.", sortOrder: 8 },
  { slug: "constitutional-law", nameEn: "Constitutional Law", nameUr: "آئینی قانون", description: "Writ petitions, fundamental rights and public interest litigation.", sortOrder: 9 },
  { slug: "cybercrime-law", nameEn: "Cybercrime Law", nameUr: "سائبر کرائم قانون", description: "Online harassment, fraud and PECA cases.", sortOrder: 10 },
  { slug: "consumer-law", nameEn: "Consumer Protection", nameUr: "صارفین کے حقوق", description: "Faulty goods and services, consumer court claims.", sortOrder: 11 },
  { slug: "arbitration", nameEn: "Arbitration & Mediation", nameUr: "ثالثی و مصالحت", description: "Out-of-court dispute resolution and settlements.", sortOrder: 12 },
];

const LANGUAGES = [
  { code: "ur", nameEn: "Urdu", nameUr: "اردو" },
  { code: "en", nameEn: "English", nameUr: "انگریزی" },
  { code: "pa", nameEn: "Punjabi", nameUr: "پنجابی" },
  { code: "sd", nameEn: "Sindhi", nameUr: "سندھی" },
  { code: "ps", nameEn: "Pashto", nameUr: "پشتو" },
];

// ---------------- Demo lawyers (NOT real) ----------------

interface DemoLawyer {
  phone: string;
  fullName: string;
  slug: string;
  displayName: string;
  headline: string;
  citySlug: string;
  yearsExperience: number;
  feePaisa: number;
  barCouncil: string;
  barCouncilNo: string;
  courts: string[];
  practiceAreaSlugs: string[];
  langCodes: string[];
  chamberName: string;
  chamberAddress: string;
}

const DEMO_LAWYERS: DemoLawyer[] = [
  {
    phone: "+923001234501",
    fullName: "Ahmed Raza",
    slug: "ahmed-raza-demo",
    displayName: "Ahmed Raza (Demo)",
    headline: "Family & property disputes, Lahore High Court",
    citySlug: "lahore",
    yearsExperience: 12,
    feePaisa: 300000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-001",
    courts: ["Lahore High Court", "District Courts Lahore"],
    practiceAreaSlugs: ["family-law", "property-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Raza Law Chamber",
    chamberAddress: "14-D, Davis Road, Lahore",
  },
  {
    phone: "+923001234502",
    fullName: "Fatima Khan",
    slug: "fatima-khan-demo",
    displayName: "Fatima Khan (Demo)",
    headline: "Criminal defence & cybercrime, Karachi",
    citySlug: "karachi",
    yearsExperience: 8,
    feePaisa: 250000,
    barCouncil: "Sindh Bar Council",
    barCouncilNo: "SBC-DEMO-002",
    courts: ["Sindh High Court", "City Courts Karachi"],
    practiceAreaSlugs: ["criminal-law", "cybercrime-law"],
    langCodes: ["ur", "en", "sd"],
    chamberName: "Khan Legal Associates",
    chamberAddress: "Office 301, Clifton Centre, Karachi",
  },
  {
    phone: "+923001234503",
    fullName: "Muhammad Bilal",
    slug: "muhammad-bilal-demo",
    displayName: "Muhammad Bilal (Demo)",
    headline: "Corporate & tax advisory, Islamabad",
    citySlug: "islamabad",
    yearsExperience: 15,
    feePaisa: 500000,
    barCouncil: "Islamabad Bar Council",
    barCouncilNo: "IBC-DEMO-003",
    courts: ["Islamabad High Court", "Supreme Court of Pakistan"],
    practiceAreaSlugs: ["corporate-law", "tax-law"],
    langCodes: ["ur", "en"],
    chamberName: "Bilal & Partners",
    chamberAddress: "Suite 12, Blue Area, Islamabad",
  },
  {
    phone: "+923001234504",
    fullName: "Ayesha Malik",
    slug: "ayesha-malik-demo",
    displayName: "Ayesha Malik (Demo)",
    headline: "Immigration & labour matters, Rawalpindi",
    citySlug: "rawalpindi",
    yearsExperience: 6,
    feePaisa: 200000,
    barCouncil: "Punjab Bar Council",
    barCouncilNo: "PBC-DEMO-004",
    courts: ["Lahore High Court Rawalpindi Bench", "District Courts Rawalpindi"],
    practiceAreaSlugs: ["immigration-law", "labour-law"],
    langCodes: ["ur", "en", "pa"],
    chamberName: "Malik Law Office",
    chamberAddress: "House 7, Satellite Town, Rawalpindi",
  },
];

// ---------------- Seed ----------------

async function main() {
  for (const c of CITIES) {
    await prisma.city.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameUr: c.nameUr, province: c.province },
      create: c,
    });
  }
  console.log(`seeded ${CITIES.length} cities`);

  for (const p of PRACTICE_AREAS) {
    await prisma.practiceArea.upsert({
      where: { slug: p.slug },
      update: { nameEn: p.nameEn, nameUr: p.nameUr, description: p.description, sortOrder: p.sortOrder },
      create: p,
    });
  }
  console.log(`seeded ${PRACTICE_AREAS.length} practice areas`);

  for (const l of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: l.code },
      update: { nameEn: l.nameEn, nameUr: l.nameUr },
      create: l,
    });
  }
  console.log(`seeded ${LANGUAGES.length} languages`);

  for (const d of DEMO_LAWYERS) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: d.citySlug } });

    const user = await prisma.user.upsert({
      where: { phone: d.phone },
      update: {},
      create: {
        phone: d.phone,
        fullName: d.fullName,
        role: Role.LAWYER,
      },
    });

    const lawyer = await prisma.lawyer.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        userId: user.id,
        slug: d.slug,
        displayName: d.displayName,
        headline: d.headline,
        bio: "Demo profile for development only. Not a real lawyer.",
        cityId: city.id,
        yearsExperience: d.yearsExperience,
        consultationFeePaisa: d.feePaisa,
        courts: d.courts,
        barCouncil: d.barCouncil,
        barCouncilNo: d.barCouncilNo,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
        isListed: true,
        isSeedData: true,
      },
    });

    await prisma.chamber.upsert({
      where: { id: `${lawyer.id}-primary` },
      update: {},
      create: {
        id: `${lawyer.id}-primary`,
        lawyerId: lawyer.id,
        name: d.chamberName,
        address: d.chamberAddress,
        cityId: city.id,
        isPrimary: true,
      },
    });

    for (const [i, slug] of d.practiceAreaSlugs.entries()) {
      const pa = await prisma.practiceArea.findUniqueOrThrow({ where: { slug } });
      await prisma.lawyerPracticeArea.upsert({
        where: { lawyerId_practiceAreaId: { lawyerId: lawyer.id, practiceAreaId: pa.id } },
        update: {},
        create: { lawyerId: lawyer.id, practiceAreaId: pa.id, isPrimary: i === 0 },
      });
    }

    for (const code of d.langCodes) {
      await prisma.lawyerLanguage.upsert({
        where: { lawyerId_langCode: { lawyerId: lawyer.id, langCode: code } },
        update: {},
        create: { lawyerId: lawyer.id, langCode: code },
      });
    }

    // Mon–Fri 09:00–17:00 (minutes since midnight)
    for (let dow = 1; dow <= 5; dow++) {
      await prisma.weeklyAvailability.upsert({
        where: {
          lawyerId_dayOfWeek_startTime: { lawyerId: lawyer.id, dayOfWeek: dow, startTime: 540 },
        },
        update: {},
        create: { lawyerId: lawyer.id, dayOfWeek: dow, startTime: 540, endTime: 1020 },
      });
    }
  }
  console.log(`seeded ${DEMO_LAWYERS.length} demo lawyers (isSeedData=true)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
