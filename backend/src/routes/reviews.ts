import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound, conflict, forbidden } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";

const createSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function reviewRoutes(app: FastifyInstance) {
  /**
   * One review per completed booking, by the client who booked it.
   * Lawyer rating aggregates update atomically in the same transaction.
   */
  app.post("/reviews", { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", "Rating must be 1–5 stars.");
    const { bookingId, rating, comment } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, clientId: true, lawyerId: true, status: true, review: { select: { id: true } } },
    });
    if (!booking) throw notFound("Booking not found.");
    if (booking.clientId !== req.user.sub) throw forbidden("You can only review your own bookings.");
    if (booking.status !== "COMPLETED") {
      throw conflict("NOT_COMPLETED", "You can review after the consultation is completed.");
    }
    if (booking.review) throw conflict("ALREADY_REVIEWED", "You have already reviewed this booking.");

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId,
          lawyerId: booking.lawyerId,
          clientId: req.user.sub,
          rating,
          comment,
          verified: true,
        },
        select: { id: true, rating: true, comment: true, verified: true, createdAt: true },
      });

      const agg = await tx.review.aggregate({
        where: { lawyerId: booking.lawyerId },
        _avg: { rating: true },
        _count: true,
      });
      await tx.lawyer.update({
        where: { id: booking.lawyerId },
        data: {
          ratingAvg: agg._avg.rating ?? 0,
          ratingCount: agg._count,
          totalConsultations: { increment: 1 },
        },
      });
      return review;
    });

    return reply.code(201).send({ ok: true, review: result });
  });

  /** Public reviews for a lawyer. */
  app.get("/reviews", async (req) => {
    const parsed = z.object({ lawyerId: z.string().min(1), page: z.coerce.number().int().min(1).default(1) }).safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "lawyerId is required.");
    const { lawyerId, page } = parsed.data;
    const limit = 20;

    const [total, reviews] = await prisma.$transaction([
      prisma.review.count({ where: { lawyerId } }),
      prisma.review.findMany({
        where: { lawyerId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, rating: true, comment: true, verified: true, createdAt: true,
          client: { select: { fullName: true } },
        },
      }),
    ]);
    return { ok: true, total, page, reviews };
  });
}
