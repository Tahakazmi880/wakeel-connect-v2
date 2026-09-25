"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn, SectionHead } from "@/components/ui";
import { CheckIcon, PhoneIcon, ArrowIcon } from "@/components/icons";
import { requestOtp, verifyOtp, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import GoogleSignIn from "@/components/GoogleSignIn";

/** Map backend error codes to simple bilingual messages. */
function errorText(err: unknown): { en: string; ur: string } {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "WRONG_CODE":
      case "INVALID_CODE":
        return { en: "Ghalat code — dobara try karein", ur: "غلط کوڈ — دوبارہ کوشش کریں" };
      case "CODE_EXPIRED":
        return { en: "Code expire ho gaya — naya code mangwayein", ur: "کوڈ ختم ہو گیا — نیا کوڈ منگوائیں" };
      case "RATE_LIMITED":
      case "TOO_MANY_ATTEMPTS":
        return { en: "Bohat zyada koshish — thori dair baad try karein", ur: "بہت زیادہ کوشش — تھوڑی دیر بعد کوشش کریں" };
      case "INVALID_PHONE":
        return { en: "Ye mobile number durust nahi", ur: "یہ موبائل نمبر درست نہیں" };
      case "SMS_FAILED":
        return { en: "Code nahi bheja ja saka — 1 minute baad try karein", ur: "کوڈ نہیں بھیجا جا سکا — ۱ منٹ بعد کوشش کریں" };
    }
  }
  return { en: "Kuch ghalat ho gaya — dobara try karein", ur: "کچھ غلط ہو گیا — دوبارہ کوشش کریں" };
}

function fmtCountdown(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Six one-digit boxes with auto-advance + paste support. */
function OtpBoxes({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, d: string) => {
    const next = value.split("");
    next[i] = d;
    onChange(next.join("").slice(0, 6));
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-1.5" dir="ltr">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, d);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
              setDigit(i - 1, "");
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (digits) {
              onChange(digits);
              refs.current[Math.min(digits.length, 5)]?.focus();
            }
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1}`}
          className="h-14 w-12 min-w-0 rounded-lg border border-ink-900/15 text-center font-display text-2xl font-semibold text-ink-950 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20 disabled:bg-paper-dark/60 sm:h-16 sm:w-14"
        />
      ))}
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const { user, loading: sessionLoading } = useSession();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(""); // 10 digits, without +92
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ en: string; ur: string } | null>(null);
  const [ttl, setTtl] = useState(0);

  // Already logged in → go where they were headed.
  useEffect(() => {
    if (!sessionLoading && user) router.replace(next);
  }, [sessionLoading, user, router, next]);

  // Resend countdown.
  useEffect(() => {
    if (ttl <= 0) return;
    const t = setTimeout(() => setTtl((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [ttl]);

  // Auto-verify when all 6 digits are in.
  useEffect(() => {
    if (step === "code" && code.length === 6 && !busy) {
      void doVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const phoneValid = phone.length === 10 && phone.startsWith("3");

  async function doSend(resend = false) {
    if (!phoneValid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { expiresInSec } = await requestOtp(phone);
      setTtl(expiresInSec);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(errorText(err));
      if (resend) setStep("phone");
    } finally {
      setBusy(false);
    }
  }

  async function doVerify(six: string) {
    if (six.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(phone, six);
      router.replace(next);
    } catch (err) {
      setError(errorText(err));
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <SectionHead
        eyebrowEn="Login" eyebrowUr="لاگ اِن"
        title={<T en="Login with your phone" ur="فون سے لاگ اِن کریں" />}
        sub={<T en="No password to remember — we'll send a 6-digit code to your mobile." ur="پاس ورڈ یاد رکھنے کی ضرورت نہیں — آپ کے موبائل پر ۶ ہندسوں کا کوڈ آئے گا۔" />}
      />

      <section className="rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8" aria-label="Login">
        {/* Continue with Google — no phone needed to start. */}
        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <>
            <GoogleSignIn onDone={() => router.replace(next)} />
            <div className="my-6 flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-ink-900/10" />
              <span className="text-sm font-bold text-ink-400">
                <T en="or" ur="یا" />
              </span>
              <span className="h-px flex-1 bg-ink-900/10" />
            </div>
          </>
        )}

        {step === "phone" ? (
          <>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700">
                <T en="Mobile number" ur="موبائل نمبر" />
              </span>
              <span className="flex overflow-hidden rounded-lg border border-ink-900/15 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
                <span className="flex min-h-[60px] items-center border-r border-ink-900/15 bg-paper-dark/40 px-4 text-lg font-bold text-ink-700">+92</span>
                <input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError(null);
                  }}
                  inputMode="numeric"
                  placeholder="300 1234567"
                  className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-ink-950 outline-none"
                  aria-label="Mobile number"
                  autoFocus
                />
              </span>
            </label>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={error.en} ur={error.ur} />
              </p>
            )}
            <div className="mt-6">
              <PrimaryBtn
                className="w-full"
                icon={<PhoneIcon className="h-6 w-6" />}
                disabled={!phoneValid || busy}
                onClick={() => void doSend()}
              >
                <T en={busy ? "Sending…" : "Send login code"} ur={busy ? "بھیجا جا رہا ہے…" : "لاگ اِن کوڈ بھیجیں"} />
              </PrimaryBtn>
              {phone.length > 0 && !phoneValid && (
                <p className="mt-2 text-center text-sm font-semibold text-brass-600">
                  <T en="Please enter a full 10-digit mobile number (e.g. 300 1234567)." ur="پورا ۱۰ ہندسوں کا موبائل نمبر لکھیں (مثلاً 300 1234567)۔" />
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-base font-bold text-ink-700">
              <T en={`Code sent to +92 ${phone}`} ur={`+92 ${phone} پر کوڈ بھیجا گیا`} />
            </p>
            {/* Honest dev-mode note: SMS_PROVIDER=log, no real SMS is sent. */}
            <p className="mx-auto mt-2 max-w-md rounded-lg bg-brass-50 px-4 py-2 text-center text-sm font-semibold text-brass-700 ring-1 ring-brass-200">
              <T
                en="Demo mode: real SMS nahi bheja jata — OTP backend logs mein milta hai."
                ur="ڈیمو موڈ: اصل ایس ایم ایس نہیں بھیجا جاتا — او ٹی پی بیک اینڈ لاگز میں ملتا ہے۔"
              />
            </p>
            <div className="mt-6">
              <OtpBoxes value={code} onChange={setCode} disabled={busy} />
            </div>
            {error && (
              <p className="mt-4 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={error.en} ur={error.ur} />
              </p>
            )}
            <div className="mt-6">
              <PrimaryBtn
                className="w-full"
                icon={<CheckIcon className="h-6 w-6" />}
                disabled={code.length !== 6 || busy}
                onClick={() => void doVerify(code)}
              >
                <T en={busy ? "Checking…" : "Verify & login"} ur={busy ? "چیک ہو رہا ہے…" : "تصدیق کریں"} />
              </PrimaryBtn>
            </div>
            <div className="mt-4 text-center">
              {ttl > 0 ? (
                <p className="text-base font-bold text-ink-500">
                  <T en={`Resend code in ${fmtCountdown(ttl)}`} ur={`${fmtCountdown(ttl)} میں دوبارہ بھیجیں`} />
                </p>
              ) : (
                <SecondaryBtn icon={<PhoneIcon className="h-5 w-5" />} onClick={() => void doSend(true)}>
                  <T en="Resend code" ur="کوڈ دوبارہ بھیجیں" />
                </SecondaryBtn>
              )}
            </div>
            <div className="mt-4 text-center">
              <SecondaryBtn
                icon={<ArrowIcon className="h-5 w-5" />}
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError(null);
                }}
              >
                <T en="Wrong number? Go back" ur="نمبر غلط؟ واپس جائیں" />
              </SecondaryBtn>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm font-semibold text-ink-500">
          <T
            en="This number becomes your account — your bookings will be linked to it."
            ur="یہی نمبر آپ کا اکاؤنٹ ہے — آپ کی بکنگز اسی سے جڑیں گی۔"
          />
        </p>
      </section>

      <p className="mt-6 text-center">
        <Link href="/" className="text-base font-bold text-court-700 hover:underline">
          <T en="← Back to home" ur="← ہوم پر واپس" />
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
