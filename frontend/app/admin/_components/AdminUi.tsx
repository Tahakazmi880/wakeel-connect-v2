"use client";

/**
 * Small shared building blocks for the admin portal.
 * Theme: matches the public site (ink navy, court blue, brass, clay/moss semantics).
 */

import type { ReactNode } from "react";
import { T } from "@/components/LanguageContext";

export function PageHead({
  title,
  sub,
  action,
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold text-ink-950">{title}</h1>
        {sub ? <p className="mt-1 max-w-2xl text-lg text-ink-600">{sub}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  value,
  label,
  sub,
  tone = "ink",
}: {
  value: string;
  label: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "court" | "brass" | "clay";
}) {
  const tones: Record<string, string> = {
    ink: "text-ink-950",
    court: "text-court-700",
    brass: "text-brass-700",
    clay: "text-clay-700",
  };
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <p className={`font-display text-[2.2rem] font-semibold leading-none ${tones[tone]}`}>{value}</p>
      <p className="mt-2 text-base font-bold text-ink-700">{label}</p>
      {sub ? <p className="mt-1 text-sm text-ink-500">{sub}</p> : null}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-hidden className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-ink-900/5" />
      ))}
    </div>
  );
}

export function ErrorBox({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-xl bg-clay-50 p-10 text-center ring-1 ring-clay-200">
      <p className="text-xl font-bold text-clay-700">
        <T en="Couldn't load this section." ur="یہ سیکشن لوڈ نہیں ہو سکا۔" />
      </p>
      <p className="mt-1 text-base text-clay-600">
        <T en="Check your connection and try again." ur="کنکشن چیک کریں اور دوبارہ کوشش کریں۔" />
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-[52px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
        >
          <T en="Try again" ur="دوبارہ کوشش کریں" />
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, sub }: { title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-xl bg-court-50 p-10 text-center ring-1 ring-court-200">
      <p className="text-xl font-bold text-court-800">{title}</p>
      {sub ? <p className="mt-1 text-base text-court-700/80">{sub}</p> : null}
    </div>
  );
}

/** Status pill with honest, semantic colors. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-brass-100 text-brass-800 ring-brass-300",
    UNDER_REVIEW: "bg-court-100 text-court-800 ring-court-300",
    APPROVED: "bg-moss-100 text-moss-700 ring-moss-600/30",
    CONFIRMED: "bg-moss-100 text-moss-700 ring-moss-600/30",
    COMPLETED: "bg-moss-100 text-moss-700 ring-moss-600/30",
    REJECTED: "bg-clay-100 text-clay-700 ring-clay-200",
    CANCELLED: "bg-clay-100 text-clay-700 ring-clay-200",
    SUSPENDED: "bg-clay-100 text-clay-700 ring-clay-200",
    NEW: "bg-brass-100 text-brass-800 ring-brass-300",
    CONTACTED: "bg-court-100 text-court-800 ring-court-300",
    CONVERTED: "bg-moss-100 text-moss-700 ring-moss-600/30",
    CLOSED: "bg-ink-900/5 text-ink-600 ring-ink-900/10",
    NO_SHOW: "bg-clay-100 text-clay-700 ring-clay-200",
  };
  const cls = map[status] ?? "bg-ink-900/5 text-ink-600 ring-ink-900/10";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold ring-1 ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

/**
 * Honest placeholder for portal sections whose backend endpoint does not
 * exist yet. Lists exactly what the API must add — no fake data.
 */
export function MissingEndpoint({
  title,
  sub,
  needed,
}: {
  title: ReactNode;
  sub?: ReactNode;
  needed: { method: string; path: string; why: string }[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink-900/20 bg-white p-8">
      <p className="font-display text-[1.4rem] font-semibold text-ink-950">{title}</p>
      {sub ? <p className="mt-2 max-w-2xl text-lg text-ink-600">{sub}</p> : null}
      <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-ink-400">
        <T en="Needed from the API" ur="اے پی آئی سے درکار" />
      </p>
      <ul className="mt-2 space-y-2">
        {needed.map((n) => (
          <li key={n.path} className="flex flex-col gap-1 rounded-lg bg-ink-900/[0.03] p-3 sm:flex-row sm:items-center sm:gap-3">
            <code className="shrink-0 rounded bg-ink-950 px-2 py-1 font-mono text-sm text-white">
              {n.method} {n.path}
            </code>
            <span className="text-base text-ink-600">{n.why}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-400">
        <T
          en="This page stays honest until these endpoints exist — nothing here is guessed or mocked."
          ur="ان اینڈپوائنٹس کے آنے تک یہ صفحہ خالی رہے گا — یہاں کچھ بھی اندازے سے نہیں دکھایا جاتا۔"
        />
      </p>
    </div>
  );
}
