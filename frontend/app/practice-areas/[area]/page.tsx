import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SectionHead } from "@/components/ui";
import SeoArticle from "@/components/SeoArticle";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, BriefcaseIcon } from "@/components/icons";
import { CITIES, getPracticeArea, PRACTICE_AREAS } from "@/lib/data";
import { API_V1, type LawyerSummary } from "@/lib/api";

export async function generateStaticParams() {
  return PRACTICE_AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const a = getPracticeArea(area);
  if (!a) return {};
  return {
    title: `${a.nameEn} Lawyers in Pakistan — wakeel.connect`,
    description: `${a.description} Compare ${a.nameEn.toLowerCase()} lawyers across Pakistan and book in 3 easy steps.`,
  };
}

async function fetchAreaLawyers(areaSlug: string): Promise<LawyerSummary[]> {
  try {
    const res = await fetch(`${API_V1}/lawyers?area=${areaSlug}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    return data.lawyers ?? [];
  } catch {
    return [];
  }
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const a = getPracticeArea(area);
  if (!a) notFound();
  const lawyers = await fetchAreaLawyers(a.slug);
  const citySlugs = new Set(lawyers.map((l) => l.city.slug));
  const citiesHere = CITIES.filter((c) => citySlugs.has(c.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="inline-flex items-center gap-2 rounded-full bg-court-100 px-4 py-1.5 text-sm font-bold text-court-800">
        <BriefcaseIcon className="h-4 w-4" /> <T en={a.nameUr} ur={a.nameUr} />
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-ink-950 sm:text-5xl">
        <T en={<><span className="text-court-700">{a.nameEn}</span> lawyers in Pakistan</>} ur={<>پاکستان میں <span className="text-court-700">{a.nameUr}</span> کے وکیل</>} />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600">
        <T
          en={`${a.description} Below are ${lawyers.length} ${lawyers.length === 1 ? "lawyer" : "lawyers"} handling ${a.nameEn.toLowerCase()} matters. Compare experience, fees and reviews, then book in 3 easy steps.`}
          ur={`${a.description} نیچے ${lawyers.length} وکیل ہیں جو ${a.nameUr} کے معاملات دیکھتے ہیں۔ تجربہ، فیس اور آراء کا موازنہ کریں، پھر ۳ آسان مراحل میں بک کریں۔`}
        />
      </p>

      {lawyers.length === 0 ? (
        <p className="mt-8 rounded-xl bg-white p-8 text-center text-lg text-ink-600 ring-1 ring-ink-200">
          <T en="No lawyers listed in this practice area yet — check back soon." ur="اس شعبے میں ابھی کوئی وکیل درج نہیں — جلد دوبارہ دیکھیں۔" />
        </p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
        </div>
      )}

      {citiesHere.length > 0 && (
        <section className="mt-14">
          <SectionHead eyebrowEn="Browse" eyebrowUr="شہر" title={<T en={`Find ${a.nameEn.toLowerCase()} lawyers by city`} ur={`شہر کے حساب سے ${a.nameUr} کے وکیل`} />} />
          <div className="flex flex-wrap justify-center gap-3">
            {citiesHere.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/${a.slug}`}
                className="inline-flex min-h-[52px] items-center rounded-full border-2 border-court-200 bg-white px-6 text-lg font-bold text-court-800 transition hover:border-court-600 hover:bg-court-700 hover:text-white">
                <T en={c.nameEn} ur={c.nameUr} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <SeoArticle area={a} />

      <div className="mt-14 text-center">
        <PrimaryBtn href="/lawyers" icon={<ArrowIcon className="h-6 w-6" />}>
          <T en="Browse all lawyers" ur="تمام وکیل دیکھیں" />
        </PrimaryBtn>
      </div>
    </div>
  );
}
