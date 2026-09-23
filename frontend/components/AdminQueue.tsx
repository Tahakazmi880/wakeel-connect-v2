"use client";

/**
 * AdminQueue — lawyer verification review, now a proper portal component:
 * status tabs (the API already supports all statuses), document downloads,
 * and an inline decision modal instead of window.prompt / window.alert.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "@/components/LanguageContext";
import { CheckIcon, CloseIcon, DocIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { useSession } from "@/lib/session";
import {
  listAdminApplications,
  decideApplication,
  applicationDocumentDownloadUrl,
  getAccessToken,
  ApiError,
  type AdminApplication,
  type ApplicationDoc,
} from "@/lib/api";

const DOC_LABELS: Record<string, { en: string; ur: string }> = {
  CNIC_FRONT: { en: "CNIC front", ur: "شناختی کارڈ سامنے" },
  CNIC_BACK: { en: "CNIC back", ur: "شناختی کارڈ پیچھے" },
  BAR_COUNCIL_CERT: { en: "Bar Council certificate", ur: "بار کونسل سرٹیفکیٹ" },
  DEGREE: { en: "Degree", ur: "ڈگری" },
  PROFILE_PHOTO: { en: "Photo", ur: "تصویر" },
  OTHER: { en: "Other document", ur: "دیگر دستاویز" },
};

const STATUSES = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"] as const;
type StatusFilter = (typeof STATUSES)[number];

const STATUS_STYLE: Record<StatusFilter, string> = {
  PENDING: "bg-brass-100 text-brass-800",
  UNDER_REVIEW: "bg-court-100 text-court-800",
  APPROVED: "bg-moss-100 text-moss-700",
  REJECTED: "bg-clay-100 text-clay-700",
  SUSPENDED: "bg-ink-900/5 text-ink-600",
};

function daysAgo(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

function extFor(mime: string): string {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

/** Inline confirm modal for approve / reject — replaces window.prompt/alert. */
function DecisionModal({
  app,
  toStatus,
  onClose,
  onDecided,
}: {
  app: AdminApplication;
  toStatus: "APPROVED" | "REJECTED";
  onClose: () => void;
  onDecided: () => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const approved = toStatus === "APPROVED";

  useEffect(() => {
    noteRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const confirm = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await decideApplication(app.id, toStatus, note.trim() || undefined);
      onDecided();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Decision failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="decision-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink-950/60" />
      <div className="relative w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="decision-title" className="font-display text-[1.4rem] font-semibold text-ink-950">
            {approved ? <T en="Approve application" ur="درخواست منظور کریں" /> : <T en="Reject application" ur="درخواست مسترد کریں" />}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-900/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-lg text-ink-600">
          {app.displayName}
          <span className="text-ink-400"> · {app.city.nameEn}</span>
        </p>
        <label htmlFor="decision-note" className="mt-4 block text-base font-bold text-ink-700">
          {approved ? (
            <T en="Approval note (optional)" ur="منظوری کا نوٹ (اختیاری)" />
          ) : (
            <T en="Rejection reason (optional)" ur="مسترد کرنے کی وجہ (اختیاری)" />
          )}
        </label>
        <textarea
          id="decision-note"
          ref={noteRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={approved ? "Visible to the team…" : "The applicant may see this…"}
          className="mt-2 w-full rounded-lg border border-ink-900/15 p-3 text-base text-ink-900 placeholder:text-ink-300 focus:border-court-500 focus:outline-none"
        />
        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-clay-50 p-3 text-base font-bold text-clay-700 ring-1 ring-clay-200">
            {error}
          </p>
        )}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-lg border border-ink-900/15 px-6 text-base font-bold text-ink-700 hover:bg-ink-900/5"
          >
            <T en="Cancel" ur="منسوخ" />
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={saving}
            className={`inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg px-6 text-base font-bold text-white disabled:opacity-50 ${
              approved ? "bg-court-700 hover:bg-court-800" : "bg-clay-600 hover:bg-clay-700"
            }`}
          >
            {approved ? <CheckIcon className="h-5 w-5" /> : <CloseIcon className="h-5 w-5" />}
            {saving ? (
              <T en="Saving…" ur="محفوظ ہو رہا ہے…" />
            ) : approved ? (
              <T en="Confirm approval" ur="منظوری کی تصدیق" />
            ) : (
              <T en="Confirm rejection" ur="مسترد کرنے کی تصدیق" />
            )}
          </button>
        </div>
        {!approved && (
          <p className="mt-3 text-sm text-ink-400">
            <T en="Rejecting hides the application; the applicant can be asked to re-apply with complete documents." ur="مسترد کرنے سے درخواست چھپ جاتی ہے؛ درخواست گزار سے مکمل دستاویزات کے ساتھ دوبارہ درخواست لی جا سکتی ہے۔" />
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminQueue({ initialStatus = "PENDING" }: { initialStatus?: string }) {
  const { user, loading } = useSession();
  const [status, setStatus] = useState<StatusFilter>(
    (STATUSES as readonly string[]).includes(initialStatus) ? (initialStatus as StatusFilter) : "PENDING"
  );
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [decidedCount, setDecidedCount] = useState(0);
  const [modal, setModal] = useState<{ app: AdminApplication; toStatus: "APPROVED" | "REJECTED" } | null>(null);

  const load = useCallback(async (s: StatusFilter) => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminApplications(s);
      setApps(res.applications);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") void load(status);
    else if (!loading) setFetching(false);
  }, [loading, user, status, load]);

  const download = async (app: AdminApplication, doc: ApplicationDoc) => {
    setDownloading(doc.id);
    setDownloadError(null);
    try {
      const token = getAccessToken();
      const res = await fetch(applicationDocumentDownloadUrl(app.id, doc.id), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${app.slug}-${doc.type.toLowerCase()}.${extFor(doc.mimeType)}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Download failed. Try again.");
    } finally {
      setDownloading(null);
    }
  };

  // The shell already guards non-admins; this is a second layer for safety
  // (e.g. if this component is ever rendered elsewhere).
  if (!loading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <ShieldIcon className="mx-auto h-12 w-12 text-ink-300" />
        <h1 className="mt-4 font-display text-[1.8rem] font-semibold text-ink-950">
          <T en="Admins only" ur="صرف ایڈمن کے لیے" />
        </h1>
      </div>
    );
  }

  return (
    <div>
      {/* Status tabs — the API supports all of these; previously the UI only showed PENDING */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Application status">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-extrabold transition ${
              status === s
                ? `${STATUS_STYLE[s]} ring-2 ring-ink-900/20`
                : "bg-white text-ink-500 ring-1 ring-ink-900/10 hover:text-ink-900"
            }`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {downloadError && (
        <p role="alert" className="mb-4 rounded-lg bg-clay-50 p-3 text-base font-bold text-clay-700 ring-1 ring-clay-200">
          {downloadError}
        </p>
      )}

      {fetching ? (
        <div aria-hidden className="space-y-3" role="status" aria-label="Loading">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-ink-900/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl bg-clay-50 p-10 text-center ring-1 ring-clay-200">
          <p className="text-xl font-bold text-clay-700">
            <T en="Couldn't load applications." ur="درخواستیں لوڈ نہ ہو سکیں۔" />
          </p>
          <button
            type="button"
            onClick={() => void load(status)}
            className="mt-4 inline-flex min-h-[52px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
          >
            <T en="Try again" ur="دوبارہ کوشش کریں" />
          </button>
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-xl bg-court-50 p-10 text-center ring-1 ring-court-200">
          <p className="text-xl font-bold text-court-800">
            {status === "PENDING" ? (
              <T en="Queue clear — all applications reviewed." ur="قطار خالی — تمام درخواستیں جانچ لی گئیں۔" />
            ) : (
              <T en={`No ${status.toLowerCase().replace(/_/g, " ")} applications.`} ur="کوئی درخواست نہیں۔" />
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((p) => (
            <article key={p.id} className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-court-50 text-court-700 ring-1 ring-court-700/20">
                  <UserIcon className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[1.25rem] font-semibold text-ink-950">{p.displayName}</p>
                  <p className="text-base text-ink-500">
                    {p.city.nameEn}
                    {p.barCouncil ? ` · ${p.barCouncil}` : ""}
                    {p.barCouncilNo ? ` · ${p.barCouncilNo}` : ""} ·{" "}
                    <T en={`${daysAgo(p.createdAt)} days ago`} ur={`${daysAgo(p.createdAt)} دن پہلے`} />
                  </p>
                  <p className="mt-1 text-base font-bold text-ink-700">{p.user.phone}</p>
                  {p.practiceAreas.length > 0 && (
                    <p className="mt-1 text-sm text-ink-500">
                      {p.practiceAreas.map((a) => a.practiceArea.nameEn).join(" · ")}
                    </p>
                  )}
                  {p.bio && <p className="mt-2 line-clamp-2 text-base text-ink-600">{p.bio}</p>}
                  <div className="mt-3">
                    <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink-400">
                      <T en="Documents" ur="دستاویزات" /> ({p.documents.length})
                    </p>
                    {p.documents.length === 0 ? (
                      <p className="text-base font-bold text-clay-600">
                        <T en="No documents uploaded yet." ur="ابھی کوئی دستاویز اپ لوڈ نہیں ہوئی۔" />
                      </p>
                    ) : (
                      <p className="flex flex-wrap gap-2">
                        {p.documents.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            disabled={downloading === d.id}
                            onClick={() => void download(p, d)}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-ink-900/5 px-3 py-1 text-sm font-bold text-ink-700 ring-1 ring-ink-900/10 hover:bg-court-50 hover:text-court-800 disabled:opacity-50"
                          >
                            <DocIcon className="h-4 w-4" />
                            <T en={DOC_LABELS[d.type]?.en ?? d.type} ur={DOC_LABELS[d.type]?.ur ?? d.type} />
                            {downloading === d.id ? "…" : ""}
                          </button>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 sm:flex-col">
                  {["PENDING", "UNDER_REVIEW"].includes(p.verificationStatus) ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setModal({ app: p, toStatus: "APPROVED" })}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
                      >
                        <CheckIcon className="h-5 w-5" /> <T en="Approve" ur="منظور" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ app: p, toStatus: "REJECTED" })}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-clay-400 px-6 text-base font-bold text-clay-700 hover:bg-clay-50"
                      >
                        <CloseIcon className="h-5 w-5" /> <T en="Reject" ur="مسترد" />
                      </button>
                    </>
                  ) : (
                    <span
                      className={`inline-flex items-center self-start rounded-full px-3 py-1 text-sm font-extrabold ${
                        STATUS_STYLE[p.verificationStatus as StatusFilter] ?? "bg-ink-900/5 text-ink-600"
                      }`}
                    >
                      {p.verificationStatus.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-400">
                <ShieldIcon className="h-4 w-4" />
                <T en="Documents stay private — clients never see them." ur="دستاویزات نجی رہتی ہیں — کلائنٹس کبھی نہیں دیکھتے۔" />
              </p>
            </article>
          ))}
        </div>
      )}

      {decidedCount > 0 && (
        <p className="mt-4 text-sm text-ink-400">
          <T en={`Decided this session: ${decidedCount}`} ur={`اس سیشن میں فیصلہ: ${decidedCount}`} />
        </p>
      )}

      {modal && (
        <DecisionModal
          app={modal.app}
          toStatus={modal.toStatus}
          onClose={() => setModal(null)}
          onDecided={() => {
            setModal(null);
            setDecidedCount((c) => c + 1);
            setApps((as) => as.filter((a) => a.id !== modal.app.id));
          }}
        />
      )}
    </div>
  );
}
