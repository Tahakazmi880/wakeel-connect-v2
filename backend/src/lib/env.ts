import { z } from "zod";

/**
 * Validated environment. The server refuses to boot when a required
 * secret is missing or weak — fail fast instead of running insecure.
 */
/**
 * Explicit string -> boolean parsing. z.coerce.boolean() uses Boolean(v),
 * so the string "false" would coerce to TRUE and wrongly mark auth cookies
 * as Secure on plain-HTTP dev servers. Only explicit truthy strings count.
 */
const envBool = z
  .union([z.boolean(), z.string()])
  .transform((v) =>
    typeof v === "boolean" ? v : ["1", "true", "yes", "on"].includes(v.trim().toLowerCase()),
  );

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // At least 32 chars in production; dev may use the documented fallback.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_TTL_SEC: z.coerce.number().int().positive().default(900), // 15 min
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),

  FRONTEND_URL: z.string().url().default("http://localhost:3100"),
  COOKIE_SECURE: envBool.default(false), // true in production (HTTPS)

  OTP_PEPPER: z.string().min(16, "OTP_PEPPER must be at least 16 characters"),
  OTP_TTL_MIN: z.coerce.number().int().positive().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  SMS_PROVIDER: z.enum(["log", "twilio"]).default("log"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),

  // TEMPORARY soft-launch bypass (user-approved 2026-09-24): when true, the
  // verify endpoint accepts ANY 6-digit code so bookings work before a real
  // SMS provider is wired. Rate limiting + OTP record checks still apply.
  // MUST be set back to false once SMS_PROVIDER=twilio is live.
  OTP_ACCEPT_ANY: envBool.default(false),

  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_MB: z.coerce.number().int().positive().default(10),

  // Supabase Storage for uploads in production (Render's disk is ephemeral).
  // When unset, documents stay on local disk (development default).
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default("booking-docs"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment:\n" + parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
