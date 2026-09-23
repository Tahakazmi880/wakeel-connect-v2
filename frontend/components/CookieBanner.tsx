"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";

const KEY = "wc-cookie-consent";
const LEGACY_KEY = "wc-cookie-ok";

/** Cookie-consent banner: explicit Accept / Reject, remembered in localStorage, never nags again. */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      // Migrate the old "Got it"-only flag: it counts as accepted.
      if (!localStorage.getItem(KEY) && localStorage.getItem(LEGACY_KEY)) {
        localStorage.setItem(KEY, "accepted");
      }
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, value);
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
            en="We use cookies to remember your language and keep the site working smoothly. Accept or reject — your choice is saved."
            ur="ہم آپ کی زبان یاد رکھنے اور سائٹ بہتر چلانے کے لیے کوکیز استعمال کرتے ہیں۔ قبول کریں یا مسترد — آپ کا فیصلہ محفوظ رہے گا۔"
          />
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="inline-flex min-h-[52px] items-center justify-center rounded-lg border border-ink-900/15 bg-white px-6 text-base font-bold text-ink-700 transition hover:bg-paper"
          >
            <T en="Reject" ur="مسترد کریں" />
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex min-h-[52px] items-center justify-center rounded-lg bg-court-700 px-6 text-base font-bold text-white transition hover:bg-court-800"
          >
            <T en="Accept" ur="قبول کریں" />
          </button>
        </div>
      </div>
    </div>
  );
}
