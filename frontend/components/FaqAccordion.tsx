"use client";

import { useState } from "react";
import { T } from "@/components/LanguageContext";

const FAQS = [
  {
    qEn: "How do I book a lawyer?",
    qUr: "میں وکیل کیسے بک کروں؟",
    aEn: "Three simple steps: choose your wakeel, pick a date and time, then verify your phone number with a code. Done.",
    aUr: "صرف تین آسان مراحل: اپنا وکیل چنیں، تاریخ اور وقت منتخب کریں، پھر کوڈ سے اپنا فون نمبر تصدیق کریں۔ ہو گیا۔",
  },
  {
    qEn: "How much does a consultation cost?",
    qUr: "مشاورت کی فیس کتنی ہے؟",
    aEn: "Every lawyer sets their own fee, and it is shown clearly on their profile before you book. You pay the lawyer directly — never more than what you see.",
    aUr: "ہر وکیل اپنی فیس خود طے کرتا ہے، اور وہ بکنگ سے پہلے پروفائل پر واضح لکھی ہوتی ہے۔ آپ فیس براہ راست وکیل کو ادا کرتے ہیں — جو نظر آئے اس سے زیادہ کبھی نہیں۔",
  },
  {
    qEn: "How are lawyer profiles listed?",
    qUr: "وکیلوں کی پروفائلز کیسے درج ہوتی ہیں؟",
    aEn: "Every public profile is reviewed by our team before listing.",
    aUr: "عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے۔",
  },
  {
    qEn: "Can I talk to the lawyer in Urdu?",
    qUr: "کیا میں وکیل سے اردو میں بات کر سکتا ہوں؟",
    aEn: "Yes. Each lawyer's profile shows which languages they speak — look for the Urdu option and book with confidence.",
    aUr: "جی ہاں۔ ہر وکیل کی پروفائل بتاتی ہے کہ وہ کون سی زبانیں بولتا ہے — اردو کا آپشن دیکھ کر بے فکر ہو کر بک کریں۔",
  },
  {
    qEn: "Video call or chamber visit — which one should I choose?",
    qUr: "ویڈیو کال یا چیمبر ملاقات — کون سی منتخب کروں؟",
    aEn: "It's your choice. A video call is best for quick advice from anywhere; a chamber visit is better when you need to show documents in person. Both are booked the same simple way.",
    aUr: "یہ آپ کی مرضی۔ فوری مشورے کے لیے ویڈیو کال بہترین ہے، اور دستاویزات دکھانے ہوں تو چیمبر ملاقات بہتر۔ دونوں ایک ہی آسان طریقے سے بک ہوتی ہیں۔",
  },
  {
    qEn: "Will my phone number stay private?",
    qUr: "کیا میرا فون نمبر پرائیویٹ رہے گا؟",
    aEn: "Yes. Your number is only shared with the lawyer you book, so they can confirm your appointment. It is never shown publicly on the site.",
    aUr: "جی ہاں۔ آپ کا نمبر صرف اس وکیل کو دیا جاتا ہے جسے آپ بک کریں، تاکہ وہ آپ کی ملاقات کی تصدیق کر سکے۔ یہ ویب سائٹ پر کبھی عوامی نہیں ہوتا۔",
  },
  {
    qEn: "What if I need to reschedule my appointment?",
    qUr: "اگر مجھے ملاقات کا وقت بدلنا ہو تو؟",
    aEn: "Contact the lawyer directly — their phone number is shared with you after booking, and they can arrange a new time.",
    aUr: "براہ راست وکیل سے رابطہ کریں — بکنگ کے بعد ان کا فون نمبر آپ کو مل جاتا ہے، اور وہ نیا وقت طے کر سکتے ہیں۔",
  },
];

export interface FaqItem {
  qEn: string;
  qUr: string;
  aEn: string;
  aUr: string;
}

/** FAQ accordion with smooth expand/collapse and big tap targets. */
export default function FaqAccordion({ items = FAQS, wide = false }: { items?: FaqItem[]; wide?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={wide ? "w-full" : "mx-auto max-w-3xl"}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="mb-3 overflow-hidden rounded-lg border border-ink-900/10 bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-paper"
            >
              <span className="text-[1.08rem] font-bold text-ink-950">
                <T en={f.qEn} ur={f.qUr} />
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-50 text-court-800 ring-1 ring-court-700/20 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="h-5 w-5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-base leading-relaxed text-ink-600">
                  <T en={f.aEn} ur={f.aUr} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
