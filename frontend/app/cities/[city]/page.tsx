import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "@/components/ui";
import FaqAccordion from "@/components/FaqAccordion";
import { ArrowIcon, CheckBadgeIcon, PinIcon } from "@/components/icons";
import { CITIES, getCity, PRACTICE_AREAS, COURTS } from "@/lib/data";

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Lawyers in ${c.nameEn} — wakeel.connect`,
    description: `Find the best lawyers in ${c.nameEn} by practice area or court. Book an online consultation or chamber visit in 3 easy steps.`,
  };
}

/**
 * Pure directory hub (oladoc city-root pattern): banner + H1 + intro,
 * practice-area link grids, court links, city FAQs. No lawyer listings —
 * every link funnels into a filtered listing page.
 */
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const courtsHere = COURTS.filter((k) => k.citySlug === c.slug);

  const faqs = [
    {
      qEn: `How do I book a lawyer in ${c.nameEn}?`,
      qUr: `${c.nameUr} میں وکیل کیسے بک کروں؟`,
      aEn: "Pick a practice area above, choose a lawyer, select a day and time, then verify your mobile number with a code. That's it — three steps, no account or password needed.",
      aUr: "اوپر کوئی قانونی شعبہ چنیں، وکیل منتخب کریں، دن اور وقت منتخب کریں، پھر کوڈ سے موبائل نمبر کی تصدیق کریں۔ بس — تین مراحل، نہ اکاؤنٹ نہ پاس ورڈ۔",
    },
    {
      qEn: `What are the consultation fees in ${c.nameEn}?`,
      qUr: `${c.nameUr} میں مشاورت کی فیس کیا ہے؟`,
      aEn: "Every lawyer sets their own fee and it is shown on their profile before you book — never after. Some lawyers keep the fee on request; you can message them through the platform to ask.",
      aUr: "ہر وکیل اپنی فیس خود طے کرتا ہے اور بکنگ سے پہلے پروفائل پر لکھی ہوتی ہے — بعد میں نہیں۔ کچھ وکیلوں کی فیس معلوم کرنے پر بتائی جاتی ہے؛ پلیٹ فارم کے ذریعے پوچھ سکتے ہیں۔",
    },
    {
      qEn: "Are these lawyers verified?",
      qUr: "کیا یہ وکیل تصدیق شدہ ہیں؟",
      aEn: "Every public profile is reviewed by our team before it goes live. Lawyers submit their CNIC and Bar Council documents through our portal, and our team checks them before listing.",
      aUr: "عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے۔ وکیل اپنے شناختی کارڈ اور بار کونسل کی دستاویزات ہمارے پورٹل پر جمع کراتے ہیں، اور ہماری ٹیم درج کرنے سے پہلے ان کی جانچ کرتی ہے۔",
    },
    {
      qEn: "Can I consult a lawyer online instead of visiting?",
      qUr: "کیا میں ملاقات کے بجائے آن لائن مشورہ لے سکتا ہوں؟",
      aEn: "Yes — many lawyers offer online consultations. Choose the online option when you book; the lawyer will phone you at the booked time, so no app or link is needed.",
      aUr: "جی ہاں — کئی وکیل آن لائن مشاورت دیتے ہیں۔ بکنگ کے وقت آن لائن کا آپشن منتخب کریں؛ وکیل مقررہ وقت پر آپ کو فون کریں گے، کسی ایپ یا لنک کی ضرورت نہیں۔",
    },
    {
      qEn: "What if I need to reschedule or cancel?",
      qUr: "اگر وقت بدلنا یا منسوخ کرنا ہو تو؟",
      aEn: "Open your dashboard, find the booking, and choose reschedule or cancel. Rescheduling is free; please do it as early as you can so someone else can take the slot.",
      aUr: "اپنا ڈیش بورڈ کھولیں، بکنگ تلاش کریں، اور وقت بدلیں یا منسوخ کریں کا انتخاب کریں۔ وقت بدلنا مفت ہے؛ جتنی جلدی ہو سکے کریں تاکہ کوئی اور یہ وقت لے سکے۔",
    },
    {
      qEn: "My legal problem is complicated — who should I talk to first?",
      qUr: "میرا قانونی مسئلہ پیچیدہ ہے — پہلے کس سے بات کروں؟",
      aEn: "If you're not sure which lawyer fits your case, request a callback — tell us your matter and our team will call you back within 24 hours and point you to the right lawyers.",
      aUr: "اگر سمجھ نہ آئے کہ آپ کے کیس کے لیے کون سا وکیل درست ہے تو کال بیک کی درخواست کریں — اپنا مسئلہ بتائیں اور ہماری ٹیم ۲۴ گھنٹوں میں آپ کو کال کر کے درست وکیلوں کی طرف رہنمائی کرے گی۔",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* ============ BANNER ============ */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-950 shadow-lift">
        <div className="absolute inset-0 bg-gradient-to-l from-court-800 via-court-900 to-ink-950" aria-hidden />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brass-500/25 blur-3xl" aria-hidden />
        <div className="relative p-7 sm:p-10 lg:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.95rem] font-bold text-paper ring-1 ring-white/20">
            <PinIcon className="h-5 w-5 text-brass-300" />
            <T en={c.province} ur={c.nameUr} />
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[2.4rem] font-semibold leading-[1.12] text-white sm:text-[3rem]">
            <T
              en={<>Find and book the <span className="text-brass-300">best lawyers</span> in {c.nameEn}</>}
              ur={<>{c.nameUr} میں <span className="text-brass-300">بہترین وکیل</span> تلاش کریں اور بک کریں</>}
            />
          </h1>
          <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-ink-200">
            <T
              en={`Browse ${c.nameEn}'s lawyers by the legal problem you have — family, criminal, property, corporate and more. Video consultation or chamber visit, booked in 3 easy steps.`}
              ur={`اپنے قانونی مسئلے کے حساب سے ${c.nameUr} کے وکیل دیکھیں — خاندانی، فوجداری، جائیداد، کاروباری اور مزید۔ ویڈیو مشاورت یا چیمبر ملاقات، صرف ۳ آسان مراحل میں۔`}
            />
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.95rem] font-bold text-paper ring-1 ring-white/20">
            <CheckBadgeIcon className="h-5 w-5 text-brass-300" />
            <T en="Every profile is reviewed by our team" ur="ہر پروفائل ہماری ٹیم کی نظر سے گزرتا ہے" />
          </p>
        </div>
      </div>

      {/* ============ BEST {AREA} IN {CITY} ============ */}
      <section className="mt-14">
        <div className="mb-6">
          <p className="wc-kicker"><T en="Browse by legal problem" ur="قانونی مسئلے کے حساب سے" /></p>
          <h2 className="mt-2 font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
            <T en={`Best lawyers in ${c.nameEn} — by practice area`} ur={`${c.nameUr} میں بہترین وکیل — شعبے کے حساب سے`} />
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_AREAS.map((a) => (
            <Link
              key={a.slug}
              href={`/${c.slug}/${a.slug}`}
              className="group flex min-h-[64px] items-center justify-between rounded-lg border border-ink-900/10 bg-white px-5 py-4 shadow-card transition hover:border-court-700/40 hover:shadow-lift"
            >
              <span className="text-[1.05rem] font-bold text-ink-950 transition group-hover:text-court-800">
                <T en={`Best ${a.nameEn} in ${c.nameEn}`} ur={`${c.nameUr} میں بہترین ${a.nameUr}`} />
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:text-court-600" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ COURTS IN THIS CITY ============ */}
      {courtsHere.length > 0 && (
        <section className="mt-14">
          <div className="mb-6">
            <p className="wc-kicker"><T en="Courts" ur="عدالتیں" /></p>
            <h2 className="mt-2 font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
              <T en={`Courts in ${c.nameEn}`} ur={`${c.nameUr} کی عدالتیں`} />
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courtsHere.map((k) => (
              <Link
                key={k.slug}
                href={`/lawyers?court=${k.slug}`}
                className="group flex min-h-[64px] items-center justify-between rounded-lg border border-ink-900/10 bg-white px-5 py-4 shadow-card transition hover:border-court-700/40 hover:shadow-lift"
              >
                <span className="text-[1.05rem] font-bold text-ink-950 transition group-hover:text-court-800">
                  <T en={k.nameEn} ur={k.nameUr} />
                </span>
                <ArrowIcon className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:text-court-600" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ CITY FAQ ============ */}
      <section className="mx-auto mt-14 max-w-3xl">
        <div className="mb-6 text-center">
          <h2 className="font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
            <T en={`Lawyers in ${c.nameEn} — FAQs`} ur={`${c.nameUr} میں وکیل — سوالات`} />
          </h2>
        </div>
        <FaqAccordion items={faqs} wide />
      </section>

      {/* ============ CTA ============ */}
      <section className="mt-14 rounded-[1.75rem] bg-court-900 px-6 py-12 text-center shadow-lift sm:px-12">
        <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
          <T en={`Not sure which lawyer fits your case in ${c.nameEn}?`} ur={`${c.nameUr} میں آپ کے کیس کے لیے کون سا وکیل درست ہے؟`} />
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[1.05rem] text-court-100">
          <T
            en="Request a callback — our team will call you back within 24 hours and guide you."
            ur="کال بیک کی درخواست کریں — ہماری ٹیم ۲۴ گھنٹوں میں آپ کو کال کر کے رہنمائی کرے گی۔"
          />
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryBtn href="/lawyers" icon={<ArrowIcon className="h-6 w-6" />}>
            <T en="Browse all lawyers" ur="تمام وکیل دیکھیں" />
          </PrimaryBtn>
          <SecondaryBtn href="/callback" className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10">
            <T en="Request a callback" ur="کال بیک کی درخواست" />
          </SecondaryBtn>
        </div>
      </section>
    </div>
  );
}
