"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import { ChatIcon } from "./icons";
import { PRACTICE_AREAS } from "@/lib/data";
import {
  askQuestion,
  ApiError,
  type ForumQuestion,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { QuestionsInitial } from "@/app/questions/page";

const PAGE_SIZE = 20;

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

function QuestionCard({ q }: { q: ForumQuestion }) {
  const area = q.area;
  return (
    <Link
      href={`/questions/${q.id}`}
      className="block rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm transition hover:border-court-400 hover:shadow-md sm:p-6"
    >
      <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="rounded-full bg-court-100 px-3 py-1 text-court-800">
          {area ? <T en={area.nameEn} ur={area.nameUr} /> : <T en="General" ur="عام" />}
        </span>
        <span className="text-ink-400">
          {q.authorName} · {timeAgo(q.createdAt)}
        </span>
        {q.isSeed && (
          <span className="rounded-full bg-ink-900/5 px-3 py-1 text-sm font-semibold text-ink-600 ring-1 ring-ink-900/10">
            <T en="Sample" ur="نمونہ" />
          </span>
        )}
      </p>
      <h3 className="mt-2 font-display text-[1.3rem] font-semibold text-ink-950">{q.title}</h3>
      <p className="mt-1 line-clamp-2 text-base text-ink-600">{q.body}</p>
      <p className="mt-3 text-base font-bold text-court-800">
        💬 {q._count.answers} {q._count.answers === 1 ? <T en="answer" ur="جواب" /> : <T en="answers" ur="جوابات" />}
      </p>
    </Link>
  );
}

function errText(code: string): { en: string; ur: string } {
  switch (code) {
    case "RATE_LIMITED":
      return { en: "Too many requests — please wait a little and try again.", ur: "بہت زیادہ درخواستیں — تھوڑی دیر بعد دوبارہ کوشش کریں۔" };
    case "INVALID_INPUT":
      return { en: "Please check your headline (10–140 chars) and details (20–2000 chars).", ur: "براہ کرم سرخی (10 تا 140 حروف) اور تفصیل (20 تا 2000 حروف) چیک کریں۔" };
    default:
      return { en: "Something went wrong. Please try again.", ur: "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" };
  }
}

export default function QuestionsClient({
  initial,
  initialArea,
  initialPage,
  loadError,
}: {
  initial: QuestionsInitial | null;
  initialArea: string;
  initialPage: number;
  loadError: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [areaSlug, setAreaSlug] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ en: string; ur: string } | null>(null);
  const [posted, setPosted] = useState(false);

  const totalPages = initial ? Math.max(1, Math.ceil(initial.total / PAGE_SIZE)) : 1;

  const goTo = (area: string, page: number) => {
    const qs = new URLSearchParams();
    if (area !== "all") qs.set("area", area);
    if (page > 1) qs.set("page", String(page));
    const s = qs.toString();
    router.push(`/questions${s ? `?${s}` : ""}`);
  };

  const titleOk = title.trim().length >= 10 && title.trim().length <= 140;
  const bodyOk = body.trim().length >= 20 && body.trim().length <= 2000;

  const submit = async () => {
    if (!titleOk || !bodyOk || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await askQuestion({ title: title.trim(), body: body.trim(), areaSlug: areaSlug || undefined });
      setPosted(true);
      setFormOpen(false);
      setTitle("");
      setBody("");
      setAreaSlug("");
      router.refresh();
    } catch (e) {
      setSubmitError(errText(e instanceof ApiError ? e.code : ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-[2.1rem] font-semibold text-ink-950 sm:text-4xl">
        <T en="Ask a legal question" ur="قانونی سوال پوچھیں" />
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-600">
        <T
          en="Confused about your case? Ask here — lawyers and the community answer. Free."
          ur="اپنے کیس کے بارے میں الجھن؟ یہاں پوچھیں — وکیل اور کمیونٹی جواب دیں گے۔ مفت۔"
        />
      </p>

      <div className="mt-6">
        {!formOpen ? (
          <PrimaryBtn onClick={() => setFormOpen(true)} icon={<ChatIcon className="h-6 w-6" />}>
            <T en="Ask your question" ur="اپنا سوال پوچھیں" />
          </PrimaryBtn>
        ) : !user ? (
          <div className="rounded-lg border border-brass-200 bg-brass-50 p-5 sm:p-6">
            <p className="text-lg font-bold text-brass-800">
              <T en="Login to ask a question" ur="سوال پوچھنے کے لیے لاگ اِن کریں" />
            </p>
            <p className="mt-1 text-base text-brass-700">
              <T en="It takes 30 seconds — just your mobile number." ur="صرف 30 سیکنڈ — بس آپ کا موبائل نمبر۔" />
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryBtn href={`/login?next=${encodeURIComponent("/questions")}`}>
                <T en="Login / Sign up" ur="لاگ اِن / اکاؤنٹ بنائیں" />
              </PrimaryBtn>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="inline-flex min-h-[56px] items-center rounded-lg border border-brass-400 px-6 text-lg font-bold text-brass-700"
              >
                <T en="Cancel" ur="منسوخ" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm sm:p-6">
            <p className="font-display text-[1.3rem] font-semibold text-ink-950"><T en="Your question" ur="آپ کا سوال" /></p>
            {submitError && (
              <p className="mt-3 rounded-lg bg-clay-50 p-3 text-base font-bold text-clay-700 ring-1 ring-clay-200">
                <T en={submitError.en} ur={submitError.ur} />
              </p>
            )}
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-bold text-ink-700"><T en="Topic (optional)" ur="موضوع (اختیاری)" /></span>
              <select
                value={areaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                className="min-h-[56px] w-full rounded-lg border border-ink-900/15 bg-white px-4 text-lg font-bold outline-none focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
              >
                <option value="">{/* general */}<T en="General" ur="عام" /></option>
                {PRACTICE_AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.nameEn} · {a.nameUr}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-1 flex items-baseline justify-between text-base font-bold text-ink-700">
                <T en="Question headline" ur="سوال کی سرخی" />
                <span className={`text-sm font-bold ${title.trim().length > 140 || (title && title.trim().length < 10) ? "text-clay-600" : "text-ink-400"}`}>
                  {title.trim().length}/140
                </span>
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={160}
                className="min-h-[56px] w-full rounded-lg border border-ink-900/15 px-4 text-lg font-bold outline-none focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
                placeholder="e.g. Khula ke baad custody kis ko milti hai?"
              />
              {title.length > 0 && !titleOk && (
                <span className="mt-1 block text-sm font-bold text-clay-600">
                  <T en="Headline must be 10–140 characters." ur="سرخی 10 سے 140 حروف کی ہونی چاہیے۔" />
                </span>
              )}
            </label>
            <label className="mt-4 block">
              <span className="mb-1 flex items-baseline justify-between text-base font-bold text-ink-700">
                <T en="Details" ur="تفصیل" />
                <span className={`text-sm font-bold ${body.trim().length > 2000 || (body && body.trim().length < 20) ? "text-clay-600" : "text-ink-400"}`}>
                  {body.trim().length}/2000
                </span>
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={2100}
                rows={4}
                className="w-full rounded-lg border border-ink-900/15 px-4 py-3 text-base font-semibold outline-none focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
                placeholder="Apne case ki mukhtasar tafseel likhein… (naam/pata/CNIC na likhein)"
              />
              {body.length > 0 && !bodyOk && (
                <span className="mt-1 block text-sm font-bold text-clay-600">
                  <T en="Details must be 20–2000 characters." ur="تفصیل 20 سے 2000 حروف کی ہونی چاہیے۔" />
                </span>
              )}
            </label>
            <p className="mt-2 text-sm font-semibold text-ink-500">
              <T en="Your question is public. Never share CNIC numbers or full addresses here." ur="آپ کا سوال عوامی ہے۔ یہاں شناختی کارڈ نمبر یا پورا پتہ کبھی نہ لکھیں۔" />
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryBtn onClick={submit} disabled={!titleOk || !bodyOk || submitting}>
                {submitting ? <T en="Posting…" ur="شائع ہو رہا ہے…" /> : <T en="Post question" ur="سوال شائع کریں" />}
              </PrimaryBtn>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="inline-flex min-h-[56px] items-center rounded-lg border border-ink-900/15 px-6 text-lg font-bold text-ink-600"
              >
                <T en="Cancel" ur="منسوخ" />
              </button>
            </div>
          </div>
        )}
        {posted && !formOpen && (
          <p className="mt-4 rounded-lg bg-court-50 p-4 text-base font-bold text-court-800 ring-1 ring-court-200">
            <T en="✅ Posted! It now appears in the list below." ur="✅ شائع ہو گیا! یہ نیچے فہرست میں نظر آ رہا ہے۔" />
          </p>
        )}
      </div>

      <div className="wc-rail mt-8 flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Filter by topic">
        {[{ slug: "all", nameEn: "All", nameUr: "سب" }, ...PRACTICE_AREAS].map((a) => (
          <button
            key={a.slug}
            type="button"
            role="radio"
            aria-checked={initialArea === a.slug}
            onClick={() => goTo(a.slug, 1)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-base font-bold transition ${
              initialArea === a.slug ? "border-court-700 bg-court-700 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-court-400"
            }`}
          >
            <T en={a.nameEn} ur={a.nameUr} />
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loadError || !initial ? (
          <div className="rounded-lg border border-clay-200 bg-clay-50 p-8 text-center">
            <p className="text-lg font-bold text-clay-700">
              <T en="Couldn't load questions. Check your connection and try again." ur="سوالات لوڈ نہ ہو سکے۔ کنکشن چیک کر کے دوبارہ کوشش کریں۔" />
            </p>
            <div className="mt-4">
              <SecondaryBtn onClick={() => router.refresh()}><T en="Retry" ur="دوبارہ کوشش" /></SecondaryBtn>
            </div>
          </div>
        ) : initial.questions.length === 0 ? (
          <p className="rounded-lg border border-ink-900/10 bg-white p-8 text-center text-lg text-ink-500">
            <T en="No questions on this topic yet — be the first to ask!" ur="اس موضوع پر ابھی کوئی سوال نہیں — پہلا سوال آپ پوچھیں!" />
          </p>
        ) : (
          initial.questions.map((q) => <QuestionCard key={q.id} q={q} />)
        )}
      </div>

      {initial && totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
          {initialPage > 1 ? (
            <SecondaryBtn onClick={() => goTo(initialArea, initialPage - 1)}>
              <T en="← Newer" ur="← نئے" />
            </SecondaryBtn>
          ) : (
            <span className="inline-flex min-h-[52px] items-center rounded-lg border border-ink-900/15 px-6 py-3 text-lg font-bold text-ink-300">
              <T en="← Newer" ur="← نئے" />
            </span>
          )}
          <p className="text-base font-bold text-ink-600">
            <T en={`Page ${initialPage} of ${totalPages}`} ur={`صفحہ ${initialPage} از ${totalPages}`} />
          </p>
          {initialPage < totalPages ? (
            <SecondaryBtn onClick={() => goTo(initialArea, initialPage + 1)}>
              <T en="Older →" ur="پرانے →" />
            </SecondaryBtn>
          ) : (
            <span className="inline-flex min-h-[52px] items-center rounded-lg border border-ink-900/15 px-6 py-3 text-lg font-bold text-ink-300">
              <T en="Older →" ur="پرانے →" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
