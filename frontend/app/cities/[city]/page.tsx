import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { DemoNotice, PrimaryBtn, SectionHead } from "@/components/ui";
import LawyerCard from "@/components/LawyerCard";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { CITIES, getCity, LAWYERS, PRACTICE_AREAS } from "@/lib/data";

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Best Lawyers in ${c.nameEn} — wakeel.connect`,
    description: `Find verified lawyers in ${c.nameEn}. Compare fees, ratings and experience, then book a video consultation or chamber visit in 3 steps.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const lawyers = LAWYERS.filter((l) => l.citySlug === c.slug);
  const areasHere = PRACTICE_AREAS.filter((a) => lawyers.some((l) => l.practiceAreaSlugs.includes(a.slug)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800">
        <PinIcon className="h-4 w-4" /> <T en={c.province} ur={c.nameUr} />
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-5xl">
        <T en={<>Best lawyers in <span className="text-emerald-700">{c.nameEn}</span></>} ur={<><span className="text-emerald-700">{c.nameUr}</span> میں بہترین وکیل</>} />
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        <T
          en={`Looking for a wakeel in ${c.nameEn}? Compare ${lawyers.length} verified lawyers below — check their experience, fees and client reviews, then book a video call or chamber visit in 3 easy steps. Every profile is verified by the wakeel.connect team before going public.`}
          ur={`${c.nameUr} میں وکیل تلاش کر رہے ہیں؟ نیچے ${lawyers.length} تصدیق شدہ وکیلوں کا موازنہ کریں — تجربہ، فیس اور آراء دیکھیں، پھر صرف ۳ مراحل میں ویڈیو کال یا ملاقات بک کریں۔`}
        />
      </p>

      <div className="mx-auto mt-6 max-w-3xl"><DemoNotice /></div>

      {lawyers.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lawyers.map((l) => <LawyerCard key={l.slug} lawyer={l} />)}
        </div>
      ) : (
        <p className="mt-8 rounded-3xl bg-white p-8 text-center text-lg text-slate-600 ring-1 ring-slate-200">
          <T en="No lawyers listed in this city yet — check back soon." ur="اس شہر میں ابھی کوئی وکیل درج نہیں — جلد دوبارہ دیکھیں۔" />
        </p>
      )}

      {areasHere.length > 0 && (
        <section className="mt-14">
          <SectionHead eyebrowUr="شعبے" title={<T en={`Legal help in ${c.nameEn}`} ur={`${c.nameUr} میں قانونی مدد`} />} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {areasHere.map((a) => (
              <Link key={a.slug} href={`/${c.slug}/${a.slug}`}
                className="group flex min-h-[64px] items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
                <span className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800"><T en={a.nameEn} ur={a.nameUr} /></span>
                <ArrowIcon className="h-5 w-5 text-slate-300 group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 rounded-3xl bg-white p-8 ring-1 ring-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900"><T en={`FAQs — lawyers in ${c.nameEn}`} ur={`${c.nameUr} میں وکیل — سوالات`} /></h2>
        <div className="mt-4 space-y-4 text-lg text-slate-700">
          <div>
            <p className="font-extrabold text-slate-900"><T en="How do I book a lawyer in this city?" ur="اس شہر میں وکیل کیسے بک کروں؟" /></p>
            <p><T en="Pick a lawyer, choose a time, enter your phone number — done. Three steps, no account needed." ur="وکیل چنیں، وقت منتخب کریں، فون نمبر لکھیں — ہو گیا۔ تین مراحل، اکاؤنٹ کی ضرورت نہیں۔" /></p>
          </div>
          <div>
            <p className="font-extrabold text-slate-900"><T en="Are these lawyers verified?" ur="کیا یہ وکیل تصدیق شدہ ہیں؟" /></p>
            <p><T en="On the live platform every lawyer's Bar Council enrolment is checked by our team. The profiles on this demo page are samples." ur="اصل پلیٹ فارم پر ہر وکیل کی بار کونسل رکنیت ہماری ٹیم جانچتی ہے۔ اس ڈیمو صفحے کے پروفائلز نمونے ہیں۔" /></p>
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
