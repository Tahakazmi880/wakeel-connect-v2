"use client";

/**
 * Callback-leads inbox — newest first, paginated, server-side status filter,
 * and in-place status changes via PATCH /admin/leads/:id.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PhoneIcon, ArrowIcon } from "@/components/icons";
import { listAdminLeads, setLeadStatus, type AdminLead } from "../_components/adminApi";
import { PageHead, LoadingRows, ErrorBox, EmptyState, StatusBadge } from "../_components/AdminUi";

const FILTERS: { value: string; en: string; ur: string }[] = [
  { value: "", en: "All", ur: "تمام" },
  { value: "NEW", en: "New", ur: "نئی" },
  { value: "CONTACTED", en: "Contacted", ur: "رابطہ ہوا" },
  { value: "CONVERTED", en: "Converted", ur: "کنورٹڈ" },
  { value: "CLOSED", en: "Closed", ur: "بند" },
];

const STATUSES: { value: string; en: string; ur: string }[] = [
  { value: "NEW", en: "New", ur: "نئی" },
  { value: "CONTACTED", en: "Contacted", ur: "رابطہ ہوا" },
  { value: "CONVERTED", en: "Converted", ur: "کنورٹڈ" },
  { value: "CLOSED", en: "Closed", ur: "بند" },
];

const PAGE_SIZE = 20;

function leadDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function LeadCard({
  lead,
  onStatusChange,
}: {
  lead: AdminLead;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const change = async (status: string) => {
    if (status === lead.status || saving) return;
    setSaving(true);
    setFailed(false);
    try {
      const updated = await setLeadStatus(lead.id, status);
      onStatusChange(lead.id, updated.status);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-[1.2rem] font-semibold text-ink-950">{lead.fullName}</p>
            <StatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-base text-ink-500">
            <T en={lead.matter} ur={lead.matter} /> · {lead.citySlug} · {leadDate(lead.createdAt)}
          </p>
          {lead.notes && <p className="mt-2 text-base text-ink-600">“{lead.notes}”</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-sm font-bold text-ink-600">
              <T en="Status:" ur="حیثیت:" />{" "}
              <select
                value={lead.status}
                disabled={saving}
                onChange={(e) => void change(e.target.value)}
                aria-label="Lead status"
                className="min-h-[52px] rounded-lg border border-ink-900/15 bg-white px-3 text-base font-bold text-ink-900 disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    <T en={s.en} ur={s.ur} />
                  </option>
                ))}
              </select>
            </label>
            {saving && (
              <span className="text-sm font-bold text-ink-400">
                <T en="Saving…" ur="محفوظ ہو رہا ہے…" />
              </span>
            )}
            {failed && (
              <span className="text-sm font-bold text-clay-700">
                <T en="Couldn't save — try again." ur="محفوظ نہیں ہوا — دوبارہ کوشش کریں۔" />
              </span>
            )}
          </div>
        </div>
        <a
          href={`tel:${lead.phone}`}
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
        >
          <PhoneIcon className="h-5 w-5" />
          <span dir="ltr">{lead.phone}</span>
        </a>
      </div>
    </article>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number, s: string) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminLeads({
        page: p,
        limit: PAGE_SIZE,
        status: s || undefined,
      });
      setLeads(res.leads);
      setTotal(res.total);
      setPage(res.page);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void load(1, status);
  }, [status, load]);

  const applyStatus = useCallback((id: string, s: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: s } : l)));
  }, []);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHead
        title={<T en="Callback leads" ur="کال بیک لیڈز" />}
        sub={
          <T
            en="Every callback request the public form collects, newest first. Tap the number to call back, change a lead's status once you've handled it."
            ur="عوامی فارم سے آنے والی ہر کال بیک درخواست، نئی سے پرانی۔ نمبر پر ٹیپ کر کے کال کریں، نمٹانے کے بعد لیڈ کی حیثیت بدلیں۔"
          />
        }
        action={
          <Link
            href="/callback"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-ink-900/15 px-4 text-base font-bold text-ink-700 hover:bg-ink-900/5"
          >
            <T en="View the public form" ur="عوامی فارم دیکھیں" />
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Lead status filter">
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
      ) : leads.length === 0 ? (
        <EmptyState
          title={<T en="No leads here." ur="یہاں کوئی لیڈ نہیں۔" />}
          sub={
            <T
              en="When someone submits the callback form, their request appears here."
              ur="جب کوئی کال بیک فارم بھرے گا تو اس کی درخواست یہاں نظر آئے گی۔"
            />
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-500">
            <T en={`Showing ${leads.length} of ${total}`} ur={`${total} میں سے ${leads.length} دکھائی جا رہی ہیں`} />
          </p>
          <div className="space-y-3">
            {leads.map((l) => (
              <LeadCard key={l.id} lead={l} onStatusChange={applyStatus} />
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
