// Local dev entry point: npx tsx prisma/import-real-lawyers.ts
// (Production uses src/lib/bootstrap.ts via the compiled server.)
//
// ---- Honesty policy (see MEMORY.md, 2026-09-23) ----
// consultationFeePaisa: ONLY the 4 user-confirmed fees. 0 = "fee on request".
// yearsExperience: ONLY Shamsuddin's 24 (site-confirmed). 0 = "not specified".
// photoUrl: ONLY the 4 real portraits. null = initials avatar.
import { PrismaClient } from "@prisma/client";
import { importRealLawyers } from "../src/lib/import-lawyers.js";

const prisma = new PrismaClient();

importRealLawyers(prisma)
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
