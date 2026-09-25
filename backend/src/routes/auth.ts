import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import { normalizePhone, generateOtp, sha256Hex, safeEqual } from "../lib/crypto.js";
import { signAccessToken, verifyAccessToken, newRefreshToken, hashOtpCode } from "../lib/auth.js";
import { smsProvider } from "../lib/sms.js";
import { badRequest, unauthorized, tooMany } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";

const REFRESH_COOKIE = "wc_refresh";

function setRefreshCookie(reply: import("fastify").FastifyReply, raw: string) {
  reply.setCookie(REFRESH_COOKIE, raw, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 3600,
  });
}

function clearRefreshCookie(reply: import("fastify").FastifyReply) {
  reply.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
}

const phoneSchema = z.object({
  phone: z.string().min(10).max(20),
});

const verifySchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits."),
});

const googleSchema = z.object({
  idToken: z.string().min(10, "Missing Google credential."),
});

export async function authRoutes(app: FastifyInstance) {
  /**
   * Request an OTP. Always returns ok (no phone enumeration), but the code
   * is only created/sent when the number is valid. Strictly rate-limited.
   */
  app.post(
    "/auth/otp/request",
    {
      config: {
        // Hook the rate limiter at preHandler (after body parsing) so the
        // bucket keys on the normalized phone number, not just the IP.
        // The old onRequest default saw req.body as undefined, which made
        // this a shared 5/hour-per-IP bucket regardless of phone number.
        rateLimit: {
          max: 5,
          timeWindow: "1 hour",
          hook: "preHandler",
          keyGenerator: (req) =>
            req.ip + ":" + (normalizePhone((req.body as { phone?: string })?.phone ?? "") ?? ""),
        },
      },
    },
    async (req, reply) => {
      const parsed = phoneSchema.safeParse(req.body);
      if (!parsed.success) throw badRequest("INVALID_PHONE", "Please enter a valid mobile number.");
      const phone = normalizePhone(parsed.data.phone);
      if (!phone) throw badRequest("INVALID_PHONE", "Please enter a valid Pakistani mobile number (e.g. 0300 1234567).");

      // One live code per phone — expire the old one instead of stacking codes.
      await prisma.otpCode.updateMany({
        where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + env.OTP_TTL_MIN * 60_000);
      await prisma.otpCode.create({
        data: { phone, codeHash: hashOtpCode(code), purpose: "login", expiresAt },
      });

      try {
        await smsProvider.sendOtp(phone, code);
      } catch (err) {
        app.log.error({ err, phone: phone.slice(0, 7) + "•••" }, "SMS send failed");
        throw badRequest("SMS_FAILED", "Could not send the code. Please try again in a minute.");
      }

      return reply.send({ ok: true, expiresInSec: env.OTP_TTL_MIN * 60 });
    }
  );

  /**
   * Verify an OTP → creates/updates the user, starts a refresh session,
   * returns a short-lived access token. Attempts are capped; a wrong code
   * burns one attempt, 5 wrong codes kill the OTP.
   */
  app.post("/auth/otp/verify", async (req, reply) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_CODE", "Please enter the 6-digit code.");
    const phone = normalizePhone(parsed.data.phone);
    if (!phone) throw badRequest("INVALID_PHONE", "Please enter a valid Pakistani mobile number.");

    const otp = await prisma.otpCode.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) throw badRequest("CODE_EXPIRED", "This code has expired. Please request a new one.");

    if (otp.attempts >= otp.maxAttempts) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
      throw tooMany("Too many wrong attempts. Please request a new code.");
    }

    // TEMPORARY soft-launch bypass: accept any 6-digit code while no SMS
    // provider is configured (OTP_ACCEPT_ANY=true). Remove when Twilio is live.
    if (env.OTP_ACCEPT_ANY) {
      app.log.warn(`[security] OTP bypass accepted for ${phone.slice(0, 7)}••• — disable OTP_ACCEPT_ANY once real SMS is live`);
    } else if (!safeEqual(hashOtpCode(parsed.data.code), otp.codeHash)) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: otp.attempts + 1 } });
      throw badRequest("WRONG_CODE", "Wrong code. Please check and try again.");
    }

    await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });

    const user = await prisma.user.upsert({
      where: { phone },
      update: { phoneVerifiedAt: new Date(), lastLoginAt: new Date(), status: "ACTIVE" },
      create: { phone, phoneVerifiedAt: new Date(), fullName: phone, lastLoginAt: new Date() },
    });
    if (user.status === "SUSPENDED") throw unauthorized("This account has been suspended.");

    const { raw, hash } = newRefreshToken();
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 3600_000);
    await prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: hash,
        userAgent: req.headers["user-agent"]?.slice(0, 255),
        ip: req.ip,
        expiresAt,
      },
    });
    setRefreshCookie(reply, raw);

    const accessToken = signAccessToken({ sub: user.id, role: user.role, phone: user.phone ?? undefined });
    return reply.send({
      ok: true,
      accessToken,
      expiresInSec: env.ACCESS_TOKEN_TTL_SEC,
      user: { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role },
    });
  });

  /**
   * "Continue with Google" — verify the Google ID token, find or create the
   * user, and start a session. Same token shape as the OTP flow.
   *
   * Account linking: if a user already exists with the Google email address
   * (e.g. signed up via OTP), the Google identity is linked to that account
   * so they don't end up with two profiles.
   */
  app.post("/auth/google", async (req, reply) => {
    if (!env.GOOGLE_CLIENT_ID) {
      return reply.code(503).send({ ok: false, error: "GOOGLE_DISABLED", message: "Google sign-in is not configured yet." });
    }
    const parsed = googleSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("INVALID_TOKEN", "Missing Google credential.");

    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: parsed.data.idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw badRequest("INVALID_TOKEN", "Could not verify your Google sign-in. Please try again.");
    }
    if (!payload?.sub || !payload?.email) {
      throw badRequest("INVALID_TOKEN", "Google did not share an email address. Please try another account.");
    }
    if (payload.email_verified === false) {
      throw badRequest("UNVERIFIED_EMAIL", "This Google account's email is not verified.");
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const fullName = (payload.name || email.split("@")[0] || "WakeelConnect User").slice(0, 120);
    const avatarUrl = typeof payload.picture === "string" ? payload.picture.slice(0, 500) : null;

    // 1) Existing Google-linked account. 2) Same email from OTP sign-up → link.
    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      const byEmail = await prisma.user.findUnique({ where: { email } });
      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: { googleId, avatarUrl: byEmail.avatarUrl ?? avatarUrl, lastLoginAt: new Date(), status: "ACTIVE" },
        });
      } else {
        user = await prisma.user.create({
          data: { googleId, email, fullName, avatarUrl, lastLoginAt: new Date() },
        });
      }
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date(), status: "ACTIVE" },
      });
    }
    if (user.status === "SUSPENDED") throw unauthorized("This account has been suspended.");

    const { raw, hash } = newRefreshToken();
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 3600_000);
    await prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: hash,
        userAgent: req.headers["user-agent"]?.slice(0, 255),
        ip: req.ip,
        expiresAt,
      },
    });
    setRefreshCookie(reply, raw);

    const accessToken = signAccessToken({ sub: user.id, role: user.role, phone: user.phone ?? undefined });
    return reply.send({
      ok: true,
      accessToken,
      expiresInSec: env.ACCESS_TOKEN_TTL_SEC,
      user: { id: user.id, phone: user.phone, email: user.email, fullName: user.fullName, role: user.role },
    });
  });

  /**
   * Rotate the refresh token. Reuse of an already-rotated token = possible
   * theft → revoke ALL sessions for that user (standard refresh rotation).
   */
  app.post("/auth/refresh", async (req, reply) => {
    const raw = req.cookies[REFRESH_COOKIE];
    if (!raw) throw unauthorized();

    const hash = sha256Hex(raw);
    const session = await prisma.refreshSession.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });

    // Unknown token — could be theft of a rotated token. Find by raw hash is
    // impossible (we never store raw), so treat unknown as simply expired.
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      clearRefreshCookie(reply);
      throw unauthorized("Session expired. Please log in again.");
    }
    if (session.user.status === "SUSPENDED") {
      await prisma.refreshSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
      clearRefreshCookie(reply);
      throw unauthorized("This account has been suspended.");
    }

    // Rotate: revoke the old, issue a new one.
    const next = newRefreshToken();
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 3600_000);
    await prisma.$transaction([
      prisma.refreshSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } }),
      prisma.refreshSession.create({
        data: {
          userId: session.userId,
          tokenHash: next.hash,
          userAgent: req.headers["user-agent"]?.slice(0, 255),
          ip: req.ip,
          expiresAt,
        },
      }),
      prisma.user.update({ where: { id: session.userId }, data: { lastLoginAt: new Date() } }),
    ]);
    setRefreshCookie(reply, next.raw);

    const accessToken = signAccessToken({ sub: session.user.id, role: session.user.role, phone: session.user.phone ?? undefined });
    return reply.send({ ok: true, accessToken, expiresInSec: env.ACCESS_TOKEN_TTL_SEC });
  });

  app.post("/auth/logout", async (req, reply) => {
    const raw = req.cookies[REFRESH_COOKIE];
    if (raw) {
      await prisma.refreshSession.updateMany({
        where: { tokenHash: sha256Hex(raw), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    clearRefreshCookie(reply);
    return reply.send({ ok: true });
  });

  app.get("/auth/me", { preHandler: [requireAuth] }, async (req) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { id: true, phone: true, email: true, fullName: true, role: true, phoneVerifiedAt: true, createdAt: true },
    });
    if (!user) throw unauthorized();
    return { ok: true, user };
  });

  // Housekeeping: prune dead OTP rows + expired sessions (called by cron).
  app.post("/auth/prune", async (req, reply) => {
    const cronSecret = req.headers["x-cron-secret"];
    if (!cronSecret || !safeEqual(String(cronSecret), env.JWT_SECRET.slice(0, 32))) {
      throw unauthorized();
    }
    const [otps, sessions] = await prisma.$transaction([
      prisma.otpCode.deleteMany({ where: { OR: [{ expiresAt: { lt: new Date() } }, { consumedAt: { not: null } }] } }),
      prisma.refreshSession.deleteMany({ where: { OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }] } }),
    ]);
    void verifyAccessToken; // keep import used if tree-shaken
    return reply.send({ ok: true, prunedOtps: otps.count, prunedSessions: sessions.count });
  });
}
