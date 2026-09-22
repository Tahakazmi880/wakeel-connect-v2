import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { Avatar, DemoNotice, PrimaryBtn, SectionHead } from "@/components/ui";
import { CalendarIcon, CheckIcon, OfficeIcon, PhoneIcon, VideoIcon } from "@/components/icons";
import { DEMO_BOOKINGS, formatPKR, getLawyer } from "@/lib/data";

export const metadata: Metadata = {
  title: "My Bookings — wakeel.connect",
  description: "Your upcoming and past lawyer bookings.",
};

const STATUS_STYLE = {
  upcoming: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
} as const;

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHead
        eyebrowUr="میرا اکاؤنٹ"
        title={<T en="My bookings" ur="میری بکنگز" />}
        sub={<T en="Your upcoming and past consultations, in one place." ur="آپ کی آنے والی اور گزشتہ مشاورتیں، ایک جگہ۔" />}
      />
      <div className="mx-auto mb-8 max-w-3xl"><DemoNotice /></div>

      <div className="space-y-4">
        {DEMO_BOOKINGS.map((b) => {
          const lawyer = getLawyer(b.lawyerSlug);
          if (!lawyer) return null;
          return (
            <article key={b.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <Avatar name={lawyer.displayName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-slate-900">
                  {lawyer.displayName}
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_STYLE[b.status]}`}>
                    <T en={b.status} ur={b.status === "upcoming" ? "آنے والی" : b.status === "completed" ? "مکمل" : "منسوخ"} />
                  </span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-600">
                  <span className="inline-flex items-center gap-1 font-semibold"><CalendarIcon className="h-5 w-5 text-emerald-700" />{b.date} · {b.time}</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {b.mode === "video" ? <VideoIcon className="h-5 w-5 text-emerald-700" /> : <OfficeIcon className="h-5 w-5 text-emerald-700" />}
                    <T en={b.mode === "video" ? "Video Call" : "Office Visit"} ur={b.mode === "video" ? "ویڈیو کال" : "دفتر کی ملاقات"} />
                  </span>
                  <span className="font-extrabold text-emerald-800">{formatPKR(b.feePaisa)}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">Ref: {b.id}</p>
              </div>
              <div className="flex gap-2 sm:flex-col">
                {b.status === "upcoming" && (
                  <>
                    <Link href={`/book/${lawyer.slug}`} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-base font-bold text-white hover:bg-emerald-800">
                      <CalendarIcon className="h-5 w-5" /><T en="Reschedule" ur="وقت بدلیں" />
                    </Link>
                    <a href="tel:0800-00000" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-5 text-base font-bold text-slate-700 hover:border-emerald-400">
                      <PhoneIcon className="h-5 w-5" /><T en="Call" ur="کال کریں" />
                    </a>
                  </>
                )}
                {b.status === "completed" && (
                  <Link href={`/lawyer/${lawyer.slug}`} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-5 text-base font-bold text-emerald-800 hover:bg-emerald-50">
                    <CheckIcon className="h-5 w-5" /><T en="Review" ur="رائے دیں" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <PrimaryBtn href="/lawyers" icon={<CalendarIcon className="h-6 w-6" />}>
          <T en="Book a new consultation" ur="نئی مشاورت بک کریں" />
        </PrimaryBtn>
      </div>
    </div>
  );
}
