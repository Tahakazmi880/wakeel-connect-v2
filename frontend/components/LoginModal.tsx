"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import { CheckIcon, PhoneIcon, BriefcaseIcon, UserIcon } from "./icons";
import { ApiError, requestOtp, verifyOtp, type SessionUser } from "@/lib/api";
import GoogleSignIn from "./GoogleSignIn";

export type LoginRole = "CLIENT" | "LAWYER";

const COUNTRY_CODES = [
  { code: "+92", label: "Pakistan", stripLeadingZero: true },
  { code: "+971", label: "UAE" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+44", label: "UK" },
  { code: "+1", label: "USA / Canada" },
  { code: "+61", label: "Australia" },
];

/** Map backend error codes to simple bilingual messages. */
function errorText(err: unknown): { en: string; ur: string } {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "WRONG_CODE":
      case "INVALID_CODE":
        return { en: "Wrong code — try again", ur: "غلط کوڈ — دوبارہ کوشش کریں" };
      case "CODE_EXPIRED":
        return { en: "Code expired — request a new one", ur: "کوڈ ختم ہو گیا — نیا کوڈ منگوائیں" };
      case "RATE_LIMITED":
      case "TOO_MANY_ATTEMPTS":
        return { en: "Too many tries — wait a little and try again", ur: "بہت زیادہ کوشش — تھوڑی دیر بعد کوشش کریں" };
      case "INVALID_PHONE":
        return { en: "This mobile number doesn't look right", ur: "یہ موبائل نمبر درست نہیں لگ رہا" };
      case "SMS_FAILED":
        return { en: "Code couldn't be sent — try again in a minute", ur: "کوڈ نہیں بھیجا جا سکا — ایک منٹ بعد کوشش کریں" };
    }
  }
  return { en: "Something went wrong — try again", ur: "کچھ غلط ہو گیا — دوبارہ کوشش کریں" };
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
    <div className="flex justify-center gap-2" dir="ltr">
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
          className="h-14 w-11 rounded-lg border border-ink-900/15 bg-white text-center font-display text-2xl font-semibold text-ink-950 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20 disabled:opacity-50 sm:h-16 sm:w-12"
        />
      ))}
    </div>
  );
}

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  /** Fired with the verified user right after a successful login. */
  onSuccess?: (user: SessionUser) => void;
  /** Which tab the modal opens on. Only changes labels — the OTP flow is the same. */
  initialRole?: LoginRole;
}

/**
 * oladoc-style login modal: role tabs (client / lawyer) → country-code picker +
 * phone number → Continue → 6-digit OTP boxes → success. Reuses the same
 * /auth/otp/* endpoints as the /login page, so behaviour is identical.
 */
export default function LoginModal({ open, onClose, onSuccess, initialRole = "CLIENT" }: LoginModalProps) {
  const [role, setRole] = useState<LoginRole>(initialRole);
  const [step, setStep] = useState<"phone" | "code" | "done">("phone");
  const [cc, setCc] = useState("+92");
  const [national, setNational] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ en: string; ur: string } | null>(null);
  const [ttl, setTtl] = useState(0);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Reset every time the modal opens; lock body scroll; close on Escape.
  // Remember the element that opened the modal and give it focus back on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    setRole(initialRole);
    setStep("phone");
    setNational("");
    setCode("");
    setError(null);
    setTtl(0);
    setBusy(false);
    const t = setTimeout(() => phoneRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, initialRole, onClose]);

  useEffect(() => {
    if (ttl <= 0) return;
    const t = setTimeout(() => setTtl((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [ttl]);

  if (!open) return null;

  const isPk = cc === "+92";
  const digits = isPk && COUNTRY_CODES[0].stripLeadingZero ? national.replace(/^0+/, "") : national;
  const phoneValid = isPk
    ? digits.length === 10 && digits.startsWith("3")
    : digits.length >= 6 && digits.length <= 14;
  const fullPhone = isPk ? digits : `${cc}${digits}`;

  async function doSend() {
    if (!phoneValid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { expiresInSec } = await requestOtp(fullPhone);
      setTtl(expiresInSec);
      setCode("");
      setStep("code");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function doVerify() {
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const user = await verifyOtp(fullPhone, code);
      setStep("done");
      onSuccess?.(user);
    } catch (e) {
      setError(errorText(e));
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  const subtitle =
    role === "CLIENT"
      ? { en: "Book lawyers and track your appointments", ur: "وکیل بک کریں اور اپنی بکنگز دیکھیں" }
      : { en: "Registered with us? Log in with your number", ur: "ہمارے پاس رجسٹرڈ ہیں؟ اپنے نمبر سے لاگ اِن کریں" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-b-none rounded-t-3xl bg-white p-6 shadow-lift max-h-[92vh] overflow-y-auto sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-ink-900/15 sm:hidden" aria-hidden />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.5rem] font-semibold text-ink-950">
              <T en="Login / Sign up" ur="لاگ اِن / رجسٹر" />
            </h2>
            <p className="mt-1 text-base font-semibold text-ink-600">
              <T en={subtitle.en} ur={subtitle.ur} />
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full text-2xl font-bold text-ink-500 transition hover:bg-paper-dark/60"
          >
            ×
          </button>
        </div>

        {/* role tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-paper-dark/50 p-1.5" role="tablist" aria-label="Login as">
          {(
            [
              { id: "CLIENT", en: "Client", ur: "کلائنٹ", icon: <UserIcon className="h-5 w-5" /> },
              { id: "LAWYER", en: "Lawyer", ur: "وکیل", icon: <BriefcaseIcon className="h-5 w-5" /> },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={role === t.id}
              onClick={() => {
                setRole(t.id);
                setError(null);
              }}
              className={`flex min-h-[52px] items-center justify-center gap-2 rounded-lg text-base font-bold transition ${
                role === t.id ? "bg-white text-court-800 shadow-card" : "text-ink-500 hover:text-ink-800"
              }`}
            >
              {t.icon}
              <T en={t.en} ur={t.ur} />
            </button>
          ))}
        </div>

        {step === "phone" && (
          <>
            {/* Continue with Google — no phone needed to start. */}
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <>
                <div className="mt-5">
                  <GoogleSignIn
                    onDone={(user) => {
                      onClose();
                      onSuccess?.(user);
                    }}
                  />
                </div>
                <div className="my-5 flex items-center gap-3" aria-hidden>
                  <span className="h-px flex-1 bg-ink-900/10" />
                  <span className="text-sm font-bold text-ink-400">
                    <T en="or" ur="یا" />
                  </span>
                  <span className="h-px flex-1 bg-ink-900/10" />
                </div>
              </>
            )}
            <p className="mt-5 text-base text-ink-600">
              <T
                en="Enter your mobile number — we'll send a 6-digit verification code. No password needed."
                ur="اپنا موبائل نمبر لکھیں — ۶ ہندسوں کا تصدیقی کوڈ آئے گا۔ پاس ورڈ کی ضرورت نہیں۔"
              />
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-bold text-ink-700">
                <T en="Mobile number" ur="موبائل نمبر" />
              </span>
              <span className="flex overflow-hidden rounded-lg border border-ink-900/15 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
                <select
                  value={cc}
                  onChange={(e) => {
                    setCc(e.target.value);
                    setNational("");
                    setError(null);
                  }}
                  aria-label="Country code"
                  className="min-h-[60px] shrink-0 border-r border-ink-900/15 bg-paper-dark/40 px-2 text-lg font-bold text-ink-700 outline-none"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  ref={phoneRef}
                  value={national}
                  onChange={(e) => {
                    setNational(e.target.value.replace(/\D/g, "").slice(0, 14));
                    setError(null);
                  }}
                  inputMode="tel"
                  placeholder={isPk ? "300 1234567" : "5X XXX XXXX"}
                  dir="ltr"
                  aria-label="Mobile number"
                  className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-ink-950 outline-none"
                />
              </span>
              <span className="mt-1 block text-sm font-semibold text-ink-500">
                {COUNTRY_CODES.find((c) => c.code === cc)?.label}
              </span>
            </label>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={error.en} ur={error.ur} />
              </p>
            )}
            <div className="mt-5">
              <PrimaryBtn
                className="w-full"
                icon={<PhoneIcon className="h-6 w-6" />}
                disabled={!phoneValid || busy}
                onClick={doSend}
              >
                <T en={busy ? "Sending…" : "Continue"} ur={busy ? "بھیجا جا رہا ہے…" : "آگے بڑھیں"} />
              </PrimaryBtn>
            </div>
            {role === "LAWYER" && (
              <p className="mt-4 text-center text-base font-semibold text-ink-600">
                <T en="New here? " ur="نئے ہیں؟ " />
                <Link href="/join" onClick={onClose} className="font-bold text-court-700 hover:underline">
                  <T en="Join as a lawyer" ur="وکیل کے طور پر شامل ہوں" />
                </Link>
              </p>
            )}
          </>
        )}

        {step === "code" && (
          <>
            <p className="mt-5 text-center text-base font-bold text-ink-700">
              <T en={`Code sent to ${cc} ${national}`} ur={`${cc} ${national} پر کوڈ بھیجا گیا`} />
            </p>
            <div className="mt-4">
              <OtpBoxes value={code} onChange={setCode} disabled={busy} />
            </div>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={error.en} ur={error.ur} />
              </p>
            )}
            <div className="mt-5">
              <PrimaryBtn
                className="w-full"
                icon={<CheckIcon className="h-6 w-6" />}
                disabled={code.length !== 6 || busy}
                onClick={doVerify}
              >
                <T en={busy ? "Checking…" : "Verify & log in"} ur={busy ? "چیک ہو رہا ہے…" : "تصدیق کریں"} />
              </PrimaryBtn>
            </div>
            <div className="mt-3 text-center">
              {ttl > 0 ? (
                <p className="text-base font-bold text-ink-500">
                  <T
                    en={`Resend in ${Math.floor(ttl / 60)}:${String(ttl % 60).padStart(2, "0")}`}
                    ur={`${Math.floor(ttl / 60)}:${String(ttl % 60).padStart(2, "0")} میں دوبارہ بھیجیں`}
                  />
                </p>
              ) : (
                <SecondaryBtn icon={<PhoneIcon className="h-5 w-5" />} onClick={doSend}>
                  <T en="Resend code" ur="کوڈ دوبارہ بھیجیں" />
                </SecondaryBtn>
              )}
            </div>
            <div className="mt-2 text-center">
              <SecondaryBtn
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

        {step === "done" && (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-court-50 ring-1 ring-court-700/20">
              <CheckIcon className="h-10 w-10 text-court-700" />
            </span>
            <p className="mt-4 font-display text-[1.4rem] font-semibold text-ink-950">
              <T en="You're logged in!" ur="آپ لاگ اِن ہو گئے!" />
            </p>
            <div className="mt-5">
              <PrimaryBtn className="w-full" onClick={onClose}>
                <T en="Continue" ur="آگے بڑھیں" />
              </PrimaryBtn>
            </div>
          </div>
        )}

        <p className="mt-5 text-center text-sm font-semibold text-ink-500">
          <T
            en="This number becomes your account — bookings are linked to it."
            ur="یہی نمبر آپ کا اکاؤنٹ ہے — بکنگز اسی سے جڑیں گی۔"
          />
        </p>
      </div>
    </div>
  );
}
