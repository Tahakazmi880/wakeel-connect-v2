"use client";

import { useState } from "react";
import { PlaceholderAvatar } from "./LawyerAvatars";

/**
 * Lawyer photo with graceful fallback to an illustrated avatar.
 * `photo` points at /lawyers/<slug>.jpg (real client-supplied photos).
 * If the image is missing or fails to load, a professional illustrated
 * placeholder is shown (gender-aware) — never a broken image, never a
 * fake person's face, never bare initials.
 */
export function PhotoAvatar({
  name,
  photo,
  gender,
  size = "lg",
  className = "",
}: {
  name: string;
  photo?: string;
  gender?: string;
  size?: "sm" | "lg" | "xl" | "2xl" | "3xl";
  /** Appended to the rendered box — lets callers override dims responsively,
      e.g. className="sm:h-40 sm:w-40" (responsive variants never fight the base size). */
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const dims =
    size === "3xl"
      ? "h-56 w-56"
      : size === "2xl"
      ? "h-40 w-40"
      : size === "xl"
        ? "h-28 w-28"
        : size === "sm"
          ? "h-12 w-12"
          : "h-24 w-24";
  const plainName = name.replace(" (Demo)", "");

  if (!photo || failed) {
    return (
      <div className={`shrink-0 overflow-hidden rounded-lg ring-1 ring-ink-900/15 ${dims} ${className}`} aria-hidden>
        <PlaceholderAvatar gender={gender} />
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={`Photo of ${plainName}`}
      onError={() => setFailed(true)}
      loading="lazy"
      className={`shrink-0 rounded-lg bg-paper-dark object-cover ring-1 ring-ink-900/15 ${dims} ${className}`}
    />
  );
}
