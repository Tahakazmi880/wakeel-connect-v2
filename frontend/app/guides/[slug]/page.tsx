import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import GuideBody from "@/components/GuideBody";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, ClockIcon, DocIcon, ShieldIcon } from "@/components/icons";
import { getGuide, GUIDES, GUIDE_DISCLAIMER_EN, GUIDE_DISCLAIMER_UR } from "@/lib/guides";
import { API_V1, type LawyerSummary } from "@/lib/api";

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: `${g.titleEn} — wakeel.connect`,
    description: g.excerptEn,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const idx = GUIDES.findIndex((g) => g.slug === slug);
  const prev = GUIDES[(idx - 1 + GUIDES.length) % GUIDES.length];
  const next = GUIDES[(idx + 1) % GUIDES.length];

  const related = await (async (): Promise<LawyerSummary[]> => {
    try {
      const res = await fetch(`${API_V1}/lawyers?area=${guide.relatedAreaSlugs[0]}&limit=3`, { next: { revalidate: 60 } });
      if (!res.ok) return [];
      const data = await res.json();
      return data?.ok ? (data.lawyers ?? []) : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-base text-ink-500">
        <Link href="/" className="font-semibold text-court-700 hover:underline">
          wakeel.connect
        </Link>
        <span aria-hidden>/</span>
        <Link href="/guides" className="font-semibold text-court-700 hover:underline">
          <T en="Guides" ur="رہنمائی" />
        </Link>
        <span aria-hidden>/</span>
        <span className="min-w-0 max-w-full truncate font-medium text-ink-700">
          <T en={guide.titleEn} ur={guide.titleUr} />
        </span>
      </nav>

      <article className="rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-court-50 px-4 py-1.5 text-sm font-bold text-court-800 ring-1 ring-court-700/20">
            <T en={guide.categoryEn} ur={guide.categoryUr} />
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500">
            <ClockIcon className="h-4 w-4" />
            <T en={`${guide.readMinutes} min read`} ur={`${guide.readMinutes} منٹ`} />
          </span>
        </div>

        <h1 className="font-display text-[2rem] font-semibold leading-tight text-ink-950 sm:text-4xl">
          <T en={guide.titleEn} ur={guide.titleUr} />
        </h1>
        <span aria-hidden className="mt-5 block h-[3px] w-12 bg-brass-500" />
        <p className="mt-4 text-[1.1rem] text-ink-600">
          <T en={guide.excerptEn} ur={guide.excerptUr} />
        </p>

        {/* Disclaimer */}
        <div className="my-8 flex gap-3 rounded-lg bg-brass-50 p-5 ring-1 ring-brass-200">
          <ShieldIcon className="h-7 w-7 shrink-0 text-brass-600" />
          <p className="text-base font-medium text-brass-800">
            <T en={GUIDE_DISCLAIMER_EN} ur={GUIDE_DISCLAIMER_UR} />
          </p>
        </div>

        <GuideBody guide={guide} />
      </article>

      {/* Consult a lawyer */}
      <section className="mt-12">
        <h2 className="mb-2 text-center font-display text-[1.8rem] font-semibold text-ink-950">
          <T en="Consult a lawyer for this" ur="اس معاملے میں وکیل سے مشورہ کریں" />
        </h2>
        <p className="mb-6 text-center text-[1.05rem] text-ink-600">
          <T
            en="These lawyers handle cases like the one in this guide."
            ur="یہ وکیل اس مضمون جیسے معاملات دیکھتے ہیں۔"
          />
        </p>
        <div className="mx-auto mt-6 max-w-4xl border-b border-ink-900/10 sm:space-y-5 sm:border-b-0">
          {related.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
      </section>

      {/* Prev / next */}
      <nav className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/guides/${prev.slug}`}
          className="group rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm transition hover:border-court-300 hover:shadow-md"
        >
          <p className="text-sm font-bold text-ink-500">
            <T en="← Previous guide" ur="→ پچھلا مضمون" />
          </p>
          <p className="mt-1 font-display text-[1.25rem] font-semibold text-ink-950 transition group-hover:text-court-800">
            <T en={prev.titleEn} ur={prev.titleUr} />
          </p>
        </Link>
        <Link
          href={`/guides/${next.slug}`}
          className="group rounded-lg border border-ink-900/10 bg-white p-5 text-right shadow-sm transition hover:border-court-300 hover:shadow-md"
        >
          <p className="text-sm font-bold text-ink-500">
            <T en="Next guide →" ur="← اگلا مضمون" />
          </p>
          <p className="mt-1 font-display text-[1.25rem] font-semibold text-ink-950 transition group-hover:text-court-800">
            <T en={next.titleEn} ur={next.titleUr} />
          </p>
        </Link>
      </nav>

      <div className="mt-8 text-center">
        <Link
          href="/guides"
          className="inline-flex min-h-[52px] items-center gap-2 rounded-lg border-2 border-court-700 bg-white px-6 text-lg font-bold text-court-800 transition hover:bg-court-50"
        >
          <T en="All guides" ur="تمام مضامین" />
          <ArrowIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
