"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { CloseIcon, SearchIcon } from "./icons";
import { PRACTICE_AREAS } from "@/lib/data";
import { detectCitySlug, rememberCitySlug, rememberedCitySlug } from "@/lib/geo";

const SORT_CHIPS = [
  { value: "most-experienced", en: "Most Experienced", ur: "سب سے تجربہ کار" },
  { value: "lowest-fee", en: "Lowest Fee", ur: "کم ترین فیس" },
  { value: "highest-rated", en: "Highest Rated", ur: "اعلیٰ ترین ریٹنگ" },
] as const;

const chipBase =
  "inline-flex min-h-[48px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-5 text-[1rem] font-bold transition active:translate-y-px";
const chipOn = "border-court-700 bg-court-700 text-white shadow-card";
const chipOff = "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50 hover:text-court-800";

/**
 * Quick-filter chips (oladoc pattern) — writes to the URL so filtered results
 * are shareable. Only filters the backend supports: online, today, gender,
 * sort, city (via Near Me), practice area, text search.
 */
export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [nearSlug, setNearSlug] = useState<string | null>(() => rememberedCitySlug());
  const [detecting, setDetecting] = useState(false);

  const push = (p: URLSearchParams) => {
    p.delete("page");
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };
  const get = (k: string) => sp.get(k) ?? "";

  /** Toggle a flag param (online=1, today=1, gender=female) on/off. */
  const toggleFlag = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (p.get(k) === v) p.delete(k);
    else p.set(k, v);
    push(p);
  };

  /** Sort chips are mutually exclusive — tapping the active one clears it. */
  const toggleSort = (v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (p.get("sort") === v) p.delete("sort");
    else p.set("sort", v);
    push(p);
  };

  /** Near Me: toggle the remembered city; detect live if none remembered yet. */
  const toggleNearMe = async () => {
    const p = new URLSearchParams(sp.toString());
    const saved = rememberedCitySlug();
    if (saved) {
      if (p.get("city") === saved) p.delete("city");
      else p.set("city", saved);
      push(p);
      return;
    }
    if (detecting) return;
    setDetecting(true);
    try {
      const slug = await detectCitySlug();
      rememberCitySlug(slug);
      setNearSlug(slug);
      p.set("city", slug);
      push(p);
    } catch {
      /* geolocation failed — user can still pick a city from the homepage search */
    } finally {
      setDetecting(false);
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(sp.toString());
    if (q.trim()) p.set("q", q.trim());
    else p.delete("q");
    push(p);
  };

  const onlineActive = get("online") === "1";
  const todayActive = get("today") === "1";
  const femaleActive = get("gender") === "female";
  const sortActive = get("sort");
  const nearActive = !!nearSlug && get("city") === nearSlug;
  const anyActive = onlineActive || todayActive || femaleActive || !!sortActive || !!nearActive || !!get("q") || !!get("area");

  const selectCls =
    "min-h-[52px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20";

  return (
    <div className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-card">
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

      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Quick filters"
      >
        <button
          type="button"
          onClick={() => toggleFlag("online", "1")}
          aria-pressed={onlineActive}
          className={`${chipBase} ${onlineActive ? chipOn : chipOff}`}
        >
          <T en="Online Consultation" ur="آن لائن مشاورت" />
        </button>
        <button
          type="button"
          onClick={() => toggleFlag("today", "1")}
          aria-pressed={todayActive}
          className={`${chipBase} ${todayActive ? chipOn : chipOff}`}
        >
          <T en="Available Today" ur="آج دستیاب" />
        </button>
        {SORT_CHIPS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => toggleSort(s.value)}
            aria-pressed={sortActive === s.value}
            className={`${chipBase} ${sortActive === s.value ? chipOn : chipOff}`}
          >
            <T en={s.en} ur={s.ur} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => toggleFlag("gender", "female")}
          aria-pressed={femaleActive}
          className={`${chipBase} ${femaleActive ? chipOn : chipOff}`}
        >
          <T en="Female Lawyers" ur="خاتون وکیل" />
        </button>
        <button
          type="button"
          onClick={toggleNearMe}
          aria-pressed={nearActive}
          disabled={detecting}
          className={`${chipBase} ${nearActive ? chipOn : chipOff} ${detecting ? "opacity-60" : ""}`}
        >
          <T en={detecting ? "Detecting…" : "Near Me"} ur={detecting ? "معلوم کیا جا رہا ہے…" : "میرے قریب"} />
        </button>
        {anyActive && (
          <button
            type="button"
            onClick={() => router.push("/lawyers", { scroll: false })}
            className={`${chipBase} border-clay-200 bg-clay-50 text-clay-700 hover:bg-clay-100`}
          >
            <CloseIcon className="h-4 w-4" />
            <T en="Clear all" ur="صاف کریں" />
          </button>
        )}
      </div>
    </div>
  );
}
