import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { sha256Hex, generateOpaqueToken } from "./crypto.js";

export interface AccessTokenPayload {
  sub: string; // user id
  role: "CLIENT" | "LAWYER" | "ADMIN";
  phone: string;
}

/** Short-lived JWT for API calls (Authorization: Bearer). */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL_SEC });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    if (!decoded?.sub || !decoded?.role) return null;
    return decoded;
  } catch {
    return null;
  }
}

/** Opaque refresh token: the raw value goes to the httpOnly cookie only. */
export function newRefreshToken(): { raw: string; hash: string } {
  const raw = generateOpaqueToken();
  return { raw, hash: sha256Hex(raw) };
}

/** OTP code hash: SHA-256(code + pepper). The code itself is never stored. */
export function hashOtpCode(code: string): string {
  return sha256Hex(`otp:${env.OTP_PEPPER}:${code}`);
}
