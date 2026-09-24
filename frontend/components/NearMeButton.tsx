"use client";

import { useState } from "react";
import { T } from "./LanguageContext";
import { PinIcon } from "./icons";
import { detectCitySlug, rememberCitySlug, type DetectError } from "@/lib/geo";

/**
 * "Near me" location button — detects the user's city and hands the slug
 * back through onDetected. Same wording everywhere it's used.
 *
 * If detection fails, there is deliberately NO red error message: the parent
 * opens the city picker instead (via onDetectError), which is self-explanatory
 * and never leaves a stuck error sitting in the hero.
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
  const [detecting, setDetecting] = useState(false);

  const detect = async () => {
    if (detecting) return;
    setDetecting(true);
    try {
      const slug = await detectCitySlug();
      rememberCitySlug(slug);
      onDetected(slug);
    } catch (e) {
      onDetectError?.(e as DetectError);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={detect}
      disabled={detecting}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap font-bold transition disabled:opacity-60 ${
        dark ? "text-white hover:text-brass-200" : "text-court-800 hover:text-court-600"
      } ${
        small ? "min-h-[44px] px-2 text-[0.85rem]" : "min-h-[44px] px-3 text-[0.95rem]"
      }`}
    >
      <PinIcon className={small ? "h-4 w-4" : "h-5 w-5"} />
      {detecting ? (
        <T en="Detecting location…" ur="لوکیشن معلوم ہو رہی ہے…" />
      ) : (
        <T en="Near me" ur="میرے قریب" />
      )}
    </button>
  );
}
