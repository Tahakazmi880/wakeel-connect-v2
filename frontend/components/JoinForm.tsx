"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import {
  ArrowIcon,
  BriefcaseIcon,
  CheckIcon,
  DocIcon,
  ShieldIcon,
  UserIcon,
} from "./icons";
import { CITIES, PRACTICE_AREAS, COURTS, LANGUAGES } from "@/lib/data";
import {
  submitApplication,
  uploadApplicationDocument,
  deleteApplicationDocument,
  normalizePhone,
  ApiError,
  type ApplicationDoc,
  type ApplicationDocType,
} from "@/lib/api";

const inputCls =
  "min-h-[56px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-lg text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-court-600 focus:ring-2 focus:ring-court-600/20";

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
    { en: "Documents", ur: "دستاویزات", icon: <DocIcon className="h-5 w-5" /> },
  ];
  return (
    <div className="wc-scroll-x -mx-1 px-1 pb-1">
      <ol className="flex flex-wrap items-center justify-start gap-1.5 sm:flex-nowrap sm:justify-center sm:gap-2" aria-label="Application progress">
        {labels.map((l, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li key={l.en} className="flex items-center gap-1 sm:gap-2">
              <span className={`flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-base font-extrabold transition sm:px-5 ${
                active ? "bg-court-700 text-white shadow-card" : done ? "bg-court-50 text-court-800 ring-1 ring-court-700/20" : "bg-ink-900/5 text-ink-500"
              }`}>
                {done ? <CheckIcon className="h-5 w-5" /> : l.icon}
                <T en={l.en} ur={l.ur} />
              </span>
              {n < labels.length && <span className="h-0.5 w-4 shrink-0 bg-ink-200 sm:w-8" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </div>
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
  const [headline, setHeadline] = useState("");
  const [barCouncil, setBarCouncil] = useState("");
  const [barCouncilNo, setBarCouncilNo] = useState("");
  const [enrolmentYear, setEnrolmentYear] = useState("");
  const [years, setYears] = useState("");
  const [feePkr, setFeePkr] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [langCodes, setLangCodes] = useState<string[]>(["ur"]);
  const [education, setEducation] = useState<{ degree: string; institution: string; year: string }[]>([
    { degree: "", institution: "", year: "" },
  ]);
  const [chamberName, setChamberName] = useState("");
  const [chamberAddress, setChamberAddress] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const toggleCourt = (nameEn: string) =>
    setCourts((c) => (c.includes(nameEn) ? c.filter((x) => x !== nameEn) : c.length < 8 ? [...c, nameEn] : c));
  const toggleLang = (code: string) =>
    setLangCodes((c) => (c.includes(code) ? c.filter((x) => x !== code) : [...c, code]));
  const updateEdu = (i: number, k: "degree" | "institution" | "year", v: string) =>
    setEducation((es) => es.map((e, j) => (j === i ? { ...e, [k]: v } : e)));
  const addEdu = () =>
    setEducation((es) => (es.length < 5 ? [...es, { degree: "", institution: "", year: "" }] : es));
  const removeEdu = (i: number) => setEducation((es) => es.filter((_, j) => j !== i));

  // Step 4: document upload — credentials issued once by the application response.
  const [appCreds, setAppCreds] = useState<{ applicationId: string; uploadToken: string } | null>(null);
  const [docs, setDocs] = useState<ApplicationDoc[]>([]);
  const [uploading, setUploading] = useState<Partial<Record<ApplicationDocType, boolean>>>({});
  const [docError, setDocError] = useState<{ en: string; ur: string } | null>(null);

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
    if (headline.trim().length > 120)
      e.headline = { en: "Title is too long (max 120 characters).", ur: "خطاب بہت لمبا ہے (زیادہ سے زیادہ 120 حروف)۔" };
    const ey = enrolmentYear.trim();
    if (ey !== "" && (!/^\d{4}$/.test(ey) || Number(ey) < 1950 || Number(ey) > 2026))
      e.enrolmentYear = { en: "Enter a valid enrolment year (e.g. 2015).", ur: "درست انرولمنٹ سال لکھیں (مثلاً 2015)۔" };
    education.forEach((row, i) => {
      const started = row.degree.trim() || row.institution.trim() || row.year.trim();
      if (started && (row.degree.trim().length < 2 || row.institution.trim().length < 2))
        e[`edu${i}`] = { en: "Each qualification needs a degree and institution.", ur: "ہر تعلیمی سند کے لیے ڈگری اور ادارہ ضروری ہے۔" };
      if (row.year.trim() !== "" && (!/^\d{4}$/.test(row.year.trim()) || Number(row.year) < 1950 || Number(row.year) > 2026))
        e[`eduYear${i}`] = { en: "Enter a valid year (e.g. 2010).", ur: "درست سال لکھیں (مثلاً 2010)۔" };
    });
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

  const DOC_SLOTS: { type: ApplicationDocType; en: string; ur: string; required: boolean }[] = [
    { type: "CNIC_FRONT", en: "CNIC — front side", ur: "شناختی کارڈ — سامنے", required: true },
    { type: "CNIC_BACK", en: "CNIC — back side", ur: "شناختی کارڈ — پیچھے", required: true },
    { type: "BAR_COUNCIL_CERT", en: "Bar Council certificate / card", ur: "بار کونسل سرٹیفکیٹ / کارڈ", required: true },
    { type: "DEGREE", en: "Law degree", ur: "قانون کی ڈگری", required: false },
  ];

  const docFor = (type: ApplicationDocType) => docs.find((d) => d.type === type);

  const handleFile = async (type: ApplicationDocType, file: File | undefined) => {
    if (!file || !appCreds) return;
    setDocError(null);
    if (file.size > 10 * 1024 * 1024) {
      setDocError({
        en: "That file is too large — please use a file under 10 MB.",
        ur: "فائل بہت بڑی ہے — براہ کرم 10 MB سے کم فائل استعمال کریں۔",
      });
      return;
    }
    setUploading((u) => ({ ...u, [type]: true }));
    try {
      const { document } = await uploadApplicationDocument(appCreds.applicationId, appCreds.uploadToken, type, file);
      setDocs((ds) => {
        const rest = ds.filter((d) => d.type !== type);
        return [...rest, document];
      });
    } catch (e) {
      if (e instanceof ApiError && e.code === "FILE_TOO_LARGE") {
        setDocError({ en: "That file is too large — please use a file under 10 MB.", ur: "فائل بہت بڑی ہے — براہ کرم 10 MB سے کم فائل استعمال کریں۔" });
      } else if (e instanceof ApiError && e.code === "BAD_FILE_TYPE") {
        setDocError({ en: "Only JPG, PNG, WEBP or PDF files are allowed.", ur: "صرف JPG، PNG، WEBP یا PDF فائل قابل قبول ہے۔" });
      } else {
        setDocError({ en: "Upload failed. Check your connection and try again.", ur: "اپ لوڈ ناکام۔ کنکشن چیک کر کے دوبارہ کوشش کریں۔" });
      }
    } finally {
      setUploading((u) => ({ ...u, [type]: false }));
    }
  };

  const removeDoc = async (doc: ApplicationDoc) => {
    if (!appCreds || uploading[doc.type]) return;
    setDocError(null);
    setUploading((u) => ({ ...u, [doc.type]: true }));
    try {
      await deleteApplicationDocument(appCreds.applicationId, appCreds.uploadToken, doc.id);
      setDocs((ds) => ds.filter((d) => d.id !== doc.id));
    } catch {
      setDocError({ en: "Couldn't remove that file. Try again.", ur: "فائل حذف نہ ہو سکی۔ دوبارہ کوشش کریں۔" });
    } finally {
      setUploading((u) => ({ ...u, [doc.type]: false }));
    }
  };

  const missingRequired = DOC_SLOTS.filter((s) => s.required && !docFor(s.type));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const eduPayload = education
        .filter((r) => r.degree.trim() && r.institution.trim())
        .map((r) => ({
          degree: r.degree.trim(),
          institution: r.institution.trim(),
          ...(r.year.trim() ? { year: Number(r.year.trim()) } : {}),
        }));
      const res = await submitApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        citySlug,
        headline: headline.trim() || undefined,
        yearsExperience: Number(years),
        consultationFeePaisa: Math.round(Number(feePkr) * 100),
        barCouncil: barCouncil || undefined,
        barCouncilNo: barCouncilNo.trim() || undefined,
        enrolmentYear: enrolmentYear.trim() ? Number(enrolmentYear.trim()) : undefined,
        courts: courts.length ? courts : undefined,
        languageCodes: langCodes.length ? langCodes : undefined,
        education: eduPayload.length ? eduPayload : undefined,
        chamberName: chamberName.trim() || undefined,
        chamberAddress: chamberAddress.trim() || undefined,
        practiceAreaSlugs: areas,
        bio: bio.trim() || undefined,
      });
      setAppCreds({ applicationId: res.application.id, uploadToken: res.uploadToken });
      setDocs([]);
      setStep(4);
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
      <span className="mt-1 block text-sm font-bold text-clay-600">
        <T en={errors[k]!.en} ur={errors[k]!.ur} />
      </span>
    ) : null;

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-court-50 ring-1 ring-court-700/20">
          <ShieldIcon className="h-12 w-12 text-court-700" />
        </span>
        <h1 className="mt-6 font-display text-[2.1rem] font-semibold text-ink-950">
          <T en="Application received!" ur="درخواست موصول ہو گئی!" />
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-ink-600">
          <T
            en="Your documents are with our review team. This is a real review — usually done in 2–3 working days. We'll call you on your mobile number if anything is missing."
            ur="آپ کی دستاویزات ہماری جائزہ ٹیم کے پاس ہیں۔ یہ حقیقی جائزہ ہے — عام طور پر ۲ سے ۳ دن میں مکمل۔ کچھ کمی ہوئی تو آپ کے موبائل نمبر پر کال کریں گے۔"
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
      <h1 className="text-center font-display text-[2.1rem] font-semibold text-ink-950 sm:text-4xl">
        <T en="Join WakeelConnect as a lawyer" ur="وکیل کے طور پر WakeelConnect سے جڑیں" />
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-lg text-ink-600">
        <T en="Free to join. Verified lawyers get real client bookings." ur="شمولیت مفت۔ تصدیق شدہ وکیلوں کو حقیقی کلائنٹ ملتے ہیں۔" />
      </p>
      <div className="mt-8"><StepDots step={step} /></div>

      <div className="mt-8 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
        {serverError && (
          <p className="mb-5 rounded-lg bg-clay-50 p-4 text-base font-bold text-clay-700 ring-1 ring-clay-200">
            <T en={serverError.en} ur={serverError.ur} />
          </p>
        )}

        {/* ===== STEP 1: personal ===== */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-[1.65rem] font-semibold text-ink-950"><T en="Your details" ur="آپ کی معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="Full name" ur="پورا نام" /></span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} className={inputCls} placeholder="Adv. Muhammad Ali" />
              {err("fullName")}
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="Mobile number" ur="موبائل نمبر" /></span>
              <span className="flex overflow-hidden rounded-lg border border-ink-900/15 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
                <span className="flex min-h-[56px] items-center border-r border-ink-900/15 bg-paper-dark/40 px-4 text-lg font-bold text-ink-700">+92</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-[56px] w-full px-4 text-lg outline-none" inputMode="numeric" placeholder="300 1234567" />
              </span>
              {err("phone")}
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="City" ur="شہر" /></span>
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
            <h2 className="font-display text-[1.65rem] font-semibold text-ink-950"><T en="Professional details" ur="پیشہ ورانہ معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="Professional title (optional)" ur="پیشہ ورانہ خطاب (اختیاری)" /></span>
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={120} className={inputCls} placeholder="e.g. Advocate High Court" />
              {err("headline")}
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="Bar Council (optional)" ur="بار کونسل (اختیاری)" /></span>
              <select value={barCouncil} onChange={(e) => setBarCouncil(e.target.value)} className={inputCls}>
                <option value=""><T en="Select Bar Council" ur="بار کونسل چنیں" /></option>
                {BAR_COUNCILS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Enrolment number (optional)" ur="انرولمنٹ نمبر (اختیاری)" /></span>
                <input value={barCouncilNo} onChange={(e) => setBarCouncilNo(e.target.value)} maxLength={40} className={inputCls} placeholder="PBC-12345" />
                {err("barCouncilNo")}
              </label>
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Enrolment year (optional)" ur="انرولمنٹ سال (اختیاری)" /></span>
                <input value={enrolmentYear} onChange={(e) => setEnrolmentYear(e.target.value)} className={inputCls} inputMode="numeric" maxLength={4} placeholder="2015" />
                {err("enrolmentYear")}
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Years of experience" ur="تجربے کے سال" /></span>
                <input value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} type="number" min={0} max={60} placeholder="8" />
                {err("years")}
              </label>
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Consultation fee (PKR)" ur="مشاورت کی فیس (روپے)" /></span>
                <input value={feePkr} onChange={(e) => setFeePkr(e.target.value)} className={inputCls} type="number" min={0} max={1000000} placeholder="3000" />
                {err("feePkr")}
              </label>
            </div>
            <div>
              <span className="mb-2 block text-base font-bold text-ink-700">
                <T en={`Practice areas (pick 1–6) — ${areas.length} selected`} ur={`قانونی شعبے (1 تا 6 چنیں) — ${areas.length} منتخب`} />
              </span>
              <div className="flex flex-wrap gap-2">
                {PRACTICE_AREAS.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => toggleArea(a.slug)}
                    aria-pressed={areas.includes(a.slug)}
                    className={`min-h-[48px] rounded-full border px-4 text-base font-bold transition ${
                      areas.includes(a.slug) ? "border-court-700 bg-court-700 text-white" : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                    }`}
                  >
                    <T en={a.nameEn} ur={a.nameUr} />
                  </button>
                ))}
              </div>
              {err("areas")}
            </div>
            <div>
              <span className="mb-2 block text-base font-bold text-ink-700">
                <T en="Education (optional)" ur="تعلیم (اختیاری)" />
              </span>
              <div className="space-y-3">
                {education.map((row, i) => (
                  <div key={i} className="rounded-lg border border-ink-900/10 bg-paper-dark/30 p-3">
                    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_110px_auto]">
                      <input value={row.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} maxLength={80} className={inputCls} placeholder="LL.B (Hons)" />
                      <input value={row.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)} maxLength={120} className={inputCls} placeholder="University of London" />
                      <input value={row.year} onChange={(e) => updateEdu(i, "year", e.target.value)} className={inputCls} inputMode="numeric" maxLength={4} placeholder="2010" />
                      {education.length > 1 && (
                        <button type="button" onClick={() => removeEdu(i)} className="min-h-[56px] rounded-lg px-3 text-base font-bold text-clay-600 hover:bg-clay-50">
                          <T en="Remove" ur="ہٹائیں" />
                        </button>
                      )}
                    </div>
                    {err(`edu${i}`)}
                    {err(`eduYear${i}`)}
                  </div>
                ))}
              </div>
              {education.length < 5 && (
                <button type="button" onClick={addEdu} className="mt-2 min-h-[48px] rounded-full border border-dashed border-court-700/50 px-4 text-base font-bold text-court-700">
                  <T en="+ Add another degree" ur="+ مزید ڈگری شامل کریں" />
                </button>
              )}
            </div>
            <div>
              <span className="mb-2 block text-base font-bold text-ink-700">
                <T en="Courts you appear in (optional)" ur="عدالتیں جہاں پیش ہوتے ہیں (اختیاری)" />
              </span>
              <div className="flex flex-wrap gap-2">
                {COURTS.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleCourt(c.nameEn)}
                    aria-pressed={courts.includes(c.nameEn)}
                    className={`min-h-[48px] rounded-full border px-4 text-base font-bold transition ${
                      courts.includes(c.nameEn) ? "border-court-700 bg-court-700 text-white" : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                    }`}
                  >
                    <T en={c.nameEn} ur={c.nameUr} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-base font-bold text-ink-700">
                <T en="Languages you speak" ur="جو زبانیں بولتے ہیں" />
              </span>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => toggleLang(l.code)}
                    aria-pressed={langCodes.includes(l.code)}
                    className={`min-h-[48px] rounded-full border px-4 text-base font-bold transition ${
                      langCodes.includes(l.code) ? "border-court-700 bg-court-700 text-white" : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                    }`}
                  >
                    <T en={l.nameEn} ur={l.nameUr} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Chamber / office name (optional)" ur="چیمبر / دفتر کا نام (اختیاری)" /></span>
                <input value={chamberName} onChange={(e) => setChamberName(e.target.value)} maxLength={120} className={inputCls} placeholder="e.g. Karachi Legal House" />
              </label>
              <label className="block">
                <span className="mb-1 block text-base font-bold text-ink-700"><T en="Chamber address (optional)" ur="چیمبر کا پتہ (اختیاری)" /></span>
                <input value={chamberAddress} onChange={(e) => setChamberAddress(e.target.value)} maxLength={300} className={inputCls} placeholder="DHA Phase 2, Karachi" />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 flex items-baseline justify-between text-base font-bold text-ink-700">
                <T en="Short bio (optional)" ur="مختصر تعارف (اختیاری)" />
                <span className="text-sm font-bold text-ink-400">{bio.trim().length}/2000</span>
              </span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={2100} rows={3} className="w-full rounded-lg border border-ink-900/15 px-4 py-3 text-base font-semibold outline-none transition placeholder:text-ink-400 focus:border-court-600 focus:ring-2 focus:ring-court-600/20" placeholder="e.g. 10 years of family law practice in Lahore…" />
              {err("bio")}
            </label>
          </div>
        )}

        {/* ===== STEP 3: review & submit ===== */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-[1.65rem] font-semibold text-ink-950"><T en="Review & submit" ur="جائزہ اور ارسال" /></h2>
            <dl className="divide-y divide-ink-900/10 rounded-lg border border-ink-900/10">
              {[
                { en: "Name", ur: "نام", v: fullName.trim() },
                ...(headline.trim() ? [{ en: "Title", ur: "خطاب", v: headline.trim() }] : []),
                { en: "Mobile", ur: "موبائل", v: normalizePhone(phone) },
                { en: "City", ur: "شہر", v: cityName },
                ...(barCouncil ? [{ en: "Bar Council", ur: "بار کونسل", v: barCouncil }] : []),
                ...(barCouncilNo.trim() ? [{ en: "Enrolment no.", ur: "انرولمنٹ نمبر", v: barCouncilNo.trim() }] : []),
                ...(enrolmentYear.trim() ? [{ en: "Enrolment year", ur: "انرولمنٹ سال", v: enrolmentYear.trim() }] : []),
                { en: "Experience", ur: "تجربہ", v: `${years} yrs` },
                { en: "Fee", ur: "فیس", v: `Rs. ${Number(feePkr).toLocaleString("en-PK")}` },
                {
                  en: "Practice areas", ur: "قانونی شعبے",
                  v: areas.map((s) => PRACTICE_AREAS.find((a) => a.slug === s)?.nameEn ?? s).join(", "),
                },
                ...(education.some((r) => r.degree.trim() && r.institution.trim())
                  ? [{
                      en: "Education", ur: "تعلیم",
                      v: education.filter((r) => r.degree.trim() && r.institution.trim())
                        .map((r) => `${r.degree.trim()} — ${r.institution.trim()}${r.year.trim() ? ` (${r.year.trim()})` : ""}`).join("; "),
                    }]
                  : []),
                ...(courts.length ? [{ en: "Courts", ur: "عدالتیں", v: courts.join(", ") }] : []),
                ...(langCodes.length ? [{
                  en: "Languages", ur: "زبانیں",
                  v: langCodes.map((c) => LANGUAGES.find((l) => l.code === c)?.nameEn ?? c).join(", "),
                }] : []),
                ...(chamberName.trim() || chamberAddress.trim()
                  ? [{ en: "Chamber", ur: "چیمبر", v: [chamberName.trim(), chamberAddress.trim()].filter(Boolean).join(", ") }]
                  : []),
              ].map((row) => (
                <div key={row.en} className="flex gap-4 px-4 py-3">
                  <dt className="w-32 shrink-0 text-base font-bold text-ink-600"><T en={row.en} ur={row.ur} /></dt>
                  <dd className="min-w-0 break-words text-base font-bold text-ink-950">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="flex items-start gap-2 rounded-lg bg-court-50 p-4 text-base text-ink-900 ring-1 ring-court-200">
              <ShieldIcon className="h-6 w-6 shrink-0" />
              <T
                en="Next step: upload your CNIC and Bar Council documents right here on the portal. Documents stay private — they are never shown to clients."
                ur="اگلا مرحلہ: اپنا شناختی کارڈ اور بار کونسل دستاویزات یہیں پورٹل پر اپ لوڈ کریں۔ دستاویزات نجی رہتی ہیں — کلائنٹس کو کبھی نہیں دکھائیں گے۔"
              />
            </p>
          </div>
        )}

        {/* ===== STEP 4: documents ===== */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display text-[1.65rem] font-semibold text-ink-950">
              <T en="Upload your documents" ur="اپنی دستاویزات اپ لوڈ کریں" />
            </h2>
            <p className="text-base text-ink-600">
              <T
                en="Take a clear photo or choose a file (JPG, PNG, WEBP or PDF, under 10 MB). Uploading again replaces the previous file."
                ur="واضح تصویر لیں یا فائل چنیں (JPG، PNG، WEBP یا PDF، 10 MB سے کم)۔ دوبارہ اپ لوڈ کرنے سے پرانی فائل بدل جائے گی۔"
              />
            </p>
            {docError && (
              <p className="rounded-lg bg-clay-50 p-4 text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={docError.en} ur={docError.ur} />
              </p>
            )}
            <div className="space-y-3">
              {DOC_SLOTS.map((slot) => {
                const existing = docFor(slot.type);
                const busy = uploading[slot.type];
                return (
                  <div key={slot.type} className="flex items-center gap-4 rounded-lg border border-ink-900/10 bg-white p-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ring-1 ${
                      existing ? "bg-court-50 text-court-700 ring-court-700/20" : "bg-ink-900/5 text-ink-500 ring-ink-900/10"
                    }`}>
                      {existing ? <CheckIcon className="h-6 w-6" /> : <DocIcon className="h-6 w-6" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-extrabold text-ink-950">
                        <T en={slot.en} ur={slot.ur} />
                        {!slot.required && (
                          <span className="ml-2 text-sm font-bold text-ink-400"><T en="(optional)" ur="(اختیاری)" /></span>
                        )}
                      </p>
                      {existing ? (
                        <p className="truncate text-sm font-bold text-court-700">
                          <T en="Uploaded" ur="اپ لوڈ ہو گئی" /> · {(existing.sizeBytes / 1024).toFixed(0)} KB
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-ink-400">
                          <T en={slot.required ? "Required" : "Optional"} ur={slot.required ? "لازمی" : "اختیاری"} />
                        </p>
                      )}
                    </div>
                    {existing ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeDoc(existing)}
                        className="min-h-[52px] shrink-0 rounded-lg border border-ink-900/15 px-4 text-base font-bold text-ink-600 hover:bg-ink-900/5 disabled:opacity-50"
                      >
                        {busy ? <T en="…" ur="…" /> : <T en="Remove" ur="ہٹائیں" />}
                      </button>
                    ) : (
                      <label className={`inline-flex min-h-[52px] shrink-0 cursor-pointer items-center justify-center rounded-lg px-5 text-base font-bold text-white shadow-card transition ${
                        busy ? "bg-court-400" : "bg-court-700 hover:bg-court-800"
                      }`}>
                        {busy ? <T en="Uploading…" ur="اپ لوڈ…" /> : <T en="Upload" ur="اپ لوڈ" />}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          disabled={busy}
                          onChange={(e) => {
                            void handleFile(slot.type, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="flex items-start gap-2 rounded-lg bg-court-50 p-4 text-base text-ink-900 ring-1 ring-court-200">
              <ShieldIcon className="h-6 w-6 shrink-0" />
              <T
                en="Documents stay private — only our verification team sees them, never clients."
                ur="دستاویزات نجی رہتی ہیں — صرف ہماری تصدیقی ٹیم دیکھتی ہے، کلائنٹس کبھی نہیں۔"
              />
            </p>
          </div>
        )}

        {/* nav buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 && step < 4 ? (
            <SecondaryBtn icon={<ArrowIcon className="h-6 w-6 rotate-180" />} onClick={() => { setStep(step - 1); setServerError(null); }}>
              <T en="Back" ur="پیچھے" />
            </SecondaryBtn>
          ) : <span />}
          {step < 3 ? (
            <PrimaryBtn icon={<ArrowIcon className="h-6 w-6" />} onClick={next}>
              <T en="Continue" ur="آگے بڑھیں" />
            </PrimaryBtn>
          ) : step === 3 ? (
            <PrimaryBtn icon={<CheckIcon className="h-6 w-6" />} onClick={submit} disabled={submitting}>
              {submitting ? <T en="Submitting…" ur="بھیجا جا رہا ہے…" /> : <T en="Submit & continue" ur="جمع کریں اور آگے بڑھیں" />}
            </PrimaryBtn>
          ) : (
            <PrimaryBtn
              icon={<CheckIcon className="h-6 w-6" />}
              disabled={missingRequired.length > 0 || Object.values(uploading).some(Boolean)}
              onClick={() => {
                if (missingRequired.length > 0) {
                  setDocError({
                    en: `Please upload: ${missingRequired.map((s) => s.en).join(", ")}.`,
                    ur: `براہ کرم اپ لوڈ کریں: ${missingRequired.map((s) => s.ur).join("، ")}۔`,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                setDone(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <T en="Finish" ur="مکمل کریں" />
            </PrimaryBtn>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-base text-ink-500">
        <T en="Questions? Call our helpline — we help you fill the form." ur="سوالات؟ ہماری ہیلپ لائن پر کال کریں — فارم بھرنے میں مدد کریں گے۔" />{" "}
        <Link href="/" className="font-bold text-court-700 hover:underline"><T en="Back to home" ur="ہوم" /></Link>
      </p>
    </div>
  );
}
