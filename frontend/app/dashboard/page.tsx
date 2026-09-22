import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "My Bookings — wakeel.connect",
  description: "Your upcoming and past lawyer bookings.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
