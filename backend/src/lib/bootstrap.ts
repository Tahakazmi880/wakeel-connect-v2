import { prisma } from "./prisma.js";
import { seedDatabase } from "./seed.js";
import { importRealLawyers } from "./import-lawyers.js";

/**
 * Production database bootstrap.
 *
 * On a fresh deploy (empty database) this seeds reference data, demo
 * profiles and the firm's 21 real lawyer profiles automatically, so a
 * Render deploy is fully working without any manual SSH/SQL steps.
 *
 * Safe to run on every boot: it no-ops as soon as any lawyer row
 * exists, and every seed step is idempotent (upserts). Failures are
 * logged but never crash the server — the API stays up so the
 * problem is visible in health checks and logs instead of a
 * crash loop.
 */
export async function bootstrapDatabase(): Promise<void> {
  try {
    const existing = await prisma.lawyer.count();
    if (existing > 0) return;
    console.log("[bootstrap] empty database detected — seeding…");
    await seedDatabase(prisma);
    await importRealLawyers(prisma);
    console.log("[bootstrap] database ready");
  } catch (err) {
    console.error("[bootstrap] FAILED — API will run with an empty directory:", err);
  }
}
