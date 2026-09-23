"use client";

import { useEffect, useState } from "react";
import { T, useLang } from "./LanguageContext";
import { PrimaryBtn, SectionHead } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { CalendarIcon, CheckIcon, DocIcon, OfficeIcon, PhoneIcon, UploadIcon, VideoIcon } from "./icons";
import SlotPicker, { slotToISO, type SlotPick } from "./SlotPicker";
import {
  ApiError,
  bookingDocumentUrl,
  cancelBooking,
  createReview,
  fileUrl,
  formatFee,
  getAccessToken,
  getLawyerSlots,
  listBookings,
  listLawyers,
  logout,
  rescheduleBooking,
  restoreSession,
  uploadBookingDocument,
  type Booking,
  type BookingDoc,
  type BookingMode,
  type BookingStatus,
  type SlotDay,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: "bg-brass-100 text-brass-700",
  CONFIRMED: "bg-court-100 text-court-800",
  COMPLETED: "bg-ink-900/5 text-ink-700 ring-1 ring-ink-900/10",
  CANCELLED: "bg-clay-50 text-clay-700",
  NO_SHOW: "bg-ink-900/5 text-ink-600 ring-1 ring-ink-900/10",
};

const STATUS_LABEL: Record<BookingStatus, { en: string; ur: string }> = {
  PENDING: { en: "Pending", ur: "زیر التواء" },
  CONFIRMED: { en: "Confirmed", ur: "پکی" },
  COMPLETED: { en: "Completed", ur: "مکمل" },
  CANCELLED: { en: "Cancelled", ur: "منسوخ" },
  NO_SHOW: { en: "Missed", ur: "غیر حاضر" },
};

const MODE_LABEL: Record<BookingMode, { en: string; ur: string }> = {
  ONLINE_VIDEO: { en: "Video Call", ur: "ویڈیو کال" },
  IN_CHAMBER: { en: "Office Visit", ur: "دفتر کی ملاقات" },
  PHONE: { en: "Phone Call", ur: "فون کال" },
};

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_MB = 10;

/* ---------------- documents ---------------- */

function DocumentsSection({ booking, onDocs }: { booking: Booking; onDocs: (docs: BookingDoc[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    if (!ALLOWED_MIME.has(f.type)) {
      setError("type");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError("size");
      return;
    }
    setUploading(true);
    try {
      const { document } = await uploadBookingDocument(booking.id, f);
      onDocs([...booking.documents, document]);
    } catch {
      setError("generic");
    } finally {
      setUploading(false);
    }
  };

  const download = async (doc: BookingDoc) => {
    setDownloading(doc.id);
    try {
      const token = getAccessToken();
      const res = await fetch(bookingDocumentUrl(booking.id, doc.id), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("generic");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="mt-3 rounded-lg bg-paper p-4 ring-1 ring-ink-200">
      <p className="flex items-center gap-2 text-base font-bold text-ink-800">
        <DocIcon className="h-5 w-5 text-court-700" />
        <T en="Case documents" ur="کیس کے کاغذات" />
      </p>
      {booking.documents.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {booking.documents.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-2.5 ring-1 ring-ink-200">
              <span className="min-w-0 flex-1 truncate text-base font-bold text-ink-800">{d.fileName}</span>
              <button
                type="button"
                onClick={() => download(d)}
                disabled={downloading === d.id}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg px-3 text-base font-bold text-court-800 hover:bg-court-50 disabled:opacity-50"
              >
                {downloading === d.id ? "…" : <T en="Download" ur="ڈاؤن لوڈ" />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm font-semibold text-ink-400">
          <T en="No documents yet." ur="ابھی کوئی کاغذات نہیں۔" />
        </p>
      )}
      <label className="mt-3 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-lg border border-court-700/50 px-5 text-base font-bold text-court-800 transition hover:bg-court-50">
        <UploadIcon className="h-5 w-5" />
        <T en={uploading ? "Uploading…" : "Attach file"} ur={uploading ? "اپ لوڈ ہو رہی ہے…" : "فائل لگائیں"} />
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {error === "type" && (
        <p className="mt-2 text-sm font-bold text-clay-700">
          <T en="Only PDF, JPG, PNG, WEBP, DOC or DOCX files." ur="صرف PDF، JPG، PNG، WEBP، DOC یا DOCX فائل۔" />
        </p>
      )}
      {error === "size" && (
        <p className="mt-2 text-sm font-bold text-clay-700">
          <T en={`File must be under ${MAX_MB} MB.`} ur={`فائل ${MAX_MB} ایم بی سے چھوٹی ہو۔`} />
        </p>
      )}
      {error === "generic" && (
        <p className="mt-2 text-sm font-bold text-clay-700">
          <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" />
        </p>
      )}
    </div>
  );
}

/* ---------------- review ---------------- */

function ReviewSection({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const submit = async () => {
    if (rating < 1 || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      await createReview({ bookingId, rating, comment: comment.trim() || undefined });
      onDone();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg bg-brass-50 p-4 ring-1 ring-brass-200">
      <p className="text-base font-bold text-ink-800">
        <T en="How was your consultation?" ur="مشاورت کیسی رہی؟" />
      </p>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            className="min-h-[52px] min-w-[52px] text-4xl transition active:scale-90"
          >
            <span className={n <= rating ? "text-brass-400" : "text-ink-300"}>★</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 1000))}
        rows={2}
        placeholder="…"
        aria-label="Review comment"
        className="mt-2 w-full rounded-lg border border-ink-900/15 px-4 py-2 text-base text-ink-950 outline-none focus:border-court-600 focus:ring-2 focus:ring-court-600/20"
      />
      {error && (
        <p className="mt-1 text-sm font-bold text-clay-700">
          <T en="Could not submit. Please try again." ur="بھیجی نہ جا سکی۔ دوبارہ کوشش کریں۔" />
        </p>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={rating < 1 || submitting}
        className="mt-2 inline-flex min-h-[48px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white transition hover:bg-court-800 disabled:cursor-not-allowed disabled:bg-ink-300"
      >
        <T en={submitting ? "Sending…" : "Submit review"} ur={submitting ? "بھیجی جا رہی ہے…" : "رائے بھیجیں"} />
      </button>
    </div>
  );
}

/* ---------------- reschedule ---------------- */

function RescheduleSection({
  lawyerSlug,
  onConfirm,
  onClose,
}: {
  lawyerSlug: string;
  onConfirm: (pick: SlotPick) => Promise<void>;
  onClose: () => void;
}) {
  const [days, setDays] = useState<SlotDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState<SlotPick | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLawyerSlots(lawyerSlug, 7)
      .then(({ days }) => setDays(days))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [lawyerSlug]);

  return (
    <div className="mt-3 rounded-lg bg-court-50 p-4 ring-1 ring-court-200">
      <p className="mb-3 text-base font-bold text-ink-800">
        <T en="Pick a new time" ur="نیا وقت چنیں" />
      </p>
      <SlotPicker days={days} loading={loading} onPick={setPick} />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!pick || saving}
          onClick={async () => {
            if (!pick) return;
            setSaving(true);
            try {
              await onConfirm(pick);
            } finally {
              setSaving(false);
            }
          }}
          className="inline-flex min-h-[52px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white transition hover:bg-court-800 disabled:cursor-not-allowed disabled:bg-ink-300"
        >
          <T en={saving ? "Moving…" : "Move booking here"} ur={saving ? "منتقل ہو رہی ہے…" : "بکنگ یہاں منتقل کریں"} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[52px] items-center rounded-lg border border-ink-900/15 px-6 text-base font-bold text-ink-700"
        >
          <T en="Cancel" ur="رہنے دیں" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- booking card ---------------- */

function BookingCard({
  booking,
  photoUrl,
  onUpdate,
}: {
  booking: Booking;
  photoUrl: string | null;
  onUpdate: (b: Booking) => void;
}) {
  const { lang } = useLang();
  const [mode, setMode] = useState<"idle" | "cancel" | "reschedule">("idle");
  const [reason, setReason] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const locale = lang === "ur" ? "ur-PK" : "en-PK";
  const dateStr = new Date(booking.startAt).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const timeStr = new Date(booking.startAt).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const st = STATUS_LABEL[booking.status];
  const md = MODE_LABEL[booking.mode];
  const fee = formatFee(booking.feePaisa);
  const active = booking.status === "PENDING" || booking.status === "CONFIRMED";

  const doCancel = async () => {
    setWorking(true);
    setError("");
    try {
      await cancelBooking(booking.id, reason.trim() || undefined);
      onUpdate({ ...booking, status: "CANCELLED", cancelReason: reason.trim() || null });
      setMode("idle");
    } catch {
      setError("generic");
    } finally {
      setWorking(false);
    }
  };

  const doReschedule = async (pick: SlotPick) => {
    setError("");
    try {
      const { booking: updated } = await rescheduleBooking(booking.id, slotToISO(pick.date, pick.start));
      onUpdate(updated);
      setMode("idle");
    } catch (e) {
      setError(e instanceof ApiError && e.code === "SLOT_TAKEN" ? "taken" : "generic");
    }
  };

  return (
    <article className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PhotoAvatar name={booking.lawyer.displayName} photo={photoUrl ?? undefined} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-display text-[1.15rem] font-semibold text-ink-950">
            {booking.lawyer.displayName}
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_STYLE[booking.status]}`}>
              <T en={st.en} ur={st.ur} />
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-ink-600">
            <span className="inline-flex items-center gap-1 font-semibold">
              <CalendarIcon className="h-5 w-5 text-court-700" />{dateStr} · {timeStr}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold">
              {booking.mode === "ONLINE_VIDEO" ? <VideoIcon className="h-5 w-5 text-court-700" /> : <OfficeIcon className="h-5 w-5 text-court-700" />}
              <T en={md.en} ur={md.ur} />
            </span>
            <span className="font-bold text-court-800">{fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}</span>
          </p>
          <p className="mt-1 text-sm text-ink-400">
            <T en={`Ref: ${booking.id.slice(0, 8).toUpperCase()}`} ur={`حوالہ: ${booking.id.slice(0, 8).toUpperCase()}`} />
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col">
          {active && booking.mode === "ONLINE_VIDEO" && (
            <a
              href={`/video/${booking.id}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-court-700 px-5 text-base font-bold text-white hover:bg-court-800"
            >
              <VideoIcon className="h-5 w-5" /><T en="Join video call" ur="ویڈیو کال" />
            </a>
          )}
          {active && mode === "idle" && (
            <>
              <button
                type="button"
                onClick={() => setMode("reschedule")}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-court-700/50 px-5 text-base font-bold text-court-800 hover:bg-court-50"
              >
                <CalendarIcon className="h-5 w-5" /><T en="Reschedule" ur="وقت بدلیں" />
              </button>
              <button
                type="button"
                onClick={() => setMode("cancel")}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:border-clay-400 hover:text-clay-700"
              >
                <T en="Cancel" ur="منسوخ کریں" />
              </button>
            </>
          )}
        </div>
      </div>

      {error === "taken" && (
        <p className="mt-3 rounded-lg bg-brass-50 px-4 py-3 text-sm font-bold text-brass-800 ring-1 ring-brass-200">
          <T en="That slot was just taken — pick another time." ur="یہ وقت ابھی بک ہو گیا — کوئی اور وقت چنیں۔" />
        </p>
      )}
      {error === "generic" && (
        <p className="mt-3 rounded-lg bg-clay-50 px-4 py-3 text-sm font-bold text-clay-700 ring-1 ring-clay-200">
          <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" />
        </p>
      )}

      {mode === "cancel" && (
        <div className="mt-3 rounded-lg bg-clay-50 p-4 ring-1 ring-clay-200">
          <p className="text-base font-bold text-ink-800">
            <T en="Cancel this booking?" ur="یہ بکنگ منسوخ کریں؟" />
          </p>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 200))}
            placeholder="Reason (optional)"
            className="mt-2 w-full rounded-lg border border-ink-900/15 px-4 py-2 text-base outline-none focus:border-clay-200"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={doCancel}
              disabled={working}
              className="inline-flex min-h-[52px] items-center rounded-lg bg-clay-600 px-6 text-base font-bold text-white hover:bg-clay-700 disabled:opacity-60"
            >
              <T en={working ? "Cancelling…" : "Yes, cancel it"} ur={working ? "منسوخ ہو رہی ہے…" : "جی ہاں، منسوخ کریں"} />
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="inline-flex min-h-[52px] items-center rounded-lg border border-ink-900/15 px-6 text-base font-bold text-ink-700"
            >
              <T en="Keep it" ur="رہنے دیں" />
            </button>
          </div>
        </div>
      )}

      {mode === "reschedule" && (
        <RescheduleSection lawyerSlug={booking.lawyer.slug} onConfirm={doReschedule} onClose={() => setMode("idle")} />
      )}

      {active && (
        <DocumentsSection booking={booking} onDocs={(docs) => onUpdate({ ...booking, documents: docs })} />
      )}

      {booking.status === "COMPLETED" && !reviewed && (
        <ReviewSection bookingId={booking.id} onDone={() => setReviewed(true)} />
      )}
      {booking.status === "COMPLETED" && reviewed && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-court-50 px-4 py-3 text-base font-bold text-court-800 ring-1 ring-court-200">
          <CheckIcon className="h-5 w-5" />
          <T en="Thanks for your review!" ur="آپ کی رائے کا شکریہ!" />
        </p>
      )}
    </article>
  );
}

/* ---------------- dashboard ---------------- */

export default function DashboardClient() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photoMap, setPhotoMap] = useState<Record<string, string | null>>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const u = await restoreSession().catch(() => null);
      if (cancelled) return;
      if (u) {
        try {
          const [{ bookings }, { lawyers }] = await Promise.all([
            listBookings(),
            listLawyers({ limit: 100 }),
          ]);
          if (cancelled) return;
          setBookings(bookings);
          const map: Record<string, string | null> = {};
          for (const l of lawyers) map[l.slug] = l.photoUrl;
          setPhotoMap(map);
        } catch {
          if (!cancelled) setLoadError(true);
        }
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <div className="mx-auto max-w-5xl px-4 py-10"><p className="text-center text-lg font-bold text-ink-500">…</p></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-court-100">
          <PhoneIcon className="h-10 w-10 text-court-700" />
        </span>
        <h1 className="mt-6 font-display text-[2.1rem] font-semibold text-ink-950">
          <T en="Login to see your bookings" ur="بکنگز دیکھنے کے لیے لاگ اِن کریں" />
        </h1>
        <p className="mt-2 text-lg text-ink-600">
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

  const rank: Record<BookingStatus, number> = { PENDING: 0, CONFIRMED: 1, COMPLETED: 2, NO_SHOW: 3, CANCELLED: 4 };
  const sorted = [...bookings].sort(
    (a, b) => rank[a.status] - rank[b.status] || +new Date(a.startAt) - +new Date(b.startAt)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHead
          eyebrowUr="میرا اکاؤنٹ"
          title={<T en="My bookings" ur="میری بکنگز" />}
          sub={<T en={`Logged in as ${user.phone}`} ur={`${user.phone} سے لاگ اِن`} />}
        />
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex min-h-[48px] items-center rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:border-clay-400 hover:text-clay-700"
        >
          <T en="Logout" ur="لاگ آؤٹ" />
        </button>
      </div>

      {loadError && (
        <p className="mx-auto mb-6 max-w-3xl rounded-lg bg-clay-50 px-4 py-3 text-center text-base font-bold text-clay-700 ring-1 ring-clay-200">
          <T en="Could not load bookings. Please refresh." ur="بکنگز لوڈ نہ ہو سکیں۔ صفحہ دوبارہ لوڈ کریں۔" />
        </p>
      )}

      {sorted.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-lg border border-ink-900/10 bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-court-100">
            <CalendarIcon className="h-10 w-10 text-court-700" />
          </span>
          <h2 className="mt-6 font-display text-[1.65rem] font-semibold text-ink-950">
            <T en="No bookings yet" ur="ابھی کوئی بکنگ نہیں" />
          </h2>
          <p className="mt-2 text-lg text-ink-600">
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
          {sorted.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              photoUrl={photoMap[b.lawyer.slug] ?? null}
              onUpdate={(nb) => setBookings((prev) => prev.map((x) => (x.id === nb.id ? nb : x)))}
            />
          ))}
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
