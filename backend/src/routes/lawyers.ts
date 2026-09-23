import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../lib/errors.js";

const listQuery = z.object({
  city: z.string().max(64).optional(),
  area: z.string().max(64).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const publicSelect = {
  id: true,
  slug: true,
  displayName: true,
  headline: true,
  bio: true,
  bioUrdu: true,
  gender: true,
  yearsExperience: true,
  consultationFeePaisa: true,
  courts: true,
  barCouncil: true,
  ratingAvg: true,
  ratingCount: true,
  totalConsultations: true,
  city: { select: { slug: true, nameEn: true, nameUr: true, province: true } },
  practiceAreas: {
    select: { isPrimary: true, practiceArea: { select: { slug: true, nameEn: true, nameUr: true } } },
    orderBy: { isPrimary: "desc" as const },
  },
  languages: { select: { language: { select: { code: true, nameEn: true, nameUr: true } } } },
  education: { select: { degree: true, institution: true, year: true }, orderBy: { year: "desc" as const } },
  chambers: {
    select: { id: true, name: true, address: true, phone: true, isPrimary: true, city: { select: { slug: true, nameEn: true } } },
  },
} as const;

const listedWhere = {
  isListed: true,
  verificationStatus: "APPROVED" as const,
  isSeedData: false,
};

export async function lawyerRoutes(app: FastifyInstance) {
  /** Public directory — only approved, listed, non-seed lawyers. */
  app.get("/lawyers", async (req) => {
    const parsed = listQuery.safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid search parameters.");
    const { city, area, q, page, limit } = parsed.data;

    const where: Record<string, unknown> = { ...listedWhere };
    if (city) where.city = { slug: city };
    if (area) where.practiceAreas = { some: { practiceArea: { slug: area } } };
    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { headline: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, lawyers] = await prisma.$transaction([
      prisma.lawyer.count({ where }),
      prisma.lawyer.findMany({
        where,
        select: publicSelect,
        orderBy: [{ ratingAvg: "desc" }, { totalConsultations: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { ok: true, total, page, limit, lawyers };
  });

  /** Public profile + latest reviews. */
  app.get("/lawyers/:slug", async (req) => {
    const { slug } = req.params as { slug: string };
    const lawyer = await prisma.lawyer.findFirst({
      where: { slug, ...listedWhere },
      select: {
        ...publicSelect,
        reviews: {
          select: { id: true, rating: true, comment: true, verified: true, createdAt: true, client: { select: { fullName: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!lawyer) throw notFound("Lawyer not found.");
    return { ok: true, lawyer };
  });

  /**
   * Real availability: weekly schedule minus overrides minus existing
   * bookings, in 30-minute slots, Asia/Karachi days.
   */
  app.get("/lawyers/:slug/slots", async (req) => {
    const { slug } = req.params as { slug: string };
    const query = z.object({ days: z.coerce.number().int().min(1).max(14).default(7) }).safeParse(req.query);
    if (!query.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");

    const lawyer = await prisma.lawyer.findFirst({ where: { slug, ...listedWhere }, select: { id: true } });
    if (!lawyer) throw notFound("Lawyer not found.");

    const [weekly, overrides, bookings] = await prisma.$transaction([
      prisma.weeklyAvailability.findMany({ where: { lawyerId: lawyer.id, isActive: true } }),
      prisma.dateOverride.findMany({
        where: { lawyerId: lawyer.id, date: { gte: new Date(new Date().toISOString().slice(0, 10)) } },
      }),
      prisma.booking.findMany({
        where: {
          lawyerId: lawyer.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          startAt: { gte: new Date(), lt: new Date(Date.now() + query.data.days * 86400_000) },
        },
        select: { startAt: true, endAt: true },
      }),
    ]);

    const SLOT_MIN = 30;
    const days: { date: string; label: string; slots: { start: string; end: string; taken: boolean }[] }[] = [];
    const taken = bookings.map((b) => ({ s: b.startAt.getTime(), e: b.endAt.getTime() }));

    for (let d = 0; d < query.data.days; d++) {
      // Work in Asia/Karachi: build the day from its PKT calendar date.
      const nowPkt = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
      const dayPkt = new Date(nowPkt.getFullYear(), nowPkt.getMonth(), nowPkt.getDate() + d);
      const dow = dayPkt.getDay();
      const dateKey = `${dayPkt.getFullYear()}-${String(dayPkt.getMonth() + 1).padStart(2, "0")}-${String(dayPkt.getDate()).padStart(2, "0")}`;

      const override = overrides.find((o) => o.date.toISOString().slice(0, 10) === dateKey);
      if (override && !override.isAvailable) continue;

      const windows = override?.startTime != null
        ? [{ startTime: override.startTime, endTime: override.endTime ?? override.startTime }]
        : weekly.filter((w) => w.dayOfWeek === dow).map((w) => ({ startTime: w.startTime, endTime: w.endTime }));

      const slots: { start: string; end: string; taken: boolean }[] = [];
      for (const win of windows) {
        for (let m = win.startTime; m + SLOT_MIN <= win.endTime; m += SLOT_MIN) {
          // Convert PKT wall-clock minutes to an absolute UTC instant.
          const pktMidnightUtc = Date.UTC(dayPkt.getFullYear(), dayPkt.getMonth(), dayPkt.getDate()) - 5 * 3600_000;
          const startUtc = new Date(pktMidnightUtc + m * 60_000);
          const endUtc = new Date(startUtc.getTime() + SLOT_MIN * 60_000);
          if (startUtc.getTime() < Date.now() + 30 * 60_000) continue; // no booking < 30 min out
          const isTaken = taken.some((t) => startUtc.getTime() < t.e && endUtc.getTime() > t.s);
          const hh = String(Math.floor(m / 60)).padStart(2, "0");
          const mm = String(m % 60).padStart(2, "0");
          slots.push({ start: `${hh}:${mm}`, end: "", taken: isTaken });
        }
      }
      if (slots.length > 0) {
        days.push({
          date: dateKey,
          label: dayPkt.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" }),
          slots: slots.map((s) => ({ ...s, end: "" })),
        });
      }
    }

    return { ok: true, days };
  });
}
