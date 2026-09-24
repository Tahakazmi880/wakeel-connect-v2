import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SafeImage } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import { PhotoAvatar } from "@/components/PhotoAvatar";
import SearchHero from "@/components/SearchHero";
import SpecialtyCircles from "@/components/SpecialtyCircles";
import StatsBand from "@/components/StatsBand";
import FaqAccordion from "@/components/FaqAccordion";
import {
  ArrowIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  ChatIcon,
  DocIcon,
  OfficeIcon,
  PinIcon,
  VideoIcon,
} from "@/components/icons";
import { CITIES, COURTS, getCity } from "@/lib/data";
import { API_V1, fileUrl, formatFee, type LawyerSummary } from "@/lib/api";

async function fetchFeatured(): Promise<{ lawyers: LawyerSummary[]; total: number }> {
  try {
    const res = await fetch(`${API_V1}/lawyers?limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return { lawyers: [], total: 0 };
    const data = await res.json();
    if (!data?.ok) return { lawyers: [], total: 0 };
    return { lawyers: data.lawyers ?? [], total: data.total ?? 0 };
  } catch {
    return { lawyers: [], total: 0 };
  }
}

/** Honest live count of lawyers offering video consultation (backend ?online=1). */
async function fetchOnlineCount(): Promise<number> {
  try {
    const res = await fetch(`${API_V1}/lawyers?online=1&limit=1`, { next: { revalidate: 60 } });
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data?.ok) return 0;
    return data.total ?? 0;
  } catch {
    return 0;
  }
}

const SERVICES: {
  titleEn: string;
  titleUr: string;
  subEn: string;
  subUr: string;
  href: string;
  image?: string;
  urduWord?: string;
  icon: React.ReactNode;
}[] = [
  {
    titleEn: "Consult Online Now",
    titleUr: "ابھی آن لائن مشورہ کریں",
    subEn: "Talk to a wakeel face-to-face, from anywhere in Pakistan.",
    subUr: "پاکستان میں کہیں سے بھی وکیل سے بالمشافہ بات کریں۔",
    href: "/lawyers?online=1",
    image: fileUrl("/lawyers/fayazuddin-rajper.jpg") ?? undefined,
    icon: <VideoIcon className="h-5 w-5" />,
  },
  {
    titleEn: "Chamber Appointments",
    titleUr: "چیمبر ملاقاتیں",
    subEn: "Book an in-person visit to the lawyer's office.",
    subUr: "وکیل کے دفتر میں بالمشافہ ملاقات بک کریں۔",
    href: "/lawyers",
    image: "/courts/city-courts-karachi.jpg",
    icon: <OfficeIcon className="h-5 w-5" />,
  },
  {
    titleEn: "Document Drafting",
    titleUr: "دستاویز تیاری",
    subEn: "Agreements, notices and deeds drafted properly.",
    subUr: "معاہدے، نوٹس اور دستاویزات درست طریقے سے تیار کروائیں۔",
    href: "/lawyers",
    image: "/services/document-drafting.jpg",
    icon: <DocIcon className="h-5 w-5" />,
  },
  {
    titleEn: "Case Filing",
    titleUr: "کیس دائر کرنا",
    subEn: "File your case in the right court, the right way.",
    subUr: "اپنا کیس درست عدالت میں درست طریقے سے دائر کریں۔",
    href: "/lawyers",
    image: "/courts/supreme-court-pakistan.jpg",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    titleEn: "Free Legal Q&A",
    titleUr: "مفت قانونی سوال جواب",
    subEn: "Ask a legal question, get answers from lawyers.",
    subUr: "قانونی سوال پوچھیں، وکیلوں سے جواب پائیں۔",
    href: "/questions",
    image: "/services/legal-qa.jpg",
    icon: <ChatIcon className="h-5 w-5" />,
  },
];

const STEPS = [
  { n: "1", en: "Choose your wakeel", ur: "اپنا وکیل چنیں", enSub: "Browse reviewed profiles by city and legal problem.", urSub: "شہر اور قانونی مسئلے کے حساب سے جانچی ہوئی پروفائلز دیکھیں۔" },
  { n: "2", en: "Pick a time", ur: "وقت منتخب کریں", enSub: "Choose a day and slot that suits you.", urSub: "اپنی سہولت کا دن اور وقت منتخب کریں۔" },
  { n: "3", en: "Confirm by phone", ur: "فون سے تصدیق کریں", enSub: "Enter your number, verify the code — done.", urSub: "نمبر لکھیں، کوڈ سے تصدیق کریں — ہو گیا۔" },
];

const WHY_WAKEEL = [
  {
    en: "Reviewed profiles",
    ur: "جانچی ہوئی پروفائلز",
    enSub: "Every lawyer uploads their CNIC and Bar Council documents — our team checks them before the profile is listed.",
    urSub: "ہر وکیل اپنا شناختی کارڈ اور بار کونسل دستاویزات اپ لوڈ کرتا ہے — ہماری ٹیم انہیں جانچتی ہے، اس کے بعد پروفائل عوامی ہوتی ہے۔",
  },
  {
    en: "Transparent fees",
    ur: "واضح فیس",
    enSub: "The consultation fee is shown on the profile — before you book, not after.",
    urSub: "مشاورت کی فیس پروفائل پر لکھی ہوتی ہے — بکنگ سے پہلے، بعد میں نہیں۔",
  },
  {
    en: "3-step booking",
    ur: "صرف ۳ مراحل",
    enSub: "Choose, pick a time, enter your phone number. No accounts, no passwords.",
    urSub: "وکیل چنیں، وقت منتخب کریں، فون نمبر لکھیں۔ نہ اکاؤنٹ، نہ پاس ورڈ۔",
  },
  {
    en: "Urdu support",
    ur: "اردو سپورٹ",
    enSub: "Talk to your lawyer in Urdu. Profiles show which languages each lawyer speaks.",
    urSub: "اپنے وکیل سے اردو میں بات کریں۔ ہر پروفائل پر زبان لکھی ہوتی ہے۔",
  },
  {
    en: "Your number stays private",
    ur: "آپ کا نمبر پرائیویٹ",
    enSub: "Your phone number is shared only with the lawyer you book — never shown publicly.",
    urSub: "آپ کا نمبر صرف اس وکیل کو ملتا ہے جسے آپ بک کریں — عوامی کبھی نہیں۔",
  },
];

const GUIDES = [
  {
    slug: "/guides/khula-process-pakistan",
    titleEn: "Khula ka process",
    titleUr: "خلع کا طریقہ کار",
    excerptEn: "Step-by-step: how khula works in Pakistani family courts, in plain words.",
    excerptUr: "مرحلہ بہ مرحلہ: پاکستانی خاندانی عدالتوں میں خلع کیسے ہوتا ہے، آسان الفاظ میں۔",
  },
  {
    slug: "/guides/fir-kaise-darj-karain",
    titleEn: "FIR kaise darj karayein",
    titleUr: "ایف آئی آر درج کرنے کا طریقہ",
    excerptEn: "Your right to register an FIR, and what to do if the police refuse.",
    excerptUr: "ایف آئی آر درج کرانا آپ کا حق ہے — پولیس انکار کرے تو کیا کریں۔",
  },
  {
    slug: "/guides/property-registry-transfer-pakistan",
    titleEn: "Property registry in Pakistan",
    titleUr: "پاکستان میں جائیداد کی رجسٹری",
    excerptEn: "How registry and transfer of property works, and the documents you need.",
    excerptUr: "جائیداد کی رجسٹری اور منتقلی کیسے ہوتی ہے، اور کون سی دستاویزات چاہئیں۔",
  },
];

/** oladoc-style section head: bold title left, "View All" link right. */
function RowHead({ title, href, linkEn, linkUr }: { title: React.ReactNode; href: string; linkEn: string; linkUr: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <h2 className="font-display text-[1.7rem] font-semibold leading-tight text-ink-950 sm:text-[2rem]">
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-[1.05rem] font-bold text-court-700 underline decoration-court-300 decoration-2 underline-offset-4 transition hover:text-court-800"
      >
        <T en={linkEn} ur={linkUr} />
      </Link>
    </div>
  );
}

export default async function Home() {
  const { lawyers: featured, total: lawyerCount } = await fetchFeatured();
  const onlineCount = await fetchOnlineCount();
  const heroPortrait = fileUrl("/lawyers/shamsuddin-rajper.jpg");

  return (
    <>
      {/* ============ HERO — oladoc-style banner ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:pt-7">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-950 shadow-lift sm:rounded-[2.25rem]">
          <div className="absolute inset-0 bg-gradient-to-l from-court-800 via-court-900 to-ink-950" aria-hidden />
          <div className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-brass-500/25 blur-3xl" aria-hidden />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-court-500/20 blur-3xl" aria-hidden />
          {/* Mobile (<md): compact oladoc-pattern card — headline → badge →
              location → full-width search; portrait absolute right ~35%,
              full card height, edge-bleed with face visible. */}
          <div className="relative md:hidden">
            <div className="absolute inset-y-0 right-0 w-[35%]">
              <SafeImage
                src={heroPortrait}
                alt="Shamsuddin Rajper — Founder & Senior Advocate"
                eager
                className="h-full w-full object-cover object-[72%_top]"
                fallback={<div className="h-full w-full bg-court-800" aria-hidden />}
              />
            </div>
            <div className="relative z-10 px-4 pb-3 pt-4">
              <p className="max-w-[62%] text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brass-300">
                <T en="For everyday Pakistanis" ur="عام پاکستانیوں کے لیے" />
              </p>
              <h1 className="mt-1.5 max-w-[62%] font-display text-[1.35rem] font-semibold leading-[1.25] text-white">
                <T
                  en={<>Find and Book the <span className="text-brass-300">Best Wakeel</span> near you</>}
                  ur={<>اپنے قریب <span className="text-brass-300">بہترین وکیل</span> تلاش کریں اور بک کریں</>}
                />
              </h1>
              <p className="mt-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold text-brass-200 ring-1 ring-white/15">
                <span aria-hidden className="text-brass-300">✓</span>
                <T
                  en={`${lawyerCount} reviewed profiles`}
                  ur={`${lawyerCount} جانچی ہوئی پروفائلز`}
                />
              </p>
              <SearchHero compact />
            </div>
          </div>
          {/* md+: existing hero — unchanged. */}
          <div className="relative hidden md:grid md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-x-4 md:gap-y-6 md:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-14">
            <div className="min-w-0 p-5 md:p-0 lg:col-start-1 lg:row-start-1">
              <p className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1.5 text-[0.72rem] font-bold text-paper ring-1 ring-white/20 md:rounded-full md:px-4 md:py-2 md:text-[0.95rem]">
                <CheckBadgeIcon className="h-5 w-5 text-brass-300" />
                <T
                  en={`${lawyerCount} reviewed lawyer profiles`}
                  ur={`${lawyerCount} جانچی ہوئی وکیل پروفائلز`}
                />
              </p>
              <p className="text-[0.85rem] font-bold uppercase tracking-[0.22em] text-brass-300">
                <T en="For everyday Pakistanis" ur="عام پاکستانیوں کے لیے" />
              </p>
              <h1 className="mt-3 font-display text-[1.4rem] font-semibold leading-[1.15] text-white md:mt-4 md:text-[2.6rem] md:leading-[1.1] lg:text-[3.4rem]">
                <T
                  en={<>Find and Book the <span className="text-brass-300">Best Wakeel</span> near you</>}
                  ur={<>اپنے قریب <span className="text-brass-300">بہترین وکیل</span> تلاش کریں اور بک کریں</>}
                />
              </h1>
              <p className="mt-3 hidden max-w-xl text-[1.12rem] leading-relaxed text-ink-200 md:mt-4 md:block">
                <T
                  en="No touts, no middlemen — every profile is reviewed by our team before it goes public, and the fee is shown up front."
                  ur="نہ دلال، نہ مڈل مین — عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے، اور فیس پہلے سے واضح لکھی ہوتی ہے۔"
                />
              </p>
              <div className="mt-4 md:hidden">
                <SearchHero compact />
              </div>
            </div>
            <div className="hidden md:block md:col-span-2 md:row-start-2 md:[&_form]:mx-0 md:[&_form]:mt-0 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:[&_form]:mt-8">
              <SearchHero />
            </div>
            <div className="relative md:col-start-2 md:row-start-1 md:-mr-10 md:-mt-10 lg:m-0 lg:mx-auto lg:row-span-2 lg:w-full lg:max-w-sm">
              <SafeImage
                src={heroPortrait}
                alt="Shamsuddin Rajper — Founder & Senior Advocate"
                eager
                className="absolute inset-0 h-full w-full object-cover object-top md:static md:aspect-[3/4] md:w-full md:rounded-l-[1.5rem] lg:aspect-[4/5] lg:rounded-[1.5rem] lg:shadow-lift lg:ring-1 lg:ring-white/25"
                fallback={<div className="absolute inset-0 bg-court-800 md:static md:aspect-[3/4] md:w-full md:rounded-l-[1.5rem] lg:aspect-[4/5] lg:rounded-[1.5rem] lg:ring-1 lg:ring-white/25" aria-hidden />}
              />
              <div className="absolute -bottom-5 left-1/2 hidden w-max -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-[0.95rem] font-bold text-ink-900 shadow-lift lg:block">
                <T en="3-step booking · No account needed" ur="۳ مراحل میں بکنگ · اکاؤنٹ کی ضرورت نہیں" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOP WAKEELS — profiles right up front ============ */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8" aria-label="Top wakeels">
          <RowHead
            title={<T en="Top wakeels near you" ur="آپ کے قریب نمایاں وکیل" />}
            href="/lawyers"
            linkEn="View All"
            linkUr="سب دیکھیں"
          />
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {featured.map((l) => (
              <Link
                key={l.id}
                href={`/lawyer/${l.slug}`}
                className="group flex w-64 shrink-0 snap-start items-center gap-3.5 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift sm:w-auto"
              >
                <PhotoAvatar
                  name={l.displayName}
                  photo={fileUrl(l.photoUrl) ?? undefined}
                  gender={l.gender}
                  size="lg"
                  className="h-16 w-16"
                />
                <div className="min-w-0">
                  <p className="truncate text-[1.02rem] font-bold text-ink-950 transition group-hover:text-court-800">
                    {l.displayName}
                  </p>
                  <p className="truncate text-[0.85rem] text-ink-600">
                    {l.headline ?? <T en="Wakeel" ur="وکیل" />}
                  </p>
                  <p className="mt-0.5 text-[0.85rem] font-bold text-brass-700">
                    {formatFee(l.consultationFeePaisa) ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ SERVICES — oladoc mobile pattern: 2 large + 3 compact ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-10">
        {/* mobile: 2 large cards side by side */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {SERVICES.slice(0, 2).map((s, i) => (
            <Link
              key={s.titleEn}
              href={s.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift"
            >
              <div className="relative h-28 overflow-hidden bg-court-950">
                <SafeImage
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-court-900 text-brass-300">
                      {s.icon}
                    </div>
                  }
                />
                {i === 0 && onlineCount > 0 && (
                  <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1.5 bg-court-800/95 px-2 py-1.5 text-[0.78rem] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-moss-600" aria-hidden />
                    <T en={`${onlineCount} Lawyers Online Now`} ur={`${onlineCount} وکیل آن لائن`} />
                  </span>
                )}
              </div>
              <p className="p-3 text-[0.95rem] font-bold leading-snug text-ink-950">
                <T en={s.titleEn} ur={s.titleUr} />
              </p>
            </Link>
          ))}
        </div>
        {/* mobile: 3 compact cards in a row */}
        <div className="mt-3 grid grid-cols-3 gap-3 md:hidden">
          {SERVICES.slice(2).map((s) => (
            <Link
              key={s.titleEn}
              href={s.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift"
            >
              <div className="h-20 overflow-hidden bg-court-50">
                <SafeImage
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-court-900 text-brass-300">
                      {s.icon}
                    </div>
                  }
                />
              </div>
              <p className="p-2 text-center text-[0.8rem] font-bold leading-tight text-ink-950">
                <T en={s.titleEn} ur={s.titleUr} />
              </p>
            </Link>
          ))}
        </div>
        {/* md+: existing card grid untouched */}
        <div className="hidden gap-5 md:grid md:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((s, i) => (
            <Link
              key={s.titleEn}
              href={s.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift"
            >
              <div className="relative h-44 overflow-hidden bg-court-50 sm:h-52">
                <SafeImage
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                  fallback={
                    <div className="wc-jali-light flex h-full w-full items-center justify-center bg-court-900 p-4">
                      <span className="text-center font-display text-[1.9rem] font-semibold leading-snug text-brass-300">
                        {s.urduWord}
                      </span>
                    </div>
                  }
                />
                {i === 0 && onlineCount > 0 && (
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-court-800/95 px-2 py-1.5 text-[0.8rem] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-moss-600" aria-hidden />
                    <T en={`${onlineCount} lawyers available for online consultation`} ur={`${onlineCount} وکیل آن لائن مشاورت کے لیے دستیاب`} />
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-[1.08rem] font-bold leading-snug text-ink-950 transition group-hover:text-court-800">
                  <T en={s.titleEn} ur={s.titleUr} />
                </p>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-600">
                  <T en={s.subEn} ur={s.subUr} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SpecialtyCircles />

      {/* ============ PARTNERSHIP — corporate benefits ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-20">
        <div className="wc-jali relative overflow-hidden rounded-3xl bg-court-900 px-6 py-10 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brass-500/15 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-court-500/25 blur-2xl" aria-hidden />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.85rem] font-bold uppercase tracking-[0.2em] text-brass-300">
                <T en="For businesses & institutions" ur="کاروبار اور اداروں کے لیے" />
              </p>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-snug text-white sm:text-[2.1rem]">
                <T
                  en="Bring trusted legal support to your brand, clients and employees."
                  ur="اپنے برانڈ، کلائنٹس اور ملازمین کے لیے قابلِ اعتماد قانونی سہولت لائیں۔"
                />
              </h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-court-100">
                <T
                  en="Talk to us about partnering with WakeelConnect — a trusted legal resource for your team and clients."
                  ur="اپنی ٹیم اور کلائنٹس کے لیے قابلِ اعتماد قانونی وسیلہ — WakeelConnect کے ساتھ شراکت کے بارے میں ہم سے بات کریں۔"
                />
              </p>
            </div>
            <Link
              href="/callback"
              className="group inline-flex shrink-0 items-center gap-3 rounded-2xl bg-brass-400 px-8 py-4 text-[1.1rem] font-bold text-court-950 shadow-lift transition hover:bg-brass-300"
            >
              <T en="Become a Partner" ur="پارٹنر بنیں" />
              <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED LAWYERS ============ */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-20">
          <RowHead
            title={<T en="Featured lawyers" ur="نمایاں وکیل" />}
            href="/lawyers"
            linkEn="View All"
            linkUr="سب دیکھیں"
          />
          <div className="mx-auto max-w-4xl border-b border-ink-900/10 sm:space-y-5 sm:border-b-0">
            {featured.map((l) => (
              <LawyerCard key={l.slug} lawyer={l} />
            ))}
          </div>
        </section>
      )}

      {/* ============ HOW IT WORKS ============ */}
      <section className="mt-14 bg-paper-dark/60 py-14 sm:mt-20 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
              <T en="Book in 3 easy steps" ur="صرف ۳ آسان مراحل میں بک کریں" />
            </h2>
            <p className="mt-2 text-[1.05rem] text-ink-600">
              <T en="So simple, anyone can do it — no account, no passwords." ur="اتنا آسان کہ کوئی بھی کر لے — نہ اکاؤنٹ، نہ پاس ورڈ۔" />
            </p>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-ink-900/10">
                <p className="flex h-12 w-12 items-center justify-center rounded-full bg-court-700 font-display text-[1.4rem] font-semibold text-white">
                  {s.n}
                </p>
                <p className="mt-5 text-[1.25rem] font-bold text-ink-950">
                  <T en={s.en} ur={s.ur} />
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-600">
                  <T en={s.enSub} ur={s.urSub} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHY WAKEELCONNECT ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
            <T en="Why WakeelConnect?" ur="WakeelConnect کیوں؟" />
          </h2>
          <p className="mt-2 text-[1.05rem] text-ink-600">
            <T en="Built for Pakistan — simple, honest, and in your language." ur="پاکستان کے لیے بنا — آسان، ایماندار، اور آپ کی زبان میں۔" />
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_WAKEEL.map((w) => (
            <div key={w.en} className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
              <p className="flex h-11 w-11 items-center justify-center rounded-full bg-brass-100 text-brass-700">
                <CheckBadgeIcon className="h-6 w-6" />
              </p>
              <p className="mt-4 text-[1.2rem] font-bold text-ink-950">
                <T en={w.en} ur={w.ur} />
              </p>
              <p className="mt-2 text-[1rem] leading-relaxed text-ink-600">
                <T en={w.enSub} ur={w.urSub} />
              </p>
            </div>
          ))}
          <Link
            href="/guides"
            className="group flex flex-col justify-between rounded-2xl bg-court-800 p-6 shadow-card transition hover:bg-court-900"
          >
            <div>
              <p className="text-[1.2rem] font-bold text-white">
                <T en="Still unsure?" ur="ابھی بھی سوچ رہے ہیں؟" />
              </p>
              <p className="mt-2 text-[1rem] leading-relaxed text-court-100">
                <T en="Read our free legal guides first — know your rights." ur="پہلے ہماری مفت قانونی رہنمائی پڑھیں — اپنے حقوق جانیں۔" />
              </p>
            </div>
            <span className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-[1.02rem] font-bold text-brass-300 transition group-hover:gap-3">
              <T en="Browse guides" ur="گائیڈز دیکھیں" />
              <ArrowIcon className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ============ TOP CITIES ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:pb-20">
        <RowHead
          title={<T en="Find lawyers in your city" ur="اپنے شہر میں وکیل تلاش کریں" />}
          href="/cities"
          linkEn="View All"
          linkUr="سب دیکھیں"
        />
        <div className="flex flex-wrap gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink-900/15 bg-white px-6 text-[1.05rem] font-semibold text-ink-800 shadow-sm transition hover:border-court-700 hover:text-court-800"
            >
              <PinIcon className="h-5 w-5 text-court-700" />
              <T en={c.nameEn} ur={c.nameUr} />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ STATS BAND ============ */}
      <StatsBand lawyerCount={lawyerCount} />

      {/* ============ TOP COURTS ============ */}
      <section className="bg-paper-dark/60 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <RowHead
            title={<T en="Lawyers by court" ur="عدالت کے حساب سے وکیل" />}
            href="/lawyers"
            linkEn="View All"
            linkUr="سب دیکھیں"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {COURTS.map((c) => {
              const city = getCity(c.citySlug);
              return (
                <Link
                  key={c.slug}
                  href={city ? `/cities/${city.slug}` : "/lawyers"}
                  className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift"
                >
                  <div className="relative h-40 overflow-hidden">
                    <SafeImage
                      src={c.image}
                      alt={c.nameEn}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      fallback={
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-court-900 text-white">
                          <BriefcaseIcon className="h-10 w-10 text-brass-300" />
                        </div>
                      }
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[1.12rem] font-bold leading-snug text-ink-950 transition group-hover:text-court-800">
                      <T en={c.nameEn} ur={c.nameUr} />
                    </p>
                    {city && (
                      <p className="mt-1 text-[0.95rem] font-medium text-ink-600">
                        <T en={city.nameEn} ur={city.nameUr} />
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="mt-5 text-center text-[0.85rem] text-ink-500">
            <T en="Court photos: Wikimedia Commons contributors (CC BY-SA)" ur="عدالتوں کی تصاویر: ویکیمیڈیا کامنز (CC BY-SA)" />
          </p>
        </div>
      </section>

      {/* ============ LEGAL GUIDES ============ */}
      <section className="border-y border-ink-900/10 bg-paper-dark/60 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <RowHead
            title={<T en="Free legal guides" ur="مفت قانونی رہنمائی" />}
            href="/guides"
            linkEn="View All"
            linkUr="سب دیکھیں"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {GUIDES.map((g) => (
              <Link key={g.slug} href={g.slug} className="group rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift">
                <p className="wc-kicker"><T en="Guide" ur="رہنمائی" /></p>
                <p className="mt-2 text-[1.3rem] font-bold leading-snug text-ink-950 transition group-hover:text-court-800">
                  <T en={g.titleEn} ur={g.titleUr} />
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-600">
                  <T en={g.excerptEn} ur={g.excerptUr} />
                </p>
                <span className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[1rem] font-bold text-court-700 transition group-hover:gap-3">
                  <T en="Read guide" ur="گائیڈ پڑھیں" />
                  <ArrowIcon className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-[1.7rem] font-semibold text-ink-950 sm:text-[2rem]">
              <T en="Questions? Answers." ur="سوالات؟ جوابات۔" />
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ============ NOT SURE WHERE TO START — callback strip ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] bg-white px-6 py-10 text-center shadow-card ring-1 ring-ink-900/10 sm:py-12">
          <h2 className="font-display text-[1.6rem] font-semibold leading-snug text-ink-950 sm:text-[2rem]">
            <T en="Not sure where to start?" ur="سمجھ نہیں آ رہا کہاں سے شروع کریں؟" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[1.05rem] leading-relaxed text-ink-600">
            <T
              en="Describe your problem in your own words — our team will call you back within 24 hours and match you with the right reviewed lawyer."
              ur="اپنا مسئلہ اپنے الفاظ میں لکھیں — ہماری ٹیم ۲۴ گھنٹوں کے اندر آپ کو کال کرے گی اور آپ کے لیے صحیح جانچی ہوئی وکیل تلاش کرے گی۔"
            />
          </p>
          <div className="mt-7">
            <PrimaryBtn href="/callback" icon={<ChatIcon className="h-6 w-6" />}>
              <T en="Request a callback" ur="کال بیک کی درخواست" />
            </PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ============ JOIN CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-court-900 px-6 py-14 text-center shadow-lift sm:px-14 sm:py-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brass-500/20 blur-3xl" aria-hidden />
          <p className="wc-kicker !text-brass-300">
            <T en="For lawyers" ur="وکیلوں کے لیے" />
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            <T en="Are you a lawyer? Get verified clients." ur="کیا آپ وکیل ہیں؟ تصدیق شدہ کلائنٹ حاصل کریں۔" />
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.08rem] leading-relaxed text-court-100">
            <T
              en="Join WakeelConnect — our team reviews every profile before it goes public."
              ur="WakeelConnect سے جڑیں — ہماری ٹیم ہر پروفائل کا عوامی ہونے سے پہلے جائزہ لیتی ہے۔"
            />
          </p>
          <div className="mt-9">
            <PrimaryBtn href="/join" icon={<BriefcaseIcon className="h-6 w-6" />}>
              <T en="Join as Lawyer — it's free" ur="وکیل بنیں — بالکل مفت" />
            </PrimaryBtn>
          </div>
        </div>
      </section>
    </>
  );
}
