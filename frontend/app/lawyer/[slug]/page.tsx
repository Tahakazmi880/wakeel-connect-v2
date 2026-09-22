import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { AvailableBadge, DemoNotice, PrimaryBtn, SecondaryBtn, Stars, VerifiedBadge } from "@/components/ui";
import { PhotoAvatar } from "@/components/PhotoAvatar";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckBadgeIcon,
  DocIcon,
  OfficeIcon,
  PinIcon,
  ShieldIcon,
  StarIcon,
  VideoIcon,
} from "@/components/icons";
import {
  cityName,
  formatPKR,
  getLawyer,
  LAWYERS,
  lawyerAreas,
  lawyerLanguages,
} from "@/lib/data";

export async function generateStaticParams() {
  return LAWYERS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLawyer(slug);
  if (!l) return {};
  return {
    title: `${l.displayName} — ${l.headline} | wakeel.connect`,
    description: `Book ${l.displayName}, ${l.yearsExperience} years experience, ${cityName(l.citySlug)}. Fee ${formatPKR(l.consultationFeePaisa)}. Verified lawyer on wakeel.connect.`,
  };
}

export default async function LawyerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lawyer = getLawyer(slug);
  if (!lawyer) notFound();

  const areas = lawyerAreas(lawyer);
  const langs = lawyerLanguages(lawyer);
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    pct: Math.round((lawyer.reviews.filter((r) => r.rating === s).length / Math.max(lawyer.reviewCount, 1)) * 100),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-base text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">wakeel.connect</Link>
        {" / "}
        <Link href="/lawyers" className="hover:text-emerald-700"><T en="Lawyers" ur="وکیل" /></Link>
        {" / "}
        <span className="font-bold text-slate-800">{lawyer.displayName}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ===== Main column ===== */}
        <div className="lg:col-span-2">
          {/* Header card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row">
              <PhotoAvatar name={lawyer.displayName} photo={lawyer.photo} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-slate-900">{lawyer.displayName}</h1>
                  <VerifiedBadge />
                </div>
                <p className="mt-2 text-lg text-slate-600">{lawyer.headline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
                  <Stars rating={lawyer.rating} count={lawyer.reviewCount} />
                  <span className="font-semibold text-slate-600">
                    <T en={`${lawyer.yearsExperience} years experience`} ur={`${lawyer.yearsExperience} سال تجربہ`} />
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                    <PinIcon className="h-5 w-5 text-emerald-700" /> {cityName(lawyer.citySlug)}
                  </span>
                  <AvailableBadge />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <Link key={a.slug} href={`/practice-areas/${a.slug}`}
                      className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100">
                      <T en={a.nameEn} ur={a.nameUr} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <PrimaryBtn href={`/book/${lawyer.slug}?mode=video`} icon={<VideoIcon className="h-6 w-6" />}>
                <T en={`Video Call — ${formatPKR(lawyer.consultationFeePaisa)}`} ur={`ویڈیو کال — ${formatPKR(lawyer.consultationFeePaisa)}`} />
              </PrimaryBtn>
              <SecondaryBtn href={`/book/${lawyer.slug}?mode=chamber`} icon={<OfficeIcon className="h-6 w-6" />}>
                <T en="Visit Office" ur="دفتر میں ملاقات" />
              </SecondaryBtn>
            </div>
          </section>

          {/* About */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="About" ur="تعارف" /></h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">{lawyer.bio}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {lawyer.education.length > 0 && (
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <BriefcaseIcon className="h-5 w-5 text-emerald-700" /> <T en="Education" ur="تعلیم" />
                </p>
                <ul className="mt-2 space-y-2 text-base text-slate-700">
                  {lawyer.education.map((e) => (
                    <li key={e.degree}>{e.degree}{e.institution ? ` — ${e.institution}` : ""}{e.year ? ` (${e.year})` : ""}</li>
                  ))}
                </ul>
              </div>
              )}
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <ShieldIcon className="h-5 w-5 text-emerald-700" /> <T en="Bar & Courts" ur="بار اور عدالتیں" />
                </p>
                <ul className="mt-2 space-y-2 text-base text-slate-700">
                  <li>{lawyer.barCouncil} · {lawyer.barCouncilNo}</li>
                  {lawyer.courts.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-5">
              <p className="text-base font-extrabold text-slate-900"><T en="Languages" ur="زبانیں" /></p>
              <p className="mt-1 text-base text-slate-700">
                {langs.map((l) => <T key={l.code} en={l.nameEn} ur={l.nameUr} />).reduce<React.ReactNode[]>(
                  (acc, el, i) => (i === 0 ? [el] : [...acc, ", ", el]), []
                )}
              </p>
              <p className="mt-3 text-base font-extrabold text-slate-900"><T en="Chamber" ur="چیمبر" /></p>
              <p className="mt-1 text-base text-slate-700">{lawyer.chamberName} — {lawyer.chamberAddress}</p>
            </div>
          </section>

          {/* Services & fees */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="Services & fees" ur="خدمات اور فیس" /></h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {lawyer.services.map((s) => (
                <li key={s.nameEn} className="flex items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-3 text-lg font-semibold text-slate-800">
                    <DocIcon className="h-6 w-6 shrink-0 text-emerald-700" />
                    <T en={s.nameEn} ur={s.nameUr} />
                  </span>
                  <span className="text-xl font-extrabold text-emerald-800">{formatPKR(s.feePaisa)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              <T en={`Client reviews (${lawyer.reviewCount})`} ur={`کلائنٹ کی آراء (${lawyer.reviewCount})`} />
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-5xl font-extrabold text-slate-900">{lawyer.rating.toFixed(1)}</p>
              <div className="flex-1 space-y-1.5">
                {dist.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-sm">
                    <span className="flex w-10 items-center gap-0.5 font-bold text-slate-600">{d.star}<StarIcon className="h-3.5 w-3.5 text-amber-400" /></span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.max(d.pct, 2)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {lawyer.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-extrabold text-slate-900">{r.clientName}</p>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                        <CheckBadgeIcon className="h-4 w-4" /> <T en="Verified client" ur="تصدیق شدہ کلائنٹ" />
                      </span>
                    )}
                  </div>
                  <Stars rating={r.rating} className="mt-1" />
                  <p className="mt-2 text-base text-slate-700">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ===== Side column: booking card ===== */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            {lawyer.isDemo && <DemoNotice />}
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700"><T en="Consultation fee" ur="مشاورت کی فیس" /></p>
              <p className="mt-1 text-4xl font-extrabold text-emerald-900">{formatPKR(lawyer.consultationFeePaisa)}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-base font-bold text-green-700">
                <CalendarIcon className="h-5 w-5" />
                <T en="Mon–Fri · 9 AM – 5 PM" ur="پیر تا جمعہ · صبح ۹ تا شام ۵" />
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <PrimaryBtn href={`/book/${lawyer.slug}?mode=video`} icon={<VideoIcon className="h-6 w-6" />} className="w-full">
                <T en="Book Video Call" ur="ویڈیو کال بک کریں" />
              </PrimaryBtn>
              <SecondaryBtn href={`/book/${lawyer.slug}?mode=chamber`} icon={<OfficeIcon className="h-6 w-6" />} className="w-full">
                <T en="Book Office Visit" ur="دفتر کی ملاقات بک کریں" />
              </SecondaryBtn>
            </div>
            <ul className="mt-6 space-y-3 text-base text-slate-600">
              <li className="flex gap-2"><CheckBadgeIcon className="h-5 w-5 shrink-0 text-emerald-600" /><T en="Transparent fee — confirmed before you book" ur="واضح فیس — بکنگ سے پہلے تصدیق شدہ" /></li>
              <li className="flex gap-2"><CheckBadgeIcon className="h-5 w-5 shrink-0 text-emerald-600" /><T en="Your number stays private until confirmed" ur="تصدیق تک آپ کا نمبر نجی رہتا ہے" /></li>
              <li className="flex gap-2"><CheckBadgeIcon className="h-5 w-5 shrink-0 text-emerald-600" /><T en="Pay the fee directly — online or at the chamber" ur="فیس براہِ راست ادا کریں — آن لائن یا چیمبر میں" /></li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Sticky mobile CTA — one primary action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <PrimaryBtn href={`/book/${lawyer.slug}?mode=video`} icon={<VideoIcon className="h-6 w-6" />} className="w-full">
          <T en={`Book Now — ${formatPKR(lawyer.consultationFeePaisa)}`} ur={`ابھی بک کریں — ${formatPKR(lawyer.consultationFeePaisa)}`} />
        </PrimaryBtn>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
