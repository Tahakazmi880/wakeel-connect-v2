"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn } from "./ui";
import { PRACTICE_AREAS, getPracticeArea } from "@/lib/data";
import { getQuestions, saveQuestion, type ForumQuestion } from "@/lib/community";

function timeAgo(ts: number): string {
  const d = Math.max(0, Date.now() - ts);
  const days = Math.floor(d / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

function QuestionCard({ q }: { q: ForumQuestion }) {
  const area = getPracticeArea(q.areaSlug);
  return (
    <Link
      href={`/questions/${q.id}`}
      className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md sm:p-6"
    >
      <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">{area?.nameEn ?? q.areaSlug}</span>
        <span className="text-slate-400">
          {q.name} · {timeAgo(q.createdAt)}
        </span>
      </p>
      <h3 className="mt-2 text-xl font-extrabold text-slate-900">{q.title}</h3>
      <p className="mt-1 line-clamp-2 text-base text-slate-600">{q.body}</p>
      <p className="mt-3 text-base font-bold text-emerald-800">
        💬 {q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
      </p>
    </Link>
  );
}

export default function QuestionsClient() {
  const [areaFilter, setAreaFilter] = useState("all");
  const [questions, setQuestions] = useState<ForumQuestion[]>(() => getQuestions());
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [areaSlug, setAreaSlug] = useState(PRACTICE_AREAS[0].slug);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState<string | null>(null);

  const filtered = useMemo(
    () => (areaFilter === "all" ? questions : questions.filter((q) => q.areaSlug === areaFilter)),
    [questions, areaFilter]
  );

  const submit = () => {
    if (!name.trim() || !title.trim() || !body.trim()) return;
    const q = saveQuestion({
      name: name.trim().slice(0, 40),
      areaSlug,
      title: title.trim().slice(0, 120),
      body: body.trim().slice(0, 1000),
    });
    setQuestions(getQuestions());
    setPosted(q.id);
    setFormOpen(false);
    setName("");
    setTitle("");
    setBody("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        <T en="Ask a legal question" ur="قانونی سوال پوچھیں" />
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-slate-600">
        <T
          en="Confused about your case? Ask here — lawyers and the community answer. Free."
          ur="اپنے کیس کے بارے میں الجھن؟ یہاں پوچھیں — وکیل اور کمیونٹی جواب دیں گے۔ مفت۔"
        />
      </p>

      <div className="mt-6">
        {!formOpen ? (
          <PrimaryBtn onClick={() => setFormOpen(true)} icon={<span aria-hidden>❓</span>}>
            <T en="Ask your question" ur="اپنا سوال پوچھیں" />
          </PrimaryBtn>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xl font-extrabold text-slate-900"><T en="Your question" ur="آپ کا سوال" /></p>
            {posted && (
              <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-base font-bold text-emerald-800 ring-1 ring-emerald-200">
                <T en="✅ Posted! It now appears in the list below." ur="✅ شائع ہو گیا! یہ نیچے فہرست میں نظر آ رہا ہے۔" />
              </p>
            )}
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Your name" ur="آپ کا نام" /></span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-bold outline-none focus:border-emerald-600"
                placeholder="e.g. Sana A."
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Topic" ur="موضوع" /></span>
              <select
                value={areaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-lg font-bold outline-none focus:border-emerald-600"
              >
                {PRACTICE_AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.nameEn} · {a.nameUr}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Question headline" ur="سوال کی سرخی" /></span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="min-h-[56px] w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-bold outline-none focus:border-emerald-600"
                placeholder="e.g. Khula ke baad custody kis ko milti hai?"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700"><T en="Details" ur="تفصیل" /></span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-emerald-600"
                placeholder="Apne case ki mukhtasar tafseel likhein… (naam/pata na likhein)"
              />
            </label>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              <T en="Demo — questions are saved on this device only. Never share CNIC numbers or full addresses here." ur="ڈیمو — سوالات صرف اس ڈیوائس پر محفوظ ہیں۔ یہاں شناختی کارڈ نمبر یا پورا پتہ کبھی نہ لکھیں۔" />
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryBtn onClick={submit} disabled={!name.trim() || !title.trim() || !body.trim()}>
                <T en="Post question" ur="سوال شائع کریں" />
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
      </div>

      <div className="wc-rail mt-8 flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Filter by topic">
        {[{ slug: "all", nameEn: "All", nameUr: "سب" }, ...PRACTICE_AREAS].map((a) => (
          <button
            key={a.slug}
            type="button"
            role="radio"
            aria-checked={areaFilter === a.slug}
            onClick={() => setAreaFilter(a.slug)}
            className={`shrink-0 rounded-full border-2 px-5 py-2.5 text-base font-bold transition ${
              areaFilter === a.slug ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
            }`}
          >
            <T en={a.nameEn} ur={a.nameUr} />
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-lg text-slate-500">
            <T en="No questions on this topic yet — be the first to ask!" ur="اس موضوع پر ابھی کوئی سوال نہیں — پہلا سوال آپ پوچھیں!" />
          </p>
        ) : (
          filtered.map((q) => <QuestionCard key={q.id} q={q} />)
        )}
      </div>
    </div>
  );
}
