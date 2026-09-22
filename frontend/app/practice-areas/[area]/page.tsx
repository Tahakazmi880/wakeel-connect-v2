import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { DemoNotice, PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, BriefcaseIcon } from "@/components/icons";
import { CITIES, getPracticeArea, LAWYERS, PRACTICE_AREAS } from "@/lib/data";

export async function generateStaticParams() {
  return PRACTICE_AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const a = getPracticeArea(area);
  if (!a) return {};
  return {
    title: `${a.nameEn} Lawyers in Pakistan — wakeel.connect`,
    description: `${a.description} Compare verified ${a.nameEn.toLowerCase()} lawyers across Pakistan and book in 3 easy steps.`,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const a = getPracticeArea(area);
  if (!a) notFound();
  const lawyers = LAWYERS.filter((l) => l.practiceAreaSlugs.includes(a.slug));
  const citiesHere = CITIES.filter((c) => lawyers.some((l) => l.citySlug === c.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
        <BriefcaseIcon className="h-4 w-4" /> <T en={a.nameUr} ur={a.nameUr} />
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-5xl">
        <T en={<><span className="text-emerald-700">{a.nameEn}</span> lawyers in Pakistan</>} ur={<>پاکستان میں <span className="text-emerald-700">{a.nameUr}</span> کے وکیل</>} />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        <T
          en={`${a.description} Below are ${lawyers.length} verified lawyers handling ${a.nameEn.toLowerCase()} matters. Compare experience, fees and reviews, then book in 3 easy steps.`}
          ur={`${a.description} نیچے ${lawyers.length} تصدیق شدہ وکیل ہیں جو ${a.nameUr} کے معاملات دیکھتے ہیں۔ تجربہ، فیس اور آراء کا موازنہ کریں، پھر ۳ آسان مراحل میں بک کریں۔`}
        />
      </p>

      <div className="mx-auto mt-6 max-w-3xl"><DemoNotice /></div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
      </div>

      {citiesHere.length > 0 && (
        <section className="mt-14">
          <SectionHead eyebrowUr="شہر" title={<T en={`Find ${a.nameEn.toLowerCase()} lawyers by city`} ur={`شہر کے حساب سے ${a.nameUr} کے وکیل`} />} />
          <div className="flex flex-wrap justify-center gap-3">
            {citiesHere.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/${a.slug}`}
                className="inline-flex min-h-[52px] items-center rounded-full border-2 border-emerald-200 bg-white px-6 text-lg font-bold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-700 hover:text-white">
                <T en={c.nameEn} ur={c.nameUr} />
              </Link>
            ))}
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
