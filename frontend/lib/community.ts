"use client";

/**
 * Community features — client reviews and the Q&A forum.
 * localStorage only until the backend lands.
 * Keys: wc-reviews, wc-questions.
 */

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1296)
    .toString(36)
    .padStart(2, "0")}`;
}

// ---------------- Reviews ----------------

const REVIEWS_KEY = "wc-reviews";

export interface LocalReview {
  id: string;
  lawyerSlug: string;
  clientName: string;
  rating: number; // 1..5
  comment: string;
  createdAt: number;
}

export function getLocalReviews(lawyerSlug: string): LocalReview[] {
  return read<LocalReview[]>(REVIEWS_KEY, []).filter((r) => r.lawyerSlug === lawyerSlug);
}

export function saveLocalReview(r: Omit<LocalReview, "id" | "createdAt">): LocalReview[] {
  const all = read<LocalReview[]>(REVIEWS_KEY, []);
  const next = [{ ...r, id: uid("rv"), createdAt: Date.now() }, ...all];
  write(REVIEWS_KEY, next);
  return next.filter((x) => x.lawyerSlug === r.lawyerSlug);
}

// ---------------- Q&A forum ----------------

const QA_KEY = "wc-questions";

export interface ForumAnswer {
  id: string;
  authorName: string;
  text: string;
  createdAt: number;
  isSeed?: boolean;
}

export interface ForumQuestion {
  id: string;
  name: string;
  areaSlug: string;
  title: string;
  body: string;
  createdAt: number;
  answers: ForumAnswer[];
  isSeed?: boolean;
}

const SEED_QUESTIONS: ForumQuestion[] = [
  {
    id: "seed-q1",
    name: "Ayesha K.",
    areaSlug: "family-law",
    title: "Khula ke baad bachon ki custody kis ko milti hai?",
    body: "Meri cousin ne khula liya hai, 2 chhote bache hain. Woh jaanna chahti hain ke custody ka faisla kis bunyaad pe hota hai aur kya baap ko milne ka haq milta hai?",
    createdAt: Date.now() - 6 * 86400000,
    isSeed: true,
    answers: [
      {
        id: "seed-a1",
        authorName: "WakeelConnect Legal Team",
        text: "Custody ka faisla hamesha bachon ki welfare (bhalai) ko dekh kar hota hai — umar, dekh-bhaal ka intezam aur mustaqbil. Chhote bachon ki custody aam tor pe maan ko milti hai, jabke baap ko milne (visitation) ka schedule adaalat muqarrar karti hai. Har case ke halaat mukhtalif hote hain, is liye family lawyer se apne case ki tafseel pe mashwara zaroor lein.",
        createdAt: Date.now() - 5 * 86400000,
        isSeed: true,
      },
    ],
  },
  {
    id: "seed-q2",
    name: "Imran S.",
    areaSlug: "property-law",
    title: "Plot par qabza ho gaya hai — kya karun?",
    body: "Mera Karachi mein 120 sq. yard ka plot hai, pata chala hai kisi ne deewar utha li hai. Registry mere naam pe hai. Sab se tez qanuni rasta kya hai?",
    createdAt: Date.now() - 4 * 86400000,
    isSeed: true,
    answers: [
      {
        id: "seed-a2",
        authorName: "WakeelConnect Legal Team",
        text: "Registry aap ke naam pe hai to aap mazboot position mein hain. Aam rasta: possession ka daawa (suit for possession) ke saath stay order ki darkhwast, taake qabza karne wala tameer na barha sake. Sath hi police mein qabze ki complaint bhi darj karwayein. Kagzat (registry, mutation, tax receipts) sambhal ke rakhein aur property lawyer se foran rabta karein — der se nuksan hota hai.",
        createdAt: Date.now() - 4 * 86400000 + 3600000,
        isSeed: true,
      },
    ],
  },
  {
    id: "seed-q3",
    name: "Bilal R.",
    areaSlug: "criminal-law",
    title: "FIR mein ghalat dafa lag gayi — kya quash ho sakti hai?",
    body: "Mere bhai ke khilaf FIR mein aisi dafa lagayi gayi hai jo waqiye pe lagti hi nahi. Kya High Court se FIR quash karwayi ja sakti hai?",
    createdAt: Date.now() - 3 * 86400000,
    isSeed: true,
    answers: [
      {
        id: "seed-a3",
        authorName: "WakeelConnect Legal Team",
        text: "Ji haan — agar FIR se hi koi jurm banta nazar na aaye ya dafa ka itlaq ghalat ho to High Court CrPC ki dafa 561-A ke tehat FIR quash kar sakti hai. Lekin adaalat aam tor pe tafteesh mukammal hone ka intezar karti hai. Criminal lawyer FIR, challan aur gawahon ke bayanaat dekh kar behtar bata sakta hai.",
        createdAt: Date.now() - 2 * 86400000,
        isSeed: true,
      },
    ],
  },
  {
    id: "seed-q4",
    name: "Farah M.",
    areaSlug: "banking-finance",
    title: "Bank ne qist default par ghar ki neelami ka notice bheja",
    body: "2 qistein late hui thin, ab bank ne neelami ka notice bhej diya hai. Kya stay mil sakta hai? Ghar bachane ka koi rasta?",
    createdAt: Date.now() - 2 * 86400000,
    isSeed: true,
    answers: [],
  },
];

export function getQuestions(): ForumQuestion[] {
  const local = read<ForumQuestion[]>(QA_KEY, []);
  return [...local, ...SEED_QUESTIONS].sort((a, b) => b.createdAt - a.createdAt);
}

export function getQuestion(id: string): ForumQuestion | undefined {
  return getQuestions().find((q) => q.id === id);
}

export function saveQuestion(q: Omit<ForumQuestion, "id" | "createdAt" | "answers">): ForumQuestion {
  const full: ForumQuestion = { ...q, id: uid("q"), createdAt: Date.now(), answers: [] };
  write(QA_KEY, [full, ...read<ForumQuestion[]>(QA_KEY, [])]);
  return full;
}

export function saveAnswer(questionId: string, a: Omit<ForumAnswer, "id" | "createdAt">): ForumQuestion | undefined {
  const local = read<ForumQuestion[]>(QA_KEY, []);
  const idx = local.findIndex((q) => q.id === questionId);
  if (idx === -1) return undefined; // seed questions can't take answers yet (backend will)
  const full: ForumAnswer = { ...a, id: uid("a"), createdAt: Date.now() };
  const next = local.map((q, i) => (i === idx ? { ...q, answers: [...q.answers, full] } : q));
  write(QA_KEY, next);
  return next[idx];
}
