import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { CITIES, getCity, PRACTICE_AREAS } from "@/lib/data";
import { API_V1, type LawyerSummary } from "@/lib/api";

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Lawyers in ${c.nameEn} — wakeel.connect`,
    description: `Find lawyers in ${c.nameEn}. Compare fees, ratings and experience, then book a video consultation or chamber visit in 3 steps.`,
  };
}

async function fetchCityLawyers(citySlug: string): Promise<LawyerSummary[]> {
  try {
    const res = await fetch(`${API_V1}/lawyers?city=${citySlug}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    return data.lawyers ?? [];
  } catch {
    return [];
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const lawyers = await fetchCityLawyers(c.slug);
  const areaSlugs = new Set<string>();
  for (const l of lawyers) for (const a of l.practiceAreas) areaSlugs.add(a.practiceArea.slug);
  const areasHere = PRACTICE_AREAS.filter((a) => areaSlugs.has(a.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="inline-flex items-center gap-2 rounded-full bg-court-100 px-4 py-1.5 text-sm font-bold text-court-800">
        <PinIcon className="h-4 w-4" /> <T en={c.province} ur={c.nameUr} />
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-ink-950 sm:text-5xl">
        <T en={<>Lawyers in <span className="text-court-700">{c.nameEn}</span></>} ur={<><span className="text-court-700">{c.nameUr}</span> میں وکیل</>} />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600">
        <T
          en={`Looking for a wakeel in ${c.nameEn}? Compare ${lawyers.length} ${lawyers.length === 1 ? "lawyer" : "lawyers"} below — check their experience, fees and client reviews, then book a video call or chamber visit in 3 easy steps.`}
          ur={`${c.nameUr} میں وکیل تلاش کر رہے ہیں؟ نیچے ${lawyers.length} وکیلوں کا موازنہ کریں — تجربہ، فیس اور آراء دیکھیں، پھر صرف ۳ مراحل میں ویڈیو کال یا ملاقات بک کریں۔`}
        />
      </p>

      {lawyers.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-white p-8 text-center text-lg text-ink-600 ring-1 ring-ink-200">
          <T en="No lawyers listed in this city yet — check back soon." ur="اس شہر میں ابھی کوئی وکیل درج نہیں — جلد دوبارہ دیکھیں۔" />
        </p>
      )}

      {areasHere.length > 0 && (
        <section className="mt-14">
          <SectionHead eyebrowEn="Browse" eyebrowUr="شعبے" title={<T en={`Legal help in ${c.nameEn}`} ur={`${c.nameUr} میں قانونی مدد`} />} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {areasHere.map((a) => (
              <Link key={a.slug} href={`/${c.slug}/${a.slug}`}
                className="group flex min-h-[64px] items-center justify-between rounded-lg border border-ink-200 bg-white px-5 py-4 shadow-sm transition hover:border-court-300 hover:shadow-md">
                <span className="text-base font-extrabold text-ink-950 group-hover:text-court-800"><T en={a.nameEn} ur={a.nameUr} /></span>
                <ArrowIcon className="h-5 w-5 text-ink-300 group-hover:text-court-600" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 rounded-xl bg-white p-8 ring-1 ring-ink-200">
        <h2 className="text-2xl font-extrabold text-ink-950"><T en={`FAQs — lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں وکیل — سوالات`} /></h2>
        <div className="mt-4 space-y-4 text-lg text-ink-700">
          <div>
            <p className="font-extrabold text-ink-950"><T en="How do I book a lawyer in this city?" ur="اس شہر میں وکیل کیسے بک کروں؟" /></p>
            <p><T en="Pick a lawyer, choose a time, then verify your phone number with a code — done. Three steps." ur="وکیل چنیں، وقت منتخب کریں، پھر کوڈ سے فون نمبر تصدیق کریں — ہو گیا۔ تین مراحل۔" /></p>
          </div>
          <div>
            <p className="font-extrabold text-ink-950"><T en="How are profiles listed?" ur="پروفائلز کیسے درج ہوتے ہیں؟" /></p>
            <p><T en="Every public profile is reviewed by our team before listing." ur="عوامی ہونے سے پہلے ہماری ٹیم ہر پروفائل کا جائزہ لیتی ہے۔" /></p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <PrimaryBtn href="/lawyers" icon={<ArrowIcon className="h-6 w-6" />}>
            <T en="Browse all lawyers" ur="تمام وکیل دیکھیں" />
          </PrimaryBtn>
        </div>
      </section>
    </div>
  );
}
