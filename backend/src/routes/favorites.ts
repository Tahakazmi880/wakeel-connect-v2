/**
 * Saved lawyers (favorites). Auth required; each user manages their own
 * shortlist. Lawyer ids must belong to listed, approved lawyers.
 */
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";

const idSchema = z.object({ lawyerId: z.string().min(1).max(64) });

export async function favoriteRoutes(app: FastifyInstance) {
  /** List my saved lawyers. */
  app.get("/favorites", { preHandler: [requireAuth] }, async (req) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.sub },
      include: {
        lawyer: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            headline: true,
            photoUrl: true,
            gender: true,
            consultationFeePaisa: true,
            offersOnline: true,
            ratingAvg: true,
            ratingCount: true,
            city: { select: { nameEn: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, favorites };
  });

  /** Save a lawyer. Idempotent — saving twice returns the same row. */
  app.post("/favorites", { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = idSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", "Invalid lawyer id.");

    const lawyer = await prisma.lawyer.findFirst({
      where: { id: parsed.data.lawyerId, isListed: true, verificationStatus: "APPROVED" },
      select: { id: true },
    });
    if (!lawyer) throw notFound("Lawyer not found.");

    const favorite = await prisma.favorite.upsert({
      where: { userId_lawyerId: { userId: req.user.sub, lawyerId: lawyer.id } },
      update: {},
      create: { userId: req.user.sub, lawyerId: lawyer.id },
    });
    return reply.code(201).send({ ok: true, favorite: { id: favorite.id, lawyerId: lawyer.id } });
  });

  /** Remove a lawyer from my saved list. */
  app.delete("/favorites/:lawyerId", { preHandler: [requireAuth] }, async (req) => {
    const parsed = z.object({ lawyerId: z.string().min(1).max(64) }).safeParse(req.params);
    if (!parsed.success) throw badRequest("INVALID_INPUT", "Invalid lawyer id.");
    await prisma.favorite
      .delete({ where: { userId_lawyerId: { userId: req.user.sub, lawyerId: parsed.data.lawyerId } } })
      .catch(() => null); // not saved → treat as success (idempotent)
    return { ok: true };
  });
}
