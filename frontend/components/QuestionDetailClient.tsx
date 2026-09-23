"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "@/components/ui";
import { getPracticeArea } from "@/lib/data";
import { getQuestion, saveAnswer, type ForumQuestion } from "@/lib/community";

function timeAgo(ts: number): string {
  const d = Math.max(0, Date.now() - ts);
  const days = Math.floor(d / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

export default function QuestionDetailClient({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<ForumQuestion | undefined>(() => getQuestion(questionId));
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    setQuestion(getQuestion(questionId));
  }, [questionId]);

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-2xl font-extrabold text-slate-900"><T en="Question not found" ur="سوال نہیں ملا" /></p>
        <div className="mt-6"><SecondaryBtn href="/questions"><T en="Back to questions" ur="سوالات پر واپس" /></SecondaryBtn></div>
      </div>
    );
  }

  const area = getPracticeArea(question.areaSlug);

  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    const updated = saveAnswer(question.id, { authorName: name.trim().slice(0, 40), text: text.trim().slice(0, 1000) });
    if (updated) setQuestion(updated);
    setName("");
    setText("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/questions" className="text-base font-bold text-emerald-700 hover:underline">
        <T en="← All questions" ur="← تمام سوالات" />
      </Link>

      <article className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">{area?.nameEn ?? question.areaSlug}</span>
          <span className="text-slate-400">{question.name} · {timeAgo(question.createdAt)}</span>
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">{question.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-lg text-slate-700">{question.body}</p>
        {question.isSeed && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-600">
            <span aria-hidden>📌</span>
            <T en="Sample question — answered by our legal team" ur="نمونہ سوال — ہماری قانونی ٹیم کا جواب" />
          </p>
        )}
      </article>

      <h2 className="mt-8 text-2xl font-extrabold text-slate-900">
        <T en={`Answers (${question.answers.length})`} ur={`جوابات (${question.answers.length})`} />
      </h2>
      <div className="mt-4 space-y-4">
        {question.answers.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-lg text-slate-500">
            <T en="No answers yet — share what you know below." ur="ابھی کوئی جواب نہیں — نیچے اپنی معلومات شیئر کریں۔" />
          </p>
        ) : (
          question.answers.map((a) => (
            <div key={a.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="flex flex-wrap items-center gap-2 text-base font-extrabold text-slate-900">
                {a.authorName}
                <span className="text-sm font-semibold text-slate-400">{timeAgo(a.createdAt)}</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-base text-slate-700">{a.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xl font-extrabold text-slate-900"><T en="Write an answer" ur="جواب لکھیں" /></p>
        {question.isSeed ? (
          <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-base font-semibold text-amber-900 ring-1 ring-amber-200">
            <T en="Sample questions are locked — answers open for community questions once accounts launch." ur="نمونہ سوالات بند ہیں — اکاؤنٹس آنے کے بعد کمیونٹی سوالات کے جوابات کھلیں گے۔" />
          </p>
        ) : (
          <>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Your name" ur="آپ کا نام" /></span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-bold outline-none focus:border-emerald-600"
                placeholder="e.g. Adv. Rashid"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Your answer" ur="آپ کا جواب" /></span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-emerald-600"
                placeholder="Helpful, respectful, and general — not a substitute for hiring a lawyer."
              />
            </label>
            <div className="mt-4">
              <PrimaryBtn onClick={submit} disabled={!name.trim() || !text.trim()}>
                <T en="Post answer" ur="جواب شائع کریں" />
              </PrimaryBtn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
