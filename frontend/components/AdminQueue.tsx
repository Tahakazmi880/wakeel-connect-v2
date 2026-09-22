"use client";

import { useState } from "react";
import { T } from "@/components/LanguageContext";
import { DemoNotice, SectionHead } from "@/components/ui";
import { CheckIcon, CloseIcon, DocIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { PENDING_VERIFICATIONS } from "@/lib/data";

export default function AdminQueue() {
  const [decided, setDecided] = useState<Record<string, "approved" | "rejected">>({});
  const pending = PENDING_VERIFICATIONS.filter((p) => !decided[p.id]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHead
        eyebrowUr="ایڈمن"
        title={<T en="Verification queue" ur="تصدیق کی قطار" />}
        sub={<T en="Review each lawyer's Bar Council enrolment and documents before their profile goes public." ur="پروفائل عوامی ہونے سے پہلے ہر وکیل کی بار کونسل رکنیت اور دستاویزات جانچیں۔" />}
      />
      <div className="mx-auto mb-8 max-w-3xl"><DemoNotice /></div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { n: String(pending.length), en: "Awaiting review", ur: "جائزے کے منتظر" },
          { n: String(Object.keys(decided).length), en: "Decided this session", ur: "اس سیشن میں فیصلہ" },
          { n: "2–3 days", en: "Target turnaround", ur: "ہدف مدت" },
        ].map((s) => (
          <div key={s.en} className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-slate-900">{s.n}</p>
            <p className="text-base font-bold text-slate-600"><T en={s.en} ur={s.ur} /></p>
          </div>
        ))}
      </div>

      {pending.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-emerald-50 p-10 text-center text-xl font-extrabold text-emerald-800 ring-1 ring-emerald-200">
          <T en="Queue clear — all applications reviewed." ur="قطار خالی — تمام درخواستیں جانچ لی گئیں۔" />
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {pending.map((p) => (
            <article key={p.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <UserIcon className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-extrabold text-slate-900">{p.name}</p>
                  <p className="text-base text-slate-500">{p.city} · {p.barCouncil} · <T en={`${p.submittedDaysAgo} days ago`} ur={`${p.submittedDaysAgo} دن پہلے`} /></p>
                  <p className="mt-2 flex flex-wrap gap-2">
                    {["CNIC front", "CNIC back", "Bar certificate", "Photo"].map((d) => (
                      <span key={d} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                        <DocIcon className="h-4 w-4" /> {d}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => setDecided((s) => ({ ...s, [p.id]: "approved" }))}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 text-base font-extrabold text-white shadow hover:bg-emerald-800"
                  >
                    <CheckIcon className="h-5 w-5" /> <T en="Approve" ur="منظور" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecided((s) => ({ ...s, [p.id]: "rejected" }))}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-red-200 px-6 text-base font-extrabold text-red-700 hover:bg-red-50"
                  >
                    <CloseIcon className="h-5 w-5" /> <T en="Reject" ur="مسترد" />
                  </button>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                <ShieldIcon className="h-4 w-4" />
                <T en="Documents stay private — clients never see them." ur="دستاویزات نجی رہتی ہیں — کلائنٹس کبھی نہیں دیکھتے۔" />
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

