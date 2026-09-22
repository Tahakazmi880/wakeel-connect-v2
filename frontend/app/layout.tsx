import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wakeel.connect — Verified Lawyers in Pakistan",
  description:
    "Find and book verified lawyers across Pakistan. Bar Council verified profiles, transparent fees, online or in-chamber consultations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
