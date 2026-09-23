import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound, forbidden } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";

const askSchema = z.object({
  areaSlug: z.string().max(64).optional(),
  title: z.string().min(10).max(140),
  body: z.string().min(20).max(2000),
});

const answerSchema = z.object({
  body: z.string().min(10).max(2000),
});

export async function questionRoutes(app: FastifyInstance) {
  /** Public forum listing with answer counts. */
  app.get("/questions", async (req) => {
    const parsed = z
      .object({
        area: z.string().max(64).optional(),
        page: z.coerce.number().int().min(1).default(1),
      })
      .safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");
    const { area, page } = parsed.data;
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (area) where.area = { slug: area };

    const [total, questions] = await prisma.$transaction([
      prisma.forumQuestion.count({ where }),
      prisma.forumQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, title: true, body: true, authorName: true, isSeed: true, createdAt: true,
          area: { select: { slug: true, nameEn: true, nameUr: true } },
          _count: { select: { answers: true } },
        },
      }),
    ]);
    return { ok: true, total, page, questions };
  });

  /** Ask a question (logged-in users; guests read only). */
  app.post("/questions", { preHandler: [requireAuth] }, async (req, reply) => {
    const parsed = askSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input.");

    let areaId: string | undefined;
    if (parsed.data.areaSlug) {
      const area = await prisma.practiceArea.findUnique({ where: { slug: parsed.data.areaSlug }, select: { id: true } });
      if (!area) throw badRequest("INVALID_AREA", "Unknown practice area.");
      areaId = area.id;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { fullName: true } });
    const question = await prisma.forumQuestion.create({
      data: {
        authorId: req.user.sub,
        authorName: user?.fullName ?? "Member",
        areaId,
        title: parsed.data.title.trim(),
        body: parsed.data.body.trim(),
      },
      select: { id: true, title: true, createdAt: true },
    });
    return reply.code(201).send({ ok: true, question });
  });

  /** Question detail with answers. */
  app.get("/questions/:id", async (req) => {
    const { id } = req.params as { id: string };
    const question = await prisma.forumQuestion.findUnique({
      where: { id },
      select: {
        id: true, title: true, body: true, authorName: true, isSeed: true, isLocked: true, createdAt: true,
        area: { select: { slug: true, nameEn: true, nameUr: true } },
        answers: {
          orderBy: { createdAt: "asc" },
          select: { id: true, body: true, authorName: true, isSeed: true, createdAt: true },
        },
      },
    });
    if (!question) throw notFound("Question not found.");
    return { ok: true, question };
  });

  /** Answer a question. Seed/locked questions stay read-only until launch. */
  app.post("/questions/:id/answers", { preHandler: [requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_INPUT", "Answer must be 10–2000 characters.");

    const question = await prisma.forumQuestion.findUnique({ where: { id }, select: { id: true, isLocked: true } });
    if (!question) throw notFound("Question not found.");
    if (question.isLocked) throw forbidden("This question is locked.");

    const user = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { fullName: true, role: true } });
    const answer = await prisma.forumAnswer.create({
      data: {
        questionId: id,
        authorId: req.user.sub,
        authorName: user?.role === "LAWYER" ? `Adv. ${user.fullName}` : (user?.fullName ?? "Member"),
        body: parsed.data.body.trim(),
      },
      select: { id: true, body: true, authorName: true, createdAt: true },
    });
    return reply.code(201).send({ ok: true, answer });
  });
}
