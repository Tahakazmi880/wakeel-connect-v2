import type { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import { env, isProd } from "../lib/env.js";

/**
 * Baseline security for every request:
 *  - Helmet security headers
 *  - CORS locked to the frontend origin, cookies allowed
 *  - Global rate limit (generous); sensitive routes add stricter limits
 *  - Signed-cookie support + multipart upload caps
 */
export async function registerSecurity(app: FastifyInstance) {
  await app.register(helmet, {
    // API only — no inline scripts to protect; keep defaults strict.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  await app.register(cors, {
    origin: [env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(rateLimit, {
    max: 300,
    timeWindow: "1 minute",
    // Don't burn the global budget on preflights.
    allowList: (req) => req.method === "OPTIONS",
  });

  await app.register(cookie, {
    secret: env.JWT_SECRET, // enables signed cookies if we ever need them
  });

  await app.register(multipart, {
    limits: {
      fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
      files: 5,
      fields: 20,
    },
  });

  if (isProd) {
    app.addHook("onRequest", async (req, reply) => {
      // Trust the platform's TLS termination (Render/Heroku style).
      req.headers["x-forwarded-proto"] = req.headers["x-forwarded-proto"] ?? "https";
      void reply;
    });
  }
}
