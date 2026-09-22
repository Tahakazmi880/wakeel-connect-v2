"use client";

import { useState } from "react";
import { T } from "@/components/LanguageContext";

const FAQS = [
  {
    qEn: "How do I book a lawyer?",
    qUr: "میں وکیل کیسے بک کروں؟",
    aEn: "Three simple steps: choose your wakeel, pick a date and time, and enter your phone number. No account or password needed.",
    aUr: "صرف تین آسان مراحل: اپنا وکیل چنیں، تاریخ اور وقت منتخب کریں، اور اپنا فون نمبر لکھیں۔ اکاؤنٹ یا پاس ورڈ کی ضرورت نہیں۔",
  },
  {
    qEn: "How much does a consultation cost?",
    qUr: "مشاورت کی فیس کتنی ہے؟",
    aEn: "Every lawyer sets their own fee, and it is shown clearly on their profile before you book. You pay the lawyer directly — never more than what you see.",
    aUr: "ہر وکیل اپنی فیس خود طے کرتا ہے، اور وہ بکنگ سے پہلے پروفائل پر واضح لکھی ہوتی ہے۔ آپ فیس براہ راست وکیل کو ادا کرتے ہیں — جو نظر آئے اس سے زیادہ کبھی نہیں۔",
  },
  {
    qEn: "How are lawyers verified?",
    qUr: "وکیلوں کی تصدیق کیسے ہوتی ہے؟",
    aEn: "Our team checks each lawyer's Bar Council enrolment before their profile goes public. Profiles you see in this demo are sample data for testing.",
    aUr: "ہماری ٹیم پروفائل عوامی ہونے سے پہلے ہر وکیل کا بار کونسل اندراج چیک کرتی ہے۔ اس ڈیمو میں نظر آنے والی پروفائلز صرف جانچ کے لیے ہیں۔",
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
          <div key={i} className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-lg font-extrabold text-slate-900">
                <T en={f.qEn} ur={f.qUr} />
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 transition-transform duration-300 ${
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
                <p className="px-5 pb-5 text-base leading-relaxed text-slate-600">
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
