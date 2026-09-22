import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { DemoNotice, PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import SearchHero from "@/components/SearchHero";
import {
  ArrowIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatIcon,
  CheckBadgeIcon,
  DocIcon,
  OfficeIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
  VideoIcon,
} from "@/components/icons";
import { CITIES, LAWYERS, PRACTICE_AREAS } from "@/lib/data";

const SERVICES = [
  { icon: <VideoIcon className="h-9 w-9" />, en: "Online Consultation", ur: "آن لائن مشاورت" },
  { icon: <OfficeIcon className="h-9 w-9" />, en: "Chamber Meeting", ur: "چیمبر ملاقات" },
  { icon: <DocIcon className="h-9 w-9" />, en: "Document Drafting", ur: "دستاویز تیاری" },
  { icon: <BriefcaseIcon className="h-9 w-9" />, en: "Case Filing", ur: "کیس دائر کرنا" },
  { icon: <ChatIcon className="h-9 w-9" />, en: "Legal Opinion", ur: "قانونی رائے" },
];

const STEPS = [
  { n: "1", icon: <SearchIcon className="h-8 w-8" />, en: "Choose your wakeel", ur: "اپنا وکیل چنیں" },
  { n: "2", icon: <CalendarIcon className="h-8 w-8" />, en: "Pick a time", ur: "وقت منتخب کریں" },
  { n: "3", icon: <PhoneIcon className="h-8 w-8" />, en: "Enter your phone number — done!", ur: "فون نمبر لکھیں — ہو گیا!" },
];

export default function Home() {
  const featured = LAWYERS.slice(0, 4);
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="wc-hero-pattern relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 text-center sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-base font-bold text-emerald-100 ring-1 ring-white/20">
            <ShieldIcon className="h-5 w-5 text-amber-300" />
            <T en="Bar Council verified lawyers" ur="بار کونسل سے تصدیق شدہ وکیل" />
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            <T
              en={<>Pakistan ke <span className="text-amber-300">verified wakeel</span>, ab ek click par</>}
              ur={<>پاکستان کے <span className="text-amber-300">تصدیق شدہ وکیل</span>، اب ایک کلک پر</>}
            />
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100 sm:text-xl">
            <T
              en="Video call or chamber visit — booked in 3 easy steps. Transparent fees, real reviews."
              ur="ویڈیو کال یا چیمبر ملاقات — صرف ۳ آسان مراحل میں۔ واضح فیس، حقیقی آراء۔"
            />
          </p>
          <SearchHero />
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-emerald-100">
            <span className="inline-flex items-center gap-2 text-lg font-bold">
              <CheckBadgeIcon className="h-5 w-5 text-amber-300" />
              <T en={`${LAWYERS.length} demo lawyers`} ur={`${LAWYERS.length} ڈیمو وکیل`} />
            </span>
            <span className="inline-flex items-center gap-2 text-lg font-bold">
              <CheckBadgeIcon className="h-5 w-5 text-amber-300" />
              <T en={`${CITIES.length} cities`} ur={`${CITIES.length} شہر`} />
            </span>
            <span className="inline-flex items-center gap-2 text-lg font-bold">
              <CheckBadgeIcon className="h-5 w-5 text-amber-300" />
              <T en={`${PRACTICE_AREAS.length} practice areas`} ur={`${PRACTICE_AREAS.length} قانونی شعبے`} />
            </span>
          </div>
        </div>
        <div className="h-8 rounded-t-[2rem] bg-slate-50" />
      </section>

      {/* ============ SERVICES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="خدمات"
          title={<T en="What do you need help with?" ur="آپ کو کس میں مدد چاہیے؟" />}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((s) => (
            <Link
              key={s.en}
              href="/lawyers"
              className="group flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                {s.icon}
              </span>
              <span className="text-lg font-extrabold text-slate-900"><T en={s.en} ur={s.ur} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-emerald-50/70 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowUr="طریقہ کار"
            title={<T en="Book in 3 easy steps" ur="صرف ۳ آسان مراحل میں بک کریں" />}
            sub={<T en="So simple, anyone can do it — no account, no passwords." ur="اتنا آسان کہ کوئی بھی کر لے — نہ اکاؤنٹ، نہ پاس ورڈ۔" />}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-emerald-100">
                <span className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-xl font-extrabold text-emerald-950">
                  {s.n}
                </span>
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-700 text-white">
                  {s.icon}
                </span>
                <p className="mt-5 text-xl font-extrabold text-slate-900"><T en={s.en} ur={s.ur} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED LAWYERS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="نمایاں وکیل"
          title={<T en="Featured lawyers" ur="نمایاں وکیل" />}
        />
        <div className="mx-auto mb-6 max-w-3xl"><DemoNotice /></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <PrimaryBtn href="/lawyers" icon={<ArrowIcon className="h-6 w-6" />}>
            <T en="See all lawyers" ur="تمام وکیل دیکھیں" />
          </PrimaryBtn>
        </div>
      </section>

      {/* ============ PRACTICE AREAS ============ */}
      <section className="bg-white py-14 ring-1 ring-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowUr="قانونی شعبے"
            title={<T en="Browse by legal problem" ur="اپنے مسئلے کے حساب سے دیکھیں" />}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {PRACTICE_AREAS.map((a) => (
              <Link
                key={a.slug}
                href={`/practice-areas/${a.slug}`}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg"
              >
                <p className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800"><T en={a.nameEn} ur={a.nameUr} /></p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TOP CITIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="شہر"
          title={<T en="Find lawyers in your city" ur="اپنے شہر میں وکیل تلاش کریں" />}
        />
        <div className="flex flex-wrap justify-center gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="inline-flex min-h-[52px] items-center rounded-full border-2 border-emerald-200 bg-white px-6 text-lg font-bold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-700 hover:text-white"
            >
              <T en={c.nameEn} ur={c.nameUr} />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ JOIN CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="wc-hero-pattern overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-800 to-emerald-600 p-10 text-center shadow-xl sm:p-14">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-white">
            <UserIcon className="h-10 w-10" />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            <T en="Are you a lawyer? Get verified clients." ur="کیا آپ وکیل ہیں؟ تصدیق شدہ کلائنٹ حاصل کریں۔" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-emerald-100">
            <T
              en="Join wakeel.connect — our team verifies every profile before it goes public."
              ur="wakeel.connect سے جڑیں — ہماری ٹیم ہر پروفائل کی تصدیق کرتی ہے۔"
            />
          </p>
          <div className="mt-8">
            <Link
              href="/join"
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-amber-400 px-8 text-lg font-extrabold text-emerald-950 shadow-lg transition hover:bg-amber-300 active:scale-[0.98]"
            >
              <BriefcaseIcon className="h-6 w-6" />
              <T en="Join as Lawyer — it's free" ur="وکیل بنیں — بالکل مفت" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
