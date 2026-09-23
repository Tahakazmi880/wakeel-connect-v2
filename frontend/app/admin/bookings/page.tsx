"use client";

/**
 * Booking management — platform-wide booking list with a status filter and
 * expandable detail (client contact, notes, chamber, documents, payment).
 * All data comes from GET /admin/bookings and GET /admin/bookings/:id.
 */

import { useCallback, useEffect, useState } from "react";
import { T } from "@/components/LanguageContext";
import { ArrowIcon, CalendarIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { formatPKR } from "@/lib/data";
import {
  listAdminBookings,
  getAdminBooking,
  type AdminBookingSummary,
  type AdminBookingDetail,
} from "../_components/adminApi";
import { PageHead, LoadingRows, ErrorBox, EmptyState, StatusBadge } from "../_components/AdminUi";

const FILTERS: { value: string; en: string; ur: string }[] = [
  { value: "", en: "All", ur: "تمام" },
  { value: "PENDING", en: "Pending", ur: "زیرِ التواء" },
  { value: "CONFIRMED", en: "Confirmed", ur: "تصدیق شدہ" },
  { value: "COMPLETED", en: "Completed", ur: "مکمل" },
  { value: "CANCELLED", en: "Cancelled", ur: "منسوخ" },
  { value: "NO_SHOW", en: "No-show", ur: "نہیں آیا" },
];

const PAGE_SIZE = 20;

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function modeLabel(mode: string): string {
  return mode === "ONLINE" ? "Online" : mode === "IN_CHAMBER" ? "Chamber" : mode.replace(/_/g, " ");
}

function BookingDetail({ id }: { id: string }) {
  const [detail, setDetail] = useState<AdminBookingDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await getAdminBooking(id);
        if (alive) setDetail(d);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) {
    return (
      <p className="mt-3 rounded-lg bg-clay-50 p-4 text-base font-bold text-clay-700 ring-1 ring-clay-200">
        <T en="Couldn't load the booking detail." ur="بکنگ کی تفصیل لوڈ نہیں ہو سکی۔" />
      </p>
    );
  }
  if (!detail) {
    return (
      <div aria-hidden className="mt-3 space-y-2" role="status" aria-label="Loading">
        <div className="h-12 animate-pulse rounded-lg bg-ink-900/5" />
        <div className="h-12 animate-pulse rounded-lg bg-ink-900/5" />
      </div>
    );
  }

  return (
    <dl className="mt-3 space-y-3 rounded-lg bg-ink-900/[0.03] p-4 text-base ring-1 ring-ink-900/10">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Client phone" ur="کلائنٹ کا نمبر" />
          </dt>
          <dd className="mt-1">
            <a
              href={`tel:${detail.clientPhone}`}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-court-700 px-4 font-bold text-white hover:bg-court-800"
            >
              <PhoneIcon className="h-5 w-5" /> <span dir="ltr">{detail.clientPhone}</span>
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Fee" ur="فیس" />
          </dt>
          <dd className="mt-1 font-bold text-ink-900">{formatPKR(detail.feePaisa)}</dd>
        </div>
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Mode" ur="طریقہ" />
          </dt>
          <dd className="mt-1 font-bold text-ink-900">{modeLabel(detail.mode)}</dd>
        </div>
      </div>
      {detail.clientNote && (
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Client note" ur="کلائنٹ کا نوٹ" />
          </dt>
          <dd className="mt-1 text-ink-700">“{detail.clientNote}”</dd>
        </div>
      )}
      {detail.chamber && (
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Chamber" ur="چیمبر" />
          </dt>
          <dd className="mt-1 flex items-start gap-1 text-ink-700">
            <PinIcon className="mt-1 h-4 w-4 shrink-0" />
            <span>
              {detail.chamber.name} — {detail.chamber.address}
            </span>
          </dd>
        </div>
      )}
      {detail.cancelReason && (
        <div>
          <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
            <T en="Cancel reason" ur="منسوخی کی وجہ" />
          </dt>
          <dd className="mt-1 text-ink-700">{detail.cancelReason}</dd>
        </div>
      )}
      <div>
        <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
          <T en="Documents" ur="دستاویزات" />
        </dt>
        <dd className="mt-1">
          {detail.documents.length === 0 ? (
            <span className="text-ink-500">
              <T en="No documents attached." ur="کوئی دستاویز منسلک نہیں۔" />
            </span>
          ) : (
            <ul className="space-y-1">
              {detail.documents.map((d) => (
                <li key={d.id} className="text-ink-700">
                  {d.fileName}{" "}
                  <span className="text-sm text-ink-400">
                    ({d.mimeType}, {(d.sizeBytes / 1024).toFixed(0)} KB)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </dd>
      </div>
      <div>
        <dt className="text-sm font-bold uppercase tracking-wide text-ink-400">
          <T en="Payment" ur="ادائیگی" />
        </dt>
        <dd className="mt-1 text-ink-700">
          {detail.payment ? (
            <>
              {formatPKR(detail.payment.amountPaisa)} · <StatusBadge status={detail.payment.status} />
            </>
          ) : (
            <span className="text-ink-500">
              <T en="No payment record." ur="ادائیگی کا کوئی ریکارڈ نہیں۔" />
            </span>
          )}
        </dd>
      </div>
      <p className="text-sm text-ink-400">
        <T
          en={`Booked ${fmtDateTime(detail.createdAt)} · ID ${detail.id}`}
          ur={`بکنگ ${fmtDateTime(detail.createdAt)} · آئی ڈی ${detail.id}`}
        />
      </p>
    </dl>
  );
}

function BookingRow({
  booking,
  open,
  onToggle,
}: {
  booking: AdminBookingSummary;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-[1.15rem] font-semibold text-ink-950">{booking.client.fullName}</p>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-ink-500">
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" /> {fmtDateTime(booking.startAt)}
            </span>
            <span>·</span>
            <span>
              <T en="with" ur="بمقابلہ" /> {booking.lawyer.displayName}
            </span>
            <span>·</span>
            <span>{modeLabel(booking.mode)}</span>
          </p>
        </div>
        <span
          className={`inline-flex min-h-[44px] items-center gap-1 self-start text-base font-bold text-court-700 sm:self-center ${
            open ? "[&>svg]:rotate-90" : ""
          }`}
          aria-hidden
        >
          <T en={open ? "Hide detail" : "View detail"} ur={open ? "تفصیل چھپائیں" : "تفصیل دیکھیں"} />{" "}
          <ArrowIcon className="h-4 w-4 transition-transform" />
        </span>
      </button>
      {open && <BookingDetail id={booking.id} />}
    </article>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number, s: string) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminBookings({ page: p, limit: PAGE_SIZE, status: s || undefined });
      setBookings(res.bookings);
      setTotal(res.total);
      setPage(res.page);
      setOpenId(null);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void load(1, status);
  }, [status, load]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHead
        title={<T en="Bookings" ur="بکنگز" />}
        sub={
          <T
            en="All client bookings across the platform, newest first. Open a row to see contact, notes, documents and payment."
            ur="پلیٹ فارم کی تمام کلائنٹ بکنگز، نئی سے پرانی۔ رابطہ، نوٹس، دستاویزات اور ادائیگی دیکھنے کے لیے قطار کھولیں۔"
          />
        }
      />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Booking status filter">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={status === f.value}
            onClick={() => setStatus(f.value)}
            className={`min-h-[44px] rounded-full px-4 text-sm font-extrabold ring-1 transition ${
              status === f.value
                ? "bg-court-700 text-white ring-court-700"
                : "bg-white text-ink-500 ring-ink-900/10 hover:text-ink-900"
            }`}
          >
            <T en={f.en} ur={f.ur} />
          </button>
        ))}
      </div>

      {fetching ? (
        <LoadingRows rows={4} />
      ) : error ? (
        <ErrorBox onRetry={() => void load(page, status)} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title={<T en="No bookings here." ur="یہاں کوئی بکنگ نہیں۔" />}
          sub={
            <T
              en="Bookings appear here once clients start booking through the site."
              ur="جب کلائنٹ سائٹ سے بکنگ کریں گے تو وہ یہاں نظر آئیں گی۔"
            />
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-500">
            <T en={`Showing ${bookings.length} of ${total}`} ur={`${total} میں سے ${bookings.length} دکھائی جا رہی ہیں`} />
          </p>
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                open={openId === b.id}
                onToggle={() => setOpenId((cur) => (cur === b.id ? null : b.id))}
              />
            ))}
          </div>
          {pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => void load(page - 1, status)}
                className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:bg-ink-900/5 disabled:opacity-40"
              >
                <T en="Previous" ur="پچھلا" />
              </button>
              <p className="text-base font-bold text-ink-600">
                <T en={`Page ${page} of ${pages}`} ur={`صفحہ ${page} از ${pages}`} />
              </p>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => void load(page + 1, status)}
                className="inline-flex min-h-[52px] items-center gap-1 rounded-lg border border-ink-900/15 px-5 text-base font-bold text-ink-700 hover:bg-ink-900/5 disabled:opacity-40"
              >
                <T en="Next" ur="اگلا" /> <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
