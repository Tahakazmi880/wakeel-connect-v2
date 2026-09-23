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
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-base text-slate-500">
        <Link href="/" className="font-semibold text-emerald-700 hover:underline">
          wakeel.connect
        </Link>
        <span aria-hidden>/</span>
        <Link href="/guides" className="font-semibold text-emerald-700 hover:underline">
          <T en="Guides" ur="رہنمائی" />
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate font-medium text-slate-700">
          <T en={guide.titleEn} ur={guide.titleUr} />
        </span>
      </nav>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <DocIcon className="h-7 w-7 text-emerald-700" />
          </span>
          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <T en={guide.categoryEn} ur={guide.categoryUr} />
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <ClockIcon className="h-4 w-4" />
            <T en={`${guide.readMinutes} min read`} ur={`${guide.readMinutes} منٹ`} />
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          <T en={guide.titleEn} ur={guide.titleUr} />
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          <T en={guide.excerptEn} ur={guide.excerptUr} />
        </p>

        {/* Disclaimer */}
        <div className="my-8 flex gap-3 rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-200">
          <ShieldIcon className="h-7 w-7 shrink-0 text-sky-700" />
          <p className="text-base font-medium text-sky-900">
            <T en={GUIDE_DISCLAIMER_EN} ur={GUIDE_DISCLAIMER_UR} />
          </p>
        </div>

        <GuideBody guide={guide} />
      </article>

      {/* Consult a lawyer */}
      <section className="mt-12">
        <h2 className="mb-2 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
          <T en="Consult a lawyer for this" ur="اس معاملے میں وکیل سے مشورہ کریں" />
        </h2>
        <p className="mb-6 text-center text-lg text-slate-600">
          <T
            en="These lawyers handle cases like the one in this guide."
            ur="یہ وکیل اس مضمون جیسے معاملات دیکھتے ہیں۔"
          />
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
      </section>

      {/* Prev / next */}
      <nav className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/guides/${prev.slug}`}
          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-bold text-slate-500">
            <T en="← Previous guide" ur="→ پچھلا مضمون" />
          </p>
          <p className="mt-1 text-lg font-extrabold text-slate-900 group-hover:text-emerald-800">
            <T en={prev.titleEn} ur={prev.titleUr} />
          </p>
        </Link>
        <Link
          href={`/guides/${next.slug}`}
          className="group rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-sm font-bold text-slate-500">
            <T en="Next guide →" ur="← اگلا مضمون" />
          </p>
          <p className="mt-1 text-lg font-extrabold text-slate-900 group-hover:text-emerald-800">
            <T en={next.titleEn} ur={next.titleUr} />
          </p>
        </Link>
      </nav>

      <div className="mt-8 text-center">
        <Link
          href="/guides"
          className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white px-6 text-lg font-bold text-emerald-800 transition hover:bg-emerald-50"
        >
          <T en="All guides" ur="تمام مضامین" />
          <ArrowIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
