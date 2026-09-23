"use client";

import { useMemo, useState } from "react";
import { T } from "./LanguageContext";
import type { SlotDay } from "@/lib/api";

export interface SlotPick {
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
}

/** Slot time → "Morning" (before 12:00) or "Evening". */
function slotGroup(start: string): "morning" | "evening" {
  const h = Number(start.slice(0, 2));
  return h < 12 ? "morning" : "evening";
}

/** "2026-09-24" → "September 2026" (English + Urdu month names). */
function monthLabel(date: string): { en: string; ur: string } {
  const [y, m] = date.split("-").map(Number);
  const en = new Date(y, m - 1, 1).toLocaleDateString("en-PK", { month: "long", year: "numeric" });
  const urMonths = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
  return { en, ur: `${urMonths[m - 1]} ${y}` };
}

/** "2026-09-24" + day.label fallback → short weekday + day number. */
function dayChip(date: string): { weekdayEn: string; weekdayUr: string; dayNum: string } {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdayEn = dt.toLocaleDateString("en-PK", { weekday: "short" });
  const weekdayUr = dt.toLocaleDateString("ur-PK", { weekday: "short" });
  return { weekdayEn, weekdayUr, dayNum: String(d) };
}

/**
 * oladoc-style slot picker: horizontally scrollable date carousel grouped
 * by month (month label divider + day chips), then time slots grouped
 * under Morning / Evening headings. Backed by real backend availability.
 */
export default function SlotPicker({
  days,
  loading,
  initial,
  onPick,
}: {
  days: SlotDay[];
  loading: boolean;
  initial?: SlotPick | null;
  onPick: (pick: SlotPick | null) => void;
}) {
  const [dayIdx, setDayIdx] = useState(() => {
    if (initial) {
      const i = days.findIndex((d) => d.date === initial.date);
      if (i >= 0) return i;
    }
    return 0;
  });
  const [picked, setPicked] = useState<SlotPick | null>(initial ?? null);

  // Group day indexes by month for the carousel.
  const monthGroups = useMemo(() => {
    const groups: { key: string; label: { en: string; ur: string }; indexes: number[] }[] = [];
    days.forEach((d, i) => {
      const key = d.date.slice(0, 7);
      const g = groups.find((x) => x.key === key);
      if (g) g.indexes.push(i);
      else groups.push({ key, label: monthLabel(d.date), indexes: [i] });
    });
    return groups;
  }, [days]);

  if (loading) {
    return <p className="py-8 text-center text-lg font-bold text-ink-500">…</p>;
  }

  if (days.length === 0) {
    return (
      <p className="rounded-lg bg-paper-dark/40 px-4 py-6 text-center text-base font-semibold text-ink-600 ring-1 ring-ink-900/10">
        <T en="No free slots right now — please check back later." ur="ابھی کوئی خالی وقت نہیں — بعد میں دوبارہ دیکھیں۔" />
      </p>
    );
  }

  const day = days[dayIdx];
  const free = day?.slots.filter((s) => !s.taken) ?? [];
  const morning = free.filter((s) => slotGroup(s.start) === "morning");
  const evening = free.filter((s) => slotGroup(s.start) === "evening");

  const pickSlot = (d: SlotDay, start: string) => {
    const p = { date: d.date, start };
    setPicked(p);
    onPick(p);
  };

  return (
    <div>
      <p className="mb-2 text-base font-bold text-ink-700">
        <T en="Pick a day" ur="دن چنیں" />
      </p>

      {/* ---- month-grouped horizontal date carousel ---- */}
      <div className="flex gap-4 overflow-x-auto pb-2" role="radiogroup" aria-label="Day">
        {monthGroups.map((g) => (
          <div key={g.key} className="shrink-0">
            <p className="mb-1.5 text-sm font-bold uppercase tracking-wide text-ink-500">
              <T en={g.label.en} ur={g.label.ur} />
            </p>
            <div className="flex gap-2">
              {g.indexes.map((i) => {
                const d = days[i];
                const chip = dayChip(d.date);
                const selected = dayIdx === i;
                return (
                  <button
                    key={d.date}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setDayIdx(i);
                      setPicked(null);
                      onPick(null);
                    }}
                    className={`flex min-h-[72px] min-w-[68px] flex-col items-center justify-center rounded-lg border px-2 py-2 text-center transition ${
                      selected
                        ? "border-court-700 bg-court-700 text-white shadow-card"
                        : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                    }`}
                  >
                    <span className="text-sm font-bold opacity-80">
                      <T en={chip.weekdayEn} ur={chip.weekdayUr} />
                    </span>
                    <span className="font-display text-[1.35rem] font-semibold leading-tight">{chip.dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ---- time slots: Morning / Evening ---- */}
      {day && (
        <>
          <p className="mb-2 mt-6 text-base font-bold text-ink-700">
            <T en="Pick a time" ur="وقت چنیں" />
          </p>
          {free.length === 0 ? (
            <p className="rounded-lg bg-paper-dark/40 px-4 py-6 text-center text-base font-semibold text-ink-600 ring-1 ring-ink-900/10">
              <T en="No free slots this day — try another day." ur="اس دن کوئی خالی وقت نہیں — کوئی اور دن آزمائیں۔" />
            </p>
          ) : (
            <>
              {(
                [
                  { id: "morning", en: "Morning", ur: "صبح", slots: morning },
                  { id: "evening", en: "Evening", ur: "شام", slots: evening },
                ] as const
              ).map(
                (grp) =>
                  grp.slots.length > 0 && (
                    <div key={grp.id} className="mt-4 first:mt-0">
                      <p className="mb-2 text-[0.95rem] font-bold uppercase tracking-wide text-ink-500">
                        <T en={grp.en} ur={grp.ur} />
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={`${grp.en} slots`}>
                        {grp.slots.map((s) => {
                          const isPicked = picked?.date === day.date && picked?.start === s.start;
                          return (
                            <button
                              key={s.start}
                              type="button"
                              role="radio"
                              aria-checked={isPicked}
                              onClick={() => pickSlot(day, s.start)}
                              className={`min-h-[52px] rounded-lg border text-base font-bold transition ${
                                isPicked
                                  ? "border-court-700 bg-court-700 text-white shadow-card"
                                  : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                              }`}
                            >
                              {s.start}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

/** "2026-09-24" + "09:00" (Asia/Karachi wall time) → UTC ISO string. PK has no DST, so +05:00 is fixed. */
export function slotToISO(date: string, start: string): string {
  return new Date(`${date}T${start}:00+05:00`).toISOString();
}
