import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";
import { PRACTICE_AREAS } from "@/lib/data";
import { API_V1 } from "@/lib/api";

export const metadata: Metadata = {
  title: "Practice Areas — WakeelConnect",
  description: "Family, criminal, property, corporate, tax, immigration and more — find a verified lawyer for your legal problem.",
};

/**
 * Real per-area lawyer counts from the API (one cheap count query each).
 * A failed request yields null → renders "—", never a fake number.
 */
async function fetchAreaCounts(): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    PRACTICE_AREAS.map(async (a) => {
      try {
        const res = await fetch(`${API_V1}/lawyers?area=${a.slug}&limit=1`, { next: { revalidate: 60 } });
        if (!res.ok) return [a.slug, null] as const;
        const data = await res.json();
        return [a.slug, typeof data?.total === "number" ? data.total : null] as const;
      } catch {
        return [a.slug, null] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}

export default async function AreasHub() {
  const counts = await fetchAreaCounts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead
        eyebrowEn="Practice areas" eyebrowUr="قانونی شعبے"
        title={<T en="What is your legal problem?" ur="آپ کا قانونی مسئلہ کیا ہے؟" />}
        sub={<T en="Pick the area that matches your case — we'll show you the right lawyers." ur="اپنے کیس سے ملتا شعبہ چنیں — ہم درست وکیل دکھائیں گے۔" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_AREAS.map((a) => {
          const n = counts[a.slug];
          return (
            <Link key={a.slug} href={`/practice-areas/${a.slug}`}
              className="group rounded-lg border border-ink-900/10 bg-white p-6 shadow-card transition hover:border-court-700/40 hover:shadow-lift">
              <p className="font-display text-[1.3rem] font-semibold text-ink-950 transition group-hover:text-court-800"><T en={a.nameEn} ur={a.nameUr} /></p>
              <p className="mt-2 text-base text-ink-500">{a.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-base font-bold text-court-700">
                <T en={n == null ? "View" : `${n} ${n === 1 ? "lawyer" : "lawyers"} — view`} ur={n == null ? "دیکھیں" : `${n} وکیل — دیکھیں`} /> <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
