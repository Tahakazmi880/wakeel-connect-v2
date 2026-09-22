"use client";

import { useState } from "react";

/**
 * Lawyer photo with graceful fallback to initials.
 * `photo` points at /lawyers/<slug>.jpg (demo portraits today, real
 * client-supplied photos later). If the image is missing or fails to
 * load, the initials avatar is shown instead — never a broken image.
 */
export function PhotoAvatar({
  name,
  photo,
  size = "lg",
}: {
  name: string;
  photo?: string;
  size?: "sm" | "lg" | "xl" | "2xl";
}) {
  const [failed, setFailed] = useState(false);
  const dims =
    size === "2xl"
      ? "h-32 w-32"
      : size === "xl"
        ? "h-28 w-28"
        : size === "sm"
          ? "h-12 w-12"
          : "h-20 w-20";
  const text =
    size === "2xl"
      ? "text-5xl"
      : size === "xl"
        ? "text-4xl"
        : size === "sm"
          ? "text-lg"
          : "text-2xl";
  const plainName = name.replace(" (Demo)", "");
  const initials = plainName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!photo || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-900 font-extrabold text-white shadow-inner ${dims} ${text}`}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={`Photo of ${plainName}`}
      onError={() => setFailed(true)}
      loading="lazy"
      className={`shrink-0 rounded-2xl object-cover shadow-inner ring-1 ring-slate-200 ${dims}`}
    />
  );
}
