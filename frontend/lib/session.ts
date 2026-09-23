"use client";

import { useEffect, useState } from "react";

/**
 * Demo client auth — phone number + OTP is the account.
 * No passwords: the verified phone number IS the identity.
 *
 * Storage is localStorage only until the backend lands.
 * Keys: wc-session, wc-bookings.
 */

const SESSION_KEY = "wc-session";
const BOOKINGS_KEY = "wc-bookings";

export interface Session {
  phone: string; // 10 digits, without +92
  createdAt: number;
}

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface CaseDocMeta {
  name: string;
  size: number; // bytes
  type: string; // MIME type
}

export interface MyBooking {
  id: string;
  lawyerSlug: string;
  mode: "video" | "chamber";
  dateLabel: string;
  dateSub: string;
  time: string;
  feePaisa: number;
  phone: string; // booker's phone — links a guest booking to the session
  docs: CaseDocMeta[]; // document metadata only (files upload on the live backend)
  createdAt: number;
  status: BookingStatus;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — session simply won't persist */
  }
}

export function getSession(): Session | null {
  return read<Session | null>(SESSION_KEY, null);
}

export function setSession(phone: string): Session {
  const s: Session = { phone, createdAt: Date.now() };
  write(SESSION_KEY, s);
  return s;
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** React hook — re-reads on mount and on cross-tab storage changes. */
export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) setSessionState(getSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    session,
    ready,
    login: (phone: string) => setSessionState(setSession(phone)),
    logout: () => {
      clearSession();
      setSessionState(null);
    },
  };
}

export function getMyBookings(): MyBooking[] {
  return read<MyBooking[]>(BOOKINGS_KEY, []);
}

/** Saves a booking; dedupes by id so double-clicks / strict-mode don't duplicate. */
export function saveBooking(b: MyBooking): MyBooking[] {
  const all = getMyBookings();
  const next = all.some((x) => x.id === b.id) ? all : [b, ...all];
  write(BOOKINGS_KEY, next);
  return next;
}

export function updateBookingStatus(id: string, status: BookingStatus): MyBooking[] {
  const next = getMyBookings().map((b) => (b.id === id ? { ...b, status } : b));
  write(BOOKINGS_KEY, next);
  return next;
}
