import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { DemoNotice, PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import SeoArticle from "@/components/SeoArticle";
import { ArrowIcon, CalendarIcon, CheckBadgeIcon, PhoneIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import {
  CITIES,
  countByCityArea,
  getCity,
  getPracticeArea,
  LAWYERS,
  PRACTICE_AREAS,
} from "@/lib/data";

export async function generateStaticParams() {
  const params: { city: string; "practice-area": string }[] = [];
  for (const c of CITIES)
    for (const a of PRACTICE_AREAS)
      if (countByCityArea(c.slug, a.slug) > 0) params.push({ city: c.slug, "practice-area": a.slug });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; "practice-area": string }> }): Promise<Metadata> {
  const { city, "practice-area": area } = await params;
  const c = getCity(city);
  const a = getPracticeArea(area);
  if (!c || !a) return {};
  return {
    title: `Best ${a.nameEn} Lawyers in ${c.nameEn} — wakeel.connect`,
    description: `Compare verified ${a.nameEn.toLowerCase()} lawyers in ${c.nameEn}. Transparent fees, real reviews, 3-step booking on wakeel.connect.`,
  };
}

export default async function CityAreaPage({ params }: { params: Promise<{ city: string; "practice-area": string }> }) {
  const { city, "practice-area": areaSlug } = await params;
  const c = getCity(city);
  const a = getPracticeArea(areaSlug);
  if (!c || !a) notFound();
  const lawyers = LAWYERS.filter((l) => l.citySlug === c.slug && l.practiceAreaSlugs.includes(a.slug));
  if (lawyers.length === 0) notFound();

  const otherAreas = PRACTICE_AREAS.filter(
    (x) => x.slug !== a.slug && countByCityArea(c.slug, x.slug) > 0
  ).slice(0, 6);
  const otherCities = CITIES.filter(
    (x) => x.slug !== c.slug && countByCityArea(x.slug, a.slug) > 0
  ).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-base text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">wakeel.connect</Link>
        {" / "}
        <Link href={`/cities/${c.slug}`} className="hover:text-emerald-700"><T en={c.nameEn} ur={c.nameUr} /></Link>
        {" / "}
        <span className="font-bold text-slate-800"><T en={a.nameEn} ur={a.nameUr} /></span>
      </nav>

      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">
        <T
          en={<>Best <span className="text-emerald-700">{a.nameEn}</span> lawyers in <span className="text-emerald-700">{c.nameEn}</span></>}
          ur={<><span className="text-emerald-700">{c.nameUr}</span> میں <span className="text-emerald-700">{a.nameUr}</span> کے بہترین وکیل</>}
        />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        <T
          en={`${lawyers.length} verified ${a.nameEn.toLowerCase()} ${lawyers.length === 1 ? "lawyer" : "lawyers"} practising in ${c.nameEn}. ${a.description} Compare profiles below — experience, fees in PKR and verified client reviews — then book a video consultation or chamber visit in 3 easy steps.`}
          ur={`${c.nameUr} میں ${a.nameUr} کے ${lawyers.length} تصدیق شدہ وکیل۔ ${a.description} نیچے پروفائلز کا موازنہ کریں — تجربہ، فیس اور تصدیق شدہ آراء — پھر ۳ آسان مراحل میں بک کریں۔`}
        />
      </p>

      {/* trust strip */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: <ShieldIcon className="h-6 w-6" />, en: "Bar Council verified", ur: "بار کونسل تصدیق شدہ" },
          { icon: <CalendarIcon className="h-6 w-6" />, en: "Book in 3 easy steps", ur: "۳ آسان مراحل میں بکنگ" },
          { icon: <PhoneIcon className="h-6 w-6" />, en: "Phone-number login only", ur: "صرف فون نمبر سے لاگ اِن" },
        ].map((t) => (
          <div key={t.en} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">{t.icon}</span>
            <span className="text-base font-extrabold text-slate-800"><T en={t.en} ur={t.ur} /></span>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-3xl"><DemoNotice /></div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
      </div>

      <SeoArticle area={a} citySlug={c.slug} />

      {/* How booking works — tiny */}
      <section className="mt-14 rounded-3xl bg-emerald-50 p-8 ring-1 ring-emerald-100">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          <T en="How booking works" ur="بکنگ کیسے ہوتی ہے" />
        </h2>
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: <SearchIcon className="h-7 w-7" />, en: "1. Choose your wakeel", ur: "۱۔ وکیل چنیں" },
            { icon: <CalendarIcon className="h-7 w-7" />, en: "2. Pick a time", ur: "۲۔ وقت منتخب کریں" },
            { icon: <PhoneIcon className="h-7 w-7" />, en: "3. Enter phone — done", ur: "۳۔ فون نمبر — ہو گیا" },
          ].map((s) => (
            <div key={s.en} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">{s.icon}</span>
              <span className="text-base font-extrabold text-slate-800"><T en={s.en} ur={s.ur} /></span>
            </div>
          ))}
        </div>
      </section>

      {/* internal links */}
      {(otherAreas.length > 0 || otherCities.length > 0) && (
        <section className="mt-14">
          <SectionHead eyebrowUr="مزید دیکھیں" title={<T en="Keep exploring" ur="مزید دیکھیں" />} />
          <div className="grid gap-8 md:grid-cols-2">
            {otherAreas.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-extrabold text-slate-900">
                  <T en={`More in ${c.nameEn}`} ur={`${c.nameUr} میں مزید`} />
                </h3>
                <ul className="space-y-2">
                  {otherAreas.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/${c.slug}/${x.slug}`} className="inline-flex min-h-[48px] items-center gap-2 text-lg font-bold text-emerald-800 hover:underline">
                        <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
                        <T en={`${x.nameEn} lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں ${x.nameUr} کے وکیل`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {otherCities.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-extrabold text-slate-900">
                  <T en={`${a.nameEn} elsewhere`} ur={`${a.nameUr} دیگر شہروں میں`} />
                </h3>
                <ul className="space-y-2">
                  {otherCities.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/${x.slug}/${a.slug}`} className="inline-flex min-h-[48px] items-center gap-2 text-lg font-bold text-emerald-800 hover:underline">
                        <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
                        <T en={`${a.nameEn} lawyers in ${x.nameEn}`} ur={`${x.nameUr} میں ${a.nameUr} کے وکیل`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mt-14 text-center">
        <PrimaryBtn href="/lawyers" icon={<ArrowIcon className="h-6 w-6" />}>
          <T en="Browse all lawyers" ur="تمام وکیل دیکھیں" />
        </PrimaryBtn>
      </div>
    </div>
  );
}
