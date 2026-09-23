"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { CloseIcon, SearchIcon } from "./icons";
import { CITIES, PRACTICE_AREAS } from "@/lib/data";

/**
 * Filter bar — writes to the URL so filtered results are shareable.
 * Only filters the backend supports: city, practice area, text search.
 */
export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v);
    else p.delete(k);
    p.delete("page");
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };
  const get = (k: string) => sp.get(k) ?? "";

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    set("q", q.trim());
  };

  const selectCls =
    "min-h-[52px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20";

  return (
    <div className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-600"><T en="City" ur="شہر" /></span>
          <select value={get("city")} onChange={(e) => set("city", e.target.value)} className={selectCls}>
            <option value=""><T en="All Cities" ur="تمام شہر" /></option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                <T en={c.nameEn} ur={c.nameUr} />
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-600"><T en="Legal Problem" ur="قانونی مسئلہ" /></span>
          <select value={get("area")} onChange={(e) => set("area", e.target.value)} className={selectCls}>
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

      {(get("q") || get("city") || get("area")) && (
        <button
          type="button"
          onClick={() => router.push("/lawyers", { scroll: false })}
          className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-lg px-4 text-[1.02rem] font-bold text-court-800 transition hover:bg-court-50"
        >
          <CloseIcon className="h-5 w-5" />
          <T en="Clear all filters" ur="تمام فلٹر صاف کریں" />
        </button>
      )}
    </div>
  );
}
