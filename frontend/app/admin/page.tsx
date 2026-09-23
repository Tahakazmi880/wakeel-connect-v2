"use client";

/**
 * Admin dashboard — real KPIs from real APIs only.
 * KPI tiles come from GET /admin/stats; the "needs attention" lists reuse
 * the verification queue and leads inbox calls. Nothing is invented.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import {
  listAdminApplications,
  type AdminApplication,
} from "@/lib/api";
import { getAdminStats, listAdminLeads, type AdminLead, type AdminStats } from "./_components/adminApi";
import { PageHead, StatCard, LoadingRows, ErrorBox, StatusBadge } from "./_components/AdminUi";
import { ArrowIcon, CalendarIcon, ChatIcon } from "@/components/icons";

function daysAgo(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

function AttentionRow({
  href,
  title,
  meta,
  status,
}: {
  href: string;
  title: string;
  meta: string;
  status: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 ring-1 ring-ink-900/10 transition hover:ring-court-400"
    >
      <div className="min-w-0">
        <p className="truncate text-base font-bold text-ink-900">{title}</p>
        <p className="truncate text-sm text-ink-500">{meta}</p>
      </div>
      <StatusBadge status={status} />
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [apps, setApps] = useState<AdminApplication[] | null>(null);
  const [leads, setLeads] = useState<{ total: number; recent: AdminLead[] } | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const [statsRes, pendingRes, leadsRes] = await Promise.all([
        getAdminStats(),
        listAdminApplications("PENDING"),
        listAdminLeads({ status: "NEW", limit: 5 }),
      ]);
      setStats(statsRes);
      setApps(pendingRes.applications);
      setLeads({ total: leadsRes.total, recent: leadsRes.leads });
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const loading = stats === null || apps === null || leads === null;

  return (
    <div>
      <PageHead
        title={<T en="Overview" ur="جائزہ" />}
        sub={
          <T
            en="Live numbers from the API — applications, leads, bookings, reviews and Q&A at a glance."
            ur="اے پی آئی سے براہِ راست اعداد — درخواستیں، لیڈز، بکنگز، آراء اور سوال و جواب ایک نظر میں۔"
          />
        }
      />

      {error ? (
        <ErrorBox onRetry={() => void load()} />
      ) : loading ? (
        <LoadingRows rows={4} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/applications">
              <StatCard
                value={String(stats!.pendingApplications)}
                label={<T en="Applications awaiting review" ur="جائزے کے منتظر" />}
                sub={<T en="Lawyer verification queue" ur="وکیل تصدیق کی قطار" />}
                tone="brass"
              />
            </Link>
            <Link href="/admin/leads">
              <StatCard
                value={String(stats!.newLeads)}
                label={<T en="New callback leads" ur="نئی کال بیک لیڈز" />}
                sub={<T en="Waiting for a call back" ur="کال بیک کے منتظر" />}
                tone="court"
              />
            </Link>
            <Link href="/admin/bookings">
              <StatCard
                value={String(stats!.bookingsToday)}
                label={<T en="Bookings today" ur="آج کی بکنگز" />}
                sub={
                  <T
                    en={`${stats!.totalBookings} all time`}
                    ur={`کل ${stats!.totalBookings}`}
                  />
                }
                tone="ink"
              />
            </Link>
            <Link href="/admin/applications?status=APPROVED">
              <StatCard
                value={String(stats!.approvedLawyers)}
                label={<T en="Lawyers approved & listed" ur="منظور شدہ وکلاء" />}
                sub={<T en="Live on the directory" ur="ڈائریکٹری میں لائیو" />}
                tone="court"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section aria-label="Applications needing review">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                  <T en="Needs review" ur="جائزے کی ضرورت" />
                </h2>
                <Link
                  href="/admin/applications"
                  className="inline-flex min-h-[44px] items-center gap-1 text-base font-bold text-court-700 hover:text-court-800"
                >
                  <T en="Open queue" ur="قطار کھولیں" /> <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {apps!.slice(0, 5).map((a) => (
                  <AttentionRow
                    key={a.id}
                    href="/admin/applications"
                    title={a.displayName}
                    meta={`${a.city.nameEn} · ${daysAgo(a.createdAt)}d ago`}
                    status={a.verificationStatus}
                  />
                ))}
                {apps!.length === 0 && (
                  <p className="rounded-lg bg-court-50 p-6 text-center text-base font-bold text-court-800 ring-1 ring-court-200">
                    <T en="Queue clear — all applications reviewed." ur="قطار خالی — تمام درخواستیں جانچ لی گئیں۔" />
                  </p>
                )}
              </div>
            </section>

            <section aria-label="New callback leads">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[1.3rem] font-semibold text-ink-950">
                  <T en="Latest leads" ur="تازہ ترین لیڈز" />
                </h2>
                <Link
                  href="/admin/leads"
                  className="inline-flex min-h-[44px] items-center gap-1 text-base font-bold text-court-700 hover:text-court-800"
                >
                  <T en="Open inbox" ur="ان باکس کھولیں" /> <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {leads!.recent.map((l) => (
                  <AttentionRow
                    key={l.id}
                    href="/admin/leads"
                    title={l.fullName}
                    meta={`${l.matter} · ${daysAgo(l.createdAt)}d ago`}
                    status={l.status}
                  />
                ))}
                {leads!.recent.length === 0 && (
                  <p className="rounded-lg bg-court-50 p-6 text-center text-base font-bold text-court-800 ring-1 ring-court-200">
                    <T en="No new leads." ur="کوئی نئی لیڈ نہیں۔" />
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/bookings"
              className="flex items-center gap-4 rounded-xl border border-ink-900/10 bg-white p-5 transition hover:ring-court-400"
            >
              <CalendarIcon className="h-8 w-8 shrink-0 text-court-700" />
              <div>
                <p className="font-display text-[1.6rem] font-semibold leading-none text-ink-950">
                  {stats!.totalBookings}
                </p>
                <p className="mt-1 text-base font-bold text-ink-900">
                  <T en="Total bookings" ur="کل بکنگز" />
                </p>
                <p className="text-sm text-ink-500">
                  <T en="Open booking management" ur="بکنگ مینجمنٹ کھولیں" />
                </p>
              </div>
            </Link>
            <Link
              href="/admin/moderation"
              className="flex items-center gap-4 rounded-xl border border-ink-900/10 bg-white p-5 transition hover:ring-court-400"
            >
              <ChatIcon className="h-8 w-8 shrink-0 text-court-700" />
              <div>
                <p className="font-display text-[1.6rem] font-semibold leading-none text-ink-950">
                  {stats!.totalReviews}
                </p>
                <p className="mt-1 text-base font-bold text-ink-900">
                  <T en="Client reviews" ur="کلائنٹ کی آراء" />
                </p>
                <p className="text-sm text-ink-500">
                  <T en="Open moderation" ur="نگرانی کھولیں" />
                </p>
              </div>
            </Link>
            <Link
              href="/admin/moderation"
              className="flex items-center gap-4 rounded-xl border border-ink-900/10 bg-white p-5 transition hover:ring-court-400"
            >
              <ChatIcon className="h-8 w-8 shrink-0 text-brass-700" />
              <div>
                <p className="font-display text-[1.6rem] font-semibold leading-none text-ink-950">
                  {stats!.totalQuestions}
                </p>
                <p className="mt-1 text-base font-bold text-ink-900">
                  <T en="Forum questions" ur="فورم کے سوالات" />
                </p>
                <p className="text-sm text-ink-500">
                  <T en="Open moderation" ur="نگرانی کھولیں" />
                </p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
