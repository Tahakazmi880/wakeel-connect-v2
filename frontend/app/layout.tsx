import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "wakeel.connect — Pakistan ke Verified Wakeel",
  description:
    "Find verified lawyers across Pakistan. Book video consultations or chamber visits in 3 easy steps. Family, criminal, property, corporate law and more.",
  metadataBase: new URL("https://wakeel.connect"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
