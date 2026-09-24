import Link from "next/link";
import { T } from "@/components/LanguageContext";
import CallbackForm from "@/components/CallbackForm";

export const metadata = {
  title: "Request a Callback — wakeel.connect",
  description:
    "Tell us about your legal matter and our team will call you back within 24 hours.",
};

export default function CallbackPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-[0.95rem] text-ink-500">
        <Link href="/" className="hover:text-court-700">
          <T en="Home" ur="ہوم" />
        </Link>{" "}
        / <T en="Request a callback" ur="کال بیک کی درخواست" />
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
        <T en="Request a callback" ur="کال بیک کی درخواست کریں" />
      </h1>
      <p className="mt-3 text-[1.08rem] leading-relaxed text-ink-600">
        <T
          en="For serious matters — property disputes, criminal cases, corporate work — tell us briefly and a member of our team will call you back within 24 hours."
          ur="اہم معاملات — جائیداد کے تنازعات، فوجداری مقدمات، کارپوریٹ کام — کے لیے مختصر بتائیں اور ہماری ٹیم کا رکن 24 گھنٹوں کے اندر آپ کو کال کرے گا۔"
        />
      </p>
      <h2 className="mt-6 font-display text-xl font-semibold text-ink-950 sm:text-2xl">
        <T en="Not sure where to start?" ur="سمجھ نہیں آ رہا کہاں سے شروع کریں؟" />
      </h2>
      <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-600">
        <T
          en="Describe your problem in your own words — in Urdu or English — and our team will call you back within 24 hours to match you with the right reviewed lawyer."
          ur="اپنا مسئلہ اپنے الفاظ میں بیان کریں — اردو یا انگریزی میں — اور ہماری ٹیم 24 گھنٹوں کے اندر آپ کو کال کرے گی تاکہ آپ کے معاملے کے لیے موزوں جانچ شدہ وکیل کا انتظام کرے۔"
        />
      </p>
      <ul className="mt-6 space-y-3">
        {[
          {
            en: "Tell us briefly what happened — a few lines are enough.",
            ur: "ہمیں مختصر بتائیں کہ کیا ہوا — چند سطریں کافی ہیں۔",
          },
          {
            en: "We call you back within 24 hours.",
            ur: "ہم 24 گھنٹوں کے اندر آپ کو کال کریں گے۔",
          },
          {
            en: "We match you with a reviewed lawyer for your matter — online or in person.",
            ur: "ہم آپ کے معاملے کے لیے آپ کو ایک جانچ شدہ وکیل سے ملائیں گے — آن لائن یا ذاتی ملاقات میں۔",
          },
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-court-600" />
            <p className="text-[1.02rem] leading-relaxed text-ink-700">
              <T en={step.en} ur={step.ur} />
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
        <CallbackForm />
      </div>
    </main>
  );
}
