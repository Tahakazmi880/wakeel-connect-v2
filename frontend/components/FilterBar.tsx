"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { SearchIcon } from "./icons";
import { PRACTICE_AREAS } from "@/lib/data";
import FilterChips from "./FilterChips";

/**
 * Search panel (practice-area select + text search) for the directory page.
 * Rendered in normal page flow; the quick-filter chips live in a separate
 * sticky bar (see FilterChips) that stays visible while results scroll.
 */
export function FilterSearchPanel() {
  return (
    <div className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-card">
      <SearchFields />
    </div>
  );
}

function SearchFields() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  const push = (p: URLSearchParams) => {
    p.delete("page");
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };
  const get = (k: string) => sp.get(k) ?? "";

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(sp.toString());
    if (q.trim()) p.set("q", q.trim());
    else p.delete("q");
    push(p);
  };

  const selectCls =
    "min-h-[52px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-600"><T en="Legal Problem" ur="قانونی مسئلہ" /></span>
          <select
            value={get("area")}
            onChange={(e) => {
              const p = new URLSearchParams(sp.toString());
              if (e.target.value) p.set("area", e.target.value);
              else p.delete("area");
              push(p);
            }}
            className={selectCls}
          >
            <option value=""><T en="All Areas" ur="تمام شعبے" /></option>
            {PRACTICE_AREAS.map((a) => (
              <option key={a.slug} value={a.slug}>
                <T en={a.nameEn} ur={a.nameUr} />
              </option>
            ))}
          </select>
        </label>
        <form onSubmit={submitSearch} className="block" role="search">
          <span className="mb-1 block text-sm font-bold text-ink-600"><T en="Search" ur="تلاش" /></span>
          <span className="flex min-h-[52px] items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-4 transition focus-within:border-court-600 focus-within:ring-2 focus-within:ring-court-600/20">
            <SearchIcon className="h-5 w-5 shrink-0 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="نام، مسئلہ…"
              aria-label="Search lawyers"
              className="w-full bg-transparent text-[1.02rem] font-semibold text-ink-900 outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-court-700 px-3 text-base font-bold text-white transition hover:bg-court-800"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </span>
        </form>
    </div>
  );
}

/**
 * Back-compat default: search panel + chips in one card, as before.
 * The directory page now renders FilterSearchPanel in flow and FilterChips
 * in a sticky bar instead.
 */
export default function FilterBar() {
  return (
    <div className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-card">
      <SearchFields />
      <div className="mt-4">
        <FilterChips />
      </div>
    </div>
  );
}
