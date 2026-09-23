import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { SecondaryBtn } from "@/components/ui";
import { OfficeIcon, PhoneIcon, DocIcon, ChatIcon } from "@/components/icons";

export const metadata = {
  title: "Contact Us — wakeel.connect",
  description:
    "Visit the wakeel.connect office in DHA Phase 2, Karachi, or reach us through a callback request.",
};

const ADDRESS_QUERY = encodeURIComponent(
  "Building 28C, Old Sunset Boulevard, Phase 2, DHA, Karachi, Sindh"
);

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[0.95rem] text-ink-500">
        <Link href="/" className="hover:text-court-700">
          <T en="Home" ur="ہوم" />
        </Link>{" "}
        / <T en="Contact us" ur="ہم سے رابطہ کریں" />
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
        <T en="Contact us" ur="ہم سے رابطہ کریں" />
      </h1>
      <p className="mt-3 max-w-2xl text-[1.08rem] leading-relaxed text-ink-600">
        <T
          en="Visit our office, or send us a message and our team will call you back."
          ur="ہمارے دفتر تشریف لائیں، یا ہمیں پیغام بھیجیں اور ہماری ٹیم آپ کو کال کرے گی۔"
        />
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Address card */}
        <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-court-700 text-white">
              <OfficeIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-950">
                <T en="Our office" ur="ہمارا دفتر" />
              </h2>
              <address className="mt-2 text-[1.05rem] not-italic leading-relaxed text-ink-700">
                Building 28C, Old Sunset Boulevard,
                <br />
                Phase 2, DHA, Karachi, Sindh
              </address>
              <p className="mt-2 text-[0.98rem] text-ink-500">
                <T
                  en="15 mins from the High Court of Sindh, Court Road."
                  ur="سندھ ہائی کورٹ، کورٹ روڈ سے ۱۵ منٹ کی دوری پر۔"
                />
              </p>
            </div>
          </div>
          <div className="mt-6">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[52px] items-center justify-center rounded-lg bg-court-700 px-6 py-3 text-lg font-bold text-white transition hover:bg-court-800"
            >
              <T en="Get directions" ur="راستہ دیکھیں" />
            </a>
          </div>

          <div className="mt-8 space-y-4 border-t border-ink-900/10 pt-6">
            <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-ink-500">
              <T en="Other ways to reach us" ur="رابطے کے دیگر طریقے" />
            </h3>
            <Link
              href="/callback"
              className="flex items-center gap-3 rounded-xl p-2 text-[1.05rem] font-semibold text-ink-800 transition hover:bg-ink-900/5"
            >
              <PhoneIcon className="h-6 w-6 shrink-0 text-court-700" />
              <T en="Request a callback — we call you within 24 hours" ur="کال بیک کی درخواست — ۲۴ گھنٹوں میں ہم آپ کو کال کریں گے" />
            </Link>
            <Link
              href="/questions"
              className="flex items-center gap-3 rounded-xl p-2 text-[1.05rem] font-semibold text-ink-800 transition hover:bg-ink-900/5"
            >
              <ChatIcon className="h-6 w-6 shrink-0 text-court-700" />
              <T en="Ask a free legal question" ur="مفت قانونی سوال پوچھیں" />
            </Link>
            <Link
              href="/join"
              className="flex items-center gap-3 rounded-xl p-2 text-[1.05rem] font-semibold text-ink-800 transition hover:bg-ink-900/5"
            >
              <DocIcon className="h-6 w-6 shrink-0 text-court-700" />
              <T en="Are you a lawyer? Join wakeel.connect" ur="کیا آپ وکیل ہیں؟ wakeel.connect جوائن کریں" />
            </Link>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
          <iframe
            title="wakeel.connect office map — Building 28C, Old Sunset Boulevard, Phase 2, DHA, Karachi"
            src={`https://maps.google.com/maps?q=${ADDRESS_QUERY}&z=16&output=embed`}
            className="h-[320px] w-full border-0 sm:h-[420px] lg:h-full lg:min-h-[520px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <SecondaryBtn href="/lawyers">
          <T en="Find a lawyer" ur="وکیل تلاش کریں" />
        </SecondaryBtn>
        <SecondaryBtn href="/callback">
          <T en="Request a callback" ur="کال بیک کی درخواست" />
        </SecondaryBtn>
      </div>
    </main>
  );
}
