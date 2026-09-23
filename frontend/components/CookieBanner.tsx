"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";

const KEY = "wc-cookie-ok";

/** Simple cookie-consent banner — dismiss once, remembered in localStorage. */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border border-ink-900/10 bg-white p-5 shadow-2xl sm:flex-row sm:items-center">
        <p className="flex-1 text-base leading-relaxed text-ink-700">
          
          <T
            en="We use cookies to remember your language and keep the site working smoothly."
            ur="ہم آپ کی زبان یاد رکھنے اور سائٹ بہتر چلانے کے لیے کوکیز استعمال کرتے ہیں۔"
          />
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-lg bg-court-700 px-6 text-base font-bold text-white transition hover:bg-court-800"
        >
          <T en="Got it" ur="سمجھ گیا" />
        </button>
      </div>
    </div>
  );
}
