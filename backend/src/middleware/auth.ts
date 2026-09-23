import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken, type AccessTokenPayload } from "../lib/auth.js";
import { unauthorized, forbidden } from "../lib/errors.js";

declare module "fastify" {
  interface FastifyRequest {
    user: AccessTokenPayload;
  }
}

/** Verifies `Authorization: Bearer <access-token>` and attaches req.user. */
export async function requireAuth(req: FastifyRequest, _reply: FastifyReply) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw unauthorized();
  const payload = verifyAccessToken(token);
  if (!payload) throw unauthorized("Session expired. Please log in again.");
  req.user = payload;
}

/** Role gate — use after requireAuth. */
export function requireRole(...roles: AccessTokenPayload["role"][]) {
  return async function (req: FastifyRequest, _reply: FastifyReply) {
    if (!roles.includes(req.user.role)) {
      throw forbidden();
    }
  };
}
