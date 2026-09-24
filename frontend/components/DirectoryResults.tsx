"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LawyerCard from "./LawyerCard";
import { T } from "./LanguageContext";
import { SearchIcon } from "./icons";
import type { LawyerSummary } from "@/lib/api";
import { MobileFilterButton } from "./DirectoryFilters";

const SORTS = [
  { value: "", en: "Recommended", ur: "تجویز کردہ" },
  { value: "most-experienced", en: "Most Experienced", ur: "سب سے تجربہ کار" },
  { value: "lowest-fee", en: "Lowest Fee", ur: "کم ترین فیس" },
  { value: "highest-rated", en: "Highest Rated", ur: "اعلیٰ ترین ریٹنگ" },
] as const;

/**
 * Client-side refinement for the params the API doesn't filter on
 * (feeMin, feeMax, exp, lang, minRating). Exact while the whole directory
 * fits on one page; see DirectoryFilters.tsx for the caveat.
 *
 * Honesty rules: a lawyer is only shown under an active fee/experience
 * filter when the value is actually known and within range — unknown
 * ("on request" / unspecified) never passes an active bound.
 */
function applyClientFilters(lawyers: LawyerSummary[], sp: URLSearchParams): LawyerSummary[] {
  const feeMinRaw = sp.get("feeMin");
  const feeMaxRaw = sp.get("feeMax");
  const expRaw = sp.get("exp");
  const lang = sp.get("lang");
  const minRatingRaw = sp.get("minRating");
  const feeMin = Number(feeMinRaw);
  const feeMax = Number(feeMaxRaw);
  const exp = Number(expRaw);
  const minRating = Number(minRatingRaw);

  return lawyers.filter((l) => {
    if (feeMinRaw && !(l.consultationFeePaisa > 0 && l.consultationFeePaisa >= feeMin * 100)) return false;
    if (feeMaxRaw && !(l.consultationFeePaisa > 0 && l.consultationFeePaisa <= feeMax * 100)) return false;
    if (expRaw && !(l.yearsExperience > 0 && l.yearsExperience >= exp)) return false;
    if (lang && !l.languages.some((x) => x.language.code === lang)) return false;
    if (minRatingRaw && !(l.ratingAvg >= minRating)) return false;
    return true;
  });
}

/**
 * Right-hand results column: live result count, sort dropdown, mobile
 * filter button, then the lawyer cards (unchanged dual-mode cards).
 */
export default function DirectoryResults({ lawyers }: { lawyers: LawyerSummary[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const filtered = useMemo(() => applyClientFilters(lawyers, sp), [lawyers, sp]);
  const n = filtered.length;
  const sort = sp.get("sort") ?? "";

  const setSort = (value: string) => {
    const p = new URLSearchParams(sp.toString());
    if (value) p.set("sort", value);
    else p.delete("sort");
    p.delete("page");
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* Results toolbar: count + sort + mobile filters */}
      <div className="flex flex-wrap items-center gap-3">
        <p aria-live="polite" className="mr-auto text-[1.08rem] font-bold text-ink-800">
          <T
            en={`${n} reviewed ${n === 1 ? "lawyer" : "lawyers"}`}
            ur={`${n} جانچی ہوئی وکیل`}
          />
        </p>
        <label className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-4 text-[1rem] font-semibold text-ink-700 shadow-sm">
          <span className="font-bold text-ink-500">
            <T en="Sort:" ur="ترتیب:" />
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort lawyers"
            className="min-h-[44px] bg-transparent font-bold text-ink-900 outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                <T en={s.en} ur={s.ur} />
              </option>
            ))}
          </select>
        </label>
        <MobileFilterButton />
      </div>

      {n === 0 ? (
        <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-dashed border-ink-900/20 bg-white p-12 text-center">
          <SearchIcon className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-4 font-display text-[1.5rem] font-semibold text-ink-950">
            <T en="No lawyers match your filters" ur="آپ کے فلٹر سے کوئی وکیل نہیں ملا" />
          </p>
          <p className="mt-2 text-[1.02rem] text-ink-600">
            <T en="Try removing a filter or two." ur="کوئی فلٹر ہٹا کر دوبارہ کوشش کریں۔" />
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {filtered.map((l) => (
            <LawyerCard key={l.slug} lawyer={l} />
          ))}
        </div>
      )}
    </div>
  );
}
