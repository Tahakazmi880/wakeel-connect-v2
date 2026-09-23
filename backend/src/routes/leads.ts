/**
 * Callback-request leads ("Request a callback" for high-value matters).
 * Public POST creates a lead; admin GET lists them newest-first.
 */
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { LeadStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { normalizePhone } from "../lib/crypto.js";
import { badRequest } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const leadSchema = z.object({
  fullName: z.string().min(3).max(80),
  phone: z.string().min(10).max(20),
  citySlug: z.string().min(2).max(64),
  matter: z.string().min(2).max(120),
  notes: z.string().max(1000).optional(),
});

export async function leadRoutes(app: FastifyInstance) {
  /** Public: request a callback. */
  app.post(
    "/leads",
    { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } },
    async (req, reply) => {
      const parsed = leadSchema.safeParse(req.body);
      if (!parsed.success) throw badRequest("INVALID_INPUT", "Please check the form and try again.");
      const phone = normalizePhone(parsed.data.phone);
      if (!phone) throw badRequest("INVALID_PHONE", "Please enter a valid mobile number, e.g. 0300 1234567.");
      const city = await prisma.city.findUnique({ where: { slug: parsed.data.citySlug }, select: { id: true } });
      if (!city) throw badRequest("INVALID_CITY", "Please select a valid city.");

      const lead = await prisma.lead.create({
        data: {
          fullName: parsed.data.fullName.trim(),
          phone,
          citySlug: parsed.data.citySlug,
          matter: parsed.data.matter.trim(),
          notes: parsed.data.notes?.trim() || undefined,
        },
        select: { id: true },
      });
      return reply.code(201).send({ ok: true, lead: { id: lead.id } });
    }
  );

  /** Admin: list leads, newest first, paginated. */
  app.get(
    "/admin/leads",
    { preHandler: [requireAuth, requireRole("ADMIN")] },
    async (req) => {
      const parsed = z
        .object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
          status: z.nativeEnum(LeadStatus).optional(),
        })
        .safeParse(req.query);
      if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");
      const { page, limit, status } = parsed.data;
      const where = status ? { status } : {};
      const [total, leads] = await prisma.$transaction([
        prisma.lead.count({ where }),
        prisma.lead.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);
      return { ok: true, total, page, limit, leads };
    }
  );

  /** Admin: change a lead's status (NEW → CONTACTED → CONVERTED / CLOSED). */
  app.patch(
    "/admin/leads/:id",
    { preHandler: [requireAuth, requireRole("ADMIN")] },
    async (req) => {
      const { id } = req.params as { id: string };
      const parsed = z.object({ status: z.nativeEnum(LeadStatus) }).safeParse(req.body ?? {});
      if (!parsed.success) throw badRequest("INVALID_INPUT", "status must be NEW, CONTACTED, CONVERTED or CLOSED.");
      const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
      if (!existing) throw badRequest("NOT_FOUND", "Lead not found.");
      const lead = await prisma.lead.update({
        where: { id },
        data: { status: parsed.data.status },
      });
      await prisma.auditLog.create({
        data: {
          actorId: req.user.sub,
          action: "lead.status_changed",
          entityType: "Lead",
          entityId: id,
          metadata: { status: parsed.data.status },
        },
      });
      return { ok: true, lead };
    }
  );
}
