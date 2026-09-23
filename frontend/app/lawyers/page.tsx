import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import FilterBar from "@/components/FilterBar";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import { API_V1, type LawyerSummary } from "@/lib/api";

export const metadata: Metadata = {
  title: "Find a Lawyer — wakeel.connect",
  description: "Browse lawyers in Pakistan. Filter by city, legal problem or name, compare fees and experience, then book in 3 easy steps.",
};

const LIMIT = 24;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

async function fetchLawyers(qs: string): Promise<{ total: number; page: number; lawyers: LawyerSummary[] }> {
  try {
    const res = await fetch(`${API_V1}/lawyers?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return { total: 0, page: 1, lawyers: [] };
    const data = await res.json();
    if (!data?.ok) return { total: 0, page: 1, lawyers: [] };
    return { total: data.total ?? 0, page: data.page ?? 1, lawyers: data.lawyers ?? [] };
  } catch {
    return { total: 0, page: 1, lawyers: [] };
  }
}

function withPage(sp: Record<string, string | string[] | undefined>, page: number): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = pick(v);
    if (val) p.set(k, val);
  }
  p.set("page", String(page));
  return `/lawyers?${p.toString()}`;
}

export default async function LawyersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  const city = pick(sp.city);
  const area = pick(sp.area);
  const query = pick(sp.q);
  const page = Math.max(1, Number(pick(sp.page)) || 1);
  if (city) q.set("city", city);
  if (area) q.set("area", area);
  if (query) q.set("q", query);
  q.set("page", String(page));
  q.set("limit", String(LIMIT));

  const { total, lawyers } = await fetchLawyers(q.toString());
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        <T en="Find a lawyer" ur="وکیل تلاش کریں" />
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        <T en={`${total} ${total === 1 ? "lawyer" : "lawyers"} found`} ur={`${total} وکیل ملے`} />
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      {lawyers.length === 0 ? (
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
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lawyers.map((l) => (
              <LawyerCard key={l.slug} lawyer={l} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
              {page > 1 ? (
                <Link
                  href={withPage(sp, page - 1)}
                  className="inline-flex min-h-[52px] items-center gap-1 rounded-2xl border-2 border-emerald-700 px-6 text-lg font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  <ArrowIcon className="h-5 w-5 rotate-180" />
                  <T en="Previous" ur="پچھلا" />
                </Link>
              ) : (
                <span className="inline-flex min-h-[52px] items-center gap-1 rounded-2xl border-2 border-slate-200 px-6 text-lg font-bold text-slate-300">
                  <ArrowIcon className="h-5 w-5 rotate-180" />
                  <T en="Previous" ur="پچھلا" />
                </span>
              )}
              <span className="text-lg font-extrabold text-slate-700">
                <T en={`Page ${page} of ${totalPages}`} ur={`صفحہ ${page} از ${totalPages}`} />
              </span>
              {page < totalPages ? (
                <Link
                  href={withPage(sp, page + 1)}
                  className="inline-flex min-h-[52px] items-center gap-1 rounded-2xl border-2 border-emerald-700 px-6 text-lg font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  <T en="Next" ur="اگلا" />
                  <ArrowIcon className="h-5 w-5" />
                </Link>
              ) : (
                <span className="inline-flex min-h-[52px] items-center gap-1 rounded-2xl border-2 border-slate-200 px-6 text-lg font-bold text-slate-300">
                  <T en="Next" ur="اگلا" />
                  <ArrowIcon className="h-5 w-5" />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
