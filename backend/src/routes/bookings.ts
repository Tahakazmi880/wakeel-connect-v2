import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import { storeDocument, deleteDocument, openDocument } from "../lib/storage.js";
import { badRequest, notFound, forbidden, conflict } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const createSchema = z.object({
  lawyerId: z.string().min(1),
  startAt: z.string().datetime({ message: "startAt must be an ISO datetime." }),
  mode: z.enum(["ONLINE_VIDEO", "IN_CHAMBER", "PHONE"]).default("IN_CHAMBER"),
  clientNote: z.string().max(1000).optional(),
});

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";
}

async function assertBookingAccess(req: FastifyRequest, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { lawyer: { select: { userId: true } } },
  });
  if (!booking) throw notFound("Booking not found.");
  const isClient = booking.clientId === req.user.sub;
  const isLawyer = booking.lawyer.userId === req.user.sub;
  const isAdmin = req.user.role === "ADMIN";
  if (!isClient && !isLawyer && !isAdmin) throw forbidden();
  return { booking, isClient, isLawyer };
}

export async function bookingRoutes(app: FastifyInstance) {
  /**
   * Create a booking. The slot is validated server-side: it must be in the
   * future and must not overlap an existing PENDING/CONFIRMED booking for
   * the same lawyer (the DB EXCLUDE constraint is the final guard).
   */
  app.post("/bookings", { preHandler: [requireAuth] }, async (req) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input.");
    const { lawyerId, mode, clientNote } = parsed.data;
    const startAt = new Date(parsed.data.startAt);
    if (Number.isNaN(startAt.getTime()) || startAt.getTime() < Date.now() + 15 * 60_000) {
      throw badRequest("INVALID_SLOT", "Please choose a time at least 15 minutes in the future.");
    }

    const lawyer = await prisma.lawyer.findFirst({
      where: { id: lawyerId, isListed: true, verificationStatus: "APPROVED", isSeedData: false },
      select: { id: true, consultationFeePaisa: true, displayName: true },
    });
    if (!lawyer) throw notFound("Lawyer not available for booking.");

    const endAt = new Date(startAt.getTime() + 30 * 60_000); // 30-minute consultations
    const overlap = await prisma.booking.findFirst({
      where: {
        lawyerId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      select: { id: true },
    });
    if (overlap) throw conflict("SLOT_TAKEN", "This time slot was just taken. Please pick another.");

    const booking = await prisma.booking.create({
      data: {
        clientId: req.user.sub,
        lawyerId,
        startAt,
        endAt,
        status: "CONFIRMED",
        mode,
        feePaisa: lawyer.consultationFeePaisa,
        clientPhone: req.user.phone,
        clientNote,
      },
      select: {
        id: true, startAt: true, endAt: true, status: true, mode: true, feePaisa: true, createdAt: true,
        lawyer: { select: { displayName: true, slug: true } },
      },
    });

    return { ok: true, booking };
  });

  /** My bookings — clients see their own; lawyers see their appointments. */
  app.get("/bookings", { preHandler: [requireAuth] }, async (req) => {
    const where =
      req.user.role === "LAWYER"
        ? { lawyer: { userId: req.user.sub } }
        : { clientId: req.user.sub };

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { startAt: "desc" },
      take: 100,
      select: {
        id: true, startAt: true, endAt: true, status: true, mode: true, feePaisa: true,
        clientNote: true, cancelReason: true, createdAt: true,
        lawyer: { select: { id: true, displayName: true, slug: true } },
        client: { select: { fullName: true, phone: true } },
        documents: { select: { id: true, fileName: true, mimeType: true, sizeBytes: true, createdAt: true } },
      },
    });
    return { ok: true, bookings };
  });

  app.get("/bookings/:id", { preHandler: [requireAuth] }, async (req) => {
    const { id } = req.params as { id: string };
    const { booking } = await assertBookingAccess(req, id);
    return { ok: true, booking };
  });

  /** Client cancels an upcoming booking. Lawyers/admins use the admin route. */
  app.post("/bookings/:id/cancel", { preHandler: [requireAuth] }, async (req) => {
    const { id } = req.params as { id: string };
    const parsed = z.object({ reason: z.string().max(500).optional() }).safeParse(req.body ?? {});
    const { booking, isClient } = await assertBookingAccess(req, id);
    if (!isClient && req.user.role !== "ADMIN") throw forbidden("Only the client can cancel here.");
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw conflict("CANNOT_CANCEL", "This booking can no longer be cancelled.");
    }
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: parsed.success ? parsed.data.reason : undefined },
      select: { id: true, status: true, cancelledAt: true },
    });
    return { ok: true, booking: updated };
  });

  /** Client reschedules an upcoming booking to a new slot. The booking keeps
   *  its id (and attached documents) — only the time moves. The new slot
   *  gets the same server-side future + overlap validation as a new booking. */
  app.post("/bookings/:id/reschedule", { preHandler: [requireAuth] }, async (req) => {
    const { id } = req.params as { id: string };
    const parsed = z.object({ startAt: z.string().datetime({ message: "startAt must be an ISO datetime." }) }).safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input.");
    const { booking, isClient } = await assertBookingAccess(req, id);
    if (!isClient && req.user.role !== "ADMIN") throw forbidden("Only the client can reschedule here.");
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw conflict("CANNOT_RESCHEDULE", "This booking can no longer be rescheduled.");
    }

    const startAt = new Date(parsed.data.startAt);
    if (Number.isNaN(startAt.getTime()) || startAt.getTime() < Date.now() + 15 * 60_000) {
      throw badRequest("INVALID_SLOT", "Please choose a time at least 15 minutes in the future.");
    }
    const endAt = new Date(startAt.getTime() + 30 * 60_000);

    const overlap = await prisma.booking.findFirst({
      where: {
        lawyerId: booking.lawyerId,
        id: { not: id },
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      select: { id: true },
    });
    if (overlap) throw conflict("SLOT_TAKEN", "This time slot was just taken. Please pick another.");

    const updated = await prisma.booking.update({
      where: { id },
      data: { startAt, endAt },
      select: { id: true, startAt: true, endAt: true, status: true, mode: true, feePaisa: true },
    });
    return { ok: true, booking: updated };
  });

  /**
   * Attach a case document to a booking. Files go to Supabase Storage in
   * production (local disk in development); only metadata + a random
   * storage key touch the database.
   */
  app.post("/bookings/:id/documents", { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { booking } = await assertBookingAccess(req, id);
    if (booking.status === "CANCELLED") throw conflict("BOOKING_CANCELLED", "Cannot attach documents to a cancelled booking.");

    const existing = await prisma.bookingDocument.count({ where: { bookingId: id } });
    if (existing >= 5) throw badRequest("TOO_MANY_DOCS", "Maximum 5 documents per booking.");

    const file = await req.file();
    if (!file) throw badRequest("NO_FILE", "No file was attached.");
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw badRequest("BAD_FILE_TYPE", "Only PDF, JPG, PNG, WEBP, DOC and DOCX files are allowed.");
    }

    const storageKey = crypto.randomBytes(24).toString("hex");
    let sizeBytes: number;
    try {
      sizeBytes = await storeDocument(storageKey, file.file, file.mimetype);
      // The multipart plugin enforces the fileSize limit; a truncated
      // stream means the client exceeded it.
      if (file.file.truncated) {
        throw badRequest("FILE_TOO_LARGE", `File must be under ${env.MAX_UPLOAD_MB} MB.`);
      }
    } catch (err) {
      await deleteDocument(storageKey);
      throw err;
    }

    const doc = await prisma.bookingDocument.create({
      data: {
        bookingId: id,
        uploadedById: req.user.sub,
        fileName: sanitizeFileName(file.filename),
        storageKey,
        mimeType: file.mimetype,
        sizeBytes,
      },
      select: { id: true, fileName: true, mimeType: true, sizeBytes: true, createdAt: true },
    });
    return reply.send({ ok: true, document: doc });
  });

  /** Download a booking document — only the parties + admin, never public. */
  app.get("/bookings/:id/documents/:docId", { preHandler: [requireAuth] }, async (req, reply) => {
    const { id, docId } = req.params as { id: string; docId: string };
    await assertBookingAccess(req, id);
    const doc = await prisma.bookingDocument.findFirst({ where: { id: docId, bookingId: id } });
    if (!doc) throw notFound("Document not found.");

    const stream = await openDocument(doc.storageKey);
    if (!stream) throw notFound("Document file is missing.");
    return reply
      .header("Content-Type", doc.mimeType)
      .header("Content-Disposition", `attachment; filename="${doc.fileName}"`)
      .send(stream);
  });

  /** Lawyer marks an appointment completed (enables the client review). */
  app.post("/bookings/:id/complete", { preHandler: [requireAuth, requireRole("LAWYER", "ADMIN")] }, async (req) => {
    const { id } = req.params as { id: string };
    const { booking, isLawyer } = await assertBookingAccess(req, id);
    if (!isLawyer && req.user.role !== "ADMIN") throw forbidden();
    if (booking.status !== "CONFIRMED") throw conflict("CANNOT_COMPLETE", "Only confirmed bookings can be completed.");
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "COMPLETED" },
      select: { id: true, status: true },
    });
    return { ok: true, booking: updated };
  });
}
