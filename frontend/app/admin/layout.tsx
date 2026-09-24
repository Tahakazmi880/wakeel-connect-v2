import type { Metadata } from "next";
import AdminShell from "./_components/AdminShell";

export const metadata: Metadata = {
  title: "Admin Portal | WakeelConnect",
  description: "WakeelConnect administration — applications, leads, bookings, moderation.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
