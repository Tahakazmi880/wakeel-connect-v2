"use client";

/**
 * Review & Q&A moderation — hide/unhide client reviews and lock/unlock
 * forum questions, via GET/PATCH /admin/reviews and /admin/questions.
 * Destructive actions use a two-step inline confirm (no dialog needed).
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { ArrowIcon, ChatIcon, StarIcon } from "@/components/icons";
import {
  listAdminReviews,
  setReviewHidden,
  listAdminQuestions,
  setQuestionLocked,
  type AdminReview,
  type AdminQuestion,
} from "../_components/adminApi";
import { PageHead, LoadingRows, ErrorBox, EmptyState, StatusBadge } from "../_components/AdminUi";

const PAGE_SIZE = 20;

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

/** Two-step inline confirm button: "Hide" → "Confirm hide?" */
function ConfirmButton({
  idle,
  confirming,
  onConfirm,
  tone,
}: {
  idle: { en: string; ur: string };
  confirming: { en: string; ur: string };
  onConfirm: () => void;
  tone: "clay" | "moss" | "court";
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const tones = {
    clay: "bg-clay-700 hover:bg-clay-800",
    moss: "bg-moss-700 hover:bg-moss-800",
    court: "bg-court-700 hover:bg-court-800",
  };
  const handle = async () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      setArmed(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void handle()}
        onBlur={() => setArmed(false)}
        className={`min-h-[52px] rounded-lg px-5 text-base font-bold text-white transition disabled:opacity-50 ${
          armed ? "bg-ink-950 hover:bg-ink-900" : tones[tone]
        }`}
      >
        {busy ? <T en="Saving…" ur="محفوظ ہو رہا ہے…" /> : armed ? <T en={confirming.en} ur={confirming.ur} /> : <T en={idle.en} ur={idle.ur} />}
      </button>
      {armed && !busy && (
        <button
          type="button"
          onClick={() => setArmed(false)}
          className="min-h-[52px] rounded-lg border border-ink-900/15 px-4 text-base font-bold text-ink-600 hover:bg-ink-900/5"
        >
          <T en="Cancel" ur="منسوخ کریں" />
        </button>
      )}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} className={`h-4 w-4 ${i <= n ? "text-brass-500" : "text-ink-900/15"}`} />
      ))}
    </span>
  );
}

function ReviewCard({ review, onChange }: { review: AdminReview; onChange: (id: string, hidden: boolean) => void }) {
  const toggle = async () => {
    const res = await setReviewHidden(review.id, !review.hidden);
    onChange(review.id, res.hidden);
  };
  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm ${review.hidden ? "border-clay-300 opacity-80" : "border-ink-900/10"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Stars n={review.rating} />
            {review.verified && (
              <span className="text-sm font-bold text-moss-700">
                <T en="Verified client" ur="تصدیق شدہ کلائنٹ" />
              </span>
            )}
            {review.hidden && <StatusBadge status="HIDDEN" />}
          </div>
          {review.comment && <p className="mt-2 text-base text-ink-700">“{review.comment}”</p>}
          <p className="mt-2 text-sm text-ink-500">
            <T en="For" ur="بابت" />{" "}
            <Link href={`/lawyers/${review.lawyer.slug}`} className="font-bold text-court-700 hover:underline">
              {review.lawyer.displayName}
            </Link>{" "}
            · <T en="by" ur="از" /> {review.client.fullName} · {fmtDate(review.createdAt)}
          </p>
          {review.hidden && (
            <p className="mt-1 text-sm font-bold text-clay-700">
              <T en="Hidden from the public site. The lawyer's rating was recomputed without it." ur="عوامی سائٹ سے چھپایا گیا۔ وکیل کی ریٹنگ اس کے بغیر دوبارہ حساب کی گئی۔" />
            </p>
          )}
        </div>
        <div className="shrink-0">
          {review.hidden ? (
            <ConfirmButton
              idle={{ en: "Unhide", ur: "دوبارہ دکھائیں" }}
              confirming={{ en: "Confirm unhide?", ur: "دوبارہ دکھائیں؟" }}
              onConfirm={toggle}
              tone="moss"
            />
          ) : (
            <ConfirmButton
              idle={{ en: "Hide", ur: "چھپائیں" }}
              confirming={{ en: "Confirm hide?", ur: "چھپانے کی تصدیق؟" }}
              onConfirm={toggle}
              tone="clay"
            />
          )}
        </div>
      </div>
    </article>
  );
}

function QuestionCard({
  question,
  onChange,
}: {
  question: AdminQuestion;
  onChange: (id: string, locked: boolean) => void;
}) {
  const toggle = async () => {
    const res = await setQuestionLocked(question.id, !question.isLocked);
    onChange(question.id, res.isLocked);
  };
  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm ${question.isLocked ? "border-brass-300" : "border-ink-900/10"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {question.isLocked && <StatusBadge status="LOCKED" />}
            {question.isSeed && <StatusBadge status="SEED" />}
          </div>
          <p className="mt-1 font-display text-[1.15rem] font-semibold text-ink-950">{question.title}</p>
          <p className="mt-1 line-clamp-2 text-base text-ink-600">{question.body}</p>
          <p className="mt-2 text-sm text-ink-500">
            {question.area ? <T en={question.area.nameEn} ur={question.area.nameUr} /> : <T en="General" ur="عام" />}{" "}
            ·{" "}
            <T
              en={`${question._count.answers} ${question._count.answers === 1 ? "answer" : "answers"}`}
              ur={`${question._count.answers} جوابات`}
            />{" "}
            · <T en="by" ur="از" /> {question.authorName} · {fmtDate(question.createdAt)}
          </p>
          {question.isLocked && (
            <p className="mt-1 text-sm font-bold text-brass-700">
              <T en="Locked — no new answers can be posted." ur="لاک ہے — نئے جوابات پوسٹ نہیں ہو سکتے۔" />
            </p>
          )}
        </div>
        <div className="shrink-0">
          {question.isLocked ? (
            <ConfirmButton
              idle={{ en: "Unlock", ur: "ان لاک کریں" }}
              confirming={{ en: "Confirm unlock?", ur: "ان لاک کی تصدیق؟" }}
              onConfirm={toggle}
              tone="court"
            />
          ) : (
            <ConfirmButton
              idle={{ en: "Lock", ur: "لاک کریں" }}
              confirming={{ en: "Confirm lock?", ur: "لاک کی تصدیق؟" }}
              onConfirm={toggle}
              tone="clay"
            />
          )}
        </div>
      </div>
    </article>
  );
}

function Pager({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:bg-ink-900/5 disabled:opacity-40"
      >
        <T en="Previous" ur="پچھلا" />
      </button>
      <p className="text-base font-bold text-ink-600">
        <T en={`Page ${page} of ${pages}`} ur={`صفحہ ${page} از ${pages}`} />
      </p>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:bg-ink-900/5 disabled:opacity-40"
      >
        <T en="Next" ur="اگلا" /> <ArrowIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminReviews({ page: p, limit: PAGE_SIZE });
      setReviews(res.reviews);
      setTotal(res.total);
      setPage(res.page);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  const applyChange = useCallback((id: string, hidden: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, hidden } : r)));
  }, []);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (fetching) return <LoadingRows rows={4} />;
  if (error) return <ErrorBox onRetry={() => void load(page)} />;
  if (reviews.length === 0)
    return (
      <EmptyState
        title={<T en="No reviews yet." ur="ابھی کوئی رائے نہیں۔" />}
        sub={<T en="Client reviews appear here once bookings are completed and rated." ur="بکنگز مکمل ہو کر ریٹ ہونے پر کلائنٹ کی رائے یہاں نظر آئے گی۔" />}
      />
    );
  return (
    <>
      <p className="mb-3 text-sm text-ink-500">
        <T en={`Showing ${reviews.length} of ${total}`} ur={`${total} میں سے ${reviews.length} دکھائی جا رہی ہیں`} />
      </p>
      <div className="space-y-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} onChange={applyChange} />
        ))}
      </div>
      <Pager page={page} pages={pages} onPage={(p) => void load(p)} />
    </>
  );
}

function QuestionsTab() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminQuestions({ page: p, limit: PAGE_SIZE });
      setQuestions(res.questions);
      setTotal(res.total);
      setPage(res.page);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  const applyChange = useCallback((id: string, locked: boolean) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isLocked: locked } : q)));
  }, []);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (fetching) return <LoadingRows rows={4} />;
  if (error) return <ErrorBox onRetry={() => void load(page)} />;
  if (questions.length === 0)
    return (
      <EmptyState
        title={<T en="No questions yet." ur="ابھی کوئی سوال نہیں۔" />}
        sub={<T en="Forum questions appear here once people start asking." ur="جب لوگ سوالات پوچھیں گے تو وہ یہاں نظر آئیں گے۔" />}
      />
    );
  return (
    <>
      <p className="mb-3 text-sm text-ink-500">
        <T en={`Showing ${questions.length} of ${total}`} ur={`${total} میں سے ${questions.length} دکھائے جا رہے ہیں`} />
      </p>
      <div className="space-y-3">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} onChange={applyChange} />
        ))}
      </div>
      <Pager page={page} pages={pages} onPage={(p) => void load(p)} />
    </>
  );
}

export default function AdminModerationPage() {
  const [tab, setTab] = useState<"reviews" | "questions">("reviews");

  return (
    <div>
      <PageHead
        title={<T en="Moderation" ur="نگرانی" />}
        sub={
          <T
            en="Keep client reviews and legal Q&A trustworthy — hide a review that breaks the rules, or lock a question to stop new answers."
            ur="کلائنٹ کی رائے اور قانونی سوال و جواب کو قابلِ اعتماد رکھیں — خلافِ ضابطہ رائے چھپائیں، یا سوال لاک کر کے نئے جوابات روکیں۔"
          />
        }
      />

      <div className="mb-4 flex gap-2" role="tablist" aria-label="Moderation sections">
        {(
          [
            { id: "reviews", icon: <StarIcon className="h-5 w-5" />, en: "Reviews", ur: "آراء" },
            { id: "questions", icon: <ChatIcon className="h-5 w-5" />, en: "Q&A", ur: "سوال و جواب" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-xl px-5 text-base font-bold ring-1 transition ${
              tab === t.id
                ? "bg-court-700 text-white ring-court-700"
                : "bg-white text-ink-600 ring-ink-900/10 hover:text-ink-900"
            }`}
          >
            {t.icon} <T en={t.en} ur={t.ur} />
          </button>
        ))}
      </div>

      {tab === "reviews" ? <ReviewsTab /> : <QuestionsTab />}
    </div>
  );
}
