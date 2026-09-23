"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { SearchIcon } from "./icons";
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
    "min-h-[52px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 outline-none focus:border-emerald-600";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="City" ur="شہر" /></span>
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
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="Legal Problem" ur="قانونی مسئلہ" /></span>
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
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="Search" ur="تلاش" /></span>
          <span className="flex min-h-[52px] items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 focus-within:border-emerald-600">
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="نام، مسئلہ…"
              aria-label="Search lawyers"
              className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-emerald-700 px-3 text-base font-bold text-white"
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
          className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-base font-bold text-emerald-800 hover:bg-emerald-50"
        >
          <SearchIcon className="h-5 w-5" />
          <T en="Clear all filters" ur="تمام فلٹر صاف کریں" />
        </button>
      )}
    </div>
  );
}
