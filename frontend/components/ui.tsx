import type { ReactNode } from "react";
import { T } from "./LanguageContext";
import { CheckBadgeIcon, StarIcon } from "./icons";
import { isAvailableToday, type Lawyer } from "@/lib/data";

/** Star rating row, e.g. ★★★★★ 4.8 (124). */
export function Stars({ rating, count, className = "" }: { rating: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <StarIcon className="h-5 w-5 text-amber-400" />
      <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-slate-500">({count})</span>}
    </span>
  );
}

/** Green "Verified Lawyer" pill. */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 ${className}`}>
      <CheckBadgeIcon className="h-4 w-4 text-emerald-700" />
      <T en="Verified Lawyer" ur="تصدیق شدہ وکیل" />
    </span>
  );
}

/** Green "Aaj Available" / amber "Closed Today" pill. */
export function AvailableBadge() {
  const open = isAvailableToday();
  return open ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-sm font-bold text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <T en="Available Today" ur="آج دستیاب" />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
      <T en="Closed Today" ur="آج بند" />
    </span>
  );
}

/** Big initials avatar — no external images needed. */
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
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 font-extrabold text-white shadow-inner ${dims}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

/** Section heading: small Urdu eyebrow + big title. */
export function SectionHead({ eyebrowUr, title, sub }: { eyebrowUr: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-2 text-lg font-bold text-emerald-700">{eyebrowUr}</p>
      <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">{sub}</p>}
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
}: {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  children: ReactNode;
  type?: "submit" | "button";
  className?: string;
}) {
  const cls = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-emerald-800 hover:shadow-lg active:scale-[0.98] ${className}`;
  if (href) return <a href={href} className={cls}>{icon}{children}</a>;
  return <button type={type ?? "button"} onClick={onClick} className={cls}>{icon}{children}</button>;
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
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const cls = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white px-6 py-3 text-lg font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98] ${className}`;
  if (href) return <a href={href} className={cls}>{icon}{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{icon}{children}</button>;
}

/** Demo-data honesty strip. */
export function DemoNotice() {
  return (
    <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900 ring-1 ring-amber-200">
      <T
        en="Demo data: these lawyer profiles are samples for testing, not real verified lawyers."
        ur="ڈیمو ڈیٹا: یہ وکیل پروفائلز صرف جانچ کے لیے ہیں، حقیقی وکیل نہیں۔"
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
