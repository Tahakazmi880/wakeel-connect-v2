"use client";

import type { ReactNode } from "react";
import { T } from "./LanguageContext";

/**
 * Illustrated bilingual empty state — used anywhere a list/section can
 * legitimately be empty (filters with no matches, empty categories, etc.).
 * Never renders a blank hole: always an illustration + honest copy.
 */
export default function EmptyState({
  titleEn,
  titleUr,
  bodyEn,
  bodyUr,
  action,
}: {
  titleEn: string;
  titleUr: string;
  bodyEn?: string;
  bodyUr?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-ink-900/10 bg-white px-6 py-12 text-center shadow-card">
      {/* Scales illustration — line art in theme colors, clearly illustrative */}
      <svg
        width="96"
        height="72"
        viewBox="0 0 96 72"
        fill="none"
        aria-hidden
        className="mb-5"
      >
        <path
          d="M48 8v40M28 20h40"
          stroke="#1f4373"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M28 20l-9 22a10 7 0 0 0 18 0l-9-22zM68 20l-9 22a10 7 0 0 0 18 0l-9-22z"
          stroke="#1f4373"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M38 64h20M48 48v16"
          stroke="#b3873b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="8" r="4" fill="#b3873b" />
      </svg>
      <h3 className="font-display text-[1.35rem] font-semibold text-ink-950">
        <T en={titleEn} ur={titleUr} />
      </h3>
      {(bodyEn || bodyUr) && (
        <p className="mt-2 max-w-md text-[1rem] leading-relaxed text-ink-600">
          <T en={bodyEn ?? ""} ur={bodyUr ?? ""} />
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
