import type { Metadata } from "next";
import VideoRoom from "@/components/VideoRoom";

export const metadata: Metadata = {
  title: "Video Consultation — wakeel.connect",
  description: "Join your video consultation with your lawyer.",
};

export default async function VideoPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <VideoRoom bookingId={bookingId} />;
}
