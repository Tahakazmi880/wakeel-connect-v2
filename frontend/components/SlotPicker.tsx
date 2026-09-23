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
    return <p className="py-8 text-center text-lg font-bold text-slate-500">…</p>;
  }

  const day = days[dayIdx];
  const free = day?.slots.filter((s) => !s.taken) ?? [];

  return (
    <div>
      <p className="mb-2 text-base font-extrabold text-slate-700">
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
            className={`min-h-[72px] min-w-[110px] shrink-0 rounded-2xl border-2 px-3 py-2 text-center transition ${
              dayIdx === i
                ? "border-emerald-700 bg-emerald-700 text-white shadow"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
            }`}
          >
            <span className="block text-base font-extrabold">{d.label}</span>
          </button>
        ))}
      </div>

      {day && (
        <>
          <p className="mb-2 mt-6 text-base font-extrabold text-slate-700">
            <T en="Pick a time" ur="وقت چنیں" />
          </p>
          {free.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-base font-bold text-slate-500 ring-1 ring-slate-200">
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
                    className={`min-h-[52px] rounded-xl border-2 text-base font-bold transition ${
                      s.taken
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                        : isPicked
                          ? "border-emerald-700 bg-emerald-700 text-white shadow"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
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
