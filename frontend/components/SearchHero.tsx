"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { T, useLang } from "./LanguageContext";
import { PinIcon, SearchIcon } from "./icons";
import { ChevronIcon } from "./Header";
import NearMeButton from "./NearMeButton";
import { rememberedCitySlug } from "@/lib/geo";
import { CITIES, getCity } from "@/lib/data";

/**
 * Combined search (oladoc pattern): ONE text input covering lawyer name,
 * courts and legal issues + city selector + Detect + Search button → /lawyers
 *
 * `compact` — oladoc-mobile pattern: a location pill row (city select +
 * Near me) above a SINGLE-ROW search (input + button side by side).
 * Rendered only below the md breakpoint; desktop keeps the full form.
 */
export default function SearchHero({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { lang } = useLang();
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");
  const [autoCity, setAutoCity] = useState(false);
  const citySelectRef = useRef<HTMLSelectElement>(null);

  // Preselect the city detected on a previous visit — no re-prompt needed.
  useEffect(() => {
    const saved = rememberedCitySlug();
    if (saved && CITIES.some((c) => c.slug === saved)) {
      setCity(saved);
      setAutoCity(true);
    }
  }, []);

  /** Location detection failed — open the city picker so "pick your city" is one tap away. */
  const handleDetectError = () => {
    const el = citySelectRef.current;
    if (!el) return;
    try {
      // Opens the native dropdown where the browser allows it (Chrome/Edge/Safari).
      (el as HTMLSelectElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      /* user-activation-gated on some browsers — fall through to focus */
    }
    el.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/lawyers${params.toString() ? "?" + params.toString() : ""}`);
  };

  if (compact) {
    const cityName = city ? CITIES.find((c) => c.slug === city) : undefined;
    return (
      <div>
        {/* Location row — plain text style (oladoc mobile pattern): city
            picker + "Near me" tap-link on one row. The native select sits
            invisible over a shrink-wrapped label so the row stays text-sized
            in every language. */}
        <div className="mt-2 flex items-center gap-2">
          <label className="relative inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1 rounded-lg text-white has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-brass-300">
            <PinIcon className="h-4 w-4 shrink-0 text-brass-300" />
            <span className="whitespace-nowrap text-[0.8rem] font-bold">
              {cityName ? (
                <T en={cityName.nameEn} ur={cityName.nameUr} />
              ) : (
                <T en="All Cities" ur="تمام شہر" />
              )}
            </span>
            <ChevronIcon className="h-3 w-3 shrink-0 text-white/70" />
            <select
              ref={citySelectRef}
              value={city}
              onChange={(e) => { setCity(e.target.value); setAutoCity(false); }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="City"
            >
              <option value=""><T en="All Cities" ur="تمام شہر" /></option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  <T en={c.nameEn} ur={c.nameUr} />
                </option>
              ))}
            </select>
          </label>
          <NearMeButton
            small
            dark
            onDetected={(slug) => { setCity(slug); setAutoCity(true); }}
            onDetectError={handleDetectError}
          />
        </div>
        {/* Single-row search: full-width bar (oladoc mobile pattern). The
            input is flex-1 + min-w-0 so the whole placeholder stays readable;
            compact text-only Search button. */}
        <form
          onSubmit={submit}
          role="search"
          aria-label="Find a lawyer"
          className="mt-2 flex w-full items-center gap-1 rounded-2xl bg-white p-1 shadow-lift"
        >
          <label className="flex min-h-[48px] min-w-0 flex-1 items-center px-2.5">
            <span className="sr-only"><T en="Lawyers, courts, legal issues" ur="وکیل، عدالت، قانونی مسئلہ" /></span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ur" ? "وکیل، عدالت، قانونی مسئلہ…" : "Lawyers, courts, legal issues…"}
              className="min-w-0 flex-1 bg-transparent text-[0.95rem] text-ink-900 outline-none placeholder:text-[0.85rem] placeholder:text-ink-400"
              aria-label="Lawyers, courts, legal issues"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-court-700 px-4 text-[0.9rem] font-bold text-white transition hover:bg-court-800 active:translate-y-px"
          >
            <T en="Search" ur="تلاش" />
          </button>
        </form>
        {autoCity && city && <AutoCityNote slug={city} />}
      </div>
    );
  }

  return (
    <>
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a lawyer"
      className="mx-auto mt-9 flex max-w-3xl flex-col gap-2 rounded-xl border border-ink-900/15 bg-white p-2 shadow-lift sm:flex-row sm:items-stretch sm:gap-0 sm:divide-x sm:divide-ink-900/10"
    >
      <label className="flex min-h-[58px] flex-1 items-center gap-3 px-4">
        <PinIcon className="h-6 w-6 shrink-0 text-court-700" />
        <span className="sr-only"><T en="City" ur="شہر" /></span>
        <select
          ref={citySelectRef}
          value={city}
          onChange={(e) => { setCity(e.target.value); setAutoCity(false); }}
          className="w-full cursor-pointer bg-transparent text-[1.05rem] font-semibold text-ink-900 outline-none"
          aria-label="City"
        >
          <option value=""><T en="All Cities" ur="تمام شہر" /></option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              <T en={c.nameEn} ur={c.nameUr} />
            </option>
          ))}
        </select>
        <NearMeButton
          small
          onDetected={(slug) => { setCity(slug); setAutoCity(true); }}
          onDetectError={handleDetectError}
        />
      </label>
      <label className="flex min-h-[58px] flex-[1.5] items-center gap-3 border-t border-ink-900/10 px-4 sm:border-t-0">
        <SearchIcon className="h-6 w-6 shrink-0 text-court-700" />
        <span className="sr-only"><T en="Lawyers, courts, legal issues" ur="وکیل، عدالت، قانونی مسئلہ" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Lawyers, courts, legal issues… — وکیل، عدالت، قانونی مسئلہ…"
          className="w-full bg-transparent text-[1.05rem] text-ink-900 outline-none placeholder:text-ink-400"
          aria-label="Lawyers, courts, legal issues"
        />
      </label>
      <div className="p-1 sm:pl-2">
        <button
          type="submit"
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-court-700 px-8 text-[1.05rem] font-bold text-white transition hover:bg-court-800 active:translate-y-px sm:w-auto"
        >
          <SearchIcon className="h-6 w-6" />
          <T en="Find Lawyer" ur="وکیل ڈھونڈیں" />
        </button>
      </div>
    </form>
    {autoCity && city && <AutoCityNote slug={city} />}
    </>
  );
}

/** Small "lawyers near you" note shown under the hero form after auto-detection. */
function AutoCityNote({ slug }: { slug: string }) {
  const city = getCity(slug);
  if (!city) return null;
  return (
    <p className="mx-auto mt-3 flex max-w-3xl items-center justify-center gap-1.5 text-[0.92rem] font-semibold text-ink-200">
      <PinIcon className="h-4 w-4 text-brass-300" />
      <T
        en={`Showing lawyers near you — ${city.nameEn}`}
        ur={`آپ کے قریب کے وکیل دکھائے جا رہے ہیں — ${city.nameUr}`}
      />
    </p>
  );
}
