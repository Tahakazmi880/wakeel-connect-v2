import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import SeoArticle from "@/components/SeoArticle";
import { ArrowIcon, CalendarIcon, CheckBadgeIcon, PhoneIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import {
  CITIES,
  getCity,
  getPracticeArea,
  PRACTICE_AREAS,
} from "@/lib/data";
import { API_V1, type LawyerSummary } from "@/lib/api";

async function fetchCityAreaLawyers(citySlug: string, areaSlug: string): Promise<LawyerSummary[]> {
  try {
    const res = await fetch(`${API_V1}/lawyers?city=${citySlug}&area=${areaSlug}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    return data.lawyers ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  // Build-time best effort: only pre-render combos that exist in the live API.
  try {
    const res = await fetch(`${API_V1}/lawyers?limit=50`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    const seen = new Set<string>();
    const params: { city: string; "practice-area": string }[] = [];
    for (const l of (data.lawyers ?? []) as LawyerSummary[]) {
      for (const a of l.practiceAreas) {
        const key = `${l.city.slug}/${a.practiceArea.slug}`;
        if (!seen.has(key)) {
          seen.add(key);
          params.push({ city: l.city.slug, "practice-area": a.practiceArea.slug });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string; "practice-area": string }> }): Promise<Metadata> {
  const { city, "practice-area": area } = await params;
  const c = getCity(city);
  const a = getPracticeArea(area);
  if (!c || !a) return {};
  return {
    title: `${a.nameEn} Lawyers in ${c.nameEn} — wakeel.connect`,
    description: `Compare ${a.nameEn.toLowerCase()} lawyers in ${c.nameEn}. Fees in PKR, client reviews, 3-step booking on wakeel.connect.`,
  };
}

export default async function CityAreaPage({ params }: { params: Promise<{ city: string; "practice-area": string }> }) {
  const { city, "practice-area": areaSlug } = await params;
  const c = getCity(city);
  const a = getPracticeArea(areaSlug);
  if (!c || !a) notFound();
  const lawyers = await fetchCityAreaLawyers(c.slug, a.slug);
  if (lawyers.length === 0) notFound();

  const areaSlugs = new Set<string>();
  const citySlugs = new Set<string>();
  for (const l of lawyers) {
    citySlugs.add(l.city.slug);
    for (const x of l.practiceAreas) areaSlugs.add(x.practiceArea.slug);
  }
  // Cross-links: same city + other areas, and same area + other cities — via directory filters.
  const otherAreas = PRACTICE_AREAS.filter((x) => x.slug !== a.slug && areaSlugs.has(x.slug)).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-base text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-court-700">wakeel.connect</Link>
        {" / "}
        <Link href={`/cities/${c.slug}`} className="hover:text-court-700"><T en={c.nameEn} ur={c.nameUr} /></Link>
        {" / "}
        <span className="font-bold text-ink-800"><T en={a.nameEn} ur={a.nameUr} /></span>
      </nav>

      <h1 className="text-3xl font-extrabold text-ink-950 sm:text-5xl">
        <T
          en={<><span className="text-court-700">{a.nameEn}</span> lawyers in <span className="text-court-700">{c.nameEn}</span></>}
          ur={<><span className="text-court-700">{c.nameUr}</span> میں <span className="text-court-700">{a.nameUr}</span> کے وکیل</>}
        />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600">
        <T
          en={`${lawyers.length} ${a.nameEn.toLowerCase()} ${lawyers.length === 1 ? "lawyer" : "lawyers"} practising in ${c.nameEn}. ${a.description} Compare profiles below — experience, fees in PKR and client reviews — then book a video consultation or chamber visit in 3 easy steps.`}
          ur={`${c.nameUr} میں ${a.nameUr} کے ${lawyers.length} وکیل۔ ${a.description} نیچے پروفائلز کا موازنہ کریں — تجربہ، فیس اور آراء — پھر ۳ آسان مراحل میں بک کریں۔`}
        />
      </p>

      {/* trust strip */}
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-ink-900/10 py-4">
        {[
          { icon: <ShieldIcon className="h-5 w-5" />, en: "Reviewed profiles", ur: "جانچی ہوئی پروفائلز" },
          { icon: <CalendarIcon className="h-5 w-5" />, en: "Book in 3 easy steps", ur: "۳ آسان مراحل میں بکنگ" },
          { icon: <PhoneIcon className="h-5 w-5" />, en: "Phone-number login only", ur: "صرف فون نمبر سے لاگ اِن" },
        ].map((t) => (
          <span key={t.en} className="inline-flex items-center gap-2 text-[1rem] font-semibold text-ink-700">
            <span className="text-brass-600">{t.icon}</span>
            <T en={t.en} ur={t.ur} />
          </span>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-4xl space-y-5">
        {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
      </div>

      <SeoArticle area={a} citySlug={c.slug} />

      {/* How booking works */}
      <section className="mt-14">
        <h2 className="text-center font-display text-[1.8rem] font-semibold text-ink-950">
          <T en="How booking works" ur="بکنگ کیسے ہوتی ہے" />
        </h2>
        <span aria-hidden className="mx-auto mt-4 block h-[3px] w-12 bg-brass-500" />
        <ol className="mx-auto mt-8 grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            { n: "1", en: "Choose your wakeel", ur: "وکیل چنیں" },
            { n: "2", en: "Pick a time", ur: "وقت منتخب کریں" },
            { n: "3", en: "Verify phone — done", ur: "فون تصدیق — ہو گیا" },
          ].map((s) => (
            <li key={s.en} className="border-t-2 border-ink-900 pt-4">
              <p className="font-display text-[2rem] font-semibold text-brass-500">{s.n}</p>
              <p className="mt-2 text-[1.05rem] font-bold text-ink-950"><T en={s.en} ur={s.ur} /></p>
            </li>
          ))}
        </ol>
      </section>

      {/* internal links */}
      {otherAreas.length > 0 && (
        <section className="mt-14">
          <SectionHead eyebrowEn="Keep exploring" eyebrowUr="مزید دیکھیں" title={<T en="Keep exploring" ur="مزید دیکھیں" />} />
          <div>
            <h3 className="mb-3 text-xl font-extrabold text-ink-950">
              <T en={`More in ${c.nameEn}`} ur={`${c.nameUr} میں مزید`} />
            </h3>
            <ul className="space-y-2">
              {otherAreas.map((x) => (
                <li key={x.slug}>
                  <Link href={`/lawyers?city=${c.slug}&area=${x.slug}`} className="inline-flex min-h-[48px] items-center gap-2 text-lg font-bold text-court-800 hover:underline">
                    <CheckBadgeIcon className="h-5 w-5 text-court-600" />
                    <T en={`${x.nameEn} lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں ${x.nameUr} کے وکیل`} />
                  </Link>
                </li>
              ))}
            </ul>
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
