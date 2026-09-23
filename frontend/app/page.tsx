import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SectionHead, Stars } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import SearchHero from "@/components/SearchHero";
import StatsBand from "@/components/StatsBand";
import FaqAccordion from "@/components/FaqAccordion";
import {
  ArrowIcon,
  BriefcaseIcon,
  PinIcon,
  ShieldIcon,
} from "@/components/icons";
import { CITIES, COURTS, PRACTICE_AREAS, getCity } from "@/lib/data";
import { API_V1, type LawyerSummary } from "@/lib/api";

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

const SERVICES = [
  { en: "Online Consultation", ur: "آن لائن مشاورت", enSub: "Video call with a wakeel, from anywhere in Pakistan.", urSub: "پاکستان میں کہیں سے بھی وکیل سے ویڈیو کال پر بات کریں۔" },
  { en: "Chamber Meeting", ur: "چیمبر ملاقات", enSub: "Sit down with a lawyer at their office.", urSub: "وکیل کے دفتر میں بالمشافہ ملاقات کریں۔" },
  { en: "Document Drafting", ur: "دستاویز تیاری", enSub: "Agreements, notices and deeds drafted properly.", urSub: "معاہدے، نوٹس اور دستاویزات درست طریقے سے تیار کروائیں۔" },
  { en: "Case Filing", ur: "کیس دائر کرنا", enSub: "File your case in the right court, the right way.", urSub: "اپنا کیس درست عدالت میں درست طریقے سے دائر کریں۔" },
  { en: "Legal Opinion", ur: "قانونی رائے", enSub: "A clear written opinion before you decide.", urSub: "فیصلہ کرنے سے پہلے واضح تحریری قانونی رائے حاصل کریں۔" },
];

const STEPS = [
  { n: "01", en: "Choose your wakeel", ur: "اپنا وکیل چنیں", enSub: "Browse verified profiles by city and legal problem.", urSub: "شہر اور قانونی مسئلے کے حساب سے تصدیق شدہ پروفائلز دیکھیں۔" },
  { n: "02", en: "Pick a time", ur: "وقت منتخب کریں", enSub: "Choose a day and slot that suits you.", urSub: "اپنی سہولت کا دن اور وقت منتخب کریں۔" },
  { n: "03", en: "Confirm by phone", ur: "فون سے تصدیق کریں", enSub: "Enter your number, verify the code — done.", urSub: "نمبر لکھیں، کوڈ سے تصدیق کریں — ہو گیا۔" },
];

const WHY_WAKEEL = [
  {
    en: "Reviewed profiles",
    ur: "جانچی ہوئی پروفائلز",
    enSub: "Every public profile is reviewed by our team before listing.",
    urSub: "عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے۔",
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

/** Small editorial text-link with a brass underline. */
function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[48px] items-center gap-2 border-b-2 border-brass-500 pb-0.5 text-[1.05rem] font-bold text-court-800 transition hover:gap-3 hover:text-court-700"
    >
      {children}
      <ArrowIcon className="h-5 w-5" />
    </Link>
  );
}

export default async function Home() {
  const { lawyers: featured, total: lawyerCount } = await fetchFeatured();
  return (
    <>
      {/* ============ HERO — editorial masthead ============ */}
      <section>
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12">
          <div className="border-y border-ink-900/15 py-2.5 text-center">
            <p className="wc-kicker">
              <T en="The lawyer directory of Pakistan" ur="پاکستان کی وکیل ڈائریکٹری" />
            </p>
          </div>
          <h1 className="mx-auto mt-9 max-w-3xl text-center font-display text-[2.75rem] font-semibold leading-[1.08] text-ink-950 sm:text-6xl">
            <T
              en={<>Pakistan ke <em className="italic text-court-700">wakeel</em>, ab ek click par</>}
              ur={<>پاکستان کے <em className="italic text-court-700">وکیل</em>، اب ایک کلک پر</>}
            />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[1.15rem] leading-relaxed text-ink-600">
            <T
              en="Video call or chamber visit — booked in 3 easy steps. Transparent fees, real reviews."
              ur="ویڈیو کال یا چیمبر ملاقات — صرف ۳ آسان مراحل میں۔ واضح فیس، حقیقی آراء۔"
            />
          </p>
          <SearchHero />
          <dl className="mx-auto mt-9 flex max-w-2xl items-stretch justify-center divide-x divide-ink-900/10 text-center">
            {[
              { v: lawyerCount, en: "lawyers", ur: "وکیل" },
              { v: CITIES.length, en: "cities", ur: "شہر" },
              { v: PRACTICE_AREAS.length, en: "practice areas", ur: "قانونی شعبے" },
            ].map((s) => (
              <div key={s.en} className="flex-1 px-4">
                <dt className="sr-only"><T en={s.en} ur={s.ur} /></dt>
                <dd className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">{s.v}</dd>
                <dd className="mt-1 text-[0.95rem] font-medium text-ink-600"><T en={s.en} ur={s.ur} /></dd>
              </div>
            ))}
          </dl>
          <hr className="wc-hr mt-10" />
        </div>
      </section>

      {/* ============ SERVICES — editorial index ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead
          eyebrowEn="Services"
          eyebrowUr="خدمات"
          title={<T en="What do you need help with?" ur="آپ کو کس میں مدد چاہیے؟" />}
        />
        <div className="max-w-3xl border-b border-ink-900/10">
          {SERVICES.map((s, i) => (
            <Link
              key={s.en}
              href="/lawyers"
              className="group flex items-baseline gap-5 border-t border-ink-900/10 py-5"
            >
              <span className="font-display text-[1.05rem] font-semibold text-brass-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span className="font-display text-[1.35rem] font-semibold text-ink-950 transition group-hover:text-court-800">
                  <T en={s.en} ur={s.ur} />
                </span>
                <span className="mt-0.5 block text-[0.98rem] text-ink-600">
                  <T en={s.enSub} ur={s.urSub} />
                </span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 self-center text-ink-400 transition group-hover:translate-x-1 group-hover:text-court-700" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-paper-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowEn="How it works"
            eyebrowUr="طریقہ کار"
            title={<T en="Book in 3 easy steps" ur="صرف ۳ آسان مراحل میں بک کریں" />}
            sub={<T en="So simple, anyone can do it — no account, no passwords." ur="اتنا آسان کہ کوئی بھی کر لے — نہ اکاؤنٹ، نہ پاس ورڈ۔" />}
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s) => (
              <li key={s.n} className="border-t-2 border-ink-900 pt-6">
                <p className="font-display text-[2.75rem] font-semibold leading-none text-brass-500">{s.n}</p>
                <p className="mt-4 font-display text-[1.4rem] font-semibold text-ink-950">
                  <T en={s.en} ur={s.ur} />
                </p>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-600">
                  <T en={s.enSub} ur={s.urSub} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FEATURED LAWYERS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead
          eyebrowEn="Featured"
          eyebrowUr="نمایاں وکیل"
          title={<T en="Featured lawyers" ur="نمایاں وکیل" />}
        />
        <div className="mx-auto max-w-4xl space-y-5">
          {featured.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <TextLink href="/lawyers">
            <T en="See all lawyers" ur="تمام وکیل دیکھیں" />
          </TextLink>
        </div>
      </section>

      {/* ============ PRACTICE AREAS ============ */}
      <section className="border-y border-ink-900/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowEn="Practice areas"
            eyebrowUr="قانونی شعبے"
            title={<T en="Browse by legal problem" ur="اپنے مسئلے کے حساب سے دیکھیں" />}
          />
          <div className="grid gap-x-14 md:grid-cols-2">
            <div className="border-b border-ink-900/10">
              {PRACTICE_AREAS.slice(0, Math.ceil(PRACTICE_AREAS.length / 2)).map((a) => (
                <Link
                  key={a.slug}
                  href={`/practice-areas/${a.slug}`}
                  className="group flex items-baseline justify-between gap-4 border-t border-ink-900/10 py-4"
                >
                  <span className="font-display text-[1.25rem] font-semibold text-ink-950 transition group-hover:text-court-800">
                    <T en={a.nameEn} ur={a.nameUr} />
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 self-center text-ink-400 transition group-hover:translate-x-1 group-hover:text-court-700" />
                </Link>
              ))}
            </div>
            <div className="border-b border-ink-900/10">
              {PRACTICE_AREAS.slice(Math.ceil(PRACTICE_AREAS.length / 2)).map((a) => (
                <Link
                  key={a.slug}
                  href={`/practice-areas/${a.slug}`}
                  className="group flex items-baseline justify-between gap-4 border-t border-ink-900/10 py-4"
                >
                  <span className="font-display text-[1.25rem] font-semibold text-ink-950 transition group-hover:text-court-800">
                    <T en={a.nameEn} ur={a.nameUr} />
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 self-center text-ink-400 transition group-hover:translate-x-1 group-hover:text-court-700" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOP CITIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead
          eyebrowEn="Cities"
          eyebrowUr="شہر"
          title={<T en="Find lawyers in your city" ur="اپنے شہر میں وکیل تلاش کریں" />}
        />
        <div className="flex flex-wrap gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink-900/20 bg-white px-6 text-[1.05rem] font-semibold text-ink-800 shadow-sm transition hover:border-court-700 hover:text-court-800 hover:shadow-card"
            >
              <PinIcon className="h-5 w-5 text-brass-600" />
              <T en={c.nameEn} ur={c.nameUr} />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ STATS BAND ============ */}
      <StatsBand lawyerCount={lawyerCount} />

      {/* ============ WHY WAKEEL.CONNECT ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead
          eyebrowEn="Why us"
          eyebrowUr="اعتماد"
          title={<T en="Why wakeel.connect?" ur="wakeel.connect کیوں؟" />}
          sub={<T en="Built for Pakistan — simple, honest, and in your language." ur="پاکستان کے لیے بنا — آسان، ایماندار، اور آپ کی زبان میں۔" />}
        />
        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_WAKEEL.map((w, i) => (
            <div key={w.en} className="border-t-2 border-ink-900 pt-5">
              <p className="font-display text-[1.1rem] font-semibold text-brass-600">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-[1.3rem] font-semibold text-ink-950">
                <T en={w.en} ur={w.ur} />
              </p>
              <p className="mt-2 text-[1rem] leading-relaxed text-ink-600">
                <T en={w.enSub} ur={w.urSub} />
              </p>
            </div>
          ))}
          <Link
            href="/guides"
            className="group flex flex-col justify-between border-t-2 border-brass-500 bg-ink-950 p-6 pt-5 transition hover:bg-ink-900"
          >
            <div>
              <p className="font-display text-[1.1rem] font-semibold text-brass-400">→</p>
              <p className="mt-2 font-display text-[1.3rem] font-semibold text-paper">
                <T en="Still unsure?" ur="ابھی بھی سوچ رہے ہیں؟" />
              </p>
              <p className="mt-2 text-[1rem] leading-relaxed text-ink-300">
                <T en="Read our free legal guides first — know your rights." ur="پہلے ہماری مفت قانونی رہنمائی پڑھیں — اپنے حقوق جانیں۔" />
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-[1.02rem] font-bold text-brass-300 transition group-hover:gap-3">
              <T en="Browse guides" ur="گائیڈز دیکھیں" />
              <ArrowIcon className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ============ TOP COURTS ============ */}
      <section className="bg-paper-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowEn="Courts"
            eyebrowUr="عدالتیں"
            title={<T en="Lawyers by court" ur="عدالت کے حساب سے وکیل" />}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURTS.map((c) => {
              const city = getCity(c.citySlug);
              return (
                <Link
                  key={c.slug}
                  href={city ? `/cities/${city.slug}` : "/lawyers"}
                  className="group overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-ink-900/10 transition hover:shadow-lift"
                >
                  {c.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.nameEn}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 flex-col items-center justify-center gap-2 bg-ink-900 text-paper">
                      <BriefcaseIcon className="h-10 w-10 text-brass-400" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="font-display text-[1.2rem] font-semibold leading-snug text-ink-950 transition group-hover:text-court-800">
                      <T en={c.nameEn} ur={c.nameUr} />
                    </p>
                    {city && (
                      <p className="mt-1.5 text-[0.95rem] font-medium text-ink-600">
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

      {/* ============ TESTIMONIALS — pull quotes ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead
          eyebrowEn="Testimonials"
          eyebrowUr="آراء"
          title={<T en="What clients say" ur="کلائنٹ کیا کہتے ہیں" />}
        />
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="border-t-2 border-ink-900 pt-6">
              <span className="font-display text-[3rem] font-semibold leading-none text-brass-500" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="-mt-3 font-display text-[1.3rem] font-medium italic leading-snug text-ink-900">
                <T en={t.quoteEn} ur={t.quoteUr} />
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-brass-500" aria-hidden />
                <span>
                  <span className="block text-[1.02rem] font-bold text-ink-950">{t.name}</span>
                  <span className="block text-[0.95rem] font-medium text-ink-600">
                    <T en={t.cityEn} ur={t.cityUr} /> · <T en="Sample" ur="نمونہ" />
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[0.95rem] text-ink-500">
          <T
            en="Sample testimonials — real client reviews will appear here."
            ur="یہ نمونے کی آراء ہیں — حقیقی کلائنٹ کی آراء یہاں آئیں گی۔"
          />
        </p>
      </section>

      {/* ============ LEGAL GUIDES ============ */}
      <section className="border-y border-ink-900/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead
            eyebrowEn="Guides"
            eyebrowUr="رہنمائی"
            title={<T en="Free legal guides" ur="مفت قانونی رہنمائی" />}
            sub={<T en="Know your rights before you need a wakeel." ur="وکیل کی ضرورت سے پہلے اپنے حقوق جانیں۔" />}
          />
          <div className="max-w-3xl border-b border-ink-900/10">
            {GUIDES.map((g) => (
              <Link key={g.slug} href={g.slug} className="group block border-t border-ink-900/10 py-6">
                <p className="wc-kicker"><T en="Guide" ur="رہنمائی" /></p>
                <p className="mt-2 font-display text-[1.5rem] font-semibold text-ink-950 transition group-hover:text-court-800">
                  <T en={g.titleEn} ur={g.titleUr} />
                </p>
                <p className="mt-1.5 max-w-2xl text-[1.02rem] leading-relaxed text-ink-600">
                  <T en={g.excerptEn} ur={g.excerptUr} />
                </p>
                <span className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-[1.02rem] font-bold text-court-800 transition group-hover:gap-3">
                  <T en="Read guide" ur="گائیڈ پڑھیں" />
                  <ArrowIcon className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            eyebrowEn="FAQ"
            eyebrowUr="سوالات"
            title={<T en="Questions? Answers." ur="سوالات؟ جوابات۔" />}
          />
          <FaqAccordion />
        </div>
      </section>

      {/* ============ JOIN CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="wc-jali-light relative overflow-hidden rounded-xl bg-ink-950 px-6 py-14 text-center shadow-lift sm:px-14 sm:py-16">
          <p className="wc-kicker !text-brass-300">
            <T en="For lawyers" ur="وکیلوں کے لیے" />
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
            <T en="Are you a lawyer? Get verified clients." ur="کیا آپ وکیل ہیں؟ تصدیق شدہ کلائنٹ حاصل کریں۔" />
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.08rem] leading-relaxed text-ink-300">
            <T
              en="Join wakeel.connect — our team verifies every profile before it goes public."
              ur="wakeel.connect سے جڑیں — ہماری ٹیم ہر پروفائل کی تصدیق کرتی ہے۔"
            />
          </p>
          <div className="mt-9">
            <Link
              href="/join"
              className="inline-flex min-h-[56px] items-center gap-2 rounded-lg bg-brass-400 px-8 text-[1.08rem] font-bold text-ink-950 shadow-lift transition hover:bg-brass-300 active:translate-y-px"
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
