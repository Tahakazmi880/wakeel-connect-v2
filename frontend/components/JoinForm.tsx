"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import {
  ArrowIcon,
  BriefcaseIcon,
  CheckIcon,
  ShieldIcon,
  UserIcon,
} from "./icons";
import { CITIES, PRACTICE_AREAS } from "@/lib/data";
import { submitApplication, normalizePhone, ApiError } from "@/lib/api";

const inputCls =
  "min-h-[56px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-lg text-slate-900 outline-none focus:border-emerald-600";

const BAR_COUNCILS = [
  "Punjab Bar Council",
  "Sindh Bar Council",
  "Khyber Pakhtunkhwa Bar Council",
  "Balochistan Bar Council",
  "Islamabad Bar Council",
  "Azad Jammu & Kashmir Bar Council",
  "Gilgit-Baltistan Bar Council",
];

function StepDots({ step }: { step: number }) {
  const labels = [
    { en: "Personal", ur: "ذاتی", icon: <UserIcon className="h-5 w-5" /> },
    { en: "Professional", ur: "پیشہ ورانہ", icon: <BriefcaseIcon className="h-5 w-5" /> },
    { en: "Review", ur: "جائزہ", icon: <CheckIcon className="h-5 w-5" /> },
  ];
  return (
    <ol className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Application progress">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={l.en} className="flex items-center gap-1 sm:gap-2">
            <span className={`flex min-h-[48px] items-center gap-2 rounded-full px-3 sm:px-5 text-base font-extrabold transition ${
              active ? "bg-emerald-700 text-white shadow" : done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
            }`}>
              {done ? <CheckIcon className="h-5 w-5" /> : l.icon}
              <T en={l.en} ur={l.ur} />
            </span>
            {n < 3 && <span className="h-0.5 w-4 bg-slate-200 sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}

type Errors = Partial<Record<string, { en: string; ur: string }>>;

export default function JoinForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<{ en: string; ur: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [barCouncil, setBarCouncil] = useState("");
  const [barCouncilNo, setBarCouncilNo] = useState("");
  const [years, setYears] = useState("");
  const [feePkr, setFeePkr] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const toggleArea = (slug: string) =>
    setAreas((a) => (a.includes(slug) ? a.filter((x) => x !== slug) : a.length < 6 ? [...a, slug] : a));

  function validateStep1(): boolean {
    const e: Errors = {};
    if (fullName.trim().length < 3 || fullName.trim().length > 80)
      e.fullName = { en: "Please enter your full name (3–80 characters).", ur: "براہ کرم پورا نام لکھیں (3 تا 80 حروف)۔" };
    const normalized = normalizePhone(phone);
    const digits = normalized.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15 || normalized.length > 20)
      e.phone = { en: "Please enter a valid mobile number, e.g. 0300 1234567.", ur: "براہ کرم درست موبائل نمبر لکھیں، مثلاً 0300 1234567۔" };
    if (!citySlug) e.citySlug = { en: "Please select your city.", ur: "براہ کرم اپنا شہر چنیں۔" };
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Errors = {};
    const y = Number(years);
    if (years.trim() === "" || !Number.isInteger(y) || y < 0 || y > 60)
      e.years = { en: "Experience must be a whole number between 0 and 60.", ur: "تجربہ 0 سے 60 کے درمیان مکمل عدد ہونا چاہیے۔" };
    const f = Number(feePkr);
    if (feePkr.trim() === "" || Number.isNaN(f) || f < 0 || f > 1000000)
      e.feePkr = { en: "Fee must be between Rs. 0 and Rs. 1,000,000.", ur: "فیس 0 سے 10 لاکھ روپے کے درمیان ہونی چاہیے۔" };
    if (barCouncilNo.trim().length > 40)
      e.barCouncilNo = { en: "Enrolment number is too long (max 40 characters).", ur: "انرولمنٹ نمبر بہت لمبا ہے (زیادہ سے زیادہ 40 حروف)۔" };
    if (areas.length < 1)
      e.areas = { en: "Please pick at least one practice area (up to 6).", ur: "براہ کرم کم از کم ایک قانونی شعبہ چنیں (زیادہ سے زیادہ 6)۔" };
    if (bio.trim().length > 2000)
      e.bio = { en: "Bio is too long (max 2000 characters).", ur: "تعارف بہت لمبا ہے (زیادہ سے زیادہ 2000 حروف)۔" };
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const next = () => {
    setServerError(null);
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await submitApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        citySlug,
        yearsExperience: Number(years),
        consultationFeePaisa: Math.round(Number(feePkr) * 100),
        barCouncil: barCouncil || undefined,
        barCouncilNo: barCouncilNo.trim() || undefined,
        practiceAreaSlugs: areas,
        bio: bio.trim() || undefined,
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      if (e instanceof ApiError && (e.code === "RATE_LIMITED" || e.status === 429)) {
        setServerError({
          en: "Too many applications from this device — please try again in an hour.",
          ur: "اس ڈیوائس سے بہت زیادہ درخواستیں — براہ کرم ایک گھنٹے بعد دوبارہ کوشش کریں۔",
        });
      } else if (e instanceof ApiError) {
        setServerError({ en: e.message, ur: "درخواست بھیجنے میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔" });
      } else {
        setServerError({
          en: "Couldn't send your application. Check your connection and try again.",
          ur: "درخواست نہ بھیجی جا سکی۔ کنکشن چیک کر کے دوبارہ کوشش کریں۔",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const err = (k: string) =>
    errors[k] ? (
      <span className="mt-1 block text-sm font-bold text-red-600">
        <T en={errors[k]!.en} ur={errors[k]!.ur} />
      </span>
    ) : null;

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <ShieldIcon className="h-12 w-12 text-emerald-700" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          <T en="Application received!" ur="درخواست موصول ہو گئی!" />
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-slate-600">
          <T
            en="Our team will call you on your phone number to collect your CNIC and Bar Council documents for verification. This is a real review — usually done in 2–3 working days."
            ur="ہماری ٹیم تصدیق کے لیے آپ کے شناختی کارڈ اور بار کونسل دستاویزات لینے آپ کے فون نمبر پر رابطہ کرے گی۔ یہ حقیقی جائزہ ہے — عام طور پر ۲ سے ۳ دن میں مکمل۔"
          />
        </p>
        <div className="mt-8">
          <PrimaryBtn href="/" icon={<ArrowIcon className="h-6 w-6" />}>
            <T en="Back to home" ur="ہوم پر واپس" />
          </PrimaryBtn>
        </div>
      </div>
    );
  }

  const cityName = CITIES.find((c) => c.slug === citySlug)?.nameEn ?? citySlug;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
        <T en="Join wakeel.connect as a lawyer" ur="وکیل کے طور پر wakeel.connect سے جڑیں" />
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-lg text-slate-600">
        <T en="Free to join. Verified lawyers get real client bookings." ur="شمولیت مفت۔ تصدیق شدہ وکیلوں کو حقیقی کلائنٹ ملتے ہیں۔" />
      </p>
      <div className="mt-8"><StepDots step={step} /></div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {serverError && (
          <p className="mb-5 rounded-2xl bg-red-50 p-4 text-base font-bold text-red-700 ring-1 ring-red-200">
            <T en={serverError.en} ur={serverError.ur} />
          </p>
        )}

        {/* ===== STEP 1: personal ===== */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Your details" ur="آپ کی معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Full name" ur="پورا نام" /></span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} className={inputCls} placeholder="Adv. Muhammad Ali" />
              {err("fullName")}
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Mobile number" ur="موبائل نمبر" /></span>
              <span className="flex overflow-hidden rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600">
                <span className="flex min-h-[56px] items-center bg-slate-100 px-4 text-lg font-extrabold text-slate-700">+92</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-[56px] w-full px-4 text-lg outline-none" inputMode="numeric" placeholder="300 1234567" />
              </span>
              {err("phone")}
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="City" ur="شہر" /></span>
              <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)} className={inputCls}>
                <option value="" disabled><T en="Select city" ur="شہر چنیں" /></option>
                {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
              </select>
              {err("citySlug")}
            </label>
          </div>
        )}

        {/* ===== STEP 2: professional ===== */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Professional details" ur="پیشہ ورانہ معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Bar Council (optional)" ur="بار کونسل (اختیاری)" /></span>
              <select value={barCouncil} onChange={(e) => setBarCouncil(e.target.value)} className={inputCls}>
                <option value=""><T en="Select Bar Council" ur="بار کونسل چنیں" /></option>
                {BAR_COUNCILS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Enrolment number (optional)" ur="انرولمنٹ نمبر (اختیاری)" /></span>
                <input value={barCouncilNo} onChange={(e) => setBarCouncilNo(e.target.value)} maxLength={40} className={inputCls} placeholder="PBC-12345" />
                {err("barCouncilNo")}
              </label>
              <label className="block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Years of experience" ur="تجربے کے سال" /></span>
                <input value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} type="number" min={0} max={60} placeholder="8" />
                {err("years")}
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Consultation fee (PKR)" ur="مشاورت کی فیس (روپے)" /></span>
              <input value={feePkr} onChange={(e) => setFeePkr(e.target.value)} className={inputCls} type="number" min={0} max={1000000} placeholder="3000" />
              {err("feePkr")}
            </label>
            <div>
              <span className="mb-2 block text-base font-extrabold text-slate-700">
                <T en={`Practice areas (pick 1–6) — ${areas.length} selected`} ur={`قانونی شعبے (1 تا 6 چنیں) — ${areas.length} منتخب`} />
              </span>
              <div className="flex flex-wrap gap-2">
                {PRACTICE_AREAS.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => toggleArea(a.slug)}
                    aria-pressed={areas.includes(a.slug)}
                    className={`min-h-[48px] rounded-full border-2 px-4 text-base font-bold transition ${
                      areas.includes(a.slug) ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    <T en={a.nameEn} ur={a.nameUr} />
                  </button>
                ))}
              </div>
              {err("areas")}
            </div>
            <label className="block">
              <span className="mb-1 flex items-baseline justify-between text-base font-extrabold text-slate-700">
                <T en="Short bio (optional)" ur="مختصر تعارف (اختیاری)" />
                <span className="text-sm font-bold text-slate-400">{bio.trim().length}/2000</span>
              </span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={2100} rows={3} className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-emerald-600" placeholder="e.g. 10 years of family law practice in Lahore…" />
              {err("bio")}
            </label>
          </div>
        )}

        {/* ===== STEP 3: review & submit ===== */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Review & submit" ur="جائزہ اور ارسال" /></h2>
            <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {[
                { en: "Name", ur: "نام", v: fullName.trim() },
                { en: "Mobile", ur: "موبائل", v: normalizePhone(phone) },
                { en: "City", ur: "شہر", v: cityName },
                ...(barCouncil ? [{ en: "Bar Council", ur: "بار کونسل", v: barCouncil }] : []),
                ...(barCouncilNo.trim() ? [{ en: "Enrolment no.", ur: "انرولمنٹ نمبر", v: barCouncilNo.trim() }] : []),
                { en: "Experience", ur: "تجربہ", v: `${years} yrs` },
                { en: "Fee", ur: "فیس", v: `Rs. ${Number(feePkr).toLocaleString("en-PK")}` },
                {
                  en: "Practice areas", ur: "قانونی شعبے",
                  v: areas.map((s) => PRACTICE_AREAS.find((a) => a.slug === s)?.nameEn ?? s).join(", "),
                },
              ].map((row) => (
                <div key={row.en} className="flex gap-4 px-4 py-3">
                  <dt className="w-32 shrink-0 text-base font-extrabold text-slate-500"><T en={row.en} ur={row.ur} /></dt>
                  <dd className="text-base font-bold text-slate-900">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-base text-emerald-900 ring-1 ring-emerald-200">
              <ShieldIcon className="h-6 w-6 shrink-0" />
              <T
                en="After you submit, our team will call you to collect your CNIC and Bar Council documents. Documents stay private — they are never shown to clients."
                ur="بھیجنے کے بعد ہماری ٹیم آپ کے شناختی کارڈ اور بار کونسل دستاویزات کے لیے کال کرے گی۔ دستاویزات نجی رہتی ہیں — کلائنٹس کو کبھی نہیں دکھائیں گے۔"
              />
            </p>
          </div>
        )}

        {/* nav buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <SecondaryBtn icon={<ArrowIcon className="h-6 w-6 rotate-180" />} onClick={() => { setStep(step - 1); setServerError(null); }}>
              <T en="Back" ur="پیچھے" />
            </SecondaryBtn>
          ) : <span />}
          {step < 3 ? (
            <PrimaryBtn icon={<ArrowIcon className="h-6 w-6" />} onClick={next}>
              <T en="Continue" ur="آگے بڑھیں" />
            </PrimaryBtn>
          ) : (
            <PrimaryBtn icon={<CheckIcon className="h-6 w-6" />} onClick={submit} disabled={submitting}>
              {submitting ? <T en="Submitting…" ur="بھیجا جا رہا ہے…" /> : <T en="Submit for verification" ur="تصدیق کے لیے بھیجیں" />}
            </PrimaryBtn>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-base text-slate-500">
        <T en="Questions? Call our helpline — we help you fill the form." ur="سوالات؟ ہماری ہیلپ لائن پر کال کریں — فارم بھرنے میں مدد کریں گے۔" />{" "}
        <Link href="/" className="font-bold text-emerald-700 hover:underline"><T en="Back to home" ur="ہوم" /></Link>
      </p>
    </div>
  );
}
