"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";
import { PrimaryBtn, Stars } from "./ui";
import { CheckBadgeIcon } from "./icons";
import type { Review } from "@/lib/data";
import { getLocalReviews, saveLocalReview, type LocalReview } from "@/lib/community";

/**
 * Reviews section for a lawyer profile.
 * Merges built-in reviews with reviews the visitor wrote on this device.
 */
export default function ReviewSection({
  lawyerSlug,
  lawyerName,
  baseReviews,
  baseCount,
  baseRating,
}: {
  lawyerSlug: string;
  lawyerName: string;
  baseReviews: Review[];
  baseCount: number;
  baseRating: number;
}) {
  const [local, setLocal] = useState<LocalReview[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLocal(getLocalReviews(lawyerSlug));
  }, [lawyerSlug]);

  const total = baseCount + local.length;
  const avg = total === 0 ? 0 : (baseRating * baseCount + local.reduce((s, r) => s + r.rating, 0)) / total;

  const dist = [5, 4, 3, 2, 1].map((s) => {
    const n = baseReviews.filter((r) => r.rating === s).length + local.filter((r) => r.rating === s).length;
    return { star: s, pct: total === 0 ? 0 : Math.round((n / total) * 100) };
  });

  const submit = () => {
    if (!name.trim() || !comment.trim() || stars < 1) return;
    setLocal(saveLocalReview({ lawyerSlug, clientName: name.trim().slice(0, 40), rating: stars, comment: comment.trim().slice(0, 500) }));
    setFormOpen(false);
    setDone(true);
    setName("");
    setComment("");
    setStars(5);
  };

  return (
    <section id="reviews" className="mt-6 scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900">
        <T en={`Client reviews (${total})`} ur={`کلائنٹ کی آراء (${total})`} />
      </h2>

      {total === 0 ? (
        <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-base text-slate-600">
          <T en={`No client reviews yet. Book a consultation with ${lawyerName} — after your case, your review will appear here.`}
             ur="ابھی کوئی رائے نہیں۔ مشورہ بک کریں — آپ کے کیس کے بعد آپ کی رائے یہاں نظر آئے گی۔" />
        </p>
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <p className="text-5xl font-extrabold text-slate-900">{avg.toFixed(1)}</p>
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

      {/* Review form */}
      {!formOpen && !done && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-2 border-emerald-700 px-6 text-lg font-extrabold text-emerald-800 transition hover:bg-emerald-50"
          >
            <span aria-hidden>✍️</span>
            <T en="Write a review" ur="رائے لکھیں" />
          </button>
        </div>
      )}
      {done && (
        <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-base font-bold text-emerald-800 ring-1 ring-emerald-200">
          <T en="✅ Thank you! Your review is now visible below." ur="✅ شکریہ! آپ کی رائے نیچے نظر آ رہی ہے۔" />
        </p>
      )}
      {formOpen && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:p-6">
          <p className="text-lg font-extrabold text-slate-900"><T en="Your review" ur="آپ کی رائے" /></p>
          <div className="mt-3 flex items-center gap-2" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={stars === s}
                aria-label={`${s} star${s > 1 ? "s" : ""}`}
                onClick={() => setStars(s)}
                className="min-h-[52px] min-w-[52px] text-4xl transition active:scale-110"
              >
                <span aria-hidden className={s <= stars ? "" : "opacity-25"}>⭐</span>
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Your name" ur="آپ کا نام" /></span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="e.g. Ahmed K."
              className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-lg font-bold outline-none focus:border-emerald-600"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Your experience" ur="آپ کا تجربہ" /></span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="How was the consultation? Was the advice helpful?"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold outline-none focus:border-emerald-600"
            />
          </label>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            <T en="Demo — your review is saved on this device only until accounts launch." ur="ڈیمو — اکاؤنٹس آنے تک آپ کی رائے صرف اس ڈیوائس پر محفوظ ہے۔" />
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryBtn onClick={submit} disabled={!name.trim() || !comment.trim()}>
              <T en="Post review" ur="رائے شائع کریں" />
            </PrimaryBtn>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="inline-flex min-h-[56px] items-center rounded-2xl border-2 border-slate-200 px-6 text-lg font-bold text-slate-600"
            >
              <T en="Cancel" ur="منسوخ" />
            </button>
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {local.map((r) => (
          <div key={r.id} className="rounded-2xl bg-emerald-50/60 p-5 ring-1 ring-emerald-100">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-extrabold text-slate-900">{r.clientName}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                <T en="Your review" ur="آپ کی رائے" />
              </span>
            </div>
            <Stars rating={r.rating} className="mt-1" />
            <p className="mt-2 text-base text-slate-700">{r.comment}</p>
          </div>
        ))}
        {baseReviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-extrabold text-slate-900">{r.clientName}</p>
              {r.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                  <CheckBadgeIcon className="h-4 w-4" /> <T en="Verified client" ur="تصدیق شدہ کلائنٹ" />
                </span>
              )}
            </div>
            <Stars rating={r.rating} className="mt-1" />
            <p className="mt-2 text-base text-slate-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
