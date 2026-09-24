import Link from "next/link";
import { T } from "@/components/LanguageContext";

export const metadata = {
  title: "Page not found — WakeelConnect",
};

/** Branded 404 — never a dead end: guide the visitor back to real pages. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-7xl font-semibold text-court-800">404</p>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brass-500" aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
        <T en="This page doesn't exist" ur="یہ صفحہ موجود نہیں ہے" />
      </h1>
      <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-ink-600">
        <T
          en="The link may be old or mistyped. Let's get you back to finding the right wakeel."
          ur="ہو سکتا ہے لنک پرانا ہو یا غلط لکھا گیا ہو۔ آئیے آپ کو واپس صحیح وکیل کی تلاش کی طرف لے چلتے ہیں۔"
        />
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-court-700 px-8 text-[1.05rem] font-bold text-white shadow-card transition hover:bg-court-800"
        >
          <T en="Back to home" ur="ہوم پر واپس جائیں" />
        </Link>
        <Link
          href="/lawyers"
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-court-700/40 bg-white px-8 text-[1.05rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50"
        >
          <T en="Find a lawyer" ur="وکیل تلاش کریں" />
        </Link>
      </div>
    </main>
  );
}
