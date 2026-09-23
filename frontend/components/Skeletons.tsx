/**
 * Loading skeletons — shown while lists/profiles load so the page never
 * flashes empty. Pure CSS shimmer (see .wc-skeleton in globals.css),
 * disabled under prefers-reduced-motion.
 */

function Bar({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`wc-skeleton rounded-md ${className}`} />;
}

/** Matches LawyerCard proportions (photo + text + CTA column). */
export function LawyerCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5 rounded-2xl border border-ink-900/10 bg-white p-5 sm:flex-row sm:gap-6">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Bar className="h-20 w-20 shrink-0 rounded-lg sm:h-40 sm:w-40" />
        <div className="min-w-0 flex-1 space-y-3 pt-1">
          <Bar className="h-6 w-3/5" />
          <Bar className="h-4 w-2/5" />
          <Bar className="h-4 w-1/2" />
          <div className="flex gap-2 pt-1">
            <Bar className="h-8 w-24 rounded-full" />
            <Bar className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col justify-center gap-3 border-t border-ink-900/10 pt-5 sm:w-64 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <Bar className="h-14 w-full rounded-lg" />
        <Bar className="h-14 w-full rounded-lg" />
      </div>
    </div>
  );
}

/** Stack of N card skeletons for directory/search loading states. */
export function LawyerListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-5" aria-label="Loading lawyers">
      {Array.from({ length: rows }).map((_, i) => (
        <LawyerCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Matches the lawyer profile header block. */
export function ProfileSkeleton() {
  return (
    <div aria-hidden className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <Bar className="h-56 w-56 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-4 pt-2">
          <Bar className="h-8 w-2/3" />
          <Bar className="h-5 w-1/2" />
          <Bar className="h-5 w-2/5" />
          <div className="flex gap-2 pt-2">
            <Bar className="h-12 w-40 rounded-lg" />
            <Bar className="h-12 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
