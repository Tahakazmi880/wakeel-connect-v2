"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, Rating, SecondaryBtn } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  OfficeIcon,
  PhoneIcon,
  ShieldIcon,
  VideoIcon,
  WalletIcon,
} from "./icons";
import SlotPicker, { slotToISO, type SlotPick } from "./SlotPicker";
import {
  ApiError,
  createBooking,
  fileUrl,
  formatFee,
  getLawyer,
  getLawyerSlots,
  requestOtp,
  restoreSession,
  verifyOtp,
  type Booking,
  type BookingMode,
  type LawyerSummary,
  type SlotDay,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import GoogleSignIn from "./GoogleSignIn";

const MODES: { id: BookingMode; en: string; ur: string; icon: (c: string) => React.ReactNode }[] = [
  { id: "ONLINE_VIDEO", en: "Online consultation", ur: "آن لائن مشاورت", icon: (c) => <VideoIcon className={c} /> },
  { id: "IN_CHAMBER", en: "Office Visit", ur: "دفتر کی ملاقات", icon: (c) => <OfficeIcon className={c} /> },
  { id: "PHONE", en: "Phone Call", ur: "فون کال", icon: (c) => <PhoneIcon className={c} /> },
];

function StepDots({ step }: { step: number }) {
  const labels = [
    { en: "Time", ur: "وقت" },
    { en: "Confirm", ur: "تصدیق" },
    { en: "Done", ur: "ہو گیا" },
  ];
  return (
    <ol className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-3" aria-label="Booking progress">
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={l.en} className="flex items-center gap-2">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold transition sm:h-11 sm:w-11 sm:text-lg ${
                done ? "bg-court-700 text-white" : current ? "bg-court-700 text-white ring-2 ring-brass-500 ring-offset-2 ring-offset-paper" : "bg-ink-900/5 text-ink-500"
              }`}
              aria-current={current ? "step" : undefined}
            >
              {done ? <CheckIcon className="h-6 w-6" /> : n}
            </span>
            <span className={`whitespace-nowrap text-sm font-bold sm:text-base ${current || done ? "text-court-800" : "text-ink-500"}`}>
              <T en={l.en} ur={l.ur} />
            </span>
            {n < 3 && <span className="mx-1 h-0.5 w-6 bg-ink-900/15 sm:w-14" />}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Phone-capture modal (oladoc pattern): clicking a slot while logged out opens
 * this instead of a login page redirect. Same OTP flow as /login —
 * +92 number → 6-digit code → verified → booking continues.
 */
function PhoneModal({
  lawyerName,
  slotLabel,
  onClose,
  onVerified,
}: {
  lawyerName: string;
  slotLabel: string;
  onClose: () => void;
  /** phone is set when a Google user had no number on file and added one here. */
  onVerified: (phone?: string) => void;
}) {
  const [step, setStep] = useState<"phone" | "code" | "google-phone">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ttl, setTtl] = useState(0);

  useEffect(() => {
    if (ttl <= 0) return;
    const t = setTimeout(() => setTtl((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [ttl]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const phoneValid = phone.length === 10 && phone.startsWith("3");

  async function doSend() {
    if (!phoneValid || busy) return;
    setBusy(true);
    setError("");
    try {
      const { expiresInSec } = await requestOtp(phone);
      setTtl(expiresInSec);
      setCode("");
      setStep("code");
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "generic");
    } finally {
      setBusy(false);
    }
  }

  async function doVerify() {
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setError("");
    try {
      await verifyOtp(phone, code);
      onVerified();
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "generic");
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  /** After Google sign-in: continue if we have a phone, else ask for one (no OTP — Google verified the identity). */
  async function onGoogleDone() {
    const { getSessionUser } = await import("@/lib/api");
    const u = getSessionUser();
    if (u?.phone) onVerified();
    else setStep("google-phone");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Login with phone"
      onClick={onClose}
    >
      {/* Mobile bottom-sheet slide-up (desktop keeps the centered fade). */}
      <style jsx global>{`
        @keyframes wc-sheet-up {
          from { transform: translateY(28px); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 639px) {
          .wc-sheet-panel { animation: wc-sheet-up 0.28s ease-out; }
        }
      `}</style>
      <div
        className="wc-sheet-panel max-h-[92vh] w-full max-w-md overflow-y-auto rounded-b-none rounded-t-3xl bg-white p-6 pt-3 shadow-lift sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-ink-900/15 sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.5rem] font-semibold text-ink-950">
              <T en="Almost done" ur="بس تھوڑا سا باقی" />
            </h2>
            <p className="mt-1 text-base font-semibold text-ink-600">
              {lawyerName} · {slotLabel}
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

        {step === "google-phone" ? (
          <>
            <p className="mt-4 text-base text-ink-600">
              <T
                en="One last step — add your mobile number so the lawyer can reach you about the appointment."
                ur="آخری مرحلہ — اپنا موبائل نمبر لکھیں تاکہ وکیل ملاقات کے بارے میں رابطہ کر سکے۔"
              />
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-bold text-ink-700">
                <T en="Mobile number" ur="موبائل نمبر" />
              </span>
              <span className="flex overflow-hidden rounded-lg border border-ink-900/15 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
                <span className="flex min-h-[60px] items-center border-r border-ink-900/15 bg-paper-dark/40 px-4 text-lg font-bold text-ink-700">
                  +92
                </span>
                <input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  inputMode="numeric"
                  placeholder="300 1234567"
                  autoFocus
                  aria-label="Mobile number"
                  className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-ink-950 outline-none"
                />
              </span>
            </label>
            <div className="mt-5">
              <PrimaryBtn
                className="w-full"
                icon={<CheckIcon className="h-6 w-6" />}
                disabled={!phoneValid || busy}
                onClick={() => onVerified(phone)}
              >
                <T en="Continue" ur="آگے بڑھیں" />
              </PrimaryBtn>
            </div>
          </>
        ) : step === "phone" ? (
          <>
            <div className="mt-4">
              <GoogleSignIn onDone={() => void onGoogleDone()} />
            </div>
            <div className="my-5 flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-ink-900/10" />
              <span className="text-sm font-bold text-ink-400">
                <T en="or continue with mobile" ur="یا موبائل سے جاری رکھیں" />
              </span>
              <span className="h-px flex-1 bg-ink-900/10" />
            </div>
            <p className="text-base text-ink-600">
              <T
                en="Enter your mobile number — we'll send a verification code. No password needed."
                ur="اپنا موبائل نمبر لکھیں — تصدیقی کوڈ آئے گا۔ پاس ورڈ کی ضرورت نہیں۔"
              />
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-bold text-ink-700">
                <T en="Mobile number" ur="موبائل نمبر" />
              </span>
              <span className="flex overflow-hidden rounded-lg border border-ink-900/15 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
                <span className="flex min-h-[60px] items-center border-r border-ink-900/15 bg-paper-dark/40 px-4 text-lg font-bold text-ink-700">
                  +92
                </span>
                <input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  inputMode="numeric"
                  placeholder="300 1234567"
                  autoFocus
                  aria-label="Mobile number"
                  className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-ink-950 outline-none"
                />
              </span>
            </label>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en="Couldn't send the code — try again." ur="کوڈ نہ بھیجا جا سکا — دوبارہ کوشش کریں۔" />
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
          </>
        ) : (
          <>
            <p className="mt-4 text-center text-base font-bold text-ink-700">
              <T en={`Code sent to +92 ${phone}`} ur={`+92 ${phone} پر کوڈ بھیجا گیا`} />
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-bold text-ink-700">
                <T en="6-digit code" ur="۶ ہندسوں کا کوڈ" />
              </span>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                autoFocus
                aria-label="Verification code"
                dir="ltr"
                className="min-h-[60px] w-full rounded-lg border border-ink-900/15 px-4 text-center font-display text-2xl font-semibold tracking-[0.4em] text-ink-950 outline-none transition placeholder:text-ink-300 focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
              />
            </label>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en="Wrong or expired code — try again." ur="غلط یا پرانا کوڈ — دوبارہ کوشش کریں۔" />
              </p>
            )}
            <div className="mt-5">
              <PrimaryBtn
                className="w-full"
                icon={<CheckIcon className="h-6 w-6" />}
                disabled={code.length !== 6 || busy}
                onClick={doVerify}
              >
                <T en={busy ? "Checking…" : "Verify & continue"} ur={busy ? "چیک ہو رہا ہے…" : "تصدیق کریں"} />
              </PrimaryBtn>
            </div>
            <div className="mt-3 text-center">
              {ttl > 0 ? (
                <p className="text-base font-bold text-ink-500">
                  <T en={`Resend in ${Math.floor(ttl / 60)}:${String(ttl % 60).padStart(2, "0")}`} ur={`${Math.floor(ttl / 60)}:${String(ttl % 60).padStart(2, "0")} میں دوبارہ بھیجیں`} />
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
                  setError("");
                }}
              >
                <T en="Wrong number? Go back" ur="نمبر غلط؟ واپس جائیں" />
              </SecondaryBtn>
            </div>
          </>
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

export default function BookingFlow({ lawyerSlug }: { lawyerSlug: string }) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  const [lawyer, setLawyer] = useState<LawyerSummary | null>(null);
  const [loadError, setLoadError] = useState("");
  const [days, setDays] = useState<SlotDay[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const [mode, setMode] = useState<BookingMode>(() => {
    const m = (searchParams.get("mode") ?? "").toUpperCase();
    // Accept both enum values (ONLINE_VIDEO/IN_CHAMBER/PHONE) and the
    // friendly aliases used by card/profile CTAs: ?mode=online / ?mode=chamber.
    if (m === "IN_CHAMBER" || m === "CHAMBER") return "IN_CHAMBER";
    if (m === "PHONE") return "PHONE";
    return "ONLINE_VIDEO";
  });
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState<SlotPick | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  /** Phone collected in the auth modal for Google users with no number on file. */
  const [checkoutPhone, setCheckoutPhone] = useState("");

  // Session restore + lawyer + slots
  useEffect(() => {
    restoreSession().finally(() => setReady(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getLawyer(lawyerSlug)
      .then(({ lawyer }) => {
        if (!cancelled) setLawyer(lawyer);
      })
      .catch(() => {
        if (!cancelled) setLoadError("not-found");
      });
    return () => {
      cancelled = true;
    };
  }, [lawyerSlug]);

  const loadSlots = () => {
    setSlotsLoading(true);
    getLawyerSlots(lawyerSlug, 7)
      .then(({ days }) => setDays(days))
      .catch(() => setDays([]))
      .finally(() => setSlotsLoading(false));
  };
  useEffect(loadSlots, [lawyerSlug]);

  const initialPick: SlotPick | null =
    searchParams.get("date") && searchParams.get("start")
      ? { date: searchParams.get("date")!, start: searchParams.get("start")! }
      : null;

  if (!ready || !lawyer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {loadError ? (
          <>
            <p className="font-display text-[1.3rem] font-semibold text-ink-950"><T en="Lawyer not found" ur="وکیل نہیں ملا" /></p>
            <Link href="/lawyers" className="mt-4 inline-block font-bold text-court-700 hover:underline">
              <T en="Back to lawyers" ur="وکیلوں کی فہرست" />
            </Link>
          </>
        ) : (
          <p className="text-lg font-bold text-ink-500">…</p>
        )}
      </div>
    );
  }

  // ---- auth: low-friction phone modal (oladoc pattern) ----
  // If the user isn't logged in, clicking Continue opens the phone-capture
  // modal; after OTP verification the booking continues to confirmation.
  const goNext = () => {
    if (!pick) return;
    if (!user) setShowPhoneModal(true);
    else setStep(2);
  };

  // Fee for the selected mode. Falls back to the general consultation fee when
  // the mode-specific fee isn't specified — avoids showing "Fee on request"
  // on the booking page for a lawyer whose confirmed fee is known.
  const modeFeePaisa =
    mode === "ONLINE_VIDEO" ? lawyer.onlineFeePaisa || lawyer.consultationFeePaisa : lawyer.consultationFeePaisa;
  const fee = formatFee(modeFeePaisa);
  const modeInfo = MODES.find((m) => m.id === mode)!;
  const pickedDay = pick ? days.find((d) => d.date === pick.date) : undefined;

  const confirmBooking = async () => {
    if (!pick || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const { booking } = await createBooking({
        lawyerId: lawyer.id,
        startAt: slotToISO(pick.date, pick.start),
        mode,
        clientNote: note.trim() || undefined,
        clientPhone: checkoutPhone || undefined,
      });
      setBooking(booking);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      if (e instanceof ApiError && e.code === "SLOT_TAKEN") {
        setError("taken");
        loadSlots();
        setPick(null);
        setStep(1);
      } else if (e instanceof ApiError && e.code === "INVALID_SLOT") {
        setError("past");
      } else {
        setError("generic");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* lawyer summary */}
      <div className="flex flex-col gap-3 rounded-lg border border-ink-900/10 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} gender={lawyer.gender} size="sm" />
          <div className="min-w-0">
            <p className="font-display text-[1.25rem] font-semibold leading-snug text-ink-950">{lawyer.displayName}</p>
            <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
          </div>
        </div>
        <p className="wc-fee shrink-0 text-[1.3rem] text-ink-950 sm:ml-auto sm:text-[1.4rem]">
          {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
        </p>
      </div>

      <div className="mt-8"><StepDots step={step} /></div>

      {error === "taken" && (
        <p className="mx-auto mt-6 max-w-xl rounded-lg bg-brass-50 px-5 py-4 text-center text-base font-bold text-brass-800 ring-1 ring-brass-200">
          <T en="That slot was just taken — please pick another time." ur="یہ وقت ابھی بک ہو گیا — کوئی اور وقت چنیں۔" />
        </p>
      )}
      {error === "past" && (
        <p className="mx-auto mt-6 max-w-xl rounded-lg bg-brass-50 px-5 py-4 text-center text-base font-bold text-brass-800 ring-1 ring-brass-200">
          <T en="Please pick a time at least 15 minutes in the future." ur="کم از کم ۱۵ منٹ بعد کا وقت چنیں۔" />
        </p>
      )}
      {error === "generic" && (
        <p className="mx-auto mt-6 max-w-xl rounded-lg bg-clay-50 px-5 py-4 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
          <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" />
        </p>
      )}

      {/* ============ STEP 1: MODE + TIME ============ */}
      {step === 1 && (
        <section className="mt-8 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8" aria-label="Choose time">
          <h1 className="font-display text-[1.75rem] font-semibold text-ink-950">
            <T en="When should we book you?" ur="کب بک کریں؟" />
          </h1>
          <p className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-court-50 px-4 py-1.5 text-sm font-bold text-court-800 ring-1 ring-court-700/15">
            <ClockIcon className="h-4 w-4" />
            <T en="Takes about a minute" ur="تقریباً ایک منٹ" />
          </p>

          <p className="mb-2 mt-6 text-base font-bold text-ink-700"><T en="How do you want to meet?" ur="ملاقات کیسے ہوگی؟" /></p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-[0.95rem] font-bold leading-snug transition sm:min-h-[76px] sm:flex-col sm:justify-center sm:gap-1 sm:px-2 sm:py-3 sm:text-center sm:text-base ${
                  mode === m.id ? "border-court-700 bg-court-700 text-white shadow-card" : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                }`}
              >
                {m.icon("h-6 w-6 shrink-0")}
                <span className="min-w-0 flex-1 break-words sm:flex-none"><T en={m.en} ur={m.ur} /></span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <SlotPicker days={days} loading={slotsLoading} initial={initialPick} onPick={setPick} />
          </div>

          <div className="mt-8">
            <PrimaryBtn
              className="w-full"
              icon={<CalendarIcon className="h-6 w-6" />}
              disabled={!pick}
              onClick={goNext}
            >
              <T en={pick ? "Continue" : "First pick a time above"} ur={pick ? "آگے بڑھیں" : "پہلے اوپر وقت چنیں"} />
            </PrimaryBtn>
            {!pick && (
              <p className="mt-2 text-center text-sm font-semibold text-brass-600">
                <T en="Tap a day and a time slot to continue." ur="آگے بڑھنے کے لیے دن اور وقت چنیں۔" />
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============ STEP 2: CONFIRM ============ */}
      {step === 2 && pick && (
        <section className="mt-8 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8" aria-label="Confirm booking">
          <h1 className="font-display text-[1.75rem] font-semibold text-ink-950">
            <T en="Confirm your booking" ur="بکنگ کی تصدیق کریں" />
          </h1>

          <div className="mt-6 rounded-lg bg-paper-dark/40 p-6 ring-1 ring-ink-900/10">
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Lawyer" ur="وکیل" /></dt><dd className="text-right font-bold text-ink-950">{lawyer.displayName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Meeting" ur="ملاقات" /></dt><dd className="text-right font-bold text-ink-950"><T en={modeInfo.en} ur={modeInfo.ur} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="When" ur="کب" /></dt><dd className="text-right font-bold text-ink-950">{pickedDay?.label} · {pick.start}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Fee" ur="فیس" /></dt><dd className="text-right font-bold text-court-800">{fee ?? <T en="On request" ur="معلوم کریں" />}</dd></div>
            </dl>
          </div>

          <label className="mt-6 block">
            <span className="mb-1 block text-base font-bold text-ink-700">
              <T en="Note for the lawyer (optional)" ur="وکیل کے لیے نوٹ (اختیاری)" />
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="…"
              className="w-full rounded-lg border border-ink-900/15 px-4 py-3 text-lg text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
            />
          </label>

          <p className="mt-4 flex items-start gap-2 rounded-lg bg-paper p-4 text-base font-semibold text-ink-600 ring-1 ring-ink-200">
            <ShieldIcon className="h-6 w-6 shrink-0 text-court-700" />
            <T
              en="Your phone number is shared only with this lawyer to confirm the appointment. It is never shown publicly."
              ur="آپ کا فون نمبر صرف اس وکیل سے شیئر ہوگا تاکہ ملاقات کی تصدیق ہو سکے۔ یہ کبھی عوامی نہیں دکھایا جائے گا۔"
            />
          </p>

          <div className="mt-6">
            <PrimaryBtn className="w-full" icon={<CheckIcon className="h-6 w-6" />} disabled={submitting} onClick={confirmBooking}>
              <T en={submitting ? "Booking…" : "Confirm booking"} ur={submitting ? "بک ہو رہی ہے…" : "بکنگ پکی کریں"} />
            </PrimaryBtn>
          </div>
          <div className="mt-4 text-center">
            <SecondaryBtn icon={<CalendarIcon className="h-5 w-5" />} onClick={() => setStep(1)}>
              <T en="Back to time" ur="وقت بدلیں" />
            </SecondaryBtn>
          </div>
        </section>
      )}

      {/* ============ STEP 3: DONE ============ */}
      {step === 3 && booking && (
        <section className="mt-8 rounded-lg border border-ink-900/10 bg-white p-6 text-center shadow-card sm:p-10" aria-label="Booking confirmed">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-court-50 ring-1 ring-court-700/20">
            <CheckIcon className="h-12 w-12 text-court-700" />
          </span>
          <h1 className="mt-6 font-display text-[2rem] font-semibold text-ink-950">
            <T en="Booking confirmed!" ur="بکنگ ہو گئی!" />
          </h1>
          <p className="mt-2 text-lg text-ink-600">
            <T en={`Reference: ${booking.id.slice(0, 8).toUpperCase()}`} ur={`حوالہ نمبر: ${booking.id.slice(0, 8).toUpperCase()}`} />
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-lg bg-paper-dark/40 p-6 text-left ring-1 ring-ink-900/10">
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Lawyer" ur="وکیل" /></dt><dd className="text-right font-bold text-ink-950">{lawyer.displayName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Meeting" ur="ملاقات" /></dt><dd className="text-right font-bold text-ink-950"><T en={modeInfo.en} ur={modeInfo.ur} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="When" ur="کب" /></dt><dd className="text-right font-bold text-ink-950">{pickedDay?.label} · {pick?.start}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-ink-500"><T en="Fee" ur="فیس" /></dt><dd className="text-right font-bold text-court-800">{fee ?? <T en="On request" ur="معلوم کریں" />}</dd></div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {mode === "ONLINE_VIDEO" && (
              <PrimaryBtn href={`/video/${booking.id}`} icon={<VideoIcon className="h-6 w-6" />}>
                <T en="Consultation details" ur="مشاورت کی تفصیل" />
              </PrimaryBtn>
            )}
            <PrimaryBtn href="/dashboard" icon={<CalendarIcon className="h-6 w-6" />}>
              <T en="My bookings" ur="میری بکنگز" />
            </PrimaryBtn>
            <SecondaryBtn href="/lawyers">
              <T en="Book another" ur="ایک اور بک کریں" />
            </SecondaryBtn>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-base font-bold text-ink-500">
            <WalletIcon className="h-5 w-5" />
            <T en="Pay the fee directly to the lawyer" ur="فیس وکیل کو براہِ راست ادا کریں" />
          </p>
        </section>
      )}

      {showPhoneModal && pick && (
        <PhoneModal
          lawyerName={lawyer.displayName}
          slotLabel={`${pickedDay?.label ?? pick.date} · ${pick.start}`}
          onClose={() => setShowPhoneModal(false)}
          onVerified={(phone) => {
            if (phone) setCheckoutPhone(phone);
            setShowPhoneModal(false);
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
