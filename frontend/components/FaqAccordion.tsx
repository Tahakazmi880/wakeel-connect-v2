"use client";

import { useState } from "react";
import { T } from "@/components/LanguageContext";

export interface FaqRow {
  termEn: string;
  termUr: string;
  defEn: string;
  defUr: string;
}

/** New item shape. Legacy {qEn,qUr,aEn,aUr} items are still accepted and normalized. */
export interface FaqItem {
  q: string;
  qUr?: string;
  a: string;
  aUr?: string;
  /** Optional definition-list rows, rendered as a table in the "table" variant. */
  rows?: FaqRow[];
}

export type LegacyFaqItem = { qEn: string; qUr: string; aEn: string; aUr: string };
type RawItem = FaqItem | LegacyFaqItem;

interface NormalizedFaq {
  qEn: string;
  qUr: string;
  aEn: string;
  aUr: string;
  rows?: FaqRow[];
}

function normalize(item: RawItem): NormalizedFaq {
  if ("qEn" in item) return { qEn: item.qEn, qUr: item.qUr, aEn: item.aEn, aUr: item.aUr };
  return {
    qEn: item.q,
    qUr: item.qUr ?? item.q,
    aEn: item.a,
    aUr: item.aUr ?? item.a,
    rows: item.rows,
  };
}

const FAQS: FaqItem[] = [
  {
    q: "How do I book a lawyer?",
    qUr: "میں وکیل کیسے بک کروں؟",
    a: "Three simple steps: choose your wakeel, pick a date and time, then verify your phone number with a code. Done.",
    aUr: "صرف تین آسان مراحل: اپنا وکیل چنیں، تاریخ اور وقت منتخب کریں، پھر کوڈ سے اپنا فون نمبر تصدیق کریں۔ ہو گیا۔",
  },
  {
    q: "How much does a consultation cost?",
    qUr: "مشاورت کی فیس کتنی ہے؟",
    a: "Every lawyer sets their own fee, and it is shown clearly on their profile before you book. You pay the lawyer directly — never more than what you see.",
    aUr: "ہر وکیل اپنی فیس خود طے کرتا ہے، اور وہ بکنگ سے پہلے پروفائل پر واضح لکھی ہوتی ہے۔ آپ فیس براہ راست وکیل کو ادا کرتے ہیں — جو نظر آئے اس سے زیادہ کبھی نہیں۔",
  },
  {
    q: "How are lawyer profiles listed?",
    qUr: "وکیلوں کی پروفائلز کیسے درج ہوتی ہیں؟",
    a: "Every public profile is reviewed by our team before listing.",
    aUr: "عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے۔",
  },
  {
    q: "Can I talk to the lawyer in Urdu?",
    qUr: "کیا میں وکیل سے اردو میں بات کر سکتا ہوں؟",
    a: "Yes. Each lawyer's profile shows which languages they speak — look for the Urdu option and book with confidence.",
    aUr: "جی ہاں۔ ہر وکیل کی پروفائل بتاتی ہے کہ وہ کون سی زبانیں بولتا ہے — اردو کا آپشن دیکھ کر بے فکر ہو کر بک کریں۔",
  },
  {
    q: "Video call or chamber visit — which one should I choose?",
    qUr: "ویڈیو کال یا چیمبر ملاقات — کون سی منتخب کروں؟",
    a: "It's your choice. A video call is best for quick advice from anywhere; a chamber visit is better when you need to show documents in person. Both are booked the same simple way.",
    aUr: "یہ آپ کی مرضی۔ فوری مشورے کے لیے ویڈیو کال بہترین ہے، اور دستاویزات دکھانے ہوں تو چیمبر ملاقات بہتر۔ دونوں ایک ہی آسان طریقے سے بک ہوتی ہیں۔",
  },
  {
    q: "Will my phone number stay private?",
    qUr: "کیا میرا فون نمبر پرائیویٹ رہے گا؟",
    a: "Yes. Your number is only shared with the lawyer you book, so they can confirm your appointment. It is never shown publicly on the site.",
    aUr: "جی ہاں۔ آپ کا نمبر صرف اس وکیل کو دیا جاتا ہے جسے آپ بک کریں، تاکہ وہ آپ کی ملاقات کی تصدیق کر سکے۔ یہ ویب سائٹ پر کبھی عوامی نہیں ہوتا۔",
  },
  {
    q: "What if I need to reschedule my appointment?",
    qUr: "اگر مجھے ملاقات کا وقت بدلنا ہو تو؟",
    a: "Contact the lawyer directly — their phone number is shared with you after booking, and they can arrange a new time.",
    aUr: "براہ راست وکیل سے رابطہ کریں — بکنگ کے بعد ان کا فون نمبر آپ کو مل جاتا ہے، اور وہ نیا وقت طے کر سکتے ہیں۔",
  },
];

export type FaqVariant = "default" | "bordered" | "table";

export interface FaqAccordionProps {
  items?: RawItem[];
  wide?: boolean;
  /** default: card design (homepage) · bordered: compact list (listing pages) · table: fee/timing rows (profiles) */
  variant?: FaqVariant;
  /** Open the first item on mount. Defaults to true for "default", false for "bordered". */
  defaultOpenFirst?: boolean;
}

/** FAQ accordion with smooth expand/collapse and big tap targets. */
export default function FaqAccordion({
  items = FAQS,
  wide = false,
  variant = "default",
  defaultOpenFirst,
}: FaqAccordionProps) {
  const resolvedDefaultOpen = defaultOpenFirst ?? variant === "default";
  const [open, setOpen] = useState<number | null>(resolvedDefaultOpen ? 0 : null);
  const data = items.map(normalize);

  const bordered = variant === "bordered" || variant === "table";

  return (
    <div className={wide ? "w-full" : "mx-auto max-w-3xl"}>
      {data.map((f, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${variant}-${i}`;
        const btnId = `faq-btn-${variant}-${i}`;
        return (
          <div
            key={i}
            className={
              variant === "default"
                ? "mb-3 overflow-hidden rounded-lg border border-ink-900/10 bg-white"
                : "border-b border-ink-900/10 first:border-t"
            }
          >
            <button
              type="button"
              id={btnId}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={
                variant === "default"
                  ? "flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-paper"
                  : "flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left transition"
              }
            >
              <span
                className={
                  variant === "default"
                    ? "text-[1.08rem] font-bold text-ink-950"
                    : "text-[1.02rem] font-bold text-ink-900"
                }
              >
                <T en={f.qEn} ur={f.qUr} />
              </span>
              <span
                className={
                  variant === "default"
                    ? `flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-50 text-court-800 ring-1 ring-court-700/20 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`
                    : `flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-court-800 ring-1 ring-ink-900/10 transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-court-50" : ""
                      }`
                }
                aria-hidden
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="h-5 w-5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {variant === "table" && f.rows && f.rows.length > 0 ? (
                  <dl className="pb-5">
                    {f.rows.map((r, ri) => (
                      <div
                        key={ri}
                        className="flex items-baseline justify-between gap-4 border-t border-ink-900/5 py-2.5 text-base first:border-t-0 first:pt-0"
                      >
                        <dt className="font-semibold text-ink-600">
                          <T en={r.termEn} ur={r.termUr} />
                        </dt>
                        <dd className="text-right font-bold text-ink-950">
                          <T en={r.defEn} ur={r.defUr} />
                        </dd>
                      </div>
                    ))}
                    {(f.aEn || f.aUr) && (
                      <p className="pt-3 text-base leading-relaxed text-ink-600">
                        <T en={f.aEn} ur={f.aUr} />
                      </p>
                    )}
                  </dl>
                ) : (
                  <p
                    className={
                      variant === "default"
                        ? "px-5 pb-5 text-base leading-relaxed text-ink-600"
                        : "pb-5 text-base leading-relaxed text-ink-600"
                    }
                  >
                    <T en={f.aEn} ur={f.aUr} />
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
