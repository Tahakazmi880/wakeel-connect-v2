/**
 * Compact header search: icon button that expands into a search field.
 * Submits to /lawyers?q=… (the directory already supports the `q` param).
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "./LanguageContext";
import { CloseIcon, SearchIcon } from "./icons";

export default function HeaderSearch() {
  const { lang } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openSearch = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const closeSearch = () => {
    setOpen(false);
    setQ("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/lawyers?q=${encodeURIComponent(query)}` : "/lawyers");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label={lang === "ur" ? "تلاش کریں" : "Search lawyers"}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-ink-700 transition hover:bg-ink-900/5 hover:text-court-800"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex items-center gap-1 rounded-lg border border-ink-900/15 bg-white py-1.5 pl-2.5 pr-1 shadow-sm"
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-ink-400" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSearch();
        }}
        placeholder={lang === "ur" ? "وکیل، شعبہ یا عدالت تلاش کریں…" : "Search lawyers, areas, courts…"}
        aria-label={lang === "ur" ? "تلاش کریں" : "Search"}
        className="w-40 bg-transparent text-[0.95rem] text-ink-900 outline-none placeholder:text-ink-400 xl:w-56"
      />
      <button
        type="button"
        onClick={closeSearch}
        aria-label={lang === "ur" ? "بند کریں" : "Close search"}
        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md text-ink-500 transition hover:bg-ink-900/5 hover:text-ink-800"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
