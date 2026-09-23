/**
 * Public content endpoints: banners, FAQs, partners, site settings.
 * Powers the homepage, FAQ accordions, and the partner marquee without
 * hard-coding content in the frontend.
 */
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { badRequest } from "../lib/errors.js";

export async function contentRoutes(app: FastifyInstance) {
  /** Active banners, display order. */
  app.get("/banners", async () => {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, subtitle: true, imageUrl: true, ctaText: true, ctaUrl: true },
    });
    return { ok: true, banners };
  });

  /** Active FAQs, optionally filtered by category. */
  app.get("/faqs", async (req) => {
    const parsed = z
      .object({ category: z.string().max(32).optional() })
      .safeParse(req.query);
    if (!parsed.success) throw badRequest("INVALID_QUERY", "Invalid parameters.");
    const faqs = await prisma.faq.findMany({
      where: {
        isActive: true,
        ...(parsed.data.category ? { category: parsed.data.category } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
    return { ok: true, faqs };
  });

  /** Active institutional partners (confirmed real clients only). */
  app.get("/partners", async () => {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, logoUrl: true, websiteUrl: true },
    });
    return { ok: true, partners };
  });

  /** Public site settings as a key → value map. */
  app.get("/settings", async () => {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return { ok: true, settings: map };
  });
}
