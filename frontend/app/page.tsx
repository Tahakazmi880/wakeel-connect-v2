import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { DemoNotice, PrimaryBtn, SectionHead, Stars } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import SearchHero from "@/components/SearchHero";
import StatsBand from "@/components/StatsBand";
import FaqAccordion from "@/components/FaqAccordion";
import {
  ArrowIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatIcon,
  CheckBadgeIcon,
  DocIcon,
  OfficeIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
  VideoIcon,
  WalletIcon,
} from "@/components/icons";
import { CITIES, COURTS, LAWYERS, PRACTICE_AREAS, countByCourt, getCity } from "@/lib/data";

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

const WHY_WAKEEL = [
  {
    icon: <ShieldIcon className="h-9 w-9" />,
    en: "Verified lawyers",
    ur: "تصدیق شدہ وکیل",
    enSub: "Our team checks every Bar Council enrolment before a profile goes public.",
    urSub: "پروفائل عوامی ہونے سے پہلے ہماری ٹیم ہر بار کونسل اندراج چیک کرتی ہے۔",
  },
  {
    icon: <WalletIcon className="h-9 w-9" />,
    en: "Transparent fees",
    ur: "واضح فیس",
    enSub: "The consultation fee is shown on the profile — before you book, not after.",
    urSub: "مشاورت کی فیس پروفائل پر لکھی ہوتی ہے — بکنگ سے پہلے، بعد میں نہیں۔",
  },
  {
    icon: <CalendarIcon className="h-9 w-9" />,
    en: "3-step booking",
    ur: "صرف ۳ مراحل",
    enSub: "Choose, pick a time, enter your phone number. No accounts, no passwords.",
    urSub: "وکیل چنیں، وقت منتخب کریں، فون نمبر لکھیں۔ نہ اکاؤنٹ، نہ پاس ورڈ۔",
  },
  {
    icon: <ChatIcon className="h-9 w-9" />,
    en: "Urdu support",
    ur: "اردو سپورٹ",
    enSub: "Talk to your lawyer in Urdu. Profiles show which languages each lawyer speaks.",
    urSub: "اپنے وکیل سے اردو میں بات کریں۔ ہر پروفائل پر زبان لکھی ہوتی ہے۔",
  },
  {
    icon: <PhoneIcon className="h-9 w-9" />,
    en: "Your number stays private",
    ur: "آپ کا نمبر پرائیویٹ",
    enSub: "Your phone number is shared only with the lawyer you book — never shown publicly.",
    urSub: "آپ کا نمبر صرف اس وکیل کو ملتا ہے جسے آپ بک کریں — عوامی کبھی نہیں۔",
  },
];

const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    cityEn: "Lahore",
    cityUr: "لاہور",
    quoteEn: "I was scared to go to court for my khula case. The wakeel explained everything in Urdu, and the fee was clear from day one.",
    quoteUr: "خلع کے کیس میں عدالت جانے سے ڈرتی تھی۔ وکیل نے سب کچھ اردو میں سمجھایا، اور فیس پہلے دن سے واضح تھی۔",
  },
  {
    name: "Rashid M.",
    cityEn: "Karachi",
    cityUr: "کراچی",
    quoteEn: "A property dispute was eating my savings. I booked a chamber visit in three minutes and walked out with a real plan.",
    quoteUr: "جائیداد کا جھگڑا میری بچت کھا رہا تھا۔ تین منٹ میں چیمبر ملاقات بک کی، اور واضح پلان لے کر نکلا۔",
  },
  {
    name: "Fatima N.",
    cityEn: "Islamabad",
    cityUr: "اسلام آباد",
    quoteEn: "The video call saved me a two-hour trip across the city. Simple, respectful, and worth every rupee.",
    quoteUr: "ویڈیو کال نے میری شہر بھر کی دو گھنٹے کی آمدورفت بچا لی۔ آسان، با ادب، اور ہر روپے کے قابل۔",
  },
  {
    name: "Imran S.",
    cityEn: "Multan",
    cityUr: "ملتان",
    quoteEn: "I needed to file an FIR and had no idea where to start. My wakeel guided me step by step, in my own language.",
    quoteUr: "مجھے ایف آئی آر درج کرانی تھی اور سمجھ نہیں آ رہا تھا۔ میرے وکیل نے قدم بہ قدم رہنمائی کی، میری اپنی زبان میں۔",
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

export default function Home() {
  const featured = LAWYERS.slice(0, 4);
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="wc-hero-pattern relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-700">
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

      {/* ============ STATS BAND ============ */}
      <StatsBand />

      {/* ============ WHY WAKEEL.CONNECT ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="اعتماد"
          title={<T en="Why wakeel.connect?" ur="wakeel.connect کیوں؟" />}
          sub={<T en="Built for Pakistan — simple, honest, and in your language." ur="پاکستان کے لیے بنا — آسان، ایماندار، اور آپ کی زبان میں۔" />}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {WHY_WAKEEL.map((w) => (
            <div key={w.en} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                {w.icon}
              </span>
              <p className="mt-4 text-lg font-extrabold text-slate-900"><T en={w.en} ur={w.ur} /></p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600"><T en={w.enSub} ur={w.urSub} /></p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TOP COURTS ============ */}
      <section className="bg-emerald-50/70 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowUr="عدالتیں"
            title={<T en="Lawyers by high court" ur="ہائی کورٹ کے حساب سے وکیل" />}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COURTS.map((c) => {
              const city = getCity(c.citySlug);
              return (
                <Link
                  key={c.slug}
                  href={`/lawyers?court=${c.slug}`}
                  className="group flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <BriefcaseIcon className="h-7 w-7" />
                  </span>
                  <p className="mt-4 text-lg font-extrabold text-slate-900 group-hover:text-emerald-800">
                    <T en={c.nameEn} ur={c.nameUr} />
                  </p>
                  {city && (
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-500">
                      <PinIcon className="h-4 w-4" />
                      <T en={city.nameEn} ur={city.nameUr} />
                    </p>
                  )}
                  <p className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-emerald-50 px-4 text-sm font-extrabold text-emerald-800">
                    <T en={`${countByCourt(c.slug)} lawyers`} ur={`${countByCourt(c.slug)} وکیل`} />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="آراء"
          title={<T en="What clients say" ur="کلائنٹ کیا کہتے ہیں" />}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 ring-1 ring-amber-200">
                <T en="Sample" ur="نمونہ" />
              </span>
              <Stars rating={5.0} />
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-slate-700">
                "<T en={t.quoteEn} ur={t.quoteUr} />"
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-4">
                <p className="font-extrabold text-slate-900">{t.name}</p>
                <p className="text-sm font-bold text-emerald-700"><T en={t.cityEn} ur={t.cityUr} /></p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-medium text-slate-500">
          <T
            en="Sample testimonials — real client reviews will appear here."
            ur="یہ نمونے کی آراء ہیں — حقیقی کلائنٹ کی آراء یہاں آئیں گی۔"
          />
        </p>
      </section>

      {/* ============ LEGAL GUIDES TEASER ============ */}
      <section className="bg-white py-14 ring-1 ring-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowUr="رہنمائی"
            title={<T en="Free legal guides" ur="مفت قانونی رہنمائی" />}
            sub={<T en="Know your rights before you need a wakeel." ur="وکیل کی ضرورت سے پہلے اپنے حقوق جانیں۔" />}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={g.slug}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <DocIcon className="h-7 w-7" />
                </span>
                <p className="mt-4 text-xl font-extrabold text-slate-900 group-hover:text-emerald-800">
                  <T en={g.titleEn} ur={g.titleUr} />
                </p>
                <p className="mt-2 flex-1 text-base leading-relaxed text-slate-600">
                  <T en={g.excerptEn} ur={g.excerptUr} />
                </p>
                <span className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-lg font-extrabold text-emerald-700 group-hover:gap-2">
                  <T en="Read guide →" ur="گائیڈ پڑھیں →" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHead
          eyebrowUr="سوالات"
          title={<T en="Questions? Answers." ur="سوالات؟ جوابات۔" />}
        />
        <FaqAccordion />
      </section>

      {/* ============ JOIN CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="wc-hero-pattern overflow-hidden rounded-[2rem] bg-linear-to-br from-emerald-800 to-emerald-600 p-10 text-center shadow-xl sm:p-14">
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
