import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";
import { CITIES } from "@/lib/data";
import { API_V1 } from "@/lib/api";

export const metadata: Metadata = {
  title: "Lawyers by City — wakeel.connect",
  description: "Find verified lawyers in Karachi, Lahore, Islamabad, Rawalpindi and more cities across Pakistan.",
};

/**
 * Real per-city lawyer counts from the API (one cheap count query each).
 * A failed request yields null → renders "—", never a fake number.
 */
async function fetchCityCounts(): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    CITIES.map(async (c) => {
      try {
        const res = await fetch(`${API_V1}/lawyers?city=${c.slug}&limit=1`, { next: { revalidate: 60 } });
        if (!res.ok) return [c.slug, null] as const;
        const data = await res.json();
        return [c.slug, typeof data?.total === "number" ? data.total : null] as const;
      } catch {
        return [c.slug, null] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}

export default async function CitiesHub() {
  const counts = await fetchCityCounts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHead
        eyebrowEn="Cities" eyebrowUr="شہر"
        title={<T en="Lawyers across Pakistan" ur="پورے پاکستان میں وکیل" />}
        sub={<T en="Choose your city to see verified lawyers near you." ur="اپنے قریب تصدیق شدہ وکیل دیکھنے کے لیے اپنا شہر چنیں۔" />}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CITIES.map((c) => {
          const n = counts[c.slug];
          return (
            <Link key={c.slug} href={`/cities/${c.slug}`}
              className="group rounded-lg border border-ink-900/10 bg-white p-6 text-center shadow-card transition hover:border-court-700/40 hover:shadow-lift">
              <p className="font-display text-[1.3rem] font-semibold text-ink-950 transition group-hover:text-court-800"><T en={c.nameEn} ur={c.nameUr} /></p>
              <p className="mt-1 text-sm font-semibold text-ink-500"><T en={n == null ? "—" : `${n} lawyers`} ur={n == null ? "—" : `${n} وکیل`} /></p>
              <span className="mt-3 inline-flex items-center gap-1 text-base font-bold text-court-700">
                <T en="View" ur="دیکھیں" /> <ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
