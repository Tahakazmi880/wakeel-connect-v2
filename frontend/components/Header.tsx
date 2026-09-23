"use client";

import { useState } from "react";
import Link from "next/link";
import { T, useLang } from "./LanguageContext";
import { BriefcaseIcon, CalendarIcon, CloseIcon, MenuIcon, PhoneIcon, SearchIcon, ShieldIcon, UserIcon } from "./icons";
import { useSession, signOut } from "@/lib/session";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="wakeel.connect home">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-court-700 text-white shadow-card">
        <BriefcaseIcon className="h-5 w-5" />
      </span>
      <span className="font-display text-[1.45rem] font-semibold tracking-tight text-ink-950">
        wakeel<span className="text-brass-600">.connect</span>
      </span>
    </Link>
  );
}

// oladoc-style: plain text nav links, no icons on desktop.
const NAV_LINK =
  "flex min-h-[44px] items-center whitespace-nowrap px-3.5 text-[0.98rem] font-semibold text-ink-800 transition hover:text-court-800";
const SOLID_BTN =
  "hidden min-h-[44px] items-center rounded-lg bg-court-700 px-5 text-[0.98rem] font-bold text-white shadow-card transition hover:bg-court-800 md:inline-flex";
const OUTLINE_BTN =
  "hidden min-h-[44px] items-center rounded-lg border border-court-700/40 bg-white px-5 text-[0.98rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 md:inline-flex";

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      aria-label={lang === "en" ? "اردو میں دیکھیں" : "View in English"}
      className="hidden min-h-[44px] items-center rounded-lg px-3 text-[0.98rem] font-bold text-ink-700 transition hover:text-court-800 md:inline-flex"
    >
      {lang === "en" ? "اردو" : "EN"}
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const ready = !loading;
  const links = [
    { href: "/lawyers", en: "Find a Lawyer", ur: "وکیل تلاش کریں" },
    { href: "/practice-areas", en: "Practice Areas", ur: "قانونی شعبے" },
    { href: "/cities", en: "Cities", ur: "شہر" },
    { href: "/guides", en: "Legal Guides", ur: "قانونی رہنمائی" },
    { href: "/questions", en: "Q&A", ur: "سوال جواب" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="hidden items-center lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={NAV_LINK}>
              <T en={l.en} ur={l.ur} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <LangSwitch />
          {ready && user ? (
            <>
              <Link href="/dashboard" className={OUTLINE_BTN}>
                <T en="My bookings" ur="میری بکنگز" />
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden min-h-[44px] items-center rounded-lg px-3 text-[0.98rem] font-bold text-brass-700 transition hover:text-brass-800 md:inline-flex"
                >
                  <T en="Admin" ur="ایڈمن" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => void signOut()}
                title={user.fullName || user.phone}
                className="hidden min-h-[44px] items-center rounded-lg px-3 text-[0.98rem] font-semibold text-ink-600 transition hover:text-ink-900 md:inline-flex"
              >
                <T en="Logout" ur="لاگ آؤٹ" />
              </button>
            </>
          ) : (
            <>
              {/* No helpline pill until a real support number is confirmed — do not ship a fake number. */}
              <Link href="/join" className={SOLID_BTN}>
                <T en="Join as Lawyer" ur="وکیل بنیں" />
              </Link>
              <Link href="/login" className={OUTLINE_BTN}>
                <T en="Login" ur="لاگ اِن" />
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-ink-800 hover:bg-ink-900/5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-ink-900/10 bg-white px-4 py-3 lg:hidden" aria-label="Mobile">
          {[
            ...links.map((l) => ({ ...l, icon: <SearchIcon className="h-5 w-5" /> })),
            { href: "/join", en: "Join as Lawyer", ur: "وکیل بنیں", icon: <BriefcaseIcon className="h-5 w-5" /> },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-ink-800 hover:bg-court-50"
            >
              {l.icon}
              <T en={l.en} ur={l.ur} />
            </Link>
          ))}
          {ready && user ? (
            <>
              <p className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-court-800">
                <UserIcon className="h-5 w-5" />
                {user.fullName || user.phone}
              </p>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-ink-800 hover:bg-court-50"
              >
                <CalendarIcon className="h-5 w-5" />
                <T en="My bookings" ur="میری بکنگز" />
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-brass-700 hover:bg-brass-50"
                >
                  <ShieldIcon className="h-5 w-5" />
                  <T en="Admin" ur="ایڈمن" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => { void signOut(); setOpen(false); }}
                className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 text-lg font-semibold text-ink-800 hover:bg-court-50"
              >
                <PhoneIcon className="h-5 w-5" />
                <T en="Logout" ur="لاگ آؤٹ" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-ink-800 hover:bg-court-50"
            >
              <PhoneIcon className="h-5 w-5" />
              <T en="Login" ur="لاگ اِن" />
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
