"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";

const TABS = [
  { id: "overview", en: "Overview", ur: "جائزہ" },
  { id: "availability", en: "Availability", ur: "دستیابی" },
  { id: "fees", en: "Fees", ur: "فیس" },
  { id: "about", en: "About", ur: "تعارف" },
  { id: "reviews", en: "Reviews", ur: "آراء" },
  { id: "faqs", en: "FAQs", ur: "سوالات" },
] as const;

/**
 * Sticky in-page section navigation for lawyer profiles (oladoc pattern:
 * the profile's anchor tab bar sticks to the top once you scroll past the
 * header card). Scroll-spy highlights the section currently in view; every
 * tab is a real anchor so it works without JavaScript too.
 */
export default function StickyProfileTabs() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      // Ignore the sticky site header (~64px) + this bar (~56px) at the top,
      // and treat a section as active while it fills most of the viewport.
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tabCls = (id: string) =>
    `inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.98rem] font-bold transition ${
      active === id
        ? "bg-court-700 text-white shadow-card"
        : "text-ink-600 hover:bg-court-50 hover:text-court-800"
    }`;

  return (
    <nav
      aria-label="Profile sections"
      className="sticky top-16 z-30 -mx-1 mb-6 overflow-x-auto rounded-lg border border-ink-900/10 bg-paper/95 px-2 py-2 shadow-card backdrop-blur [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex gap-1">
        {TABS.map((t) => (
          <a key={t.id} href={`#${t.id}`} onClick={jump(t.id)} aria-current={active === t.id ? "true" : undefined} className={tabCls(t.id)}>
            <T en={t.en} ur={t.ur} />
          </a>
        ))}
      </div>
    </nav>
  );
}
