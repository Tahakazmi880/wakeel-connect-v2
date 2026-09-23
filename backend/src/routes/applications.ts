import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { normalizePhone } from "../lib/crypto.js";
import { badRequest, notFound, forbidden, conflict } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

/**
 * Lawyer onboarding: a public application creates a User (role LAWYER) +
 * a Lawyer row in PENDING verification. Nothing is public until an admin
 * approves. Rate-limited to stop spam.
 */
const applySchema = z.object({
  fullName: z.string().min(3).max(80),
  phone: z.string().min(10).max(20),
  citySlug: z.string().min(2).max(64),
  yearsExperience: z.number().int().min(0).max(60),
  consultationFeePaisa: z.number().int().min(0).max(10_000_00 * 100),
  barCouncil: z.string().max(80).optional(),
  barCouncilNo: z.string().max(40).optional(),
  practiceAreaSlugs: z.array(z.string().max(64)).min(1).max(6),
  bio: z.string().max(2000).optional(),
});

const decisionSchema = z.object({
  toStatus: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  note: z.string().max(1000).optional(),
});

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/^(mr|mrs|ms|miss|adv|advocate|sardar|syed)\.?\s+/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "lawyer"
  );
}

export async function applicationRoutes(app: FastifyInstance) {
  app.post(
    "/applications",
    {
      config: { rateLimit: { max: 3, timeWindow: "1 hour" } },
    },
    async (req, reply) => {
      const parsed = applySchema.safeParse(req.body);
      if (!parsed.success) throw badRequest("INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid application.");
      const phone = normalizePhone(parsed.data.phone);
      if (!phone) throw badRequest("INVALID_PHONE", "Please enter a valid Pakistani mobile number.");

      const city = await prisma.city.findUnique({ where: { slug: parsed.data.citySlug }, select: { id: true } });
      if (!city) throw badRequest("INVALID_CITY", "Unknown city.");

      const areas = await prisma.practiceArea.findMany({
        where: { slug: { in: parsed.data.practiceAreaSlugs }, isActive: true },
        select: { id: true, slug: true },
      });
      if (areas.length !== parsed.data.practiceAreaSlugs.length) {
        throw badRequest("INVALID_AREA", "One or more practice areas are unknown.");
      }

      const existing = await prisma.user.findUnique({
        where: { phone },
        select: { id: true, role: true, lawyerProfile: { select: { id: true, verificationStatus: true } } },
      });
      if (existing?.lawyerProfile) {
        throw conflict("ALREADY_APPLIED", "This number already has a lawyer application.");
      }

      // Unique slug for the future public profile.
      const base = slugify(parsed.data.fullName);
      let slug = base;
      for (let i = 2; i < 10; i++) {
        const taken = await prisma.lawyer.findUnique({ where: { slug }, select: { id: true } });
        if (!taken) break;
        slug = `${base}-${i}`;
      }

      const user = existing
        ? await prisma.user.update({ where: { id: existing.id }, data: { role: "LAWYER", fullName: parsed.data.fullName } })
        : await prisma.user.create({ data: { phone, fullName: parsed.data.fullName, role: "LAWYER" } });

      const lawyer = await prisma.lawyer.create({
        data: {
          userId: user.id,
          slug,
          displayName: parsed.data.fullName,
          cityId: city.id,
          yearsExperience: parsed.data.yearsExperience,
          consultationFeePaisa: parsed.data.consultationFeePaisa,
          barCouncil: parsed.data.barCouncil,
          barCouncilNo: parsed.data.barCouncilNo,
          bio: parsed.data.bio,
          verificationStatus: "PENDING",
          isListed: false,
          practiceAreas: { create: areas.map((a, i) => ({ practiceAreaId: a.id, isPrimary: i === 0 })) },
        },
        select: { id: true, slug: true, verificationStatus: true },
      });

      await prisma.auditLog.create({
        data: { actorId: user.id, action: "lawyer.applied", entityType: "Lawyer", entityId: lawyer.id },
      });

      return reply.code(201).send({
        ok: true,
        message: "Application received. Our team will verify your Bar Council details before your profile goes live.",
        applicationId: lawyer.id,
      });
    }
  );

  // ---------------- Admin ----------------

  app.get(
    "/admin/applications",
    { preHandler: [requireAuth, requireRole("ADMIN")] },
    async (req) => {
      const parsed = z
        .object({ status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"]).optional() })
        .safeParse(req.query);
      const where = parsed.success && parsed.data.status ? { verificationStatus: parsed.data.status } : {};
      const apps = await prisma.lawyer.findMany({
        where: { isSeedData: false, ...where },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true, displayName: true, slug: true, verificationStatus: true, yearsExperience: true,
          barCouncil: true, barCouncilNo: true, bio: true, createdAt: true,
          city: { select: { nameEn: true } },
          user: { select: { phone: true, fullName: true } },
          practiceAreas: { select: { practiceArea: { select: { nameEn: true } } } },
        },
      });
      return { ok: true, applications: apps };
    }
  );

  app.post(
    "/admin/applications/:id/decision",
    { preHandler: [requireAuth, requireRole("ADMIN")] },
    async (req) => {
      const { id } = req.params as { id: string };
      const parsed = decisionSchema.safeParse(req.body);
      if (!parsed.success) throw badRequest("INVALID_INPUT", "Invalid decision.");

      const lawyer = await prisma.lawyer.findUnique({
        where: { id },
        select: { id: true, verificationStatus: true, userId: true, displayName: true },
      });
      if (!lawyer) throw notFound("Application not found.");
      if (lawyer.verificationStatus === parsed.data.toStatus) {
        throw conflict("NO_CHANGE", "Application is already in this status.");
      }
      if (parsed.data.toStatus === "APPROVED" && !["PENDING", "UNDER_REVIEW"].includes(lawyer.verificationStatus)) {
        throw forbidden("Only pending applications can be approved.");
      }

      const isApproved = parsed.data.toStatus === "APPROVED";
      const updated = await prisma.$transaction(async (tx) => {
        const l = await tx.lawyer.update({
          where: { id },
          data: {
            verificationStatus: parsed.data.toStatus,
            isListed: isApproved,
            verifiedAt: isApproved ? new Date() : undefined,
          },
          select: { id: true, displayName: true, slug: true, verificationStatus: true, isListed: true },
        });
        await tx.verificationDecision.create({
          data: {
            lawyerId: id,
            adminId: req.user.sub,
            fromStatus: lawyer.verificationStatus,
            toStatus: parsed.data.toStatus,
            note: parsed.data.note,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: req.user.sub,
            action: `verification.${parsed.data.toStatus.toLowerCase()}`,
            entityType: "Lawyer",
            entityId: id,
            metadata: { note: parsed.data.note ?? null },
          },
        });
        return l;
      });

      return { ok: true, lawyer: updated };
    }
  );
}
