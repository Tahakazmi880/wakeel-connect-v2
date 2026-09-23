/**
 * Admin portal endpoints: dashboard stats, platform-wide booking list,
 * and the audit trail. All routes require the ADMIN role.
 *
 * Resource-specific admin actions (verification queue, lead inbox, review
 * and question moderation) live in their own route modules.
 */
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const admin = { preHandler: [requireAuth, requireRole("ADMIN")] };

export async function adminRoutes(app: FastifyInstance) {
  /** Dashboard aggregates — every number is a live DB count, never invented. */
  app.get("/admin/stats", admin, async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [
      pendingApplications,
      newLeads,
      approvedLawyers,
      bookingsToday,
      totalBookings,
      totalReviews,
      totalQuestions,
    ] = await prisma.$transaction([
      prisma.lawyer.count({ where: { verificationStatus: "PENDING" } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lawyer.count({ where: { verificationStatus: "APPROVED", isListed: true } }),
      prisma.booking.count({ where: { createdAt: { gte: today } } }),
      prisma.booking.count(),
      prisma.review.count({ where: { hidden: false } }),
      prisma.forumQuestion.count(),
    ]);
    return {
      ok: true,
      stats: {
        pendingApplications,
        newLeads,
        approvedLawyers,
        bookingsToday,
        totalBookings,
        totalReviews,
        totalQuestions,
      },
    };
  });

  /** Admin: every booking on the platform, newest first. */
  app.get("/admin/bookings", admin, async (req) => {
    const parsed = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        status: z.nativeEnum(BookingStatus).optional(),
      })
      .safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");
    const { page, limit, status } = parsed.data;
    const where = status ? { status } : {};
    const [total, bookings] = await prisma.$transaction([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, startAt: true, endAt: true, status: true, mode: true,
          feePaisa: true, createdAt: true,
          lawyer: { select: { id: true, displayName: true, slug: true } },
          client: { select: { fullName: true, phone: true } },
        },
      }),
    ]);
    return { ok: true, total, page, limit, bookings };
  });

  /** Admin: full booking detail (client contact included — admin eyes only). */
  app.get("/admin/bookings/:id", admin, async (req) => {
    const { id } = req.params as { id: string };
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true, startAt: true, endAt: true, status: true, mode: true,
        feePaisa: true, clientPhone: true, clientNote: true,
        cancelReason: true, cancelledAt: true, createdAt: true, updatedAt: true,
        lawyer: { select: { id: true, displayName: true, slug: true } },
        client: { select: { id: true, fullName: true, phone: true } },
        chamber: { select: { id: true, name: true, address: true } },
        documents: { select: { id: true, fileName: true, mimeType: true, sizeBytes: true, createdAt: true } },
        payment: { select: { id: true, amountPaisa: true, status: true, createdAt: true } },
      },
    });
    if (!booking) throw notFound("Booking not found.");
    return { ok: true, booking };
  });

  /** Admin: audit trail, newest first, with optional actor/action filters. */
  app.get("/admin/audit-log", admin, async (req) => {
    const parsed = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        actorId: z.string().min(1).optional(),
        action: z.string().max(80).optional(),
      })
      .safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");
    const { page, limit, actorId, action } = parsed.data;
    const where: { actorId?: string; action?: { contains: string; mode: "insensitive" } } = {};
    if (actorId) where.actorId = actorId;
    if (action) where.action = { contains: action, mode: "insensitive" };
    const [total, entries] = await prisma.$transaction([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, action: true, entityType: true, entityId: true, metadata: true, createdAt: true,
          actor: { select: { id: true, fullName: true, role: true } },
        },
      }),
    ]);
    return { ok: true, total, page, limit, entries };
  });
}
