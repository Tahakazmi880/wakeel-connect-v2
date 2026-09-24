"use client";

import Link from "next/link";
import { T } from "./LanguageContext";
import { PRACTICE_AREAS } from "@/lib/data";
import { PracticeAreaIcon, LegalIssueIcon, LEGAL_ISSUES } from "./PracticeAreaIcons";

/**
 * oladoc-style specialty browse: "Find best wakeels online" 4-column circle
 * grid on mobile with a View All link, and a "Search lawyer by legal issue"
 * circle row. All artwork is original wakeel.connect SVG.
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
      className="group flex w-full flex-col items-center gap-2 sm:w-24 sm:shrink-0"
    >
      <span className="mx-auto block h-16 w-16 overflow-hidden rounded-full ring-1 ring-ink-900/10 transition group-hover:ring-2 group-hover:ring-court-400 min-[420px]:h-20 min-[420px]:w-20 sm:h-24 sm:w-24">
        {children}
      </span>
      <span className="text-center text-[0.78rem] font-semibold leading-tight text-ink-800 transition group-hover:text-court-800 sm:text-[0.92rem]">
        <T en={labelEn} ur={labelUr} />
      </span>
    </Link>
  );
}

function SectionHead({ titleEn, titleUr, href }: { titleEn: string; titleUr: string; href: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-[1.45rem] font-semibold text-ink-950 sm:text-[1.7rem]">
        <T en={titleEn} ur={titleUr} />
      </h2>
      <Link
        href={href}
        className="inline-flex min-h-[44px] shrink-0 items-center text-[1.02rem] font-bold text-court-700 underline underline-offset-4 transition hover:text-court-900"
      >
        <T en="View All" ur="سب دیکھیں" />
      </Link>
    </div>
  );
}

export default function SpecialtyCircles() {
  return (
    <>
      {/* ============ FIND BEST WAKEELS ONLINE ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-20">
        <SectionHead
          titleEn="Find best wakeels online"
          titleUr="بہترین وکیلوں سے آن لائن مشورہ کریں"
          href="/lawyers"
        />
        <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:flex sm:flex-wrap sm:gap-5">
          {PRACTICE_AREAS.map((a) => (
            <CircleItem key={a.slug} href={`/lawyers?area=${a.slug}&online=1`} labelEn={a.nameEn} labelUr={a.nameUr}>
              <PracticeAreaIcon slug={a.slug} />
            </CircleItem>
          ))}
        </div>
      </section>

      {/* ============ SEARCH LAWYER BY LEGAL ISSUE ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:pt-16">
        <SectionHead titleEn="Search lawyer by legal issue" titleUr="قانونی مسئلے سے وکیل تلاش کریں" href="/practice-areas" />
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
    </>
  );
}
