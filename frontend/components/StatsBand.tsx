"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/components/LanguageContext";
import { CITIES, COURTS, PRACTICE_AREAS } from "@/lib/data";

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

/** Ink band of serif numerals separated by hairline dividers. Lawyer count comes from the real API. */
export default function StatsBand({ lawyerCount }: { lawyerCount: number }) {
  const stats = [
    { target: lawyerCount, en: "Lawyers", ur: "وکیل" },
    { target: CITIES.length, en: "Cities", ur: "شہر" },
    { target: PRACTICE_AREAS.length, en: "Practice Areas", ur: "قانونی شعبے" },
    { target: COURTS.length, en: "Courts", ur: "عدالتیں" },
  ];

  return (
    <section className="bg-ink-950 py-14">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-y-10 text-center lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((s) => (
            <div key={s.en} className="px-6">
              <p className="font-display text-5xl font-semibold text-brass-300">
                <Counter target={s.target} />
              </p>
              <p className="mt-2 text-[1.02rem] font-semibold text-ink-300">
                <T en={s.en} ur={s.ur} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
