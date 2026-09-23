import type { Metadata } from "next";
import VideoRoom from "@/components/VideoRoom";

export const metadata: Metadata = {
  title: "Online Consultation — wakeel.connect",
  description: "Your online consultation details — the lawyer will phone you at the booked time.",
};

export default async function VideoPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <VideoRoom bookingId={bookingId} />;
}
