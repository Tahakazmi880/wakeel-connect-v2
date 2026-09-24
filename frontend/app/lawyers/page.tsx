import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { FilterSearchPanel } from "@/components/FilterBar";
import FilterChips from "@/components/FilterChips";
import DirectoryResults from "@/components/DirectoryResults";
import { RefineForm } from "@/components/DirectoryFilters";
import { ArrowIcon } from "@/components/icons";
import { API_V1, type LawyerSummary } from "@/lib/api";
import { PRACTICE_AREAS, getCity, getCourt } from "@/lib/data";

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

/**
 * Dynamic H1 — the heading reflects the active filters, e.g.
 * "Lawyers", "Female lawyers in Lahore — Family Law". The live result
 * count is rendered by <DirectoryResults /> (it also reflects the
 * client-side refinements like fee/experience/language/rating).
 */
function DirectoryHeading({ sp }: { sp: Record<string, string | string[] | undefined> }) {
  const female = pick(sp.gender) === "female";
  const city = pick(sp.city) ? getCity(pick(sp.city)!) : undefined;
  const area = pick(sp.area) ? PRACTICE_AREAS.find((a) => a.slug === pick(sp.area)) : undefined;
  const q = pick(sp.q)?.trim();
  const court = pick(sp.court) ? getCourt(pick(sp.court)!) : undefined;

  const en = `${female ? "Female lawyers" : "Lawyers"}${city ? ` in ${city.nameEn}` : ""}${area ? ` — ${area.nameEn}` : ""}${court ? ` — ${court.nameEn}` : ""}${q ? ` for "${q}"` : ""}`;
  const ur = `${city ? `${city.nameUr} میں ` : ""}${female ? "خاتون " : ""}وکیل${area ? ` — ${area.nameUr}` : ""}${court ? ` — ${court.nameUr}` : ""}${q ? ` — "${q}"` : ""}`;

  return (
    <h1 className="font-display text-[2rem] font-semibold text-ink-950 sm:text-4xl">
      <T en={en} ur={ur} />
    </h1>
  );
}

export default async function LawyersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  const city = pick(sp.city);
  const area = pick(sp.area);
  const query = pick(sp.q);
  const online = pick(sp.online);
  const today = pick(sp.today);
  const gender = pick(sp.gender);
  const sort = pick(sp.sort);
  const court = pick(sp.court);
  const page = Math.max(1, Number(pick(sp.page)) || 1);
  if (city) q.set("city", city);
  if (area) q.set("area", area);
  if (query) q.set("q", query);
  if (online) q.set("online", online);
  if (today) q.set("today", today);
  if (gender) q.set("gender", gender);
  if (sort) q.set("sort", sort);
  if (court) q.set("court", court);
  q.set("page", String(page));
  q.set("limit", String(LIMIT));

  const { total, lawyers } = await fetchLawyers(q.toString());
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // Client-side refinements (fee/experience/language/rating) come from the
  // URL too; pagination links would be misleading while they're active, so
  // pagination only renders when they're off. (Moot today: 21 profiles fit
  // on one page.)
  const clientFiltersActive = !!(
    pick(sp.feeMin) ||
    pick(sp.feeMax) ||
    pick(sp.exp) ||
    pick(sp.lang) ||
    pick(sp.minRating)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-ink-500">
        <Link href="/" className="transition hover:text-court-800">
          <T en="Home" ur="ہوم" />
        </Link>
        <span aria-hidden className="mx-2 text-ink-300">/</span>
        <span aria-current="page" className="text-ink-900">
          <T en="Find a Lawyer" ur="وکیل تلاش کریں" />
        </span>
      </nav>

      <div className="mt-3 min-h-[4.5rem] sm:min-h-[5rem]" aria-live="polite">
        <DirectoryHeading sp={sp} />
        <span aria-hidden className="mt-4 block h-[3px] w-12 bg-brass-500" />
      </div>

      {/* Search panel scrolls away; chips stick under the header. */}
      <div className="mt-6">
        <Suspense fallback={null}>
          <FilterSearchPanel />
        </Suspense>
      </div>
      <div className="sticky top-16 z-30 -mx-4 mt-2 border-b border-ink-900/10 bg-paper/95 px-4 py-2.5 backdrop-blur">
        <Suspense fallback={null}>
          <FilterChips />
        </Suspense>
      </div>

      {/* Two-column directory: sticky "Refine" sidebar + results. On mobile
          the sidebar is replaced by the Filters bottom-sheet button in the
          results toolbar. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
            <h2 className="mb-1 font-display text-xl font-semibold text-ink-950">
              <T en="Refine" ur="فلٹرز" />
            </h2>
            <Suspense fallback={null}>
              <RefineForm />
            </Suspense>
          </div>
        </aside>

        <div className="min-w-0">
          <Suspense fallback={null}>
            <DirectoryResults lawyers={lawyers} />
          </Suspense>

          {totalPages > 1 && !clientFiltersActive && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="Pagination">
              {page > 1 ? (
                <Link
                  href={withPage(sp, page - 1)}
                  className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-court-700/50 px-6 text-lg font-bold text-court-800 hover:bg-court-50"
                >
                  <ArrowIcon className="h-5 w-5 rotate-180" />
                  <T en="Previous" ur="پچھلا" />
                </Link>
              ) : (
                <span className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/10 px-6 text-lg font-bold text-ink-300">
                  <ArrowIcon className="h-5 w-5 rotate-180" />
                  <T en="Previous" ur="پچھلا" />
                </span>
              )}
              <span className="text-lg font-bold text-ink-700">
                <T en={`Page ${page} of ${totalPages}`} ur={`صفحہ ${page} از ${totalPages}`} />
              </span>
              {page < totalPages ? (
                <Link
                  href={withPage(sp, page + 1)}
                  className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-court-700/50 px-6 text-lg font-bold text-court-800 hover:bg-court-50"
                >
                  <T en="Next" ur="اگلا" />
                  <ArrowIcon className="h-5 w-5" />
                </Link>
              ) : (
                <span className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/10 px-6 text-lg font-bold text-ink-300">
                  <T en="Next" ur="اگلا" />
                  <ArrowIcon className="h-5 w-5" />
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
