import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, Rating, SecondaryBtn } from "@/components/ui";
import { PhotoAvatar } from "@/components/PhotoAvatar";
import FaqAccordion from "@/components/FaqAccordion";
import LawyerCard from "@/components/LawyerCard";
import ProfileAvailability from "@/components/ProfileAvailability";
import StickyProfileTabs from "@/components/StickyProfileTabs";
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

type FullLawyer = LawyerSummary & {
  reviews: LawyerReview[];
  memberships?: string[];
  offersOnline?: boolean;
  onlineFeePaisa?: number;
  nextAvailable?: { date: string; label: string } | null;
};

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
      .slice(0, 4)
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

/** Small editorial section title inside profile cards. */
function ProfileSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-[1.65rem] font-semibold text-ink-950">{children}</h2>
      <span aria-hidden className="mt-2.5 block h-[3px] w-10 bg-brass-500" />
    </div>
  );
}

export default async function LawyerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lawyer = await fetchLawyer(slug);
  if (!lawyer) notFound();

  const similar = await fetchSimilar(lawyer);
  const fee = formatFee(lawyer.consultationFeePaisa);
  const onlineFee = formatFee(lawyer.onlineFeePaisa ?? 0);
  const offersOnline = lawyer.offersOnline === true;
  const exp = formatExperience(lawyer.yearsExperience);
  const langs = lawyer.languages.map((x) => x.language);
  const langNames = langs.map((x) => x.nameEn).join(", ");
  const primaryChamber = lawyer.chambers.find((c) => c.isPrimary) ?? lawyer.chambers[0];
  const nextAvailable = lawyer.nextAvailable ?? null;

  const profileFaqs = [
    {
      qEn: `What is ${lawyer.displayName}'s consultation fee?`,
      qUr: `${lawyer.displayName} کی مشاورت کی فیس کیا ہے؟`,
      aEn: fee
        ? `${fee} for an online consultation or chamber visit. The fee is shown upfront and confirmed before you book; you pay the lawyer directly.`
        : `Fee on request — please confirm the fee with the lawyer before booking. You pay the lawyer directly.`,
      aUr: fee
        ? `مشاورت کے لیے ${fee} — آن لائن مشاورت یا چیمبر ملاقات۔ فیس پہلے سے واضح ہوتی ہے اور بکنگ سے پہلے تصدیق ہوتی ہے؛ آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`
        : `فیس معلوم کریں — بکنگ سے پہلے وکیل سے فیس ضرور طے کریں۔ آپ فیس براہ راست وکیل کو ادا کرتے ہیں۔`,
    },
    {
      qEn: `Does ${lawyer.displayName} offer online consultations?`,
      qUr: `کیا ${lawyer.displayName} آن لائن مشاورت دیتے ہیں؟`,
      aEn: offersOnline
        ? `Yes — you can book an online consultation from anywhere in Pakistan, or visit the chamber${primaryChamber ? ` at ${primaryChamber.name}, ${primaryChamber.address}` : ""}. Call details are shared after booking.`
        : `This lawyer currently takes chamber visits${primaryChamber ? ` at ${primaryChamber.name}, ${primaryChamber.address}` : ""}. Online consultations are not listed for this profile.`,
      aUr: offersOnline
        ? `جی ہاں — پاکستان میں کہیں سے بھی آن لائن مشاورت بک کریں، یا چیمبر تشریف لائیں۔ بکنگ کے بعد کال کی تفصیل شیئر کی جاتی ہے۔`
        : `یہ وکیل فی الحال چیمبر ملاقاتیں کرتے ہیں۔ اس پروفائل پر آن لائن مشاورت درج نہیں ہے۔`,
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
      aEn: "Three steps: pick online consultation or chamber visit, choose a day and time, then verify your phone number with a code. Done.",
      aUr: "تین مراحل: آن لائن مشاورت یا چیمبر ملاقات چنیں، دن اور وقت منتخب کریں، پھر کوڈ سے اپنا فون نمبر تصدیق کریں۔ ہو گیا۔",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-[0.98rem] font-medium text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-court-700">wakeel.connect</Link>
        <span className="mx-2 text-ink-300">/</span>
        <Link href="/lawyers" className="transition hover:text-court-700"><T en="Lawyers" ur="وکیل" /></Link>
        <span className="mx-2 text-ink-300">/</span>
        <span className="font-bold text-ink-800">{lawyer.displayName}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ===== Main column ===== */}
        <div className="lg:col-span-2">
          {/* Sticky in-page section tabs (oladoc pattern) */}
          <StickyProfileTabs />

          {/* Header card */}
          <section id="overview" className="scroll-mt-36 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row">
              <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} gender={lawyer.gender} size="3xl" />
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-[2.1rem] font-semibold leading-tight text-ink-950">{lawyer.displayName}</h1>
                {lawyer.headline && <p className="mt-2 text-[1.08rem] text-ink-600">{lawyer.headline}</p>}
                <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
                  {exp && (
                    <span className="text-[0.98rem] font-semibold text-ink-600">
                      <T en={`${exp} experience`} ur={`${exp} تجربہ`} />
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[0.98rem] font-semibold text-ink-600">
                    <PinIcon className="h-5 w-5 text-brass-600" /> <T en={lawyer.city.nameEn} ur={lawyer.city.nameUr} />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lawyer.practiceAreas.map((a) => (
                    <Link key={a.practiceArea.slug} href={`/practice-areas/${a.practiceArea.slug}`}
                      className="rounded-full border border-ink-900/15 px-4 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-court-700 hover:text-court-800">
                      <T en={a.practiceArea.nameEn} ur={a.practiceArea.nameUr} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <PrimaryBtn href={`/book/${lawyer.slug}?mode=online`} icon={<VideoIcon className="h-6 w-6" />}>
                <T en={onlineFee ? `Online Consultation — ${onlineFee}` : "Online Consultation"} ur={onlineFee ? `آن لائن مشاورت — ${onlineFee}` : "آن لائن مشاورت"} />
              </PrimaryBtn>
              <SecondaryBtn href={`/book/${lawyer.slug}?mode=chamber`} icon={<OfficeIcon className="h-6 w-6" />}>
                <T en="Visit Office" ur="دفتر میں ملاقات" />
              </SecondaryBtn>
            </div>
          </section>

          {/* Availability — collapsible per-location rows (oladoc pattern) */}
          <section id="availability" className="mt-6 scroll-mt-36 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
            <ProfileSectionTitle>
              <span className="inline-flex items-center gap-2.5">
                <CalendarIcon className="h-6 w-6 text-court-700" />
                <T en="Available times" ur="دستیاب اوقات" />
              </span>
            </ProfileSectionTitle>
            <ProfileAvailability
              lawyerSlug={lawyer.slug}
              offersOnline={offersOnline}
              onlineFee={onlineFee}
              chamberFee={fee}
              chambers={lawyer.chambers.map((c) => ({
                id: c.id,
                name: c.name,
                address: c.address,
                isPrimary: c.isPrimary,
              }))}
            />
          </section>

          {/* Fees & timings — per-location fee table */}
          <section id="fees" className="mt-6 scroll-mt-36 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
            <ProfileSectionTitle><T en="Fees & timings" ur="فیس اور اوقات" /></ProfileSectionTitle>
            <dl className="divide-y divide-ink-900/10 overflow-hidden rounded-lg border border-ink-900/10">
              {offersOnline && (
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="min-w-0">
                    <span className="inline-flex items-center gap-2.5 text-[1.02rem] font-bold text-ink-800">
                      <VideoIcon className="h-5 w-5 shrink-0 text-court-700" />
                      <T en="Online consultation" ur="آن لائن مشاورت" />
                    </span>
                    <span className="mt-0.5 block pl-[2.125rem] text-[0.92rem] font-medium text-ink-500">
                      <T en="Online consultation from anywhere in Pakistan" ur="پاکستان میں کہیں سے بھی آن لائن مشاورت" />
                    </span>
                  </dt>
                  <dd className="wc-fee shrink-0 text-[1.15rem] font-semibold text-ink-950">
                    {onlineFee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                  </dd>
                </div>
              )}
              {lawyer.chambers.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="min-w-0">
                    <span className="inline-flex items-center gap-2.5 text-[1.02rem] font-bold text-ink-800">
                      <OfficeIcon className="h-5 w-5 shrink-0 text-court-700" />
                      <span className="truncate">{c.name}</span>
                      {c.isPrimary && (
                        <span className="shrink-0 rounded-full bg-court-50 px-2.5 py-0.5 text-[0.78rem] font-bold text-court-700">
                          <T en="Main" ur="مرکزی" />
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate pl-[2.125rem] text-[0.92rem] font-medium text-ink-500">
                      {c.address}
                    </span>
                  </dt>
                  <dd className="wc-fee shrink-0 text-[1.15rem] font-semibold text-ink-950">
                    {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3.5 text-[0.98rem] font-medium text-ink-500">
              <T
                en="The fee is shown upfront and confirmed before you book. You pay the fee directly to the lawyer."
                ur="فیس پہلے سے واضح ہوتی ہے اور بکنگ سے پہلے تصدیق ہوتی ہے۔ آپ فیس براہِ راست وکیل کو ادا کرتے ہیں۔"
              />
            </p>
          </section>

          {/* About */}
          <section id="about" className="mt-6 scroll-mt-36 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
            <ProfileSectionTitle><T en="About" ur="تعارف" /></ProfileSectionTitle>
            {lawyer.bio && (
              <p className="text-[1.08rem] leading-relaxed text-ink-700">
                <T en={lawyer.bio} ur={lawyer.bioUrdu ?? lawyer.bio} />
              </p>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {lawyer.education.length > 0 && (
                <div className="rounded-lg bg-paper-dark/50 p-5 ring-1 ring-ink-900/10">
                  <p className="flex items-center gap-2 text-[1rem] font-bold text-ink-950">
                    <BriefcaseIcon className="h-5 w-5 text-court-700" /> <T en="Education" ur="تعلیم" />
                  </p>
                  <ul className="mt-2.5 space-y-2 text-[1rem] text-ink-700">
                    {lawyer.education.map((e, i) => (
                      <li key={i}>{e.degree}{e.institution ? ` — ${e.institution}` : ""}{e.year ? ` (${e.year})` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-lg bg-paper-dark/50 p-5 ring-1 ring-ink-900/10">
                <p className="flex items-center gap-2 text-[1rem] font-bold text-ink-950">
                  <ShieldIcon className="h-5 w-5 text-court-700" /> <T en="Bar & Courts" ur="بار اور عدالتیں" />
                </p>
                <ul className="mt-2.5 space-y-2 text-[1rem] text-ink-700">
                  {lawyer.barCouncil && <li>{lawyer.barCouncil}</li>}
                  {lawyer.courts.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>
            {(lawyer.memberships?.length ?? 0) > 0 && (
              <div className="mt-4 rounded-lg bg-paper-dark/50 p-5 ring-1 ring-ink-900/10">
                <p className="text-[1rem] font-bold text-ink-950"><T en="Professional memberships" ur="پیشہ ورانہ رکنیتیں" /></p>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[1rem] text-ink-700">
                  {lawyer.memberships!.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-4 rounded-lg bg-paper-dark/50 p-5 ring-1 ring-ink-900/10">
              {langs.length > 0 && (
                <>
                  <p className="text-[1rem] font-bold text-ink-950"><T en="Languages" ur="زبانیں" /></p>
                  <p className="mt-1.5 text-[1rem] text-ink-700">
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
                  <p className="mt-4 text-[1rem] font-bold text-ink-950"><T en="Chamber" ur="چیمبر" /></p>
                  <p className="mt-1.5 text-[1rem] text-ink-700">{primaryChamber.name} — {primaryChamber.address}</p>
                </>
              )}
            </div>
          </section>

          {/* Reviews */}
          <div id="reviews" className="mt-6 scroll-mt-36">
            <ReviewSection
              reviews={lawyer.reviews}
              ratingAvg={lawyer.ratingAvg}
              ratingCount={lawyer.ratingCount}
              lawyerName={lawyer.displayName}
            />
          </div>

          {/* Profile FAQs */}
          <section id="faqs" className="mt-6 scroll-mt-36 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
            <ProfileSectionTitle>
              <T en={`FAQs about ${lawyer.displayName}`} ur={`${lawyer.displayName} کے بارے میں سوالات`} />
            </ProfileSectionTitle>
            <FaqAccordion items={profileFaqs} wide />
          </section>
        </div>

        {/* ===== Side column: booking card (desktop only) ===== */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="rounded-lg border border-ink-900/10 bg-white p-6 shadow-lift">
            <div className="flex items-center gap-4 border-b-2 border-brass-500 pb-4">
              <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} gender={lawyer.gender} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-display text-[1.25rem] font-semibold text-ink-950">{lawyer.displayName}</p>
                {nextAvailable ? (
                  <p className="mt-0.5 text-[0.95rem] font-bold text-court-700">
                    <T en={`Next available: ${nextAvailable.label}`} ur={`اگلا دستیاب: ${nextAvailable.label}`} />
                  </p>
                ) : (
                  <p className="mt-0.5 text-[0.95rem] font-semibold text-ink-500">
                    <T en="Timings on request" ur="اوقات معلوم کریں" />
                  </p>
                )}
              </div>
            </div>
            <div className="border-b border-ink-900/10 py-4 text-center">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-500">
                <T en="Consultation fee" ur="مشاورت کی فیس" />
              </p>
              <p className={`wc-fee mt-1.5 text-ink-950 ${fee ? "text-[2.5rem]" : "text-[1.6rem]"}`}>
                {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <PrimaryBtn href={`/book/${lawyer.slug}?mode=online`} icon={<VideoIcon className="h-6 w-6" />} className="w-full">
                <T en="Book Online Consultation" ur="آن لائن مشاورت بک کریں" />
              </PrimaryBtn>
              <SecondaryBtn href={`/book/${lawyer.slug}?mode=chamber`} icon={<OfficeIcon className="h-6 w-6" />} className="w-full">
                <T en="Book Office Visit" ur="دفتر کی ملاقات بک کریں" />
              </SecondaryBtn>
            </div>
            <ul className="mt-6 space-y-3 border-t border-ink-900/10 pt-5 text-[0.98rem] text-ink-600">
              <li className="flex gap-2.5">
                <CheckBadgeIcon className="h-5 w-5 shrink-0 text-court-700" />
                <T en="Your number stays private until confirmed" ur="تصدیق تک آپ کا نمبر نجی رہتا ہے" />
              </li>
              <li className="flex gap-2.5">
                <CheckBadgeIcon className="h-5 w-5 shrink-0 text-court-700" />
                <T en="Pay the fee directly to the lawyer" ur="فیس براہِ راست وکیل کو ادا کریں" />
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Similar lawyers */}
      {similar.length > 0 && (
        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="wc-kicker"><T en="Keep looking" ur="مزید دیکھیں" /></p>
            <h2 className="mt-3 font-display text-[2rem] font-semibold text-ink-950">
              <T en="Similar lawyers" ur="ملتے جلتے وکیل" />
            </h2>
            <span aria-hidden className="mx-auto mt-4 block h-[3px] w-12 bg-brass-500" />
            <p className="mt-4 text-[1.05rem] text-ink-600">
              <T en="More lawyers for your legal problem." ur="آپ کے قانونی مسئلے کے لیے مزید وکیل۔" />
            </p>
          </div>
          <div className="mx-auto max-w-4xl space-y-5">
            {similar.map((l) => (
              <LawyerCard key={l.slug} lawyer={l} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile CTA — one primary action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-900/10 bg-paper/95 p-3 backdrop-blur lg:hidden">
        <PrimaryBtn href={`/book/${lawyer.slug}?mode=online`} icon={<VideoIcon className="h-6 w-6" />} className="w-full">
          <T en={fee ? `Book Now — ${fee}` : "Book Now"} ur={fee ? `ابھی بک کریں — ${fee}` : "ابھی بک کریں"} />
        </PrimaryBtn>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
