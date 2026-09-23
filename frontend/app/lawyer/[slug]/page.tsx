import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, Rating, SecondaryBtn } from "@/components/ui";
import { PhotoAvatar } from "@/components/PhotoAvatar";
import FaqAccordion from "@/components/FaqAccordion";
import LawyerCard from "@/components/LawyerCard";
import LawyerAvailability from "@/components/LawyerAvailability";
import ReviewSection from "@/components/ReviewSection";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckBadgeIcon,
  OfficeIcon,
  PinIcon,
  ShieldIcon,
  VideoIcon,
} from "@/components/icons";
import { API_V1, fileUrl, formatExperience, formatFee, type LawyerReview, type LawyerSummary } from "@/lib/api";

type FullLawyer = LawyerSummary & { reviews: LawyerReview[] };

async function fetchLawyer(slug: string): Promise<FullLawyer | null> {
  try {
    const res = await fetch(`${API_V1}/lawyers/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ok) return null;
    return data.lawyer as FullLawyer;
  } catch {
    return null;
  }
}

async function fetchSimilar(lawyer: FullLawyer): Promise<LawyerSummary[]> {
  try {
    const res = await fetch(`${API_V1}/lawyers?city=${lawyer.city.slug}&limit=12`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    const myAreas = new Set(lawyer.practiceAreas.map((a) => a.practiceArea.slug));
    return ((data.lawyers ?? []) as LawyerSummary[])
      .filter((l) => l.slug !== lawyer.slug)
      .map((l) => ({
        l,
        score: l.practiceAreas.filter((a) => myAreas.has(a.practiceArea.slug)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.l);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_V1}/lawyers?limit=50`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok) return [];
    return ((data.lawyers ?? []) as LawyerSummary[]).map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await fetchLawyer(slug);
  if (!l) return {};
  const fee = formatFee(l.consultationFeePaisa);
  const exp = formatExperience(l.yearsExperience);
  return {
    title: `${l.displayName} — ${l.headline ?? "Lawyer"} | wakeel.connect`,
    description: `Book ${l.displayName}${exp ? `, ${exp} experience` : ""}, ${l.city.nameEn}.${fee ? ` Fee ${fee}.` : ""} Lawyer profile on wakeel.connect.`,
  };
}

export default async function LawyerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lawyer = await fetchLawyer(slug);
  if (!lawyer) notFound();

  const similar = await fetchSimilar(lawyer);
  const fee = formatFee(lawyer.consultationFeePaisa);
  const exp = formatExperience(lawyer.yearsExperience);
  const langs = lawyer.languages.map((x) => x.language);
  const langNames = langs.map((x) => x.nameEn).join(", ");
  const primaryChamber = lawyer.chambers.find((c) => c.isPrimary) ?? lawyer.chambers[0];

  const profileFaqs = [
    {
      qEn: `What is ${lawyer.displayName}'s consultation fee?`,
      qUr: `${lawyer.displayName} کی مشاورت کی فیس کیا ہے؟`,
      aEn: fee
        ? `${fee} for a consultation — video call or chamber visit. The fee is shown upfront and confirmed before you book; you pay the lawyer directly.`
        : `Fee on request — please confirm the fee with the lawyer before booking. You pay the lawyer directly.`,
      aUr: fee
        ? `مشاورت کے لیے ${fee} — ویڈیو کال یا چیمبر ملاقات۔ فیس پہلے سے واضح ہوتی ہے اور بکنگ سے پہلے تصدیق ہوتی ہے؛ آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`
        : `فیس معلوم کریں — بکنگ سے پہلے وکیل سے فیس ضرور طے کریں۔ آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`,
    },
    {
      qEn: `Does ${lawyer.displayName} offer video consultations?`,
      qUr: `کیا ${lawyer.displayName} ویڈیو مشاورت دیتے ہیں؟`,
      aEn: `Yes — you can book a video consultation from anywhere in Pakistan, or visit the chamber${primaryChamber ? ` at ${primaryChamber.name}, ${primaryChamber.address}` : ""}. Call details are shared after booking.`,
      aUr: `جی ہاں — پاکستان میں کہیں سے بھی ویڈیو مشاورت بک کریں، یا چیمبر تشریف لائیں۔ بکنگ کے بعد کال کی تفصیل شیئر کی جاتی ہے۔`,
    },
    {
      qEn: `Which languages does ${lawyer.displayName} speak?`,
      qUr: `${lawyer.displayName} کون سی زبانیں بولتے ہیں؟`,
      aEn: langNames ? `${langNames}. Choose the language you are comfortable in when you book.` : "Contact the lawyer to ask about languages.",
      aUr: langNames ? `${langNames}۔ بکنگ کے وقت اپنی سہولت کی زبان منتخب کریں۔` : "زبانوں کے بارے میں وکیل سے رابطہ کریں۔",
    },
    {
      qEn: `Which courts does ${lawyer.displayName} practice in?`,
      qUr: `${lawyer.displayName} کن عدالتوں میں پیش ہوتے ہیں؟`,
      aEn: lawyer.courts.length > 0 ? lawyer.courts.join(", ") + "." : "Contact the lawyer for court details.",
      aUr: lawyer.courts.length > 0 ? lawyer.courts.join("، ") + "۔" : "عدالتوں کی تفصیل کے لیے وکیل سے رابطہ کریں۔",
    },
    {
      qEn: "How do I book an appointment?",
      qUr: "ملاقات کیسے بک کروں؟",
      aEn: "Three steps: pick video call or chamber visit, choose a day and time, then verify your phone number with a code. Done.",
      aUr: "تین مراحل: ویڈیو کال یا چیمبر ملاقات چنیں، دن اور وقت منتخب کریں، پھر کوڈ سے اپنا فون نمبر تصدیق کریں۔ ہو گیا۔",
    },
  ];

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
              <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} size="3xl" />
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-extrabold text-slate-900">{lawyer.displayName}</h1>
                {lawyer.headline && <p className="mt-2 text-lg text-slate-600">{lawyer.headline}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
                  <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
                  {exp && (
                    <span className="font-semibold text-slate-600">
                      <T en={`${exp} experience`} ur={`${exp} تجربہ`} />
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                    <PinIcon className="h-5 w-5 text-emerald-700" /> <T en={lawyer.city.nameEn} ur={lawyer.city.nameUr} />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lawyer.practiceAreas.map((a) => (
                    <Link key={a.practiceArea.slug} href={`/practice-areas/${a.practiceArea.slug}`}
                      className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100">
                      <T en={a.practiceArea.nameEn} ur={a.practiceArea.nameUr} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <PrimaryBtn href={`/book/${lawyer.slug}?mode=video`} icon={<VideoIcon className="h-6 w-6" />}>
                <T en={fee ? `Video Call — ${fee}` : "Video Call"} ur={fee ? `ویڈیو کال — ${fee}` : "ویڈیو کال"} />
              </PrimaryBtn>
              <SecondaryBtn href={`/book/${lawyer.slug}?mode=chamber`} icon={<OfficeIcon className="h-6 w-6" />}>
                <T en="Visit Office" ur="دفتر میں ملاقات" />
              </SecondaryBtn>
            </div>
          </section>

          {/* Availability */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <CalendarIcon className="h-7 w-7 text-emerald-700" />
              <T en="Available times" ur="دستیاب اوقات" />
            </h2>
            <LawyerAvailability lawyerSlug={lawyer.slug} />
          </section>

          {/* About */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900"><T en="About" ur="تعارف" /></h2>
            {lawyer.bio && (
              <p className="mt-3 text-lg leading-relaxed text-slate-700">
                <T en={lawyer.bio} ur={lawyer.bioUrdu ?? lawyer.bio} />
              </p>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {lawyer.education.length > 0 && (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                    <BriefcaseIcon className="h-5 w-5 text-emerald-700" /> <T en="Education" ur="تعلیم" />
                  </p>
                  <ul className="mt-2 space-y-2 text-base text-slate-700">
                    {lawyer.education.map((e, i) => (
                      <li key={i}>{e.degree}{e.institution ? ` — ${e.institution}` : ""}{e.year ? ` (${e.year})` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <ShieldIcon className="h-5 w-5 text-emerald-700" /> <T en="Bar & Courts" ur="بار اور عدالتیں" />
                </p>
                <ul className="mt-2 space-y-2 text-base text-slate-700">
                  {lawyer.barCouncil && <li>{lawyer.barCouncil}</li>}
                  {lawyer.courts.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-5">
              {langs.length > 0 && (
                <>
                  <p className="text-base font-extrabold text-slate-900"><T en="Languages" ur="زبانیں" /></p>
                  <p className="mt-1 text-base text-slate-700">
                    {langs.map((l, i) => (
                      <span key={l.code}>
                        {i > 0 && ", "}<T en={l.nameEn} ur={l.nameUr} />
                      </span>
                    ))}
                  </p>
                </>
              )}
              {primaryChamber && (
                <>
                  <p className="mt-3 text-base font-extrabold text-slate-900"><T en="Chamber" ur="چیمبر" /></p>
                  <p className="mt-1 text-base text-slate-700">{primaryChamber.name} — {primaryChamber.address}</p>
                </>
              )}
            </div>
          </section>

          {/* Reviews */}
          <ReviewSection
            reviews={lawyer.reviews}
            ratingAvg={lawyer.ratingAvg}
            ratingCount={lawyer.ratingCount}
            lawyerName={lawyer.displayName}
          />

          {/* Profile FAQs */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              <T en={`FAQs about ${lawyer.displayName}`} ur={`${lawyer.displayName} کے بارے میں سوالات`} />
            </h2>
            <div className="mt-4">
              <FaqAccordion items={profileFaqs} wide />
            </div>
          </section>
        </div>

        {/* ===== Side column: booking card ===== */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700"><T en="Consultation fee" ur="مشاورت کی فیس" /></p>
              <p className={`mt-1 font-extrabold text-emerald-900 ${fee ? "text-4xl" : "text-2xl"}`}>
                {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
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
              <li className="flex gap-2"><CheckBadgeIcon className="h-5 w-5 shrink-0 text-emerald-600" /><T en="Your number stays private until confirmed" ur="تصدیق تک آپ کا نمبر نجی رہتا ہے" /></li>
              <li className="flex gap-2"><CheckBadgeIcon className="h-5 w-5 shrink-0 text-emerald-600" /><T en="Pay the fee directly to the lawyer" ur="فیس براہِ راست وکیل کو ادا کریں" /></li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Similar lawyers */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            <T en="Similar lawyers" ur="ملتے جلتے وکیل" />
          </h2>
          <p className="mt-2 text-center text-lg text-slate-600">
            <T en="More lawyers for your legal problem." ur="آپ کے قانونی مسئلے کے لیے مزید وکیل۔" />
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((l) => (
              <LawyerCard key={l.slug} lawyer={l} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile CTA — one primary action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <PrimaryBtn href={`/book/${lawyer.slug}?mode=video`} icon={<VideoIcon className="h-6 w-6" />} className="w-full">
          <T en={fee ? `Book Now — ${fee}` : "Book Now"} ur={fee ? `ابھی بک کریں — ${fee}` : "ابھی بک کریں"} />
        </PrimaryBtn>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
