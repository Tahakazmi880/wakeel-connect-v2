"use client";

import { useState } from "react";
import { T } from "./LanguageContext";
import type { SlotDay } from "@/lib/api";

export interface SlotPick {
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
}

/**
 * Day tabs + time-slot grid, backed by real backend availability.
 * Used by the booking flow and by dashboard rescheduling.
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

  if (loading) {
    return <p className="py-8 text-center text-lg font-bold text-ink-500">…</p>;
  }

  const day = days[dayIdx];
  const free = day?.slots.filter((s) => !s.taken) ?? [];

  return (
    <div>
      <p className="mb-2 text-base font-bold text-ink-700">
        <T en="Pick a day" ur="دن چنیں" />
      </p>
      <div className="wc-rail flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Day">
        {days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            role="radio"
            aria-checked={dayIdx === i}
            onClick={() => {
              setDayIdx(i);
              setPicked(null);
              onPick(null);
            }}
            className={`min-h-[72px] min-w-[110px] shrink-0 rounded-lg border px-3 py-2 text-center transition ${
              dayIdx === i
                ? "border-court-700 bg-court-700 text-white shadow-card"
                : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
            }`}
          >
            <span className="block text-base font-bold">{d.label}</span>
          </button>
        ))}
      </div>

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
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Time slot">
              {day.slots.map((s) => {
                const isPicked = picked?.date === day.date && picked?.start === s.start;
                return (
                  <button
                    key={s.start}
                    type="button"
                    role="radio"
                    aria-checked={isPicked}
                    disabled={s.taken}
                    onClick={() => {
                      const p = { date: day.date, start: s.start };
                      setPicked(p);
                      onPick(p);
                    }}
                    className={`min-h-[52px] rounded-lg border text-base font-bold transition ${
                      s.taken
                        ? "cursor-not-allowed border-ink-900/10 bg-paper text-ink-300 line-through"
                        : isPicked
                          ? "border-court-700 bg-court-700 text-white shadow-card"
                          : "border-ink-900/15 bg-white text-ink-700 hover:border-court-700/50"
                    }`}
                  >
                    {s.start}
                  </button>
                );
              })}
            </div>
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
