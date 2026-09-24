import type { Metadata } from "next";
import { Fraunces, Public_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import AuthBootstrap from "@/components/AuthBootstrap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

/** Editorial serif for headings, fees and kickers — authority with warmth. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Humanist sans for UI and body text. */
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Genuine Nastaliq for Urdu — never an afterthought. */
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  weight: ["400", "500", "600", "700"],
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
