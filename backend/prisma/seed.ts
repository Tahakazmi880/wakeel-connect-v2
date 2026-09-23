// Local dev entry point: npx tsx prisma/seed.ts
// (Production uses src/lib/bootstrap.ts via the compiled server.)
import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed.js";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
