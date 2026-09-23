import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { normalizePhone } from "../lib/crypto.js";
import { storeDocument, deleteDocument, openDocument } from "../lib/storage.js";
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
  headline: z.string().max(120).optional(),
  yearsExperience: z.number().int().min(0).max(60),
  consultationFeePaisa: z.number().int().min(0).max(10_000_00 * 100),
  barCouncil: z.string().max(80).optional(),
  barCouncilNo: z.string().max(40).optional(),
  enrolmentYear: z.number().int().min(1950).max(2026).optional(),
  courts: z.array(z.string().max(80)).max(8).optional(),
  languageCodes: z.array(z.string().max(8)).max(8).optional(),
  education: z
    .array(
      z.object({
        degree: z.string().min(2).max(80),
        institution: z.string().min(2).max(120),
        year: z.number().int().min(1950).max(2026).optional(),
      })
    )
    .max(5)
    .optional(),
  chamberName: z.string().max(120).optional(),
  chamberAddress: z.string().max(300).optional(),
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

// ---------------------------------------------------------------------------
// Document upload: the applicant is not logged in, so the application
// response carries a one-time upload token (24h). Only its SHA-256 hash is
// stored. Documents live in the private object store — never public.
// ---------------------------------------------------------------------------
const UPLOAD_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_APP_DOCS = 6;
const APP_DOC_MIME = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const APP_DOC_TYPES = new Set(["CNIC_FRONT", "CNIC_BACK", "BAR_COUNCIL_CERT", "DEGREE", "PROFILE_PHOTO", "OTHER"]);

function hashUploadToken(token: string): string {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

/** Verify the applicant's one-time upload token for this application. */
async function assertUploadToken(lawyerId: string, presented: string | undefined) {
  if (!presented) throw forbidden("Upload not authorized. Please submit a new application.");
  const lawyer = await prisma.lawyer.findUnique({
    where: { id: lawyerId },
    select: { id: true, verificationStatus: true, uploadTokenHash: true, uploadTokenExpiresAt: true },
  });
  if (!lawyer || !lawyer.uploadTokenHash || !lawyer.uploadTokenExpiresAt) {
    throw forbidden("Upload not authorized. Please submit a new application.");
  }
  if (lawyer.uploadTokenExpiresAt.getTime() < Date.now()) {
    throw forbidden("This upload link has expired. Please submit a new application.");
  }
  if (["APPROVED", "REJECTED"].includes(lawyer.verificationStatus)) {
    throw forbidden("Documents can no longer be changed for this application.");
  }
  const expected = Buffer.from(lawyer.uploadTokenHash, "hex");
  const actual = Buffer.from(hashUploadToken(presented), "hex");
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw forbidden("Upload not authorized. Please submit a new application.");
  }
  return lawyer;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";
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

      const uploadToken = crypto.randomBytes(32).toString("hex");

      // Keep only language codes that exist in the Language table.
      const langCodes = parsed.data.languageCodes?.length
        ? (await prisma.language.findMany({ where: { code: { in: parsed.data.languageCodes } }, select: { code: true } })).map((l) => l.code)
        : [];

      const lawyer = await prisma.lawyer.create({
        data: {
          userId: user.id,
          slug,
          displayName: parsed.data.fullName,
          headline: parsed.data.headline,
          cityId: city.id,
          yearsExperience: parsed.data.yearsExperience,
          consultationFeePaisa: parsed.data.consultationFeePaisa,
          barCouncil: parsed.data.barCouncil,
          barCouncilNo: parsed.data.barCouncilNo,
          enrolmentYear: parsed.data.enrolmentYear,
          courts: parsed.data.courts ?? [],
          bio: parsed.data.bio,
          verificationStatus: "PENDING",
          isListed: false,
          uploadTokenHash: hashUploadToken(uploadToken),
          uploadTokenExpiresAt: new Date(Date.now() + UPLOAD_TOKEN_TTL_MS),
          practiceAreas: { create: areas.map((a, i) => ({ practiceAreaId: a.id, isPrimary: i === 0 })) },
          languages: { create: langCodes.map((code) => ({ langCode: code })) },
          education: {
            create: (parsed.data.education ?? []).map((e) => ({
              degree: e.degree,
              institution: e.institution,
              year: e.year,
            })),
          },
          chambers:
            parsed.data.chamberName || parsed.data.chamberAddress
              ? {
                  create: [
                    {
                      name: parsed.data.chamberName || "Main chamber",
                      address: parsed.data.chamberAddress || "",
                      cityId: city.id,
                      isPrimary: true,
                    },
                  ],
                }
              : undefined,
        },
        select: { id: true, slug: true, verificationStatus: true },
      });

      await prisma.auditLog.create({
        data: { actorId: user.id, action: "lawyer.applied", entityType: "Lawyer", entityId: lawyer.id },
      });

      return reply.code(201).send({
        ok: true,
        message: "Application received. Upload your CNIC and Bar Council documents to complete verification.",
        applicationId: lawyer.id,
        application: { id: lawyer.id, status: lawyer.verificationStatus },
        // One-time secret: the frontend uses it to upload documents. Shown once, never stored in plain text.
        uploadToken,
      });
    }
  );

  // ---------------- Applicant document upload (one-time token) ----------------

  const appDocSelect = {
    id: true,
    type: true,
    mimeType: true,
    sizeBytes: true,
    status: true,
    uploadedAt: true,
  } as const;

  /** Upload a verification document (CNIC, Bar Council certificate, degree…). */
  app.post(
    "/applications/:id/documents",
    { config: { rateLimit: { max: 20, timeWindow: "10 minutes" } } },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const token = req.headers["x-upload-token"] as string | undefined;
      await assertUploadToken(id, token);

      const existing = await prisma.verificationDocument.count({ where: { lawyerId: id } });
      if (existing >= MAX_APP_DOCS) throw badRequest("TOO_MANY_DOCS", `Maximum ${MAX_APP_DOCS} documents per application.`);

      // Document type arrives as a query param (keeps multipart parsing to the file only,
      // mirroring the booking-document route).
      const parsedQ = z.object({ type: z.string() }).safeParse(req.query);
      const type = parsedQ.success ? parsedQ.data.type : undefined;
      if (!type || !APP_DOC_TYPES.has(type)) throw badRequest("BAD_DOC_TYPE", "Unknown document type.");

      const file = await req.file();
      if (!file) throw badRequest("NO_FILE", "Attach a file.");
      if (!APP_DOC_MIME.has(file.mimetype)) {
        throw badRequest("BAD_FILE_TYPE", "Only JPG, PNG, WEBP or PDF files are allowed.");
      }

      // One document per type — re-uploading replaces the previous file.
      const previous = await prisma.verificationDocument.findFirst({ where: { lawyerId: id, type: type as never } });

      const storageKey = `applications/${crypto.randomBytes(24).toString("hex")}`;
      let sizeBytes: number;
      try {
        sizeBytes = await storeDocument(storageKey, file.file, file.mimetype);
        if (file.file.truncated) throw badRequest("FILE_TOO_LARGE", "File is too large (max 10 MB).");
      } catch (err) {
        await deleteDocument(storageKey);
        throw err;
      }

      const doc = previous
        ? await prisma.verificationDocument.update({
            where: { id: previous.id },
            data: { storageKey, mimeType: file.mimetype, sizeBytes, status: "PENDING", reviewedById: null, reviewedAt: null, reviewNote: null },
            select: appDocSelect,
          })
        : await prisma.verificationDocument.create({
            data: {
              lawyerId: id,
              type: type as never,
              storageKey,
              mimeType: file.mimetype,
              sizeBytes,
            },
            select: appDocSelect,
          });
      if (previous) await deleteDocument(previous.storageKey);

      await prisma.auditLog.create({
        data: { action: "lawyer.document_uploaded", entityType: "Lawyer", entityId: id, metadata: { type } },
      });
      return reply.code(201).send({ ok: true, document: doc });
    }
  );

  /** List the applicant's own uploaded documents. */
  app.get("/applications/:id/documents", async (req) => {
    const { id } = req.params as { id: string };
    const token = req.headers["x-upload-token"] as string | undefined;
    await assertUploadToken(id, token);
    const documents = await prisma.verificationDocument.findMany({
      where: { lawyerId: id },
      orderBy: { uploadedAt: "asc" },
      select: appDocSelect,
    });
    return { ok: true, documents };
  });

  /** Remove one of the applicant's own documents. */
  app.delete("/applications/:id/documents/:docId", async (req) => {
    const { id, docId } = req.params as { id: string; docId: string };
    const token = req.headers["x-upload-token"] as string | undefined;
    await assertUploadToken(id, token);
    const doc = await prisma.verificationDocument.findFirst({ where: { id: docId, lawyerId: id } });
    if (!doc) throw notFound("Document not found.");
    await prisma.verificationDocument.delete({ where: { id: doc.id } });
    await deleteDocument(doc.storageKey);
    return { ok: true };
  });

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
          documents: {
            orderBy: { uploadedAt: "asc" },
            select: { id: true, type: true, mimeType: true, sizeBytes: true, status: true, uploadedAt: true },
          },
        },
      });
      return { ok: true, applications: apps };
    }
  );

  /** Download one verification document — admin only, streamed from private storage. */
  app.get(
    "/admin/applications/:id/documents/:docId/download",
    { preHandler: [requireAuth, requireRole("ADMIN")] },
    async (req, reply) => {
      const { id, docId } = req.params as { id: string; docId: string };
      const doc = await prisma.verificationDocument.findFirst({
        where: { id: docId, lawyerId: id },
        select: { id: true, storageKey: true, mimeType: true, type: true },
      });
      if (!doc) throw notFound("Document not found.");
      const stream = await openDocument(doc.storageKey);
      if (!stream) throw notFound("Document file is missing.");
      return reply
        .header("Content-Type", doc.mimeType)
        .header("Content-Disposition", `attachment; filename="${doc.type.toLowerCase()}-${doc.id.slice(-6)}"`)
        .send(stream);
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
