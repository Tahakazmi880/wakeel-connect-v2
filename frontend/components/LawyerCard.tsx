import Link from "next/link";
import { T } from "./LanguageContext";
import { Rating } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { CalendarIcon, OfficeIcon, VideoIcon } from "./icons";
import { fileUrl, formatExperience, formatFee, type LawyerSummary } from "@/lib/api";

/** Rich lawyer card for a real API profile: photo, rating, fee, booking CTAs. */
export default function LawyerCard({ lawyer }: { lawyer: LawyerSummary }) {
  const areas = lawyer.practiceAreas.slice(0, 2);
  const fee = formatFee(lawyer.consultationFeePaisa);
  const exp = formatExperience(lawyer.yearsExperience);

  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <PhotoAvatar name={lawyer.displayName} photo={fileUrl(lawyer.photoUrl) ?? undefined} size="2xl" />
        <div className="min-w-0 flex-1">
          <Link href={`/lawyer/${lawyer.slug}`} className="text-xl font-extrabold leading-snug text-slate-900 hover:text-emerald-800">
            {lawyer.displayName}
          </Link>
          <p className="mt-1 line-clamp-2 text-base text-slate-600">{lawyer.headline}</p>
        </div>
      </div>

      <div className={`mt-4 grid gap-2 text-center ${exp ? "grid-cols-3" : "grid-cols-2"}`}>
        {exp && (
          <div className="rounded-2xl bg-slate-50 px-2 py-3">
            <p className="text-2xl font-extrabold text-slate-900">{exp}</p>
            <p className="text-sm text-slate-500"><T en="Experience" ur="تجربہ" /></p>
          </div>
        )}
        <div className="rounded-2xl bg-slate-50 px-2 py-3">
          <p className="text-2xl font-extrabold text-slate-900">{lawyer.ratingCount}</p>
          <p className="text-sm text-slate-500"><T en="Reviews" ur="آراء" /></p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-2 py-3">
          <p className={`font-extrabold text-emerald-800 ${fee ? "text-2xl" : "text-lg leading-9"}`}>
            {fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
          </p>
          <p className="text-sm text-slate-500"><T en="Fee" ur="فیس" /></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-slate-600">
        <Rating rating={lawyer.ratingAvg} count={lawyer.ratingCount} />
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
          <CalendarIcon className="h-5 w-5" />
          <T en={lawyer.city.nameEn} ur={lawyer.city.nameUr} />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {areas.map((a) => (
          <Link
            key={a.practiceArea.slug}
            href={`/practice-areas/${a.practiceArea.slug}`}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"
          >
            <T en={a.practiceArea.nameEn} ur={a.practiceArea.nameUr} />
          </Link>
        ))}
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
