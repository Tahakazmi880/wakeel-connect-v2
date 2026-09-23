"use client";

/**
 * Admin-only API helpers local to the admin portal.
 * Reuses lib/api.ts plumbing (apiUrl, getAccessToken, ApiError) without
 * touching that shared module — it only covers endpoints that lib/api.ts
 * does not yet expose.
 */

import { apiUrl, getAccessToken, ApiError } from "@/lib/api";

export interface AdminLead {
  id: string;
  fullName: string;
  phone: string;
  citySlug: string;
  matter: string;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsPage {
  total: number;
  page: number;
  limit: number;
  leads: AdminLead[];
}

async function authed<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data: { ok: boolean; error?: { code: string; message: string } };
  try {
    data = await res.json();
  } catch {
    throw new ApiError(res.status, "BAD_RESPONSE", `Server returned ${res.status}.`);
  }
  if (!res.ok || !data.ok) {
    throw new ApiError(res.status, data.error?.code ?? "REQUEST_FAILED", data.error?.message ?? "Request failed.");
  }
  return data as unknown as T;
}

/** GET /admin/leads — admin-only, paginated, optional server-side status filter. */
export async function listAdminLeads(params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<LeadsPage> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.status) q.set("status", params.status);
  return authed<LeadsPage>(`/admin/leads?${q.toString()}`);
}

/**
 * PATCH /admin/leads/:id — change a lead's status.
 * Returns the updated lead.
 */
export async function setLeadStatus(leadId: string, status: string): Promise<AdminLead> {
  const res = await authed<{ ok: boolean; lead: AdminLead }>(`/admin/leads/${leadId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.lead;
}

export interface AdminStats {
  pendingApplications: number;
  newLeads: number;
  approvedLawyers: number;
  bookingsToday: number;
  totalBookings: number;
  totalReviews: number;
  totalQuestions: number;
}

/** GET /admin/stats — live dashboard aggregates, admin-only. */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await authed<{ ok: boolean; stats: AdminStats }>("/admin/stats");
  return res.stats;
}

export interface AdminBookingSummary {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  mode: string;
  feePaisa: number;
  createdAt: string;
  lawyer: { id: string; displayName: string; slug: string };
  client: { fullName: string; phone: string };
}

export interface AdminBookingsPage {
  total: number;
  page: number;
  limit: number;
  bookings: AdminBookingSummary[];
}

/** GET /admin/bookings — platform-wide booking list, newest first. */
export async function listAdminBookings(params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<AdminBookingsPage> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.status) q.set("status", params.status);
  return authed<AdminBookingsPage>(`/admin/bookings?${q.toString()}`);
}

export interface AdminBookingDetail extends AdminBookingSummary {
  clientPhone: string;
  clientNote: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  updatedAt: string;
  client: { id: string; fullName: string; phone: string };
  chamber: { id: string; name: string; address: string } | null;
  documents: { id: string; fileName: string; mimeType: string; sizeBytes: number; createdAt: string }[];
  payment: { id: string; amountPaisa: number; status: string; createdAt: string } | null;
}

/** GET /admin/bookings/:id — full booking detail (admin eyes only). */
export async function getAdminBooking(id: string): Promise<AdminBookingDetail> {
  const res = await authed<{ ok: boolean; booking: AdminBookingDetail }>(`/admin/bookings/${id}`);
  return res.booking;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  hidden: boolean;
  createdAt: string;
  lawyer: { id: string; displayName: string; slug: string };
  client: { fullName: string };
}

export interface AdminReviewsPage {
  total: number;
  page: number;
  limit: number;
  reviews: AdminReview[];
}

/** GET /admin/reviews — all reviews, newest first, optional filters. */
export async function listAdminReviews(params: {
  page?: number;
  limit?: number;
  lawyerId?: string;
  hidden?: boolean;
} = {}): Promise<AdminReviewsPage> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.lawyerId) q.set("lawyerId", params.lawyerId);
  if (params.hidden !== undefined) q.set("hidden", String(params.hidden));
  return authed<AdminReviewsPage>(`/admin/reviews?${q.toString()}`);
}

/** PATCH /admin/reviews/:id — hide or unhide a review. */
export async function setReviewHidden(reviewId: string, hidden: boolean): Promise<{ id: string; hidden: boolean }> {
  const res = await authed<{ ok: boolean; review: { id: string; hidden: boolean } }>(
    `/admin/reviews/${reviewId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden }),
    }
  );
  return res.review;
}

export interface AdminQuestion {
  id: string;
  title: string;
  body: string;
  authorName: string;
  isSeed: boolean;
  isLocked: boolean;
  createdAt: string;
  area: { slug: string; nameEn: string; nameUr: string } | null;
  _count: { answers: number };
}

export interface AdminQuestionsPage {
  total: number;
  page: number;
  limit: number;
  questions: AdminQuestion[];
}

/** GET /admin/questions — all forum questions, newest first. */
export async function listAdminQuestions(params: {
  page?: number;
  limit?: number;
  locked?: boolean;
} = {}): Promise<AdminQuestionsPage> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.locked !== undefined) q.set("locked", String(params.locked));
  return authed<AdminQuestionsPage>(`/admin/questions?${q.toString()}`);
}

/** PATCH /admin/questions/:id — lock (close answers) or unlock a question. */
export async function setQuestionLocked(
  questionId: string,
  locked: boolean
): Promise<{ id: string; isLocked: boolean }> {
  const res = await authed<{ ok: boolean; question: { id: string; isLocked: boolean } }>(
    `/admin/questions/${questionId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked }),
    }
  );
  return res.question;
}

export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: unknown;
  createdAt: string;
  actor: { id: string; fullName: string; role: string } | null;
}

export interface AuditPage {
  total: number;
  page: number;
  limit: number;
  entries: AuditEntry[];
}

/** GET /admin/audit-log — audit trail, newest first. */
export async function listAdminAuditLog(params: {
  page?: number;
  limit?: number;
  actorId?: string;
  action?: string;
} = {}): Promise<AuditPage> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.actorId) q.set("actorId", params.actorId);
  if (params.action) q.set("action", params.action);
  return authed<AuditPage>(`/admin/audit-log?${q.toString()}`);
}
