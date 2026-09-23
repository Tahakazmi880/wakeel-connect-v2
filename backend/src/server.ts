import "dotenv/config";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { ZodError } from "zod";
import { env, isProd } from "./lib/env.js";
import { prisma } from "./lib/prisma.js";
import { bootstrapDatabase } from "./lib/bootstrap.js";
import { AppError } from "./lib/errors.js";
import { registerSecurity } from "./plugins/security.js";
import { authRoutes } from "./routes/auth.js";
import { lawyerRoutes } from "./routes/lawyers.js";
import { bookingRoutes } from "./routes/bookings.js";
import { reviewRoutes } from "./routes/reviews.js";
import { questionRoutes } from "./routes/questions.js";
import { applicationRoutes } from "./routes/applications.js";
import { leadRoutes } from "./routes/leads.js";
import { contentRoutes } from "./routes/content.js";
import { favoriteRoutes } from "./routes/favorites.js";
import { adminRoutes } from "./routes/admin.js";

const PORT = env.PORT;

export async function buildApp() {
  const app = Fastify({
    logger: { level: isProd ? "info" : "debug" },
    trustProxy: true,
  });

  await registerSecurity(app);

  // Public assets: real lawyer portrait photos (backend/public/lawyers/).
  // Served as plain static files; photoUrl on the Lawyer record points here.
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
    prefix: "/",
    decorateReply: false,
  });

  // Lawyer portraits are embedded by the frontend, which lives on a
  // different origin (local dev ports; Vercel vs Render in production).
  // Helmet's default `Cross-Origin-Resource-Policy: same-origin` would make
  // browsers refuse to load them — portraits must be cross-origin embeddable.
  app.addHook("onSend", async (req, reply) => {
    if (req.url.startsWith("/lawyers/")) {
      reply.header("Cross-Origin-Resource-Policy", "cross-origin");
    }
  });

  // ---- Global error handler: AppError → clean JSON, everything else → 500
  // ---- without leaking stack traces in production.
  app.setErrorHandler((err, req, reply) => {
    if (err instanceof AppError) {
      return reply.code(err.statusCode).send({ ok: false, error: { code: err.code, message: err.message } });
    }
    if (err instanceof ZodError) {
      return reply.code(400).send({ ok: false, error: { code: "VALIDATION", message: err.issues[0]?.message ?? "Invalid input." } });
    }
    // Fastify validation / rate-limit errors carry statusCode already.
    const status = typeof (err as { statusCode?: unknown }).statusCode === "number"
      ? (err as { statusCode: number }).statusCode
      : 500;
    req.log.error({ err, url: req.url }, "Unhandled error");
    return reply.code(status).send({
      ok: false,
      error: {
        code: status === 429 ? "RATE_LIMITED" : "INTERNAL",
        message: status === 429 ? "Too many requests. Please slow down." : "Something went wrong. Please try again.",
      },
    });
  });

  app.setNotFoundHandler((_req, reply) => {
    return reply.code(404).send({ ok: false, error: { code: "NOT_FOUND", message: "Not found." } });
  });

  // ---- Routes (all versioned under /api/v1)
  app.get("/health", async () => ({ ok: true, service: "wakeel-connect-backend", time: new Date().toISOString() }));

  await app.register(
    async (api) => {
      api.get("/health", async () => {
        await prisma.$queryRaw`SELECT 1`;
        return { ok: true, service: "wakeel-connect-backend", api: "v1", db: "up", time: new Date().toISOString() };
      });
      await api.register(authRoutes);
      await api.register(lawyerRoutes);
      await api.register(bookingRoutes);
      await api.register(reviewRoutes);
      await api.register(questionRoutes);
      await api.register(applicationRoutes);
      await api.register(leadRoutes);
      await api.register(contentRoutes);
      await api.register(favoriteRoutes);
      await api.register(adminRoutes);
    },
    { prefix: "/api/v1" }
  );

  return app;
}

async function main() {
  const app = await buildApp();
  // Seed a fresh database (production first deploy) before serving.
  await bootstrapDatabase();
  // Graceful shutdown: finish in-flight requests, close DB pool.
  for (const sig of ["SIGINT", "SIGTERM"] as const) {
    process.on(sig, async () => {
      app.log.info({ sig }, "Shutting down");
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  }
  await app.listen({ port: PORT, host: "0.0.0.0" });
  if (env.OTP_ACCEPT_ANY) {
    // eslint-disable-next-line no-console
    console.warn("⚠️  [security] OTP_ACCEPT_ANY=true — ANY 6-digit code is accepted as valid. This is a temporary soft-launch bypass. Set OTP_ACCEPT_ANY=false once SMS_PROVIDER=twilio is live.");
  }
}

// Works both under tsx (src/server.ts) and compiled node (dist/server.js).
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.js"));

if (invokedDirectly) {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
