import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT ?? 4000);

async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  // Liveness probe
  app.get("/health", async () => ({
    ok: true,
    service: "wakeel-connect-backend",
    time: new Date().toISOString(),
  }));

  // Versioned API health (also verifies DB connectivity)
  app.get("/api/v1/health", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return {
      ok: true,
      service: "wakeel-connect-backend",
      api: "v1",
      db: "up",
      time: new Date().toISOString(),
    };
  });

  return app;
}

async function main() {
  const app = await buildApp();
  await app.listen({ port: PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
