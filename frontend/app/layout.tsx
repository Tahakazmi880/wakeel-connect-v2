import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import AuthBootstrap from "@/components/AuthBootstrap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

/** Editorial serif for headings, fees and kickers — authority with warmth. (Self-hosted: no build-time Google Fonts fetch.) */
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/fraunces-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/fraunces-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/fraunces-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

/** Humanist sans for UI and body text. (Self-hosted.) */
const publicSans = localFont({
  src: [
    { path: "./fonts/public-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/public-sans-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/public-sans-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/public-sans-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/public-sans-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-public-sans",
  display: "swap",
});

/** Genuine Nastaliq for Urdu — never an afterthought. (Self-hosted.) */
const nastaliq = localFont({
  src: [
    { path: "./fonts/noto-nastaliq-urdu-arabic-400-normal.woff2", weight: "400" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-500-normal.woff2", weight: "500" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-600-normal.woff2", weight: "600" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WakeelConnect — Pakistan ke Verified Wakeel",
  description:
    "Find verified lawyers across Pakistan. Book online consultations or chamber visits in 3 easy steps. Family, criminal, property, corporate law and more.",
  metadataBase: new URL("https://wakeel.connect"),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable} ${nastaliq.variable}`}>
      <body className="bg-white font-sans text-ink-950 antialiased">
        <LanguageProvider>
          <AuthBootstrap />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
