"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import { listBookings, formatFee, type Booking } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

function fmtDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function modeLabel(mode: Booking["mode"]): { en: string; ur: string } {
  switch (mode) {
    case "ONLINE_VIDEO":
      return { en: "Video consultation", ur: "ویڈیو مشاورت" };
    case "IN_CHAMBER":
      return { en: "In-chamber visit", ur: "چیمبر ملاقات" };
    case "PHONE":
      return { en: "Phone call", ur: "فون کال" };
  }
}

export default function VideoRoom({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    if (!user) {
      setBooking(null);
      return;
    }
    let cancelled = false;
    listBookings()
      .then(({ bookings }) => {
        if (!cancelled) setBooking(bookings.find((b) => b.id === bookingId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setBooking(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user, bookingId]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Honest banner — in-browser video calls are not connected yet */}
      <div
        role="status"
        className="rounded-lg border border-brass-300 bg-brass-50 p-6 text-center shadow-card sm:p-8"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brass-100 text-3xl" aria-hidden>
          📞
        </span>
        <h1 className="mt-4 font-display text-[1.75rem] font-semibold text-brass-900 sm:text-3xl">
          <T en="Video calls aren't live in the app yet" ur="ویڈیو کال ابھی ایپ میں فعال نہیں" />
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-brass-800">
          <T
            en="For your online consultation, the lawyer will call you directly on your phone at the booked time. Please keep your phone nearby."
            ur="آپ کی آن لائن مشاورت کے لیے وکیل بک کیے گئے وقت پر آپ کو براہِ راست فون کرے گا۔ براہ کرم اپنا فون پاس رکھیں۔"
          />
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
        {!user ? (
          <>
            <p className="font-display text-[1.15rem] font-semibold text-ink-950">
              <T en="Login to see your booking details" ur="بکنگ کی تفصیل کے لیے لاگ اِن کریں" />
            </p>
            <div className="mt-4">
              <PrimaryBtn href={`/login?next=${encodeURIComponent(`/video/${bookingId}`)}`}>
                <T en="Login / Sign up" ur="لاگ اِن / اکاؤنٹ بنائیں" />
              </PrimaryBtn>
            </div>
          </>
        ) : booking === undefined ? (
          <p className="text-center text-lg font-bold text-ink-500">
            <T en="Loading your booking…" ur="آپ کی بکنگ لوڈ ہو رہی ہے…" />
          </p>
        ) : booking === null ? (
          <>
            <p className="font-display text-[1.15rem] font-semibold text-ink-950">
              <T en="Booking not found" ur="بکنگ نہیں ملی" />
            </p>
            <p className="mt-1 text-base text-ink-600">
              <T
                en="This link doesn't match any booking on your account."
                ur="یہ لنک آپ کے اکاؤنٹ کی کسی بکنگ سے میل نہیں کھاتا۔"
              />
            </p>
          </>
        ) : (
          <>
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-500">
              <T en="Your booking" ur="آپ کی بکنگ" />
            </p>
            <h2 className="mt-1 font-display text-[1.65rem] font-semibold text-ink-950">{booking.lawyer.displayName}</h2>
            <dl className="mt-4 space-y-3 text-lg">
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-2xl">🕐</span>
                <div>
                  <dt className="sr-only"><T en="Time" ur="وقت" /></dt>
                  <dd className="font-bold text-ink-800">{fmtDateTime(booking.startAt)}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-2xl">📋</span>
                <div>
                  <dt className="sr-only"><T en="Mode" ur="طریقہ" /></dt>
                  <dd className="font-bold text-ink-800"><T en={modeLabel(booking.mode).en} ur={modeLabel(booking.mode).ur} /></dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-2xl">💰</span>
                <div>
                  <dt className="sr-only"><T en="Fee" ur="فیس" /></dt>
                  <dd className="font-bold text-ink-800">
                    {formatFee(booking.feePaisa) ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-2xl">📌</span>
                <div>
                  <dt className="sr-only"><T en="Status" ur="حیثیت" /></dt>
                  <dd className="font-bold text-ink-800">{booking.status}</dd>
                </div>
              </div>
            </dl>
            {booking.mode === "ONLINE_VIDEO" && (
              <p className="mt-4 rounded-lg bg-court-50 p-4 text-base font-semibold text-ink-900 ring-1 ring-court-200">
                <T
                  en="The lawyer will phone you at the time above — no app download or link needed."
                  ur="وکیل اوپر دیے گئے وقت پر آپ کو فون کرے گا — کسی ایپ یا لنک کی ضرورت نہیں۔"
                />
              </p>
            )}
          </>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <SecondaryBtn href="/dashboard">
            <T en="My bookings" ur="میری بکنگز" />
          </SecondaryBtn>
          <Link href="/" className="inline-flex min-h-[52px] items-center justify-center rounded-lg px-6 py-3 text-lg font-bold text-ink-600 hover:text-court-700 hover:underline">
            <T en="Back to home" ur="ہوم پر واپس" />
          </Link>
        </div>
      </div>
    </div>
  );
}
