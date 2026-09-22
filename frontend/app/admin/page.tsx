import type { Metadata } from "next";
import AdminQueue from "@/components/AdminQueue";

export const metadata: Metadata = {
  title: "Admin — Verification Queue | wakeel.connect",
  description: "Review lawyer verification applications.",
};

export default function AdminPage() {
  return <AdminQueue />;
}
