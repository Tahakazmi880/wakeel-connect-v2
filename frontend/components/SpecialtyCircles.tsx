"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PRACTICE_AREAS } from "@/lib/data";
import { PracticeAreaIcon, LegalIssueIcon, LEGAL_ISSUES } from "./PracticeAreaIcons";

/**
 * oladoc-style specialty browse: "Consult best wakeels online" circle row
 * with a View All modal (search + full grid), and a "Search lawyer by
 * legal issue" circle row. All artwork is original wakeel.connect SVG.
 */

function CircleItem({
  href,
  labelEn,
  labelUr,
  children,
}: {
  href: string;
  labelEn: string;
  labelUr: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-24 shrink-0 flex-col items-center gap-2.5 sm:w-28"
    >
      <span className="block h-20 w-20 overflow-hidden rounded-full ring-1 ring-ink-900/10 transition group-hover:ring-2 group-hover:ring-court-400 sm:h-24 sm:w-24">
        {children}
      </span>
      <span className="text-center text-[0.92rem] font-semibold leading-tight text-ink-800 transition group-hover:text-court-800">
        <T en={labelEn} ur={labelUr} />
      </span>
    </Link>
  );
}

function ViewAllModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!open) return;
    setQ("");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return PRACTICE_AREAS;
    return PRACTICE_AREAS.filter(
      (a) => a.nameEn.toLowerCase().includes(needle) || a.nameUr.includes(q.trim()),
    );
  }, [q]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 pt-[8vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Find a wakeel online"
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-lift sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-[1.35rem] font-semibold text-ink-950">
            <T en="Find a wakeel online" ur="آن لائن وکیل تلاش کریں" />
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-[1.2rem] font-bold text-ink-700 transition hover:bg-ink-900/10"
          >
            ×
          </button>
        </div>
        <div className="relative mt-4">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-400" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for specialization"
            className="w-full rounded-xl border border-ink-900/15 bg-white py-3 pl-11 pr-4 text-[1.02rem] text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-court-500 focus:ring-2 focus:ring-court-200"
          />
        </div>
        {results.length === 0 ? (
          <p className="py-10 text-center text-[1.02rem] font-semibold text-ink-500">
            <T en="No specialization matches your search." ur="آپ کی تلاش سے کوئی مہارت نہیں ملی۔" />
          </p>
        ) : (
          <div className="mt-5 grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
            {results.map((a) => (
              <Link
                key={a.slug}
                href={`/lawyers?area=${a.slug}&online=1`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3 text-center transition hover:border-court-400 hover:bg-court-50"
              >
                <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <PracticeAreaIcon slug={a.slug} />
                </span>
                <span className="break-words text-[0.85rem] font-semibold leading-snug text-ink-800 group-hover:text-court-800">
                  <T en={a.nameEn} ur={a.nameUr} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ titleEn, titleUr, onViewAll, viewAllRef }: { titleEn: string; titleUr: string; onViewAll?: () => void; viewAllRef?: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-[1.45rem] font-semibold text-ink-950 sm:text-[1.7rem]">
        <T en={titleEn} ur={titleUr} />
      </h2>
      {onViewAll ? (
        <button
          ref={viewAllRef}
          onClick={onViewAll}
          className="shrink-0 text-[1.02rem] font-bold text-court-700 underline underline-offset-4 transition hover:text-court-900"
        >
          <T en="View All" ur="سب دیکھیں" />
        </button>
      ) : (
        <Link
          href="/practice-areas"
          className="shrink-0 text-[1.02rem] font-bold text-court-700 underline underline-offset-4 transition hover:text-court-900"
        >
          <T en="View All" ur="سب دیکھیں" />
        </Link>
      )}
    </div>
  );
}

export default function SpecialtyCircles() {
  const [modalOpen, setModalOpen] = useState(false);
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const closeModal = () => {
    setModalOpen(false);
    // Return focus to the "View All" trigger when the modal closes.
    requestAnimationFrame(() => viewAllRef.current?.focus());
  };
  return (
    <>
      {/* ============ CONSULT BEST WAKEELS ONLINE ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-20">
        <SectionHead
          titleEn="Consult best wakeels online"
          titleUr="بہترین وکیلوں سے آن لائن مشورہ کریں"
          onViewAll={() => setModalOpen(true)}
          viewAllRef={viewAllRef}
        />
        <div className="wc-rail -mx-4 flex gap-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {PRACTICE_AREAS.map((a) => (
            <CircleItem key={a.slug} href={`/lawyers?area=${a.slug}&online=1`} labelEn={a.nameEn} labelUr={a.nameUr}>
              <PracticeAreaIcon slug={a.slug} />
            </CircleItem>
          ))}
        </div>
      </section>

      {/* ============ SEARCH LAWYER BY LEGAL ISSUE ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:pt-16">
        <SectionHead titleEn="Search lawyer by legal issue" titleUr="قانونی مسئلے سے وکیل تلاش کریں" />
        <div className="wc-rail -mx-4 flex gap-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {LEGAL_ISSUES.map((issue) => (
            <CircleItem
              key={issue.id}
              href={`/lawyers?q=${encodeURIComponent(issue.q)}`}
              labelEn={issue.nameEn}
              labelUr={issue.nameUr}
            >
              <LegalIssueIcon id={issue.id} />
            </CircleItem>
          ))}
        </div>
      </section>

      <ViewAllModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
