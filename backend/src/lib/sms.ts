import { env } from "./env.js";
import { maskPhone } from "./crypto.js";

export interface SmsResult {
  ok: boolean;
  providerRef?: string;
}

/**
 * SMS abstraction. In development (SMS_PROVIDER=log) the code is written
 * to the server log so the OTP flow can be tested without spending money.
 * Set SMS_PROVIDER=twilio + credentials for real delivery.
 */
export interface SmsProvider {
  sendOtp(phone: string, code: string): Promise<SmsResult>;
}

class LogSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string): Promise<SmsResult> {
    // eslint-disable-next-line no-console
    console.log(`[sms:log] OTP for ${maskPhone(phone)}: ${code} (set SMS_PROVIDER=twilio for real delivery)`);
    return { ok: true, providerRef: "log" };
  }
}

class TwilioSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string): Promise<SmsResult> {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
      throw new Error("Twilio credentials missing: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM");
    }
    const body = new URLSearchParams({
      To: phone,
      From: TWILIO_FROM,
      Body: `wakeel.connect code: ${code}. Valid for ${env.OTP_TTL_MIN} minutes. Never share this code.`,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Twilio send failed (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as { sid?: string };
    return { ok: true, providerRef: data.sid };
  }
}

export const smsProvider: SmsProvider = env.SMS_PROVIDER === "twilio" ? new TwilioSmsProvider() : new LogSmsProvider();
