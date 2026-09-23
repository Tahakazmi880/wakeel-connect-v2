"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { CloseIcon } from "./icons";
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
 *
 * Rendered in a slim, horizontally scrollable, sticky bar on the directory
 * page (NOT inside a filter sidebar) — a subtle right-edge fade hints that
 * more chips are reachable by scrolling.
 */
export default function FilterChips() {
  const router = useRouter();
  const sp = useSearchParams();
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

  const onlineActive = get("online") === "1";
  const todayActive = get("today") === "1";
  const femaleActive = get("gender") === "female";
  const sortActive = get("sort");
  const nearActive = !!nearSlug && get("city") === nearSlug;
  const anyActive =
    onlineActive || todayActive || femaleActive || !!sortActive || !!nearActive || !!get("q") || !!get("area");

  return (
    <div className="relative">
      <div
        className="flex gap-2 overflow-x-auto py-1 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
      {/* Scroll affordance: fades the clipped edge so users know chips scroll. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent"
      />
    </div>
  );
}
