"use client";

import { useState, type ReactNode } from "react";
import { T } from "./LanguageContext";
import { CheckBadgeIcon, StarIcon } from "./icons";
import { isAvailableToday, type Lawyer } from "@/lib/data";

/** Star rating row, e.g. ★★★★★ 4.8 (124). */
export function Stars({ rating, count, className = "" }: { rating: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <StarIcon className="h-5 w-5 text-brass-400" />
      <span className="font-display text-lg font-semibold text-ink-950">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-ink-500">({count})</span>}
    </span>
  );
}

/** Lawyer rating with zero-review honesty: never shows a star score without reviews. */
export function Rating({ rating, count, className = "" }: { rating: number; count: number; className?: string }) {
  if (count === 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-ink-600 ${className}`}>
        <StarIcon className="h-5 w-5 text-ink-300" />
        <T en="No reviews yet" ur="ابھی کوئی رائے نہیں" />
      </span>
    );
  }
  return <Stars rating={rating} count={count} className={className} />;
}

/** "Verified Lawyer" badge — brass hairline, never a loud pill. */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-brass-600/30 bg-brass-50 px-3 py-1 text-sm font-bold text-brass-700 ${className}`}>
      <CheckBadgeIcon className="h-4 w-4 text-brass-600" />
      <T en="Verified Lawyer" ur="تصدیق شدہ وکیل" />
    </span>
  );
}

/** "Available Today" (moss) / "Closed Today" (brass) pill — semantic colors only. */
export function AvailableBadge() {
  const open = isAvailableToday();
  return open ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-600 px-3 py-1 text-sm font-bold text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <T en="Available Today" ur="آج دستیاب" />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brass-100 px-3 py-1 text-sm font-bold text-brass-700">
      <T en="Closed Today" ur="آج بند" />
    </span>
  );
}

/** Lawyer initials avatar — flat ink, serif initials, no gradients. */
export function Avatar({ name, size = "lg" }: { name: string; size?: "sm" | "lg" | "xl" }) {
  const initials = name
    .replace(" (Demo)", "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const dims = size === "xl" ? "h-28 w-28 text-4xl" : size === "sm" ? "h-12 w-12 text-lg" : "h-20 w-20 text-2xl";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-ink-800 font-display font-semibold text-paper ring-1 ring-ink-900/10 ${dims}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

/**
 * Editorial section heading: brass kicker, serif title, short brass rule.
 * Left-aligned by default — centered only when the section truly calls for it.
 */
export function SectionHead({
  eyebrowEn,
  eyebrowUr,
  title,
  sub,
  align = "left",
}: {
  eyebrowEn?: ReactNode;
  eyebrowUr?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  const hasKicker = eyebrowEn !== undefined || eyebrowUr !== undefined;
  return (
    <div className={`mb-10 flex max-w-3xl flex-col ${centered ? "mx-auto items-center text-center" : "items-start text-left"}`}>
      {hasKicker && (
        <p className="wc-kicker">
          <T en={eyebrowEn ?? ""} ur={eyebrowUr ?? ""} />
        </p>
      )}
      <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.15] text-ink-950 sm:text-[2.5rem]">
        {title}
      </h2>
      <span aria-hidden className="mt-5 h-[3px] w-12 bg-brass-500" />
      {sub && <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-600">{sub}</p>}
    </div>
  );
}

/** Primary / secondary big buttons — always icon + text, 48px+ tall. */
export function PrimaryBtn({
  href,
  onClick,
  icon,
  children,
  type,
  className = "",
  disabled = false,
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  type?: "submit" | "button";
  className?: string;
  disabled?: boolean;
}) {
  const cls = `inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-3 text-[1.05rem] font-bold text-white shadow-card transition hover:shadow-lift active:translate-y-px ${disabled ? "cursor-not-allowed bg-ink-300 shadow-none" : "bg-court-700 hover:bg-court-800"} ${className}`;
  if (href && !disabled) return <a href={href} className={cls}>{icon}{children}</a>;
  return <button type={type ?? "button"} onClick={disabled ? undefined : onClick} disabled={disabled} className={cls}>{icon}{children}</button>;
}

export function SecondaryBtn({
  href,
  onClick,
  icon,
  children,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const cls = `inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-court-700/40 bg-white px-6 py-3 text-[1.05rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 active:translate-y-px ${className}`;
  if (href) return <a href={href} className={cls}>{icon}{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{icon}{children}</button>;
}

/** Demo-data honesty strip. Shown on mixed listing pages. */
export function DemoNotice() {
  return (
    <p className="rounded-lg bg-brass-50 px-4 py-3 text-center text-sm font-medium text-brass-800 ring-1 ring-brass-200">
      <T
        en="Profiles marked (Demo) are samples for testing, not real lawyers."
        ur="‎(Demo)‎ لکھے پروفائلز صرف جانچ کے لیے ہیں، حقیقی وکیل نہیں۔"
      />
    </p>
  );
}

/** "Next available" line for cards, derived from demo slot logic. */
export function nextAvailableText(lawyer: Lawyer): { en: string; ur: string } {
  const open = isAvailableToday();
  const fee = (lawyer.consultationFeePaisa / 100).toLocaleString("en-PK");
  if (open) return { en: `Today · Rs. ${fee}`, ur: `آج · ${fee} روپے` };
  return { en: `Mon–Fri · Rs. ${fee}`, ur: `پیر تا جمعہ · ${fee} روپے` };
}

/**
 * Image that can never render broken: when `src` is missing or the load
 * fails, `fallback` is rendered instead (illustrated placeholder, jali
 * panel, company name — never a broken-image icon, never an empty hole).
 */
export function SafeImage({
  src,
  alt,
  className = "",
  fallback,
  eager = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback: ReactNode;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
