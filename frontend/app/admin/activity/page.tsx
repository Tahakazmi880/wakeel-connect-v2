"use client";

/**
 * Activity log — who did what, when. Every approval, rejection, document
 * event, lead change and moderation action, newest first, via
 * GET /admin/audit-log.
 */

import { useCallback, useEffect, useState } from "react";
import { T } from "@/components/LanguageContext";
import { ArrowIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import { listAdminAuditLog, type AuditEntry } from "../_components/adminApi";
import { PageHead, LoadingRows, ErrorBox, EmptyState } from "../_components/AdminUi";

const PAGE_SIZE = 20;

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EntryRow({ entry }: { entry: AuditEntry }) {
  return (
    <article className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-court-50 ring-1 ring-court-200">
          <ShieldIcon className="h-5 w-5 text-court-700" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-mono text-base font-bold text-ink-950">{entry.action}</p>
          <p className="mt-1 text-sm text-ink-500">
            {entry.actor ? (
              <>
                {entry.actor.fullName} <span className="font-bold">({entry.actor.role})</span>
              </>
            ) : (
              <T en="System" ur="سسٹم" />
            )}{" "}
            · {entry.entityType}
            {entry.entityId ? <span className="font-mono"> #{entry.entityId.slice(0, 8)}</span> : null} ·{" "}
            {fmtDateTime(entry.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AdminActivityPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number, action: string) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminAuditLog({
        page: p,
        limit: PAGE_SIZE,
        action: action.trim() || undefined,
      });
      setEntries(res.entries);
      setTotal(res.total);
      setPage(res.page);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void load(1, appliedFilter);
  }, [appliedFilter, load]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHead
        title={<T en="Activity log" ur="سرگرمی کا لاگ" />}
        sub={
          <T
            en="Who did what, when — every approval, rejection, document event, lead change and moderation action."
            ur="کس نے کب کیا کیا — ہر منظوری، مسترد، دستاویز، لیڈ کی تبدیلی اور نگرانی کی کارروائی۔"
          />
        }
      />

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedFilter(filter);
        }}
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">
            <T en="Filter by action" ur="کارروائی کے حساب سے فلٹر کریں" />
          </span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="lead.status_changed, review.hidden…"
            className="min-h-[52px] w-full rounded-xl border border-ink-900/15 bg-white py-3 pl-12 pr-4 text-base text-ink-900 placeholder:text-ink-400"
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-[52px] shrink-0 items-center rounded-xl bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
        >
          <T en="Filter" ur="فلٹر کریں" />
        </button>
      </form>

      {fetching ? (
        <LoadingRows rows={5} />
      ) : error ? (
        <ErrorBox onRetry={() => void load(page, appliedFilter)} />
      ) : entries.length === 0 ? (
        <EmptyState
          title={<T en="No activity yet." ur="ابھی کوئی سرگرمی نہیں۔" />}
          sub={
            <T
              en="Admin actions are recorded here as they happen — approvals, rejections, uploads, lead updates and moderation."
              ur="ایڈمن کی کارروائیاں یہاں درج ہوتی ہیں — منظوریاں، مسترد، اپ لوڈز، لیڈ اپ ڈیٹس اور نگرانی۔"
            />
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-500">
            <T en={`Showing ${entries.length} of ${total}`} ur={`${total} میں سے ${entries.length} دکھائی جا رہی ہیں`} />
          </p>
          <div className="space-y-2">
            {entries.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </div>
          {pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => void load(page - 1, appliedFilter)}
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
                onClick={() => void load(page + 1, appliedFilter)}
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
