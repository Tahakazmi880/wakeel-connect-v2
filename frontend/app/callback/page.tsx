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
      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
        <CallbackForm />
      </div>
    </main>
  );
}
