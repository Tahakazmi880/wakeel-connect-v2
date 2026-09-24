"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { CloseIcon } from "./icons";
import { CITIES, COURTS, LANGUAGES, PRACTICE_AREAS } from "@/lib/data";

/**
 * "Refine" filter panel for the lawyer directory.
 *
 * Desktop: rendered as a sticky left sidebar (see page.tsx).
 * Mobile: rendered inside the bottom-sheet opened by <MobileFilterButton />.
 *
 * Server-supported params (area, city, court, sort, q, online, today, gender)
 * are applied via the URL and filtered by the API. The extra refinement params
 * (feeMin, feeMax, exp, lang, minRating) have no backend support yet, so they
 * are also written to the URL (shareable) and applied client-side in
 * <DirectoryResults />. The whole directory fits on one page (21 profiles),
 * so client-side refinement is exact; if the directory outgrows one page,
 * these need matching backend query params.
 */

export interface RefineValues {
  area: string;
  city: string;
  court: string;
  feeMin: string;
  feeMax: string;
  exp: string;
  lang: string;
  minRating: string;
}

const EMPTY: RefineValues = {
  area: "",
  city: "",
  court: "",
  feeMin: "",
  feeMax: "",
  exp: "",
  lang: "",
  minRating: "",
};

function readValues(sp: URLSearchParams): RefineValues {
  return {
    area: sp.get("area") ?? "",
    city: sp.get("city") ?? "",
    court: sp.get("court") ?? "",
    feeMin: sp.get("feeMin") ?? "",
    feeMax: sp.get("feeMax") ?? "",
    exp: sp.get("exp") ?? "",
    lang: sp.get("lang") ?? "",
    minRating: sp.get("minRating") ?? "",
  };
}

export function countActiveRefinements(sp: URLSearchParams): number {
  return Object.values(readValues(sp)).filter((v) => v !== "").length;
}

const EXP_OPTIONS = [
  { value: "", en: "Any", ur: "کوئی بھی" },
  { value: "5", en: "5+ years", ur: "5+ سال" },
  { value: "10", en: "10+ years", ur: "10+ سال" },
  { value: "15", en: "15+ years", ur: "15+ سال" },
  { value: "20", en: "20+ years", ur: "20+ سال" },
];

const RATING_OPTIONS = [
  { value: "", en: "Any rating", ur: "کوئی بھی ریٹنگ" },
  { value: "3", en: "3+ stars", ur: "3+ اسٹار" },
  { value: "4", en: "4+ stars", ur: "4+ اسٹار" },
  { value: "4.5", en: "4.5+ stars", ur: "4.5+ اسٹار" },
];

const selectCls =
  "min-h-[52px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20";

function Group({
  titleEn,
  titleUr,
  children,
}: {
  titleEn: string;
  titleUr: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink-900/10 py-5 first:pt-1 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink-500">
        <T en={titleEn} ur={titleUr} />
      </h3>
      {children}
    </div>
  );
}

/** The full refine form — shared by the desktop sidebar and the mobile sheet. */
export function RefineForm({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [v, setV] = useState<RefineValues>(() => readValues(sp));

  const set =
    (k: keyof RefineValues) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      setV((prev) => ({ ...prev, [k]: e.target.value }));

  const apply = () => {
    const p = new URLSearchParams(sp.toString());
    (Object.entries(v) as [keyof RefineValues, string][]).forEach(([k, val]) => {
      if (val) p.set(k, val);
      else p.delete(k);
    });
    p.delete("page");
    onApplied?.();
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };

  const clear = () => {
    setV(EMPTY);
    onApplied?.();
    router.push("/lawyers", { scroll: false });
  };

  return (
    <div>
      <Group titleEn="Practice Area" titleUr="قانونی شعبہ">
        <select value={v.area} onChange={set("area")} className={selectCls} aria-label="Practice area">
          <option value="">
            <T en="All practice areas" ur="تمام شعبے" />
          </option>
          {PRACTICE_AREAS.map((a) => (
            <option key={a.slug} value={a.slug}>
              <T en={a.nameEn} ur={a.nameUr} />
            </option>
          ))}
        </select>
      </Group>

      <Group titleEn="City" titleUr="شہر">
        <select value={v.city} onChange={set("city")} className={selectCls} aria-label="City">
          <option value="">
            <T en="All cities" ur="تمام شہر" />
          </option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              <T en={c.nameEn} ur={c.nameUr} />
            </option>
          ))}
        </select>
      </Group>

      <Group titleEn="Court" titleUr="عدالت">
        <select value={v.court} onChange={set("court")} className={selectCls} aria-label="Court">
          <option value="">
            <T en="All courts" ur="تمام عدالتیں" />
          </option>
          {COURTS.map((c) => (
            <option key={c.slug} value={c.slug}>
              <T en={c.nameEn} ur={c.nameUr} />
            </option>
          ))}
        </select>
      </Group>

      <Group titleEn="Consultation Fee (PKR)" titleUr="مشاورت کی فیس (روپے)">
        <div className="flex items-center gap-2">
          <input
            value={v.feeMin}
            onChange={set("feeMin")}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Min"
            aria-label="Minimum fee in PKR"
            className="min-h-[52px] w-full min-w-0 rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
          />
          <span aria-hidden className="shrink-0 font-bold text-ink-400">
            –
          </span>
          <input
            value={v.feeMax}
            onChange={set("feeMax")}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max"
            aria-label="Maximum fee in PKR"
            className="min-h-[52px] w-full min-w-0 rounded-lg border border-ink-900/15 bg-white px-4 text-[1.02rem] font-semibold text-ink-900 outline-none transition focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
          />
        </div>
      </Group>

      <Group titleEn="Experience" titleUr="تجربہ">
        <select value={v.exp} onChange={set("exp")} className={selectCls} aria-label="Minimum experience">
          {EXP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              <T en={o.en} ur={o.ur} />
            </option>
          ))}
        </select>
      </Group>

      <Group titleEn="Language" titleUr="زبان">
        <select value={v.lang} onChange={set("lang")} className={selectCls} aria-label="Language">
          <option value="">
            <T en="Any language" ur="کوئی بھی زبان" />
          </option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              <T en={l.nameEn} ur={l.nameUr} />
            </option>
          ))}
        </select>
      </Group>

      <Group titleEn="Minimum Rating" titleUr="کم از کم ریٹنگ">
        <select value={v.minRating} onChange={set("minRating")} className={selectCls} aria-label="Minimum rating">
          {RATING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              <T en={o.en} ur={o.ur} />
            </option>
          ))}
        </select>
      </Group>

      <button
        type="button"
        onClick={apply}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-court-700 px-6 text-lg font-bold text-white transition hover:bg-court-800 active:translate-y-px"
      >
        <T en="Apply filters" ur="فلٹر لگائیں" />
      </button>
      <button
        type="button"
        onClick={clear}
        className="mt-1 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-6 text-[0.95rem] font-bold text-ink-500 transition hover:text-court-700"
      >
        <T en="Clear all" ur="صاف کریں" />
      </button>
    </div>
  );
}

/**
 * Mobile "Filters" button (with active-count badge) that opens the refine
 * form in a bottom sheet. Hidden on lg+ where the sidebar is visible.
 */
export function MobileFilterButton() {
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const active = countActiveRefinements(sp);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-5 text-[1rem] font-bold text-ink-800 shadow-sm transition hover:border-court-700/50 lg:hidden"
        aria-haspopup="dialog"
      >
        <T en="Filters" ur="فلٹرز" />
        {active > 0 && (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brass-500 px-1.5 text-[0.85rem] font-bold text-ink-950">
            {active}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-ink-950/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-paper px-5 pb-8 pt-3 shadow-lift">
            <div aria-hidden className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink-900/15" />
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink-950">
                <T en="Refine" ur="فلٹرز" />
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-ink-600 transition hover:bg-ink-900/5"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <RefineForm onApplied={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
