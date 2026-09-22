"use client";

import { useLang } from "./LanguageContext";
import type { Guide } from "@/lib/guides";

/** Picks the English or Urdu paragraph array based on the user's language choice. */
export default function GuideBody({ guide }: { guide: Guide }) {
  const { lang } = useLang();
  const paragraphs = lang === "ur" ? guide.bodyUr : guide.bodyEn;
  return (
    <div className={lang === "ur" ? "text-right" : "text-left"}>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-5 text-lg leading-8 text-slate-700">
          {p}
        </p>
      ))}
    </div>
  );
}
