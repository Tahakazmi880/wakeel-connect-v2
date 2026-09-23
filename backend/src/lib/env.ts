import { z } from "zod";

/**
 * Validated environment. The server refuses to boot when a required
 * secret is missing or weak — fail fast instead of running insecure.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // At least 32 chars in production; dev may use the documented fallback.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_TTL_SEC: z.coerce.number().int().positive().default(900), // 15 min
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),

  FRONTEND_URL: z.string().url().default("http://localhost:3100"),
  COOKIE_SECURE: z.coerce.boolean().default(false), // true in production (HTTPS)

  OTP_PEPPER: z.string().min(16, "OTP_PEPPER must be at least 16 characters"),
  OTP_TTL_MIN: z.coerce.number().int().positive().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),

  SMS_PROVIDER: z.enum(["log", "twilio"]).default("log"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),

  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_MB: z.coerce.number().int().positive().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment:\n" + parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
