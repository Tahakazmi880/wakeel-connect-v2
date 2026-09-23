import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../lib/errors.js";

const listQuery = z.object({
  city: z.string().max(64).optional(),
  area: z.string().max(64).optional(),
  q: z.string().max(100).optional(),
  online: z.enum(["1"]).optional(),
  today: z.enum(["1"]).optional(),
  gender: z.enum(["female", "male"]).optional(),
  sort: z.enum(["most-experienced", "lowest-fee", "highest-rated"]).optional(),
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
  photoUrl: true,
  yearsExperience: true,
  consultationFeePaisa: true,
  offersOnline: true,
  onlineFeePaisa: true,
  memberships: true,
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

const SLOT_MIN = 30;

/** "Now" in Asia/Karachi wall-clock terms. */
function pktNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
}

interface DayWindows {
  dateKey: string;
  label: string;
  dayPkt: Date;
  windows: { startTime: number; endTime: number }[];
}

/**
 * Weekly windows + date overrides for one PKT day offset (0 = today).
 * Returns null when the lawyer has no availability windows that day.
 */
function dayWindows(
  dayOffset: number,
  weekly: { dayOfWeek: number; startTime: number; endTime: number }[],
  overridesByKey: Map<string, { isAvailable: boolean; startTime: number | null; endTime: number | null }>,
): DayWindows | null {
  const nowPkt = pktNow();
  const dayPkt = new Date(nowPkt.getFullYear(), nowPkt.getMonth(), nowPkt.getDate() + dayOffset);
  const dow = dayPkt.getDay();
  const dateKey = `${dayPkt.getFullYear()}-${String(dayPkt.getMonth() + 1).padStart(2, "0")}-${String(
    dayPkt.getDate()
  ).padStart(2, "0")}`;
  const override = overridesByKey.get(dateKey);
  if (override && !override.isAvailable) return null;
  const windows =
    override?.startTime != null
      ? [{ startTime: override.startTime, endTime: override.endTime ?? override.startTime }]
      : weekly.filter((w) => w.dayOfWeek === dow).map((w) => ({ startTime: w.startTime, endTime: w.endTime }));
  if (windows.length === 0) return null;
  return {
    dateKey,
    label: dayPkt.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" }),
    dayPkt,
    windows,
  };
}

/** Absolute UTC instants (ms) of every bookable 30-min slot start for a day. */
function slotStarts(day: DayWindows): number[] {
  const starts: number[] = [];
  for (const win of day.windows) {
    for (let m = win.startTime; m + SLOT_MIN <= win.endTime; m += SLOT_MIN) {
      const pktMidnightUtc = Date.UTC(day.dayPkt.getFullYear(), day.dayPkt.getMonth(), day.dayPkt.getDate()) - 5 * 3600_000;
      starts.push(pktMidnightUtc + m * 60_000);
    }
  }
  return starts;
}

export async function lawyerRoutes(app: FastifyInstance) {
  /** Public directory — only approved, listed, non-seed lawyers. */
  app.get("/lawyers", async (req) => {
    const parsed = listQuery.safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid search parameters.");
    const { city, area, q, online, today, gender, sort, page, limit } = parsed.data;

    const where: Record<string, unknown> = { ...listedWhere };
    if (city) where.city = { slug: city };
    if (area) where.practiceAreas = { some: { practiceArea: { slug: area } } };
    if (online) where.offersOnline = true;
    if (gender) where.gender = gender.toUpperCase(); // "female" -> "FEMALE"
    if (q) {
      // Courts are stored as a string[]; match partial court names by expanding
      // against the distinct court values actually in the DB.
      const rows = await prisma.$queryRaw<{ courts: string }[]>`SELECT DISTINCT unnest(courts) AS courts FROM "Lawyer"`;
      const matchedCourts = rows.map((r) => r.courts).filter((c) => c.toLowerCase().includes(q.toLowerCase()));
      const or: Record<string, unknown>[] = [
        { displayName: { contains: q, mode: "insensitive" } },
        { headline: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
        { practiceAreas: { some: { practiceArea: { nameEn: { contains: q, mode: "insensitive" } } } } },
      ];
      if (matchedCourts.length > 0) or.push({ courts: { hasSome: matchedCourts } });
      where.OR = or;
    }

    // "Available today" — pre-filter to lawyers with availability windows today (PKT).
    if (today) {
      const ids = (await prisma.lawyer.findMany({ where, select: { id: true } })).map((l) => l.id);
      const nowPkt = pktNow();
      const todayKey = `${nowPkt.getFullYear()}-${String(nowPkt.getMonth() + 1).padStart(2, "0")}-${String(
        nowPkt.getDate()
      ).padStart(2, "0")}`;
      const [weeklyAll, overridesAll] = await prisma.$transaction([
        prisma.weeklyAvailability.findMany({ where: { lawyerId: { in: ids }, isActive: true } }),
        prisma.dateOverride.findMany({ where: { lawyerId: { in: ids }, date: new Date(todayKey) } }),
      ]);
      const qualified = ids.filter((id) => {
        const weekly = weeklyAll.filter((w) => w.lawyerId === id);
        const byKey = new Map(overridesAll.filter((o) => o.lawyerId === id).map((o) => [o.date.toISOString().slice(0, 10), o]));
        return dayWindows(0, weekly, byKey) !== null;
      });
      where.id = { in: qualified };
    }

    const orderBy =
      sort === "most-experienced"
        ? [{ yearsExperience: "desc" as const }]
        : sort === "lowest-fee"
          ? [{ consultationFeePaisa: "asc" as const }]
          : [{ ratingAvg: "desc" as const }, { totalConsultations: "desc" as const }];

    const [total, lawyers] = await prisma.$transaction([
      prisma.lawyer.count({ where }),
      prisma.lawyer.findMany({
        where,
        select: publicSelect,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // nextAvailable: first date in the next 7 days (PKT) with at least one free slot.
    const ids = lawyers.map((l) => l.id);
    const horizonMs = 7 * 86400_000;
    const [weeklyAll, overridesAll, bookingsAll] = await prisma.$transaction([
      prisma.weeklyAvailability.findMany({ where: { lawyerId: { in: ids }, isActive: true } }),
      prisma.dateOverride.findMany({
        where: { lawyerId: { in: ids }, date: { gte: new Date(new Date().toISOString().slice(0, 10)) } },
      }),
      prisma.booking.findMany({
        where: {
          lawyerId: { in: ids },
          status: { in: ["PENDING", "CONFIRMED"] },
          startAt: { gte: new Date(), lt: new Date(Date.now() + horizonMs) },
        },
        select: { lawyerId: true, startAt: true, endAt: true },
      }),
    ]);
    const cutoff = Date.now() + 30 * 60_000;
    const withNext = lawyers.map((l) => {
      const weekly = weeklyAll.filter((w) => w.lawyerId === l.id);
      const byKey = new Map(overridesAll.filter((o) => o.lawyerId === l.id).map((o) => [o.date.toISOString().slice(0, 10), o]));
      const taken = bookingsAll
        .filter((b) => b.lawyerId === l.id)
        .map((b) => ({ s: b.startAt.getTime(), e: b.endAt.getTime() }));
      let nextAvailable: { date: string; label: string } | null = null;
      for (let d = 0; d < 7 && !nextAvailable; d++) {
        const day = dayWindows(d, weekly, byKey);
        if (!day) continue;
        const free = slotStarts(day).some(
          (s) => s >= cutoff && !taken.some((t) => s < t.e && s + SLOT_MIN * 60_000 > t.s)
        );
        if (free) nextAvailable = { date: day.dateKey, label: day.label };
      }
      return { ...l, nextAvailable };
    });

    return { ok: true, total, page, limit, lawyers: withNext };
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
