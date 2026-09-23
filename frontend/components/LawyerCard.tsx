import Link from "next/link";
import { T } from "./LanguageContext";
import { Rating } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { CheckBadgeIcon, OfficeIcon, PinIcon, VideoIcon } from "./icons";
import { fileUrl, formatExperience, formatFee, type LawyerSummary } from "@/lib/api";

/** Extended listing fields the directory API supplies (optional until backend lands). */
export interface LawyerCardData extends LawyerSummary {
  memberships?: string[];
  offersOnline?: boolean;
  onlineFeePaisa?: number;
  nextAvailable?: { date: string; label: string } | null;
}

/**
 * oladoc-style dual-mode listing row: photo left, details middle,
 * availability rows + dual CTA right (hairline divider) on desktop;
 * clean stack on mobile.
 */
export default function LawyerCard({ lawyer }: { lawyer: LawyerCardData }) {
  const areas = lawyer.practiceAreas.slice(0, 2);
  const exp = formatExperience(lawyer.yearsExperience);
  const online = lawyer.offersOnline === true;
  const onlineFee = formatFee(lawyer.onlineFeePaisa ?? 0);
  const chamberFee = formatFee(lawyer.consultationFeePaisa);
  const nextLabel = lawyer.nextAvailable?.label;
  const hasChamber = lawyer.chambers.length > 0;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card transition hover:shadow-lift sm:flex-row sm:gap-6">
      {/* Photo + details — compact avatar on phones, full size on sm+ */}
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        <Link href={`/lawyer/${lawyer.slug}`} aria-label={lawyer.displayName} className="shrink-0">
          <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} gender={lawyer.gender} size="lg" className="sm:h-40 sm:w-40" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/lawyer/${lawyer.slug}`}
              className="font-display text-[1.25rem] font-semibold leading-snug text-court-800 transition hover:text-court-600 hover:underline hover:decoration-court-300 hover:underline-offset-4 sm:text-[1.4rem]"
            >
              {lawyer.displayName}
            </Link>
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-court-100 px-2.5 py-0.5 text-xs font-bold text-court-800">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              <T en="Reviewed profile" ur="جائزہ شدہ پروفائل" />
            </span>
          </div>
          {lawyer.headline && (
            <p className="mt-1 line-clamp-2 text-[1rem] text-ink-600">{lawyer.headline}</p>
          )}
          <div className="mt-2.5">
            <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.95rem] font-medium text-ink-600">
            <span className="inline-flex items-center gap-1.5">
              <PinIcon className="h-4.5 w-4.5 text-brass-600" />
              <T en={lawyer.city.nameEn} ur={lawyer.city.nameUr} />
            </span>
            {exp && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-ink-300" aria-hidden />
                {exp} <T en="experience" ur="تجربہ" />
              </span>
            )}
          </div>
          {areas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {areas.map((a) => (
                <Link
                  key={a.practiceArea.slug}
                  href={`/practice-areas/${a.practiceArea.slug}`}
                  className="rounded-full border border-ink-900/15 px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-court-700 hover:text-court-800"
                >
                  <T en={a.practiceArea.nameEn} ur={a.practiceArea.nameUr} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Availability rows + dual CTA */}
      <div className="flex shrink-0 flex-col justify-center gap-3 border-t border-ink-900/10 pt-5 sm:w-64 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="space-y-2 text-[0.98rem]">
          {online && (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-court-50 px-3.5 py-2.5 ring-1 ring-court-200">
              <span className="inline-flex items-center gap-2 font-bold text-court-800">
                <VideoIcon className="h-5 w-5" />
                <T en="Online" ur="آن لائن" />
              </span>
              <span className="flex shrink-0 flex-col items-end leading-snug">
                <span className="font-semibold text-ink-700">
                  {nextLabel ? (
                    <T en={`Next: ${nextLabel}`} ur={`اگلا: ${nextLabel}`} />
                  ) : (
                    <T en="Timings on request" ur="اوقات معلوم کریں" />
                  )}
                </span>
                <span className="wc-fee whitespace-nowrap font-bold text-ink-950">
                  {onlineFee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                </span>
              </span>
            </div>
          )}
          {hasChamber && (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-paper-dark/50 px-3.5 py-2.5 ring-1 ring-ink-900/10">
              <span className="inline-flex items-center gap-2 font-bold text-ink-800">
                <OfficeIcon className="h-5 w-5" />
                <T en="Chamber" ur="چیمبر" />
              </span>
              <span className="flex shrink-0 flex-col items-end leading-snug">
                <span className="font-semibold text-ink-700">
                  {nextLabel ? (
                    <T en={`Next: ${nextLabel}`} ur={`اگلا: ${nextLabel}`} />
                  ) : (
                    <T en="Timings on request" ur="اوقات معلوم کریں" />
                  )}
                </span>
                <span className="wc-fee whitespace-nowrap font-bold text-ink-950">
                  {chamberFee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-2.5">
          {online ? (
            <Link
              href={`/book/${lawyer.slug}?mode=online`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-court-700 px-4 text-[1.02rem] font-bold text-white shadow-card transition hover:bg-court-800 active:translate-y-px"
            >
              <VideoIcon className="h-5 w-5" />
              <T en="Online Consultation" ur="آن لائن مشاورت" />
            </Link>
          ) : (
            <Link
              href={`/lawyer/${lawyer.slug}`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-court-700 px-4 text-[1.02rem] font-bold text-white shadow-card transition hover:bg-court-800 active:translate-y-px"
            >
              <T en="View Profile" ur="پروفائل دیکھیں" />
            </Link>
          )}
          <Link
            href={`/book/${lawyer.slug}`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-court-700/40 bg-white px-4 text-[1.02rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 active:translate-y-px"
          >
            <T en="Book Appointment" ur="ملاقات بک کریں" />
          </Link>
        </div>
      </div>
    </article>
  );
}
