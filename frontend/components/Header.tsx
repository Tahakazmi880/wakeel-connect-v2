"use client";

import { useState } from "react";
import Link from "next/link";
import { LangToggle, T } from "./LanguageContext";
import { BriefcaseIcon, CalendarIcon, CloseIcon, DocIcon, MenuIcon, PhoneIcon, SearchIcon, ShieldIcon, UserIcon } from "./icons";
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

const NAV_LINK =
  "flex min-h-[48px] items-center gap-2 rounded-lg px-4 text-[1.02rem] font-semibold text-ink-700 transition hover:bg-court-50 hover:text-court-800";
const OUTLINE_BTN =
  "hidden min-h-[48px] items-center gap-2 rounded-lg border border-court-700/40 bg-white px-5 text-[1.02rem] font-bold text-court-800 transition hover:border-court-700 hover:bg-court-50 md:inline-flex";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const ready = !loading;
  const links = [
    { href: "/lawyers", en: "Find a Lawyer", ur: "وکیل تلاش کریں", icon: <SearchIcon className="h-5 w-5" /> },
    { href: "/practice-areas", en: "Practice Areas", ur: "قانونی شعبے", icon: <BriefcaseIcon className="h-5 w-5" /> },
    { href: "/cities", en: "Cities", ur: "شہر", icon: <SearchIcon className="h-5 w-5" /> },
    { href: "/guides", en: "Legal Guides", ur: "قانونی رہنمائی", icon: <DocIcon className="h-5 w-5" /> },
    { href: "/questions", en: "Q&A", ur: "سوال جواب", icon: <DocIcon className="h-5 w-5" /> },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={NAV_LINK}>
              {l.icon}
              <T en={l.en} ur={l.ur} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle />
          {ready && user ? (
            <>
              <Link href="/dashboard" className={OUTLINE_BTN}>
                <CalendarIcon className="h-5 w-5" />
                <T en="My bookings" ur="میری بکنگز" />
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden min-h-[48px] items-center gap-2 rounded-lg border border-brass-600/40 bg-white px-5 text-[1.02rem] font-bold text-brass-700 transition hover:bg-brass-50 md:inline-flex"
                >
                  <ShieldIcon className="h-5 w-5" />
                  <T en="Admin" ur="ایڈمن" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => void signOut()}
                title={user.fullName || user.phone}
                className="hidden min-h-[48px] items-center gap-2 rounded-lg px-4 text-[1.02rem] font-semibold text-ink-600 transition hover:bg-ink-900/5 md:inline-flex"
              >
                <UserIcon className="h-5 w-5" />
                <T en="Logout" ur="لاگ آؤٹ" />
              </button>
            </>
          ) : (
            <Link href="/login" className={OUTLINE_BTN}>
              <PhoneIcon className="h-5 w-5" />
              <T en="Login" ur="لاگ اِن" />
            </Link>
          )}
          <Link
            href="/join"
            className="hidden min-h-[48px] items-center gap-2 rounded-lg bg-court-700 px-5 text-[1.02rem] font-bold text-white shadow-card transition hover:bg-court-800 md:inline-flex"
          >
            <BriefcaseIcon className="h-5 w-5" />
            <T en="Join as Lawyer" ur="وکیل بنیں" />
          </Link>
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
        <nav className="border-t border-ink-900/10 bg-paper px-4 py-3 lg:hidden" aria-label="Mobile">
          {[...links, { href: "/join", en: "Join as Lawyer", ur: "وکیل بنیں", icon: <BriefcaseIcon className="h-5 w-5" /> }].map(
            (l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-lg font-semibold text-ink-800 hover:bg-court-50"
              >
                {l.icon}
                <T en={l.en} ur={l.ur} />
              </Link>
            ),
          )}
          {/* Helpline link removed until a real support number is provided — do not ship a fake number. */}
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
