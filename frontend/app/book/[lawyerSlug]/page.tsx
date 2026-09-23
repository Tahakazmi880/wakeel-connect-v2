import { Suspense } from "react";
import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Lawyer — wakeel.connect",
  description: "Book a verified lawyer in 3 easy steps: pick a time, enter your phone number, done.",
};

export default async function BookPage({ params }: { params: Promise<{ lawyerSlug: string }> }) {
  const { lawyerSlug } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-center text-lg font-bold text-ink-500">Loading…</div>}>
      <BookingFlow lawyerSlug={lawyerSlug} />
    </Suspense>
  );
}
