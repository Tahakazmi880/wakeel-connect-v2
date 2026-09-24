"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./LanguageContext";
import { PinIcon } from "./icons";
import { detectCitySlug, rememberCitySlug, type DetectError } from "@/lib/geo";

const ERROR_TEXT: Record<DetectError, { en: string; ur: string }> = {
  unsupported: {
    en: "Your browser can't detect location — please pick your city.",
    ur: "آپ کا براؤزر لوکیشن معلوم نہیں کر سکتا — اپنا شہر خود منتخب کریں۔",
  },
  denied: {
    en: "Location permission was denied — please pick your city.",
    ur: "لوکیشن کی اجازت نہیں دی گئی — اپنا شہر خود منتخب کریں۔",
  },
  unavailable: {
    en: "Location is unavailable right now — please pick your city.",
    ur: "لوکیشن ابھی دستیاب نہیں — اپنا شہر خود منتخب کریں۔",
  },
  timeout: {
    en: "Detecting your location took too long — please pick your city.",
    ur: "لوکیشن معلوم کرنے میں دیر ہو گئی — اپنا شہر خود منتخب کریں۔",
  },
  "too-far": {
    en: "You're outside our served cities — please pick the nearest one.",
    ur: "آپ ہمارے شہروں سے باہر ہیں — قریب ترین شہر منتخب کریں۔",
  },
};

/**
 * "Near me" location button — detects the user's city and hands the slug
 * back through onDetected. Same wording everywhere it's used.
 */
export default function NearMeButton({
  onDetected,
  onDetectError,
  small,
  dark,
}: {
  onDetected: (slug: string) => void;
  /** Called when detection fails so the parent can offer a manual fallback (e.g. open the city picker). */
  onDetectError?: (err: DetectError) => void;
  small?: boolean;
  /** Light text for use on dark backgrounds (e.g. the mobile hero card). */
  dark?: boolean;
}) {
  const [state, setState] = useState<"idle" | "detecting" | DetectError>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const detect = async () => {
    if (state === "detecting") return;
    if (timer.current) clearTimeout(timer.current);
    setState("detecting");
    try {
      const slug = await detectCitySlug();
      rememberCitySlug(slug);
      setState("idle");
      onDetected(slug);
    } catch (e) {
      const err = e as DetectError;
      setState(err);
      onDetectError?.(err);
      // Transient notice only — never leave a stuck red error sitting in the hero.
      timer.current = setTimeout(() => setState("idle"), 4500);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={detect}
        disabled={state === "detecting"}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap font-bold transition disabled:opacity-60 ${
          dark ? "text-white hover:text-brass-200" : "text-court-800 hover:text-court-600"
        } ${
          small ? "min-h-[44px] px-2 text-[0.85rem]" : "min-h-[44px] px-3 text-[0.95rem]"
        }`}
      >
        <PinIcon className={small ? "h-4 w-4" : "h-5 w-5"} />
        {state === "detecting" ? (
          <T en="Detecting location…" ur="لوکیشن معلوم ہو رہی ہے…" />
        ) : (
          <T en="Near me" ur="میرے قریب" />
        )}
      </button>
      {state !== "idle" && state !== "detecting" && (
        <span role="alert" className={`max-w-[220px] text-[0.82rem] font-semibold leading-snug ${dark ? "text-red-200" : "text-red-700"}`}>
          <T en={ERROR_TEXT[state].en} ur={ERROR_TEXT[state].ur} />
        </span>
      )}
    </span>
  );
}
