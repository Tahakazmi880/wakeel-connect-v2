import crypto from "node:crypto";

/** Normalize a Pakistani mobile number to E.164 (+92XXXXXXXXXX). Returns null if invalid. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let local: string | null = null;
  if (/^03\d{9}$/.test(digits)) local = digits; // 03XXXXXXXXX
  else if (/^923\d{9}$/.test(digits)) local = "0" + digits.slice(2); // 923XXXXXXXXX
  else if (/^\+?92?3\d{9}$/.test(input.replace(/\s/g, ""))) {
    const d = input.replace(/\D/g, "");
    const stripped = d.startsWith("92") ? d.slice(2) : d;
    if (/^3\d{9}$/.test(stripped)) local = "0" + stripped;
  }
  if (!local) return null;
  return "+92" + local.slice(1);
}

/** Mask a phone for logs: +92 300 •••••67 */
export function maskPhone(e164: string): string {
  return e164.slice(0, 7) + " •••••" + e164.slice(-2);
}

/** SHA-256 hex of a value — for tokens/hashes we never need to reverse. */
export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Constant-time string comparison (prevents timing attacks on codes/tokens). */
export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** 6-digit OTP, crypto-random. */
export function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** Opaque random token (for refresh sessions). */
export function generateOpaqueToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}
