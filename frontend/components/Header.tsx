"use client";

import { useState } from "react";
import Link from "next/link";
import { LangToggle, T } from "./LanguageContext";
import { BriefcaseIcon, CloseIcon, DocIcon, MenuIcon, SearchIcon } from "./icons";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="wakeel.connect home">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow">
        <BriefcaseIcon className="h-6 w-6" />
      </span>
      <span className="text-2xl font-extrabold tracking-tight">
        <span className="text-emerald-800">wakeel</span>
        <span className="text-amber-500">.connect</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/lawyers", en: "Find a Lawyer", ur: "وکیل تلاش کریں", icon: <SearchIcon className="h-5 w-5" /> },
    { href: "/practice-areas", en: "Practice Areas", ur: "قانونی شعبے", icon: <BriefcaseIcon className="h-5 w-5" /> },
    { href: "/cities", en: "Cities", ur: "شہر", icon: <SearchIcon className="h-5 w-5" /> },
    { href: "/guides", en: "Legal Guides", ur: "قانونی رہنمائی", icon: <DocIcon className="h-5 w-5" /> },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-base font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {l.icon}
              <T en={l.en} ur={l.ur} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/join"
            className="hidden min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-700 px-5 text-base font-bold text-white shadow transition hover:bg-emerald-800 md:inline-flex"
          >
            <BriefcaseIcon className="h-5 w-5" />
            <T en="Join as Lawyer" ur="وکیل بنیں" />
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl text-slate-700 hover:bg-emerald-50 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-emerald-100 bg-white px-4 py-3 md:hidden" aria-label="Mobile">
          {[...links, { href: "/join", en: "Join as Lawyer", ur: "وکیل بنیں", icon: <BriefcaseIcon className="h-5 w-5" /> }].map(
            (l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-lg font-bold text-slate-700 hover:bg-emerald-50"
              >
                {l.icon}
                <T en={l.en} ur={l.ur} />
              </Link>
            ),
          )}
          {/* Helpline link removed until a real support number is provided — do not ship a fake number. */}
        </nav>
      )}
    </header>
  );
}
