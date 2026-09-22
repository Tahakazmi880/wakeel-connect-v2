import { Suspense } from "react";
import type { Metadata } from "next";
import { T } from "@/components/LanguageContext";
import { DemoNotice } from "@/components/ui";
import FilterBar from "@/components/FilterBar";
import LawyerCard from "@/components/LawyerCard";
import { SearchIcon } from "@/components/icons";
import { searchLawyers, type LawyerFilter } from "@/lib/data";

export const metadata: Metadata = {
  title: "Find a Lawyer — wakeel.connect",
  description: "Browse verified lawyers in Pakistan. Filter by city, legal problem, fee, experience, gender and language.",
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function LawyersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter: LawyerFilter = {
    city: pick(sp.city),
    area: pick(sp.area),
    court: pick(sp.court),
    q: pick(sp.q),
    availableToday: pick(sp.availableToday) === "1",
    maxFeePaisa: pick(sp.maxFee) ? Number(pick(sp.maxFee)) : undefined,
    minExp: pick(sp.minExp) ? Number(pick(sp.minExp)) : undefined,
    gender: pick(sp.gender) === "male" || pick(sp.gender) === "female" ? (pick(sp.gender) as "male" | "female") : undefined,
    lang: pick(sp.lang),
    sort: (pick(sp.sort) as LawyerFilter["sort"]) ?? "recommended",
  };
  const results = searchLawyers(filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        <T en="Find a lawyer" ur="وکیل تلاش کریں" />
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        <T
          en={`${results.length} verified lawyers found`}
          ur={`${results.length} تصدیق شدہ وکیل ملے`}
        />
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      <div className="mx-auto mt-6 max-w-3xl"><DemoNotice /></div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <SearchIcon className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-xl font-extrabold text-slate-800">
            <T en="No lawyers match your filters" ur="آپ کے فلٹر سے کوئی وکیل نہیں ملا" />
          </p>
          <p className="mt-2 text-base text-slate-500">
            <T en="Try removing a filter or two." ur="کوئی فلٹر ہٹا کر دوبارہ کوشش کریں۔" />
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
      )}
    </div>
  );
}
