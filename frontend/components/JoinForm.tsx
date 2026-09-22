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
  UploadIcon,
  UserIcon,
} from "./icons";
import { CITIES, PRACTICE_AREAS } from "@/lib/data";

const inputCls =
  "min-h-[56px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-lg text-slate-900 outline-none focus:border-emerald-600";

function StepDots({ step }: { step: number }) {
  const labels = [
    { en: "Personal", ur: "ذاتی", icon: <UserIcon className="h-5 w-5" /> },
    { en: "Professional", ur: "پیشہ ورانہ", icon: <BriefcaseIcon className="h-5 w-5" /> },
    { en: "Documents", ur: "دستاویزات", icon: <DocIcon className="h-5 w-5" /> },
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

function UploadBox({ label, labelUr }: { label: string; labelUr: string }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50">
      <UploadIcon className="mx-auto h-10 w-10 text-emerald-700" />
      <p className="mt-2 text-lg font-extrabold text-slate-800"><T en={label} ur={labelUr} /></p>
      <p className="mt-1 text-sm text-slate-500">
        {name ? <span className="font-bold text-emerald-700">{name}</span> : <T en="Tap to choose a photo" ur="تصویر چننے کے لیے دبائیں" />}
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        className="sr-only"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}

export default function JoinForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);

  const toggleArea = (slug: string) =>
    setAreas((a) => (a.includes(slug) ? a.filter((x) => x !== slug) : [...a, slug]));

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
            en="Our team will verify your Bar Council enrolment and documents. This is a real review — usually done in 2–3 working days. We'll call you on your phone number."
            ur="ہماری ٹیم آپ کی بار کونسل رکنیت اور دستاویزات کی تصدیق کرے گی۔ یہ حقیقی جائزہ ہے — عام طور پر ۲ سے ۳ دن میں مکمل۔ ہم آپ کے فون نمبر پر رابطہ کریں گے۔"
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
        {/* ===== STEP 1: personal ===== */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Your details" ur="آپ کی معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Full name" ur="پورا نام" /></span>
              <input className={inputCls} placeholder="Adv. Muhammad Ali" />
            </label>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Mobile number" ur="موبائل نمبر" /></span>
              <span className="flex overflow-hidden rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600">
                <span className="flex min-h-[56px] items-center bg-slate-100 px-4 text-lg font-extrabold text-slate-700">+92</span>
                <input className="min-h-[56px] w-full px-4 text-lg outline-none" inputMode="numeric" placeholder="300 1234567" />
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="City" ur="شہر" /></span>
                <select className={inputCls} defaultValue="">
                  <option value="" disabled><T en="Select city" ur="شہر چنیں" /></option>
                  {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
                </select>
              </label>
              <div>
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Gender" ur="صنف" /></span>
                <div className="grid grid-cols-2 gap-2">
                  {[{ v: "male", en: "Male", ur: "مرد" }, { v: "female", en: "Female", ur: "خاتون" }].map((g) => (
                    <button key={g.v} type="button" className="min-h-[56px] rounded-2xl border-2 border-slate-200 text-lg font-bold text-slate-700 transition hover:border-emerald-500 focus:border-emerald-600">
                      <T en={g.en} ur={g.ur} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2: professional ===== */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Professional details" ur="پیشہ ورانہ معلومات" /></h2>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Bar Council" ur="بار کونسل" /></span>
              <select className={inputCls} defaultValue="">
                <option value="" disabled><T en="Select Bar Council" ur="بار کونسل چنیں" /></option>
                {["Punjab Bar Council", "Sindh Bar Council", "Khyber Pakhtunkhwa Bar Council", "Balochistan Bar Council", "Islamabad Bar Council"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Enrolment number" ur="انرولمنٹ نمبر" /></span>
                <input className={inputCls} placeholder="PBC-12345" />
              </label>
              <label className="block">
                <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Years of experience" ur="تجربے کے سال" /></span>
                <input className={inputCls} type="number" min={0} placeholder="8" />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Consultation fee (PKR)" ur="مشاورت کی فیس (روپے)" /></span>
              <input className={inputCls} type="number" min={0} placeholder="3000" />
            </label>
            <div>
              <span className="mb-2 block text-base font-extrabold text-slate-700"><T en="Practice areas (pick all that apply)" ur="قانونی شعبے (سب چنیں)" /></span>
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
            </div>
          </div>
        )}

        {/* ===== STEP 3: documents ===== */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Verification documents" ur="تصدیقی دستاویزات" /></h2>
            <p className="flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-base text-emerald-900 ring-1 ring-emerald-200">
              <ShieldIcon className="h-6 w-6 shrink-0" />
              <T
                en="Your documents are reviewed by our team and kept private — they are never shown to clients. We store only a secure hash of your CNIC, never the number itself."
                ur="آپ کی دستاویزات ہماری ٹیم جانچتی ہے اور نجی رہتی ہیں — کلائنٹس کو کبھی نہیں دکھائیں گے۔ ہم آپ کے شناختی کارڈ کا صرف محفوظ ہیش رکھتے ہیں، نمبر نہیں۔"
              />
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadBox label="CNIC — front" labelUr="شناختی کارڈ — سامنے" />
              <UploadBox label="CNIC — back" labelUr="شناختی کارڈ — پیچھے" />
              <UploadBox label="Bar Council certificate" labelUr="بار کونسل سرٹیفکیٹ" />
              <UploadBox label="Profile photo" labelUr="پروفائل تصویر" />
            </div>
          </div>
        )}

        {/* nav buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <SecondaryBtn icon={<ArrowIcon className="h-6 w-6 rotate-180" />} onClick={() => setStep(step - 1)}>
              <T en="Back" ur="پیچھے" />
            </SecondaryBtn>
          ) : <span />}
          {step < 3 ? (
            <PrimaryBtn icon={<ArrowIcon className="h-6 w-6" />} onClick={() => setStep(step + 1)}>
              <T en="Continue" ur="آگے بڑھیں" />
            </PrimaryBtn>
          ) : (
            <PrimaryBtn icon={<CheckIcon className="h-6 w-6" />} onClick={() => setDone(true)}>
              <T en="Submit for verification" ur="تصدیق کے لیے بھیجیں" />
            </PrimaryBtn>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-base text-slate-500">
        <T en="Demo form — nothing is uploaded or stored." ur="ڈیمو فارم — کچھ اپ لوڈ یا محفوظ نہیں ہوتا۔" />{" "}
        <Link href="/" className="font-bold text-emerald-700 hover:underline"><T en="Back to home" ur="ہوم" /></Link>
      </p>
    </div>
  );
}
