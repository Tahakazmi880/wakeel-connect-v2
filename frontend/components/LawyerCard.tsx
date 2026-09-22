import Link from "next/link";
import { T } from "./LanguageContext";
import { Avatar, AvailableBadge, Stars, VerifiedBadge, nextAvailableText } from "./ui";
import { CalendarIcon, OfficeIcon, VideoIcon } from "./icons";
import { cityName, formatPKR, lawyerAreas, type Lawyer } from "@/lib/data";

/** Rich lawyer card: scannable at a glance — photo, rating, fee, availability, 2 booking CTAs. */
export default function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  const next = nextAvailableText(lawyer);
  const areas = lawyerAreas(lawyer).slice(0, 2);
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex gap-4">
        <Avatar name={lawyer.displayName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/lawyer/${lawyer.slug}`} className="truncate text-xl font-extrabold text-slate-900 hover:text-emerald-800">
              {lawyer.displayName}
            </Link>
          </div>
          <p className="mt-1 line-clamp-2 text-base text-slate-600">{lawyer.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <VerifiedBadge />
            <AvailableBadge />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-slate-50 px-2 py-3">
          <p className="text-2xl font-extrabold text-slate-900">{lawyer.yearsExperience}</p>
          <p className="text-sm text-slate-500"><T en="Years Exp." ur="سال تجربہ" /></p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2 py-3">
          <p className="text-2xl font-extrabold text-slate-900">{lawyer.reviewCount}</p>
          <p className="text-sm text-slate-500"><T en="Reviews" ur="آراء" /></p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-3">
          <p className="text-2xl font-extrabold text-emerald-800">{formatPKR(lawyer.consultationFeePaisa)}</p>
          <p className="text-sm text-slate-500"><T en="Fee" ur="فیس" /></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-slate-600">
        <Stars rating={lawyer.rating} count={lawyer.reviewCount} />
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
          <CalendarIcon className="h-5 w-5" />
          <T en={next.en} ur={next.ur} />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {areas.map((a) => (
          <Link
            key={a.slug}
            href={`/practice-areas/${a.slug}`}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"
          >
            <T en={a.nameEn} ur={a.nameUr} />
          </Link>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-500">
          {cityName(lawyer.citySlug)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={`/book/${lawyer.slug}?mode=video`}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 text-base font-bold text-white shadow transition hover:bg-emerald-800 active:scale-[0.98]"
        >
          <VideoIcon className="h-5 w-5" />
          <T en="Video Call" ur="ویڈیو کال" />
        </Link>
        <Link
          href={`/book/${lawyer.slug}?mode=chamber`}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white px-4 text-base font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98]"
        >
          <OfficeIcon className="h-5 w-5" />
          <T en="Visit Office" ur="دفتر جائیں" />
        </Link>
      </div>
    </article>
  );
}
