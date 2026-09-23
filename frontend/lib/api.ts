/**
 * wakeel.connect API client.
 *
 * - Base URL from NEXT_PUBLIC_API_URL (default http://localhost:4000), all
 *   calls go to <base>/api/v1.
 * - Access token lives in module memory only (never localStorage) — it is
 *   short-lived (15 min). The rotating refresh token is an HttpOnly cookie,
 *   so every request uses credentials: "include".
 * - On 401 the client transparently tries POST /auth/refresh once and then
 *   retries the original request. If refresh fails the session is cleared
 *   and listeners are notified (UI should send the user to /login).
 *
 * Server Components (public, SEO pages) should use apiUrl() + plain fetch —
 * they cannot use the browser's HttpOnly cookie, and public endpoints need
 * no auth anyway.
 */

const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");
// Accept NEXT_PUBLIC_API_URL with or without the /api/v1 suffix — never double it.
const API_ROOT = RAW_BASE.replace(/\/api\/v1$/, "");
export const API_BASE = API_ROOT;
export const API_V1 = `${API_ROOT}/api/v1`;

export function apiUrl(path: string): string {
  return `${API_V1}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL for a backend-served file path such as /lawyers/xyz.jpg */
export function fileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiSuccess<T> = { ok: true } & T;
type ApiEnvelope<T> = ApiSuccess<T> | { ok: false; error: { code: string; message: string } };

// ---------------------------------------------------------------------------
// Auth state (in-memory access token)
// ---------------------------------------------------------------------------

export interface SessionUser {
  id: string;
  phone: string;
  fullName: string | null;
  role: "CLIENT" | "LAWYER" | "ADMIN";
}

interface AuthState {
  user: SessionUser | null;
  accessToken: string | null;
}

const authState: AuthState = { user: null, accessToken: null };
const listeners = new Set<() => void>();

function setAuth(user: SessionUser | null, accessToken: string | null) {
  authState.user = user;
  authState.accessToken = accessToken;
  listeners.forEach((cb) => cb());
}

export function onAuthChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSessionUser(): SessionUser | null {
  return authState.user;
}

/** Current in-memory access token (for manual authed fetches such as blob downloads). */
export function getAccessToken(): string | null {
  return authState.accessToken;
}

// ---------------------------------------------------------------------------
// Low-level fetch with one-shot refresh
// ---------------------------------------------------------------------------

async function parseEnvelope<T>(res: Response): Promise<ApiEnvelope<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return { ok: false, error: { code: "BAD_RESPONSE", message: `Server returned ${res.status}.` } };
  }
}

interface FetchOpts {
  method?: string;
  body?: unknown;
  auth?: boolean;
  /** retry after refresh already attempted (internal) */
  _retried?: boolean;
}

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { method = "GET", body, auth = false, _retried = false } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth && authState.accessToken) headers["Authorization"] = `Bearer ${authState.accessToken}`;

  const res = await fetch(apiUrl(path), {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  if (res.status === 401 && auth && !_retried) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, { ...opts, _retried: true });
    setAuth(null, null);
  }

  const env = await parseEnvelope<T>(res);
  if (!env.ok || !res.ok) {
    const err = !env.ok ? env.error : { code: "REQUEST_FAILED", message: `Request failed (${res.status}).` };
    throw new ApiError(res.status, err.code, err.message);
  }
  return env as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/auth/refresh"), { method: "POST", credentials: "include" });
    const env = await parseEnvelope<{ accessToken: string; expiresInSec: number }>(res);
    if (env.ok && res.ok) {
      authState.accessToken = env.accessToken;
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}

/** Public GET — no auth header, still parses the {ok} envelope. */
export async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { credentials: "include" });
  const env = await parseEnvelope<T>(res);
  if (!env.ok || !res.ok) {
    const err = !env.ok ? env.error : { code: "REQUEST_FAILED", message: `Request failed (${res.status}).` };
    throw new ApiError(res.status, err.code, err.message);
  }
  return env as T;
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

/** Normalize PK phone: 0300… → +92300…, strip spaces/dashes. */
export function normalizePhone(raw: string): string {
  let p = raw.replace(/[\s\-()]/g, "");
  if (p.startsWith("0")) p = "+92" + p.slice(1);
  if (!p.startsWith("+")) p = "+" + p;
  return p;
}

export async function requestOtp(phone: string): Promise<{ expiresInSec: number }> {
  const data = await apiFetch<{ expiresInSec: number }>("/auth/otp/request", {
    method: "POST",
    body: { phone: normalizePhone(phone) },
  });
  return { expiresInSec: data.expiresInSec };
}

export async function verifyOtp(phone: string, code: string): Promise<SessionUser> {
  const data = await apiFetch<{
    accessToken: string;
    expiresInSec: number;
    user: SessionUser;
  }>("/auth/otp/verify", {
    method: "POST",
    body: { phone: normalizePhone(phone), code: code.trim() },
  });
  setAuth(data.user, data.accessToken);
  return data.user;
}

/** Restore session on page load: refresh cookie → token → /auth/me. */
export async function restoreSession(): Promise<SessionUser | null> {
  const ok = await tryRefresh();
  if (!ok) {
    setAuth(null, null);
    return null;
  }
  try {
    const data = await apiFetch<{ user: SessionUser }>("/auth/me", { auth: true });
    setAuth(data.user, authState.accessToken);
    return data.user;
  } catch {
    setAuth(null, null);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    /* ignore — clear locally anyway */
  }
  setAuth(null, null);
}

// ---------------------------------------------------------------------------
// Lawyers (public)
// ---------------------------------------------------------------------------

export interface LawyerCity {
  slug: string;
  nameEn: string;
  nameUr: string;
  province: string;
}
export interface PracticeAreaRef {
  slug: string;
  nameEn: string;
  nameUr: string;
}
export interface LawyerSummary {
  id: string;
  slug: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  bioUrdu: string | null;
  gender: string;
  photoUrl: string | null;
  yearsExperience: number;
  consultationFeePaisa: number;
  courts: string[];
  barCouncil: string | null;
  ratingAvg: number;
  ratingCount: number;
  totalConsultations: number;
  city: LawyerCity;
  practiceAreas: { isPrimary: boolean; practiceArea: PracticeAreaRef }[];
  languages: { language: { code: string; nameEn: string; nameUr: string } }[];
  education: { degree: string; institution: string; year: number | null }[];
  chambers: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    isPrimary: boolean;
    city: LawyerCity;
  }[];
}

export interface LawyerListParams {
  city?: string;
  area?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export async function listLawyers(params: LawyerListParams = {}): Promise<{
  total: number;
  page: number;
  limit: number;
  lawyers: LawyerSummary[];
}> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  return publicGet(`/lawyers?${qs.toString()}`);
}

export interface LawyerReview {
  id: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  client: { fullName: string | null };
}

export async function getLawyer(slug: string): Promise<{ lawyer: LawyerSummary & { reviews: LawyerReview[] } }> {
  return publicGet(`/lawyers/${encodeURIComponent(slug)}`);
}

export interface SlotDay {
  date: string;
  label: string;
  slots: { start: string; end: string; taken: boolean }[];
}

export async function getLawyerSlots(slug: string, days = 7): Promise<{ days: SlotDay[] }> {
  return publicGet(`/lawyers/${encodeURIComponent(slug)}/slots?days=${days}`);
}

// ---------------------------------------------------------------------------
// Bookings (auth)
// ---------------------------------------------------------------------------

export type BookingMode = "ONLINE_VIDEO" | "IN_CHAMBER" | "PHONE";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface BookingDoc {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  mode: BookingMode;
  feePaisa: number;
  clientNote: string | null;
  cancelReason: string | null;
  createdAt: string;
  lawyer: { id: string; displayName: string; slug: string };
  client: { fullName: string | null; phone: string };
  documents: BookingDoc[];
}

export async function createBooking(input: {
  lawyerId: string;
  startAt: string;
  mode: BookingMode;
  clientNote?: string;
}): Promise<{ booking: Booking }> {
  return apiFetch("/bookings", { method: "POST", auth: true, body: input });
}

export async function listBookings(): Promise<{ bookings: Booking[] }> {
  return apiFetch("/bookings", { auth: true });
}

export async function cancelBooking(id: string, reason?: string): Promise<{ booking: { id: string; status: BookingStatus; cancelledAt: string } }> {
  return apiFetch(`/bookings/${id}/cancel`, { method: "POST", auth: true, body: { reason } });
}

export async function rescheduleBooking(id: string, startAt: string): Promise<{ booking: Booking }> {
  return apiFetch(`/bookings/${id}/reschedule`, { method: "POST", auth: true, body: { startAt } });
}

export async function uploadBookingDocument(bookingId: string, file: File): Promise<{ document: BookingDoc }> {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch(`/bookings/${bookingId}/documents`, { method: "POST", auth: true, body: fd });
}

export function bookingDocumentUrl(bookingId: string, docId: string): string {
  return apiUrl(`/bookings/${bookingId}/documents/${docId}`);
}

// ---------------------------------------------------------------------------
// Reviews (auth to write, public to read)
// ---------------------------------------------------------------------------

export async function createReview(input: { bookingId: string; rating: number; comment?: string }): Promise<{ review: LawyerReview }> {
  return apiFetch("/reviews", { method: "POST", auth: true, body: input });
}

export async function listReviews(lawyerId: string, page = 1): Promise<{ total: number; page: number; reviews: LawyerReview[] }> {
  return publicGet(`/reviews?lawyerId=${encodeURIComponent(lawyerId)}&page=${page}`);
}

// ---------------------------------------------------------------------------
// Q&A (public to read, auth to write)
// ---------------------------------------------------------------------------

export interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  authorName: string;
  isSeed: boolean;
  createdAt: string;
  area: PracticeAreaRef | null;
  _count: { answers: number };
}

export interface ForumAnswer {
  id: string;
  body: string;
  authorName: string;
  isSeed: boolean;
  createdAt: string;
}

export async function listQuestions(area?: string, page = 1): Promise<{ total: number; page: number; questions: ForumQuestion[] }> {
  const qs = new URLSearchParams({ page: String(page) });
  if (area) qs.set("area", area);
  return publicGet(`/questions?${qs.toString()}`);
}

export async function getQuestion(id: string): Promise<{ question: ForumQuestion & { answers: ForumAnswer[] } }> {
  return publicGet(`/questions/${encodeURIComponent(id)}`);
}

export async function askQuestion(input: { title: string; body: string; areaSlug?: string }): Promise<{ question: ForumQuestion }> {
  return apiFetch("/questions", { method: "POST", auth: true, body: input });
}

export async function answerQuestion(id: string, body: string): Promise<{ answer: ForumAnswer }> {
  return apiFetch(`/questions/${encodeURIComponent(id)}/answers`, { method: "POST", auth: true, body: { body } });
}

// ---------------------------------------------------------------------------
// Lawyer applications (public to submit)
// ---------------------------------------------------------------------------

export interface LawyerApplicationInput {
  fullName: string;
  phone: string;
  citySlug: string;
  yearsExperience: number;
  consultationFeePaisa: number;
  barCouncil?: string;
  barCouncilNo?: string;
  practiceAreaSlugs: string[];
  bio?: string;
}

export async function submitApplication(input: LawyerApplicationInput): Promise<{ application: { id: string; status: string } }> {
  return apiFetch("/applications", {
    method: "POST",
    body: { ...input, phone: normalizePhone(input.phone) },
  });
}

// ---------------------------------------------------------------------------
// Formatting helpers (honest display rules)
// ---------------------------------------------------------------------------

export function formatFee(feePaisa: number): string | null {
  if (!feePaisa || feePaisa <= 0) return null; // → UI shows "Fee on request"
  return `Rs. ${(feePaisa / 100).toLocaleString("en-PK")}`;
}

/** null when experience is not specified — UI must not render "0 years". */
export function formatExperience(years: number): string | null {
  if (!years || years <= 0) return null;
  return `${years} yrs`;
}

// NOTE: the useAuth() React hook lives in ./useAuth.ts ("use client").
// It is intentionally NOT defined here: this module must stay importable
// from React Server Components (public SEO pages use listLawyers etc.),
// and a module-level react hook import breaks server-component compilation.
