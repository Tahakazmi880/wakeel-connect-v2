"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/components/LanguageContext";
import { CITIES, COURTS, LAWYERS, PRACTICE_AREAS } from "@/lib/data";

/** Animated number that counts up when scrolled into view. */
function Counter({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1200;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{value}</span>;
}

const STATS = [
  { target: LAWYERS.length, en: "Lawyers", ur: "وکیل" },
  { target: CITIES.length, en: "Cities", ur: "شہر" },
  { target: PRACTICE_AREAS.length, en: "Practice Areas", ur: "قانونی شعبے" },
  { target: COURTS.length, en: "Courts", ur: "عدالتیں" },
];

/** Dark emerald animated stats band. */
export default function StatsBand() {
  return (
    <section className="bg-emerald-950 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.en} className="rounded-3xl bg-emerald-900/60 p-6 ring-1 ring-emerald-800">
              <p className="text-5xl font-extrabold text-amber-300">
                <Counter target={s.target} />
              </p>
              <p className="mt-2 text-lg font-bold text-emerald-100">
                <T en={s.en} ur={s.ur} />
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-medium text-emerald-300">
          <T en="(demo figures — real numbers will appear at launch)" ur="(ڈیمو اعداد — اصل تعداد لانچ پر آئے گی)" />
        </p>
      </div>
    </section>
  );
}
