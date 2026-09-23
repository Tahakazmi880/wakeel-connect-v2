"use client";

import Link from "next/link";
import { T } from "./LanguageContext";
import { Stars } from "./ui";
import { CheckBadgeIcon } from "./icons";
import type { LawyerReview } from "@/lib/api";

/**
 * Reviews section for a lawyer profile — real API reviews only.
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
  const dist = [5, 4, 3, 2, 1].map((s) => {
    const n = reviews.filter((r) => r.rating === s).length;
    return { star: s, pct: ratingCount === 0 ? 0 : Math.round((n / ratingCount) * 100) };
  });

  return (
    <section id="reviews" className="mt-6 scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900">
        <T en={`Client reviews (${ratingCount})`} ur={`کلائنٹ کی آراء (${ratingCount})`} />
      </h2>

      {ratingCount === 0 ? (
        <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-base text-slate-600">
          <T
            en={`No client reviews yet. Book a consultation with ${lawyerName} — after your consultation, you can leave a review from your dashboard.`}
            ur="ابھی کوئی رائے نہیں۔ مشاورت بک کریں — مشاورت کے بعد آپ اپنے ڈیش بورڈ سے رائے دے سکتے ہیں۔"
          />
        </p>
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <p className="text-5xl font-extrabold text-slate-900">{ratingAvg.toFixed(1)}</p>
          <div className="flex-1 space-y-1.5">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-sm">
                <span className="flex w-10 items-center gap-0.5 font-bold text-slate-600">{d.star}★</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.max(d.pct, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <Link
          href="/dashboard"
          className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-2 border-emerald-700 px-6 text-lg font-extrabold text-emerald-800 transition hover:bg-emerald-50"
        >
          <span aria-hidden>✍️</span>
          <T en="Write a review from your dashboard" ur="اپنے ڈیش بورڈ سے رائے لکھیں" />
        </Link>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          <T en="Reviews open after a completed consultation." ur="مکمل مشاورت کے بعد رائے دی جا سکتی ہے۔" />
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-extrabold text-slate-900">{r.client.fullName ?? <T en="Client" ur="کلائنٹ" />}</p>
              {r.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                  <CheckBadgeIcon className="h-4 w-4" /> <T en="Verified client" ur="تصدیق شدہ کلائنٹ" />
                </span>
              )}
            </div>
            <Stars rating={r.rating} className="mt-1" />
            {r.comment && <p className="mt-2 text-base text-slate-700">{r.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
