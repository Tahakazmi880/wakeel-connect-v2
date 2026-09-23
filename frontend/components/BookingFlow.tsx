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
  restoreSession,
  type Booking,
  type BookingMode,
  type LawyerSummary,
  type SlotDay,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const MODES: { id: BookingMode; en: string; ur: string; icon: (c: string) => React.ReactNode }[] = [
  { id: "ONLINE_VIDEO", en: "Video Call", ur: "ویڈیو کال", icon: (c) => <VideoIcon className={c} /> },
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
    <ol className="mx-auto flex max-w-xl items-center justify-center gap-2" aria-label="Booking progress">
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={l.en} className="flex items-center gap-2">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold transition ${
                done ? "bg-emerald-600 text-white" : current ? "bg-emerald-700 text-white shadow-lg ring-4 ring-emerald-200" : "bg-slate-200 text-slate-500"
              }`}
              aria-current={current ? "step" : undefined}
            >
              {done ? <CheckIcon className="h-6 w-6" /> : n}
            </span>
            <span className={`text-base font-extrabold ${current || done ? "text-emerald-800" : "text-slate-400"}`}>
              <T en={l.en} ur={l.ur} />
            </span>
            {n < 3 && <span className="mx-1 h-0.5 w-8 bg-slate-200 sm:w-14" />}
          </li>
        );
      })}
    </ol>
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
    const m = searchParams.get("mode")?.toUpperCase();
    return m === "IN_CHAMBER" || m === "PHONE" ? (m as BookingMode) : "ONLINE_VIDEO";
  });
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState<SlotPick | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);

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
            <p className="text-xl font-extrabold text-slate-800"><T en="Lawyer not found" ur="وکیل نہیں ملا" /></p>
            <Link href="/lawyers" className="mt-4 inline-block font-bold text-emerald-700 hover:underline">
              <T en="Back to lawyers" ur="وکیلوں کی فہرست" />
            </Link>
          </>
        ) : (
          <p className="text-lg font-bold text-slate-500">…</p>
        )}
      </div>
    );
  }

  // ---- auth gate ----
  if (!user) {
    const next = `/book/${lawyerSlug}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <PhoneIcon className="h-10 w-10 text-emerald-700" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          <T en="Login to book" ur="بکنگ کے لیے لاگ اِن کریں" />
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          <T en="Enter your mobile number — we'll send a code. No password needed." ur="اپنا موبائل نمبر لکھیں — کوڈ آئے گا۔ پاس ورڈ کی ضرورت نہیں۔" />
        </p>
        <div className="mt-8">
          <PrimaryBtn href={`/login?next=${encodeURIComponent(next)}`} icon={<PhoneIcon className="h-6 w-6" />}>
            <T en="Login with phone" ur="فون سے لاگ اِن" />
          </PrimaryBtn>
        </div>
      </div>
    );
  }

  const fee = formatFee(lawyer.consultationFeePaisa);
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
      <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold text-slate-900">{lawyer.displayName}</p>
          <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
        </div>
        <p className="text-xl font-extrabold text-emerald-800">
          {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
        </p>
      </div>

      <div className="mt-8"><StepDots step={step} /></div>

      {error === "taken" && (
        <p className="mx-auto mt-6 max-w-xl rounded-2xl bg-amber-50 px-5 py-4 text-center text-base font-bold text-amber-900 ring-1 ring-amber-200">
          <T en="That slot was just taken — please pick another time." ur="یہ وقت ابھی بک ہو گیا — کوئی اور وقت چنیں۔" />
        </p>
      )}
      {error === "past" && (
        <p className="mx-auto mt-6 max-w-xl rounded-2xl bg-amber-50 px-5 py-4 text-center text-base font-bold text-amber-900 ring-1 ring-amber-200">
          <T en="Please pick a time at least 15 minutes in the future." ur="کم از کم ۱۵ منٹ بعد کا وقت چنیں۔" />
        </p>
      )}
      {error === "generic" && (
        <p className="mx-auto mt-6 max-w-xl rounded-2xl bg-red-50 px-5 py-4 text-center text-base font-bold text-red-800 ring-1 ring-red-200">
          <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" />
        </p>
      )}

      {/* ============ STEP 1: MODE + TIME ============ */}
      {step === 1 && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Choose time">
          <h1 className="text-2xl font-extrabold text-slate-900">
            <T en="When should we book you?" ur="کب بک کریں؟" />
          </h1>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <T en="⚡ Takes about a minute" ur="⚡ تقریباً ایک منٹ" />
          </p>

          <p className="mb-2 mt-6 text-base font-extrabold text-slate-700"><T en="How do you want to meet?" ur="ملاقات کیسے ہوگی؟" /></p>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 text-base font-extrabold transition sm:flex-row sm:gap-2 sm:text-lg ${
                  mode === m.id ? "border-emerald-700 bg-emerald-700 text-white shadow" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                }`}
              >
                {m.icon("h-6 w-6")}
                <T en={m.en} ur={m.ur} />
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
              onClick={() => pick && setStep(2)}
            >
              <T en={pick ? "Continue" : "First pick a time above"} ur={pick ? "آگے بڑھیں" : "پہلے اوپر وقت چنیں"} />
            </PrimaryBtn>
            {!pick && (
              <p className="mt-2 text-center text-sm font-semibold text-amber-700">
                <T en="Tap a day and a time slot to continue." ur="آگے بڑھنے کے لیے دن اور وقت چنیں۔" />
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============ STEP 2: CONFIRM ============ */}
      {step === 2 && pick && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Confirm booking">
          <h1 className="text-2xl font-extrabold text-slate-900">
            <T en="Confirm your booking" ur="بکنگ کی تصدیق کریں" />
          </h1>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Lawyer" ur="وکیل" /></dt><dd className="text-right font-extrabold text-slate-900">{lawyer.displayName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Meeting" ur="ملاقات" /></dt><dd className="text-right font-extrabold text-slate-900"><T en={modeInfo.en} ur={modeInfo.ur} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="When" ur="کب" /></dt><dd className="text-right font-extrabold text-slate-900">{pickedDay?.label} · {pick.start}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Fee" ur="فیس" /></dt><dd className="text-right font-extrabold text-emerald-800">{fee ?? <T en="On request" ur="معلوم کریں" />}</dd></div>
            </dl>
          </div>

          <label className="mt-6 block">
            <span className="mb-1 block text-base font-extrabold text-slate-700">
              <T en="Note for the lawyer (optional)" ur="وکیل کے لیے نوٹ (اختیاری)" />
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="…"
              className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg text-slate-900 outline-none focus:border-emerald-600"
            />
          </label>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-slate-50 p-4 text-base font-semibold text-slate-600 ring-1 ring-slate-200">
            <ShieldIcon className="h-6 w-6 shrink-0 text-emerald-700" />
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
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10" aria-label="Booking confirmed">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckIcon className="h-12 w-12 text-emerald-700" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
            <T en="Booking confirmed!" ur="بکنگ ہو گئی!" />
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            <T en={`Reference: ${booking.id.slice(0, 8).toUpperCase()}`} ur={`حوالہ نمبر: ${booking.id.slice(0, 8).toUpperCase()}`} />
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-emerald-50 p-6 text-left ring-1 ring-emerald-200">
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Lawyer" ur="وکیل" /></dt><dd className="text-right font-extrabold text-slate-900">{lawyer.displayName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Meeting" ur="ملاقات" /></dt><dd className="text-right font-extrabold text-slate-900"><T en={modeInfo.en} ur={modeInfo.ur} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="When" ur="کب" /></dt><dd className="text-right font-extrabold text-slate-900">{pickedDay?.label} · {pick?.start}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Fee" ur="فیس" /></dt><dd className="text-right font-extrabold text-emerald-800">{fee ?? <T en="On request" ur="معلوم کریں" />}</dd></div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {mode === "ONLINE_VIDEO" && (
              <PrimaryBtn href={`/video/${booking.id}`} icon={<VideoIcon className="h-6 w-6" />}>
                <T en="Join video call" ur="ویڈیو کال جوائن کریں" />
              </PrimaryBtn>
            )}
            <PrimaryBtn href="/dashboard" icon={<CalendarIcon className="h-6 w-6" />}>
              <T en="My bookings" ur="میری بکنگز" />
            </PrimaryBtn>
            <SecondaryBtn href="/lawyers">
              <T en="Book another" ur="ایک اور بک کریں" />
            </SecondaryBtn>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-base font-bold text-slate-500">
            <WalletIcon className="h-5 w-5" />
            <T en="Pay the fee directly to the lawyer" ur="فیس وکیل کو براہِ راست ادا کریں" />
          </p>
        </section>
      )}
    </div>
  );
}
