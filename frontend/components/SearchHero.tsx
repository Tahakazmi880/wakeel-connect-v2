"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { T } from "./LanguageContext";
import { PinIcon, SearchIcon } from "./icons";
import NearMeButton from "./NearMeButton";
import { rememberedCitySlug } from "@/lib/geo";
import { CITIES, getCity } from "@/lib/data";

/** Dual search: city + legal problem / lawyer name → /lawyers */
export default function SearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");
  const [autoCity, setAutoCity] = useState(false);

  // Preselect the city detected on a previous visit — no re-prompt needed.
  useEffect(() => {
    const saved = rememberedCitySlug();
    if (saved && CITIES.some((c) => c.slug === saved)) {
      setCity(saved);
      setAutoCity(true);
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/lawyers${params.toString() ? "?" + params.toString() : ""}`);
  };

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
        />
      </label>
      <label className="flex min-h-[58px] flex-[1.5] items-center gap-3 border-t border-ink-900/10 px-4 sm:border-t-0">
        <SearchIcon className="h-6 w-6 shrink-0 text-court-700" />
        <span className="sr-only"><T en="Legal problem or lawyer name" ur="قانونی مسئلہ یا وکیل کا نام" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="طلاق، جائیداد، ضمانت…"
          className="w-full bg-transparent text-[1.05rem] text-ink-900 outline-none placeholder:text-ink-400"
          aria-label="Legal problem or lawyer name"
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
