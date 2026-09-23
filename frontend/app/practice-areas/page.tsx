import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";
import { LAWYERS, PRACTICE_AREAS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Practice Areas — wakeel.connect",
  description: "Family, criminal, property, corporate, tax, immigration and more — find a verified lawyer for your legal problem.",
};

export default function AreasHub() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead
        eyebrowEn="Practice areas" eyebrowUr="قانونی شعبے"
        title={<T en="What is your legal problem?" ur="آپ کا قانونی مسئلہ کیا ہے؟" />}
        sub={<T en="Pick the area that matches your case — we'll show you the right lawyers." ur="اپنے کیس سے ملتا شعبہ چنیں — ہم درست وکیل دکھائیں گے۔" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_AREAS.map((a) => {
          const n = LAWYERS.filter((l) => l.practiceAreaSlugs.includes(a.slug)).length;
          return (
            <Link key={a.slug} href={`/practice-areas/${a.slug}`}
              className="group rounded-lg border border-ink-900/10 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-court-300 hover:shadow-xl">
              <p className="font-display text-[1.3rem] font-semibold text-ink-950 transition group-hover:text-court-800"><T en={a.nameEn} ur={a.nameUr} /></p>
              <p className="mt-2 text-base text-ink-500">{a.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-base font-bold text-court-700">
                <T en={`${n} lawyers — view`} ur={`${n} وکیل — دیکھیں`} /> <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
