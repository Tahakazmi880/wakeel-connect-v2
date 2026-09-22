"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
import { ArrowIcon, ClockIcon, DocIcon } from "@/components/icons";
import { GUIDE_CATEGORIES, guidesByCategory } from "@/lib/guides";

const CAT_STYLES: Record<string, string> = {
  Family: "bg-rose-100 text-rose-800",
  Criminal: "bg-red-100 text-red-800",
  Property: "bg-amber-100 text-amber-800",
  Digital: "bg-sky-100 text-sky-800",
};

export default function GuidesList() {
  const params = useSearchParams();
  const active = (params.get("cat") ?? "all").toLowerCase();
  const guides = guidesByCategory(active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead
        eyebrowUr="قانونی رہنمائی"
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
              ? "bg-emerald-700 text-white shadow"
              : "border-2 border-emerald-700 bg-white text-emerald-800 hover:bg-emerald-50"
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
                  ? "bg-emerald-700 text-white shadow"
                  : "border-2 border-emerald-700 bg-white text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <T en={c.en} ur={c.ur} />
            </Link>
          );
        })}
      </div>

      {guides.length === 0 ? (
        <p className="text-center text-lg text-slate-500">
          <T en="No guides in this category yet." ur="اس زمرے میں ابھی کوئی مضمون نہیں۔" />
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <DocIcon className="h-6 w-6 text-emerald-700" />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${CAT_STYLES[g.categoryEn] ?? "bg-slate-100 text-slate-700"}`}
                >
                  <T en={g.categoryEn} ur={g.categoryUr} />
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800">
                <T en={g.titleEn} ur={g.titleUr} />
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-base text-slate-600">
                <T en={g.excerptEn} ur={g.excerptUr} />
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                  <ClockIcon className="h-4 w-4" />
                  <T en={`${g.readMinutes} min read`} ur={`${g.readMinutes} منٹ`} />
                </span>
                <span className="inline-flex items-center gap-1 text-base font-bold text-emerald-700">
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
