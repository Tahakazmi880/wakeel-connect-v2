import { Suspense } from "react";
import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import { ProfileSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "Book a Lawyer — WakeelConnect",
  description: "Book a verified lawyer in 3 easy steps: pick a time, enter your phone number, done.",
};

export default async function BookPage({ params }: { params: Promise<{ lawyerSlug: string }> }) {
  const { lawyerSlug } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10" aria-label="Loading booking">
          <ProfileSkeleton />
        </div>
      }
    >
      <BookingFlow lawyerSlug={lawyerSlug} />
    </Suspense>
  );
}
