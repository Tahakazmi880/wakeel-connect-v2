"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
import { ArrowIcon, ClockIcon, DocIcon } from "@/components/icons";
import { GUIDE_CATEGORIES, guidesByCategory } from "@/lib/guides";

const CAT_STYLES: Record<string, string> = {
  Family: "bg-brass-50 text-brass-700 ring-1 ring-brass-200",
  Criminal: "bg-clay-50 text-clay-700 ring-1 ring-clay-200",
  Property: "bg-court-50 text-court-800 ring-1 ring-court-700/20",
  Digital: "bg-ink-900/5 text-ink-700 ring-1 ring-ink-900/15",
};

export default function GuidesList() {
  const params = useSearchParams();
  const active = (params.get("cat") ?? "all").toLowerCase();
  const guides = guidesByCategory(active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead
        eyebrowEn="Guides" eyebrowUr="قانونی رہنمائی"
        title={<T en="Legal Guides" ur="قانونی رہنمائی" />}
        sub={
          <T
            en="Simple, plain-language articles about common legal issues in Pakistan."
            ur="پاکستان کے عام قانونی مسائل پر سادہ اور آسان زبان میں مضامین۔"
          />
        }
      />

      {/* Category filter chips */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/guides"
          className={`inline-flex min-h-[48px] items-center rounded-full px-6 text-base font-bold transition ${
            active === "all"
              ? "bg-court-700 text-white shadow"
              : "border-2 border-court-700 bg-white text-court-800 hover:bg-court-50"
          }`}
        >
          <T en="All" ur="تمام" />
        </Link>
        {GUIDE_CATEGORIES.map((c) => {
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={`/guides?cat=${c.slug}`}
              className={`inline-flex min-h-[48px] items-center rounded-full px-6 text-base font-bold transition ${
                isActive
                  ? "bg-court-700 text-white shadow"
                  : "border-2 border-court-700 bg-white text-court-800 hover:bg-court-50"
              }`}
            >
              <T en={c.en} ur={c.ur} />
            </Link>
          );
        })}
      </div>

      {guides.length === 0 ? (
        <p className="text-center text-lg text-ink-500">
          <T en="No guides in this category yet." ur="اس زمرے میں ابھی کوئی مضمون نہیں۔" />
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-lg border border-ink-900/10 bg-white p-6 shadow-card transition hover:border-court-700/40 hover:shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-court-50 ring-1 ring-court-700/20">
                  <DocIcon className="h-6 w-6 text-court-700" />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${CAT_STYLES[g.categoryEn] ?? "bg-ink-100 text-ink-700"}`}
                >
                  <T en={g.categoryEn} ur={g.categoryUr} />
                </span>
              </div>
              <h2 className="font-display text-[1.3rem] font-semibold text-ink-950 transition group-hover:text-court-800">
                <T en={g.titleEn} ur={g.titleUr} />
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-base text-ink-600">
                <T en={g.excerptEn} ur={g.excerptUr} />
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500">
                  <ClockIcon className="h-4 w-4" />
                  <T en={`${g.readMinutes} min read`} ur={`${g.readMinutes} منٹ`} />
                </span>
                <span className="inline-flex items-center gap-1 text-base font-bold text-court-700">
                  <T en="Read" ur="پڑھیں" />
                  <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
