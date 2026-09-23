"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { Stars } from "./ui";
import { CheckBadgeIcon } from "./icons";
import type { LawyerReview } from "@/lib/api";

const PAGE_SIZE = 5;

/**
 * Reviews section for a lawyer profile — real API reviews only.
 * Satisfaction % is computed from real reviews (4–5 stars); with zero
 * reviews we show the honest empty state, never a fabricated score.
 * Reviews can only be written after a completed booking, so the form
 * lives on the dashboard; here we link there.
 */
export default function ReviewSection({
  reviews,
  ratingAvg,
  ratingCount,
  lawyerName,
}: {
  reviews: LawyerReview[];
  ratingAvg: number;
  ratingCount: number;
  lawyerName: string;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const dist = [5, 4, 3, 2, 1].map((s) => {
    const n = reviews.filter((r) => r.rating === s).length;
    return { star: s, pct: ratingCount === 0 ? 0 : Math.round((n / ratingCount) * 100) };
  });
  const satisfied = ratingCount === 0 ? 0 : Math.round((reviews.filter((r) => r.rating >= 4).length / ratingCount) * 100);
  const shown = reviews.slice(0, visible);

  return (
    <section id="reviews" className="mt-6 scroll-mt-24 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-[1.65rem] font-semibold text-ink-950">
        <T en={`Client reviews (${ratingCount})`} ur={`کلائنٹ کی آراء (${ratingCount})`} />
      </h2>
      <span aria-hidden className="mt-2.5 block h-[3px] w-10 bg-brass-500" />

      {ratingCount === 0 ? (
        <p className="mt-4 rounded-lg bg-paper p-5 text-base text-ink-600">
          <T
            en={`No client reviews yet. Book a consultation with ${lawyerName} — after your consultation, you can leave a review from your dashboard.`}
            ur="ابھی کوئی رائے نہیں۔ مشاورت بک کریں — مشاورت کے بعد آپ اپنے ڈیش بورڈ سے رائے دے سکتے ہیں۔"
          />
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="text-center sm:text-left">
            <p className="font-display text-5xl font-semibold text-ink-950">{ratingAvg.toFixed(1)}</p>
            <div className="mt-2 h-2.5 w-40 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-court-600" style={{ width: `${satisfied}%` }} />
            </div>
            <p className="mt-1.5 text-sm font-bold text-ink-600">
              <T en={`${satisfied}% satisfied`} ur={`${satisfied}% مطمئن`} />
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-sm">
                <span className="flex w-10 items-center gap-0.5 font-bold text-ink-600">{d.star}★</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brass-400" style={{ width: `${Math.max(d.pct, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <Link
          href="/dashboard"
          className="inline-flex min-h-[56px] items-center gap-2 rounded-lg border border-court-700/40 px-6 text-[1.05rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50"
        >
          <T en="Write a review from your dashboard" ur="اپنے ڈیش بورڈ سے رائے لکھیں" />
        </Link>
        <p className="mt-2 text-sm font-semibold text-ink-500">
          <T en="Reviews open after a completed consultation." ur="مکمل مشاورت کے بعد رائے دی جا سکتی ہے۔" />
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {shown.map((r) => (
          <div key={r.id} className="rounded-lg bg-paper-dark/40 p-5 ring-1 ring-ink-900/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold text-ink-950">{r.client.fullName ?? <T en="Client" ur="کلائنٹ" />}</p>
              {r.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-court-100 px-3 py-1 text-sm font-bold text-court-800">
                  <CheckBadgeIcon className="h-4 w-4" /> <T en="Verified client" ur="تصدیق شدہ کلائنٹ" />
                </span>
              )}
            </div>
            <Stars rating={r.rating} className="mt-1" />
            {r.comment && <p className="mt-2 text-base text-ink-700">{r.comment}</p>}
          </div>
        ))}
      </div>

      {visible < reviews.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg border border-court-700/40 px-6 text-[1.02rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50"
        >
          <T en={`Load more reviews (${reviews.length - visible})`} ur={`مزید آراء دیکھیں (${reviews.length - visible})`} />
        </button>
      )}
    </section>
  );
}
