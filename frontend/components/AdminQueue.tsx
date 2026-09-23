"use client";

import { useCallback, useEffect, useState } from "react";
import { T } from "@/components/LanguageContext";
import { SectionHead } from "@/components/ui";
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

function daysAgo(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

function extFor(mime: string): string {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export default function AdminQueue() {
  const { user, loading } = useSession();
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [deciding, setDeciding] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [decidedCount, setDecidedCount] = useState(0);

  const load = useCallback(async () => {
    setFetching(true);
    setError(false);
    try {
      const res = await listAdminApplications("PENDING");
      setApps(res.applications);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") void load();
    else if (!loading) setFetching(false);
  }, [loading, user, load]);

  const decide = async (app: AdminApplication, toStatus: "APPROVED" | "REJECTED") => {
    if (deciding) return;
    const note = window.prompt(
      toStatus === "APPROVED" ? "Approval note (optional):" : "Rejection reason (optional):"
    );
    if (note === null) return; // user cancelled the prompt
    setDeciding(app.id);
    try {
      await decideApplication(app.id, toStatus, note.trim() || undefined);
      setApps((as) => as.filter((a) => a.id !== app.id));
      setDecidedCount((c) => c + 1);
    } catch (e) {
      if (e instanceof ApiError) window.alert(e.message);
      else window.alert("Decision failed. Try again.");
    } finally {
      setDeciding(null);
    }
  };

  const download = async (app: AdminApplication, doc: ApplicationDoc) => {
    setDownloading(doc.id);
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
      window.alert("Download failed. Try again.");
    } finally {
      setDownloading(null);
    }
  };

  if (!loading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <ShieldIcon className="mx-auto h-12 w-12 text-ink-300" />
        <h1 className="mt-4 font-display text-[1.8rem] font-semibold text-ink-950">
          <T en="Admins only" ur="صرف ایڈمن کے لیے" />
        </h1>
        <p className="mt-2 text-lg text-ink-600">
          <T en="Log in with an admin account to review verification applications." ur="تصدیقی درخواستیں دیکھنے کے لیے ایڈمن اکاؤنٹ سے لاگ اِن کریں۔" />
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHead
        eyebrowUr="ایڈمن"
        title={<T en="Verification queue" ur="تصدیق کی قطار" />}
        sub={<T en="Review each lawyer's Bar Council enrolment and documents before their profile goes public." ur="پروفائل عوامی ہونے سے پہلے ہر وکیل کی بار کونسل رکنیت اور دستاویزات جانچیں۔" />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { n: String(apps.length), en: "Awaiting review", ur: "جائزے کے منتظر" },
          { n: String(decidedCount), en: "Decided this session", ur: "اس سیشن میں فیصلہ" },
          { n: "2–3 days", en: "Target turnaround", ur: "ہدف مدت" },
        ].map((s) => (
          <div key={s.en} className="rounded-lg border border-ink-900/10 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-[2.1rem] font-semibold text-ink-950">{s.n}</p>
            <p className="text-base font-bold text-ink-600"><T en={s.en} ur={s.ur} /></p>
          </div>
        ))}
      </div>

      {fetching ? (
        <p className="mt-8 rounded-lg bg-white p-10 text-center text-xl font-bold text-ink-500 ring-1 ring-ink-900/10">
          <T en="Loading applications…" ur="درخواستیں لوڈ ہو رہی ہیں…" />
        </p>
      ) : error ? (
        <div className="mt-8 rounded-lg bg-clay-50 p-10 text-center ring-1 ring-clay-200">
          <p className="text-xl font-bold text-clay-700">
            <T en="Couldn't load applications." ur="درخواستیں لوڈ نہ ہو سکیں۔" />
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex min-h-[52px] items-center rounded-lg bg-court-700 px-6 text-base font-bold text-white hover:bg-court-800"
          >
            <T en="Try again" ur="دوبارہ کوشش کریں" />
          </button>
        </div>
      ) : apps.length === 0 ? (
        <p className="mt-8 rounded-lg bg-court-50 p-10 text-center text-xl font-bold text-court-800 ring-1 ring-court-200">
          <T en="Queue clear — all applications reviewed." ur="قطار خالی — تمام درخواستیں جانچ لی گئیں۔" />
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {apps.map((p) => (
            <article key={p.id} className="rounded-lg border border-ink-900/10 bg-white p-5 shadow-sm">
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
                <div className="flex gap-2 sm:flex-col">
                  <button
                    type="button"
                    disabled={deciding === p.id}
                    onClick={() => void decide(p, "APPROVED")}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-court-700 px-6 text-base font-bold text-white shadow-card hover:bg-court-800 disabled:opacity-50"
                  >
                    <CheckIcon className="h-5 w-5" /> <T en="Approve" ur="منظور" />
                  </button>
                  <button
                    type="button"
                    disabled={deciding === p.id}
                    onClick={() => void decide(p, "REJECTED")}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-clay-400 px-6 text-base font-bold text-clay-700 hover:bg-clay-50 disabled:opacity-50"
                  >
                    <CloseIcon className="h-5 w-5" /> <T en="Reject" ur="مسترد" />
                  </button>
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
    </div>
  );
}
