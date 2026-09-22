"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, Rating, SecondaryBtn, VerifiedBadge } from "./ui";
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
import { formatPKR, getLawyer, nextSlotDays } from "@/lib/data";
import { saveBooking } from "@/lib/session";

const MODE_LABEL = { video: { en: "Video Call", ur: "ویڈیو کال" }, chamber: { en: "Office Visit", ur: "دفتر کی ملاقات" } };

function StepDots({ step }: { step: number }) {
  const labels = [
    { en: "Time", ur: "وقت" },
    { en: "Phone", ur: "فون" },
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
  const lawyer = getLawyer(lawyerSlug);

  const [mode, setMode] = useState<"video" | "chamber">(
    searchParams.get("mode") === "chamber" ? "chamber" : "video"
  );
  const [step, setStep] = useState(1);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const days = useMemo(() => (lawyer ? nextSlotDays(lawyer.slug) : []), [lawyer]);

  if (!lawyer) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-xl font-extrabold text-slate-800"><T en="Lawyer not found" ur="وکیل نہیں ملا" /></p>
        <Link href="/lawyers" className="mt-4 inline-block font-bold text-emerald-700 hover:underline">
          <T en="Back to lawyers" ur="وکیلوں کی فہرست" />
        </Link>
      </div>
    );
  }

  const day = days[dayIdx];
  const fee = formatPKR(lawyer.consultationFeePaisa);
  const bookingRef = `BK-${(lawyer.slug.length * 7919 + dayIdx * 131).toString().padStart(5, "0")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* lawyer summary */}
      <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <PhotoAvatar name={lawyer.displayName} photo={lawyer.photo} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-slate-900">
            {lawyer.displayName} <VerifiedBadge />
          </p>
          <Rating rating={lawyer.rating} count={lawyer.reviewCount} />
        </div>
        <p className="text-xl font-extrabold text-emerald-800">{fee}</p>
      </div>

      <div className="mt-8"><StepDots step={step} /></div>

      {/* ============ STEP 1: TIME ============ */}
      {step === 1 && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Choose time">
          <h1 className="text-2xl font-extrabold text-slate-900">
            <T en="When should we book you?" ur="کب بک کریں؟" />
          </h1>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <T en="⚡ Takes about a minute · No account needed" ur="⚡ تقریباً ایک منٹ · اکاؤنٹ کی ضرورت نہیں" />
          </p>

          <p className="mb-2 mt-6 text-base font-extrabold text-slate-700"><T en="How do you want to meet?" ur="ملاقات کیسے ہوگی؟" /></p>
          <div className="grid grid-cols-2 gap-3">
            {(["video", "chamber"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border-2 text-lg font-extrabold transition ${
                  mode === m ? "border-emerald-700 bg-emerald-700 text-white shadow" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                }`}
              >
                {m === "video" ? <VideoIcon className="h-6 w-6" /> : <OfficeIcon className="h-6 w-6" />}
                <T en={MODE_LABEL[m].en} ur={MODE_LABEL[m].ur} />
              </button>
            ))}
          </div>

          <p className="mb-2 mt-6 text-base font-extrabold text-slate-700">
            <T en="Pick a day" ur="دن چنیں" />
          </p>
          <div className="wc-rail flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Day">
            {days.map((d, i) => (
              <button
                key={d.date.toISOString()}
                type="button"
                role="radio"
                aria-checked={dayIdx === i}
                onClick={() => { setDayIdx(i); setSlot(null); }}
                className={`min-h-[72px] min-w-[86px] shrink-0 rounded-2xl border-2 px-3 py-2 text-center transition ${
                  dayIdx === i ? "border-emerald-700 bg-emerald-700 text-white shadow" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                }`}
              >
                <span className="block text-sm font-bold opacity-80">{d.label}</span>
                <span className="block text-lg font-extrabold">{d.sub}</span>
              </button>
            ))}
          </div>

          {day && (
            <>
              <p className="mb-2 mt-6 text-base font-extrabold text-slate-700">
                <T en="Pick a time" ur="وقت چنیں" />
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Time slot">
                {day.slots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    role="radio"
                    aria-checked={slot === s.time}
                    disabled={s.taken}
                    onClick={() => setSlot(s.time)}
                    className={`min-h-[52px] rounded-xl border-2 text-base font-bold transition ${
                      s.taken
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                        : slot === s.time
                          ? "border-emerald-700 bg-emerald-700 text-white shadow"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-8">
            <PrimaryBtn
              className="w-full"
              icon={<PhoneIcon className="h-6 w-6" />}
              onClick={() => slot && setStep(2)}
            >
              <T en={slot ? "Continue" : "First pick a time above"} ur={slot ? "آگے بڑھیں" : "پہلے اوپر وقت چنیں"} />
            </PrimaryBtn>
            {!slot && (
              <p className="mt-2 text-center text-sm font-semibold text-amber-700">
                <T en="Tap a day and a time slot to continue." ur="آگے بڑھنے کے لیے دن اور وقت چنیں۔" />
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============ STEP 2: PHONE (+ OTP placeholder) ============ */}
      {step === 2 && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Phone number">
          <h1 className="text-2xl font-extrabold text-slate-900">
            <T en="Your phone number" ur="آپ کا فون نمبر" />
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            <T en="We'll send a code to confirm. No password needed." ur="تصدیق کے لیے کوڈ بھیجیں گے۔ پاس ورڈ کی ضرورت نہیں۔" />
          </p>
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-base font-semibold text-amber-900 ring-1 ring-amber-200">
            <span aria-hidden>🔒</span>
            <T
              en="We share this number only with the lawyer you book, so they can confirm your appointment. It is never shown publicly."
              ur="یہ نمبر صرف اس وکیل سے شیئر ہوگا جسے آپ بک کریں گے، تاکہ وہ آپ کی ملاقات کی تصدیق کر سکے۔ یہ کبھی عوامی نہیں دکھایا جائے گا۔"
            />
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-base font-semibold text-emerald-900 ring-1 ring-emerald-200">
            <T en={`${MODE_LABEL[mode].en} · ${day?.label} ${day?.sub} · ${slot} · ${fee}`} ur={`${MODE_LABEL[mode].ur} · ${day?.label} ${day?.sub} · ${slot} · ${fee}`} />
          </div>

          <label className="mt-6 block">
            <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Mobile number" ur="موبائل نمبر" /></span>
            <span className="flex overflow-hidden rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600">
              <span className="flex min-h-[60px] items-center bg-slate-100 px-4 text-lg font-extrabold text-slate-700">+92</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                inputMode="numeric"
                placeholder="300 1234567"
                className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-slate-900 outline-none"
                aria-label="Mobile number"
              />
            </span>
          </label>

          {!otpSent ? (
            <div className="mt-6">
              <PrimaryBtn className="w-full" icon={<PhoneIcon className="h-6 w-6" />} onClick={() => phone.length >= 10 && setOtpSent(true)}>
                <T en="Send code" ur="کوڈ بھیجیں" />
              </PrimaryBtn>
              {phone.length > 0 && phone.length < 10 && (
                <p className="mt-2 text-center text-sm font-semibold text-amber-700">
                  <T en="Please enter a full 10-digit number." ur="پورا ۱۰ ہندسوں کا نمبر لکھیں۔" />
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-base font-bold text-slate-700">
                <T en={`Code sent to +92 ${phone} (demo — any 4 digits work)`} ur={`+92 ${phone} پر کوڈ بھیجا گیا (ڈیمو — کوئی بھی ۴ ہندسے)`} />
              </p>
              <label className="mt-3 block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Enter code" ur="کوڈ لکھیں" /></span>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  placeholder="----"
                  className="min-h-[60px] w-full rounded-2xl border-2 border-slate-200 px-4 text-center text-2xl font-extrabold tracking-[0.5em] text-slate-900 outline-none focus:border-emerald-600"
                  aria-label="Verification code"
                />
              </label>
              <div className="mt-5">
                <PrimaryBtn
                  className="w-full"
                  icon={<CheckIcon className="h-6 w-6" />}
                  onClick={() => {
                    if (otp.length !== 4) return;
                    saveBooking({
                      id: bookingRef,
                      lawyerSlug: lawyer.slug,
                      mode,
                      dateLabel: day?.label ?? "",
                      dateSub: day?.sub ?? "",
                      time: slot ?? "",
                      feePaisa: lawyer.consultationFeePaisa,
                      phone,
                      createdAt: Date.now(),
                      status: "upcoming",
                    });
                    setStep(3);
                  }}
                >
                  <T en="Confirm booking" ur="بکنگ پکی کریں" />
                </PrimaryBtn>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <SecondaryBtn icon={<CalendarIcon className="h-5 w-5" />} onClick={() => setStep(1)}>
              <T en="Back to time" ur="وقت بدلیں" />
            </SecondaryBtn>
          </div>
        </section>
      )}

      {/* ============ STEP 3: DONE ============ */}
      {step === 3 && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10" aria-label="Booking confirmed">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckIcon className="h-12 w-12 text-emerald-700" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
            <T en="Booking confirmed!" ur="بکنگ ہو گئی!" />
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            <T en={`Reference: ${bookingRef}`} ur={`حوالہ نمبر: ${bookingRef}`} />
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-emerald-50 p-6 text-left ring-1 ring-emerald-200">
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Lawyer" ur="وکیل" /></dt><dd className="text-right font-extrabold text-slate-900">{lawyer.displayName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Meeting" ur="ملاقات" /></dt><dd className="text-right font-extrabold text-slate-900"><T en={MODE_LABEL[mode].en} ur={MODE_LABEL[mode].ur} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="When" ur="کب" /></dt><dd className="text-right font-extrabold text-slate-900">{day?.label} {day?.sub} · {slot}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500"><T en="Fee" ur="فیس" /></dt><dd className="text-right font-extrabold text-emerald-800">{fee}</dd></div>
            </dl>
          </div>

          <p className="mx-auto mt-6 flex max-w-md items-start gap-2 text-left text-base text-slate-600">
            <ShieldIcon className="h-6 w-6 shrink-0 text-emerald-700" />
            <T
              en="Demo booking — no real payment was taken. Payment options will appear here on the live site."
              ur="ڈیمو بکنگ — کوئی حقیقی ادائیگی نہیں ہوئی۔ اصل سائٹ پر ادائیگی کے طریقے یہاں نظر آئیں گے۔"
            />
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryBtn href="/dashboard" icon={<CalendarIcon className="h-6 w-6" />}>
              <T en="My bookings" ur="میری بکنگز" />
            </PrimaryBtn>
            <SecondaryBtn href="/lawyers" icon={<VideoIcon className="h-6 w-6" />}>
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
