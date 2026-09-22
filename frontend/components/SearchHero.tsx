"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { T } from "./LanguageContext";
import { PinIcon, SearchIcon } from "./icons";
import { CITIES } from "@/lib/data";

/** Dual search: city + legal problem / lawyer name → /lawyers */
export default function SearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/lawyers${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a lawyer"
      className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-2xl sm:flex-row sm:items-stretch"
    >
      <label className="flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 ring-emerald-600 focus-within:ring-2">
        <PinIcon className="h-6 w-6 shrink-0 text-emerald-700" />
        <span className="sr-only"><T en="City" ur="شہر" /></span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent text-lg font-semibold text-slate-800 outline-none"
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
      <label className="flex min-h-[56px] flex-[1.4] items-center gap-3 rounded-2xl bg-slate-50 px-4 ring-emerald-600 focus-within:ring-2">
        <SearchIcon className="h-6 w-6 shrink-0 text-emerald-700" />
        <span className="sr-only"><T en="Legal problem or lawyer name" ur="قانونی مسئلہ یا وکیل کا نام" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="طلاق، جائیداد، ضمانت…"
          className="w-full bg-transparent text-lg text-slate-800 outline-none placeholder:text-slate-400"
          aria-label="Legal problem or lawyer name"
        />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-8 text-lg font-extrabold text-white shadow transition hover:bg-emerald-800 active:scale-[0.98]"
      >
        <SearchIcon className="h-6 w-6" />
        <T en="Find Lawyer" ur="وکیل ڈھونڈیں" />
      </button>
    </form>
  );
}
