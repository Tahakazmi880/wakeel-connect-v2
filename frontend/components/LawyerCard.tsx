import Link from "next/link";
import { T } from "./LanguageContext";
import { Rating } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { OfficeIcon, PinIcon, VideoIcon } from "./icons";
import { fileUrl, formatExperience, formatFee, type LawyerSummary } from "@/lib/api";

/**
 * oladoc-style listing row: photo left, details middle, fee + booking
 * actions right (hairline divider) on desktop; clean stack on mobile.
 */
export default function LawyerCard({ lawyer }: { lawyer: LawyerSummary }) {
  const areas = lawyer.practiceAreas.slice(0, 2);
  const fee = formatFee(lawyer.consultationFeePaisa);
  const exp = formatExperience(lawyer.yearsExperience);

  return (
    <article className="flex flex-col gap-5 rounded-lg border border-ink-900/10 bg-white p-5 shadow-card transition hover:shadow-lift sm:flex-row sm:gap-6">
      {/* Photo + details */}
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Link href={`/lawyer/${lawyer.slug}`} aria-label={lawyer.displayName} className="shrink-0">
          <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} size="2xl" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/lawyer/${lawyer.slug}`}
            className="font-display text-[1.4rem] font-semibold leading-snug text-ink-950 transition hover:text-court-800"
          >
            {lawyer.displayName}
          </Link>
          <p className="mt-1 line-clamp-2 text-[1rem] text-ink-600">{lawyer.headline}</p>
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

      {/* Fee + booking actions */}
      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-ink-900/10 pt-5 sm:w-56 sm:flex-col sm:items-stretch sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="sm:text-right">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-500">
            <T en="Consultation fee" ur="مشاورت کی فیس" />
          </p>
          <p className="wc-fee mt-1 text-[1.65rem] text-ink-950">
            {fee ?? <T en="On request" ur="معلوم کریں" />}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:max-w-full">
          <Link
            href={`/book/${lawyer.slug}?mode=video`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-court-700 px-4 text-[1.02rem] font-bold text-white shadow-card transition hover:bg-court-800 active:translate-y-px"
          >
            <VideoIcon className="h-5 w-5" />
            <T en="Video Call" ur="ویڈیو کال" />
          </Link>
          <Link
            href={`/book/${lawyer.slug}?mode=chamber`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-court-700/40 bg-white px-4 text-[1.02rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 active:translate-y-px"
          >
            <OfficeIcon className="h-5 w-5" />
            <T en="Visit Office" ur="دفتر جائیں" />
          </Link>
        </div>
      </div>
    </article>
  );
}
