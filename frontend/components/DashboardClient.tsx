"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SectionHead } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { CalendarIcon, CheckIcon, OfficeIcon, PhoneIcon, VideoIcon } from "./icons";
import { formatPKR, getLawyer } from "@/lib/data";
import { getMyBookings, updateBookingStatus, useSession, type MyBooking } from "@/lib/session";

const STATUS_STYLE = {
  upcoming: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
} as const;

function BookingCard({ booking }: { booking: MyBooking }) {
  const lawyer = getLawyer(booking.lawyerSlug);
  const [confirming, setConfirming] = useState(false);
  const [, force] = useState(0);
  if (!lawyer) return null;

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <PhotoAvatar name={lawyer.displayName} photo={lawyer.photo} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-slate-900">
          {lawyer.displayName}
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_STYLE[booking.status]}`}>
            <T
              en={booking.status}
              ur={booking.status === "upcoming" ? "آنے والی" : booking.status === "completed" ? "مکمل" : "منسوخ"}
            />
          </span>
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-600">
          <span className="inline-flex items-center gap-1 font-semibold">
            <CalendarIcon className="h-5 w-5 text-emerald-700" />{booking.dateLabel} {booking.dateSub} · {booking.time}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            {booking.mode === "video" ? <VideoIcon className="h-5 w-5 text-emerald-700" /> : <OfficeIcon className="h-5 w-5 text-emerald-700" />}
            <T en={booking.mode === "video" ? "Video Call" : "Office Visit"} ur={booking.mode === "video" ? "ویڈیو کال" : "دفتر کی ملاقات"} />
          </span>
          <span className="font-extrabold text-emerald-800">{formatPKR(booking.feePaisa)}</span>
        </p>
        <p className="mt-1 text-sm text-slate-400">Ref: {booking.id}</p>
        {booking.docs && booking.docs.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
            <span aria-hidden>📎</span>
            <T
              en={`${booking.docs.length} document${booking.docs.length > 1 ? "s" : ""}: ${booking.docs.map((d) => d.name).join(", ")}`}
              ur={`${booking.docs.length} کاغذات: ${booking.docs.map((d) => d.name).join("، ")}`}
            />
          </p>
        )}
      </div>
      <div className="flex gap-2 sm:flex-col">
        {booking.status === "upcoming" && booking.mode === "video" && !confirming && (
          <Link
            href={`/video/${booking.id}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-base font-bold text-white hover:bg-emerald-800"
          >
            <VideoIcon className="h-5 w-5" /><T en="Join video call" ur="ویڈیو کال" />
          </Link>
        )}
        {booking.status === "upcoming" && !confirming && (
          <>
            <Link
              href={`/book/${lawyer.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-base font-bold text-white hover:bg-emerald-800"
            >
              <CalendarIcon className="h-5 w-5" /><T en="Reschedule" ur="وقت بدلیں" />
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-5 text-base font-bold text-slate-700 hover:border-red-300 hover:text-red-700"
            >
              <T en="Cancel" ur="منسوخ کریں" />
            </button>
          </>
        )}
        {booking.status === "upcoming" && confirming && (
          <>
            <button
              type="button"
              onClick={() => { updateBookingStatus(booking.id, "cancelled"); setConfirming(false); force((x) => x + 1); }}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-base font-bold text-white hover:bg-red-700"
            >
              <T en="Yes, cancel it" ur="جی ہاں، منسوخ کریں" />
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-5 text-base font-bold text-slate-700"
            >
              <T en="Keep it" ur="رہنے دیں" />
            </button>
          </>
        )}
        {booking.status === "completed" && (
          <Link
            href={`/lawyer/${lawyer.slug}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 px-5 text-base font-bold text-emerald-800 hover:bg-emerald-50"
          >
            <CheckIcon className="h-5 w-5" /><T en="Review" ur="رائے دیں" />
          </Link>
        )}
      </div>
    </article>
  );
}

export default function DashboardClient() {
  const { session, ready, logout } = useSession();
  const [bookings, setBookings] = useState<MyBooking[]>([]);

  useEffect(() => {
    if (session) setBookings(getMyBookings().filter((b) => b.phone === session.phone));
  }, [session]);

  if (!ready) {
    return <div className="mx-auto max-w-5xl px-4 py-10"><p className="text-center text-lg font-bold text-slate-500">…</p></div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <PhoneIcon className="h-10 w-10 text-emerald-700" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          <T en="Login to see your bookings" ur="بکنگز دیکھنے کے لیے لاگ اِن کریں" />
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          <T en="Enter your mobile number — we'll send a code. No password needed." ur="اپنا موبائل نمبر لکھیں — کوڈ آئے گا۔ پاس ورڈ کی ضرورت نہیں۔" />
        </p>
        <div className="mt-8">
          <PrimaryBtn href="/login?next=/dashboard" icon={<PhoneIcon className="h-6 w-6" />}>
            <T en="Login with phone" ur="فون سے لاگ اِن" />
          </PrimaryBtn>
        </div>
      </div>
    );
  }

  const sorted = [...bookings].sort((a, b) => {
    const rank = { upcoming: 0, completed: 1, cancelled: 2 } as const;
    return rank[a.status] - rank[b.status] || b.createdAt - a.createdAt;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHead
          eyebrowUr="میرا اکاؤنٹ"
          title={<T en="My bookings" ur="میری بکنگز" />}
          sub={<T en={`Logged in as +92 ${session.phone}`} ur={`+92 ${session.phone} سے لاگ اِن`} />}
        />
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-[48px] items-center rounded-xl border-2 border-slate-200 px-5 text-base font-bold text-slate-700 hover:border-red-300 hover:text-red-700"
        >
          <T en="Logout" ur="لاگ آؤٹ" />
        </button>
      </div>

      <p className="mx-auto mb-8 max-w-3xl rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900 ring-1 ring-amber-200">
        <T
          en="Demo: bookings are saved on this device only. Real accounts arrive with the backend."
          ur="ڈیمو: بکنگز صرف اسی ڈیوائس پر محفوظ ہیں۔ اصل اکاؤنٹس بیک اینڈ کے ساتھ آئیں گے۔"
        />
      </p>

      {sorted.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CalendarIcon className="h-10 w-10 text-emerald-700" />
          </span>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
            <T en="No bookings yet" ur="ابھی کوئی بکنگ نہیں" />
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            <T en="Find a lawyer and book your first consultation in about a minute." ur="وکیل تلاش کریں اور تقریباً ایک منٹ میں پہلی مشاورت بک کریں۔" />
          </p>
          <div className="mt-8">
            <PrimaryBtn href="/lawyers" icon={<CalendarIcon className="h-6 w-6" />}>
              <T en="Find a lawyer" ur="وکیل تلاش کریں" />
            </PrimaryBtn>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((b) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}

      <div className="mt-10 text-center">
        <PrimaryBtn href="/lawyers" icon={<CalendarIcon className="h-6 w-6" />}>
          <T en="Book a new consultation" ur="نئی مشاورت بک کریں" />
        </PrimaryBtn>
      </div>
    </div>
  );
}
