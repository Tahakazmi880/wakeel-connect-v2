"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "@/components/ui";
import {
  getQuestion,
  answerQuestion,
  ApiError,
  type ForumQuestion,
  type ForumAnswer,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type DetailQuestion = ForumQuestion & { isLocked?: boolean; answers: ForumAnswer[] };

function timeAgo(iso: string): string {
  const d = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(d / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

export default function QuestionDetailClient({
  initialQuestion,
}: {
  initialQuestion: DetailQuestion | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<DetailQuestion | null>(initialQuestion);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-[1.65rem] font-semibold text-ink-950"><T en="Question not found" ur="سوال نہیں ملا" /></p>
        <p className="mt-2 text-base text-ink-600">
          <T en="It may have been removed, or the link is wrong." ur="شاید یہ ہٹا دیا گیا ہو، یا لنک غلط ہو۔" />
        </p>
        <div className="mt-6"><SecondaryBtn href="/questions"><T en="Back to questions" ur="سوالات پر واپس" /></SecondaryBtn></div>
      </div>
    );
  }

  const area = question.area;
  const locked = !!question.isLocked;
  const textOk = text.trim().length >= 10 && text.trim().length <= 2000;

  const submit = async () => {
    if (!textOk || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await answerQuestion(question.id, text.trim());
      const fresh = await getQuestion(question.id);
      setQuestion(fresh.question as DetailQuestion);
      setText("");
    } catch (e) {
      if (e instanceof ApiError && e.code === "LOCKED") {
        setError("locked");
      } else {
        setError("generic");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/questions" className="text-base font-bold text-court-700 hover:underline">
        <T en="← All questions" ur="← تمام سوالات" />
      </Link>

      <article className="mt-4 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="rounded-full bg-court-100 px-3 py-1 text-court-800">
            {area ? <T en={area.nameEn} ur={area.nameUr} /> : <T en="General" ur="عام" />}
          </span>
          <span className="text-ink-400">{question.authorName} · {timeAgo(question.createdAt)}</span>
          {question.isSeed && (
            <span className="rounded-full bg-ink-900/5 px-3 py-1 text-sm font-semibold text-ink-600 ring-1 ring-ink-900/10">
              <T en="Sample" ur="نمونہ" />
            </span>
          )}
        </p>
        <h1 className="mt-3 font-display text-[1.75rem] font-semibold text-ink-950 sm:text-3xl">{question.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-lg text-ink-700">{question.body}</p>
        {question.isSeed && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900/5 px-4 py-1.5 text-sm font-bold text-ink-600">
            
            <T en="Sample question — answered by our legal team" ur="نمونہ سوال — ہماری قانونی ٹیم کا جواب" />
          </p>
        )}
      </article>

      <h2 className="mt-8 font-display text-[1.65rem] font-semibold text-ink-950">
        <T en={`Answers (${question.answers.length})`} ur={`جوابات (${question.answers.length})`} />
      </h2>
      <div className="mt-4 space-y-4">
        {question.answers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-300 bg-white p-8 text-center text-lg text-ink-500">
            <T en="No answers yet — share what you know below." ur="ابھی کوئی جواب نہیں — نیچے اپنی معلومات شیئر کریں۔" />
          </p>
        ) : (
          question.answers.map((a) => (
            <div key={a.id} className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm sm:p-6">
              <p className="flex flex-wrap items-center gap-2 text-base font-bold text-ink-950">
                {a.authorName}
                {a.isSeed && (
                  <span className="rounded-full bg-court-100 px-2.5 py-0.5 text-xs font-bold text-court-800">
                    <T en="Legal team" ur="قانونی ٹیم" />
                  </span>
                )}
                <span className="text-sm font-semibold text-ink-400">{timeAgo(a.createdAt)}</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-base text-ink-700">{a.body}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="font-display text-[1.3rem] font-semibold text-ink-950"><T en="Write an answer" ur="جواب لکھیں" /></p>
        {locked ? (
          <p className="mt-3 rounded-lg bg-brass-50 p-4 text-base font-semibold text-brass-800 ring-1 ring-brass-200">
            <T en="This question is locked — answers are read-only." ur="یہ سوال بند ہے — جوابات صرف پڑھنے کے لیے ہیں۔" />
          </p>
        ) : !user ? (
          <div className="mt-3">
            <p className="text-base text-ink-600">
              <T en="Login to share your answer — it takes 30 seconds." ur="جواب دینے کے لیے لاگ اِن کریں — صرف 30 سیکنڈ۔" />
            </p>
            <div className="mt-4">
              <PrimaryBtn href={`/login?next=${encodeURIComponent(`/questions/${question.id}`)}`}>
                <T en="Login / Sign up" ur="لاگ اِن / اکاؤنٹ بنائیں" />
              </PrimaryBtn>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <p className="mt-3 rounded-lg bg-clay-50 p-3 text-base font-bold text-clay-700 ring-1 ring-clay-200">
                {error === "locked" ? (
                  <T en="This question is locked and can't receive new answers." ur="یہ سوال بند ہے — نئے جوابات قبول نہیں۔" />
                ) : (
                  <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" />
                )}
              </p>
            )}
            <label className="mt-4 block">
              <span className="mb-1 flex items-baseline justify-between text-base font-bold text-ink-700">
                <T en="Your answer" ur="آپ کا جواب" />
                <span className={`text-sm font-bold ${text.trim().length > 2000 || (text && text.trim().length < 10) ? "text-clay-600" : "text-ink-400"}`}>
                  {text.trim().length}/2000
                </span>
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2100}
                rows={4}
                className="w-full rounded-lg border border-ink-900/15 px-4 py-3 text-base font-semibold outline-none focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
                placeholder="Helpful, respectful, and general — not a substitute for hiring a lawyer."
              />
              {text.length > 0 && !textOk && (
                <span className="mt-1 block text-sm font-bold text-clay-600">
                  <T en="Answer must be 10–2000 characters." ur="جواب 10 سے 2000 حروف کا ہونا چاہیے۔" />
                </span>
              )}
            </label>
            <p className="mt-2 text-sm font-semibold text-ink-500">
              <T en="Posting as" ur="نام سے شائع ہوگا" />: {user.fullName ?? user.phone}
            </p>
            <div className="mt-4">
              <PrimaryBtn onClick={submit} disabled={!textOk || submitting}>
                {submitting ? <T en="Posting…" ur="شائع ہو رہا ہے…" /> : <T en="Post answer" ur="جواب شائع کریں" />}
              </PrimaryBtn>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 text-center">
        <button type="button" onClick={() => router.refresh()} className="text-base font-bold text-ink-500 hover:text-court-700 hover:underline">
          <T en="↻ Refresh answers" ur="↻ جوابات تازہ کریں" />
        </button>
      </div>
    </div>
  );
}
