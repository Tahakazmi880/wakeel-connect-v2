"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "ur";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("wc-lang");
    if (saved === "ur" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("wc-lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Tiny bilingual text: <T en="Find a lawyer" ur="وکیل تلاش کریں" /> */
export function T({ en, ur }: { en: ReactNode; ur: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "ur" ? ur : en}</>;
}

/** Big Urdu/English toggle for the header. */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="flex items-center rounded-full border border-emerald-200 bg-white p-1 text-sm font-bold"
      role="group"
      aria-label="Language / زبان"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`min-h-[40px] rounded-full px-4 transition ${
          lang === "en" ? "bg-emerald-700 text-white shadow" : "text-emerald-800 hover:bg-emerald-50"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ur")}
        aria-pressed={lang === "ur"}
        className={`min-h-[40px] rounded-full px-4 text-lg transition ${
          lang === "ur" ? "bg-emerald-700 text-white shadow" : "text-emerald-800 hover:bg-emerald-50"
        }`}
      >
        اردو
      </button>
    </div>
  );
}
