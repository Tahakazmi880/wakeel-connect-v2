"use client";

import { useState } from "react";
import { T } from "./LanguageContext";
import { PrimaryBtn } from "./ui";
import { apiUrl, normalizePhone } from "@/lib/api";
import { CITIES, PRACTICE_AREAS } from "@/lib/data";

const INPUT =
  "min-h-[52px] w-full rounded-xl border border-ink-900/15 bg-white px-4 text-[1.05rem] text-ink-950 placeholder:text-ink-400 focus:border-court-600 focus:outline-none focus:ring-2 focus:ring-court-600/25";

export default function CallbackForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [citySlug, setCitySlug] = useState(CITIES[0].slug);
  const [matter, setMatter] = useState(PRACTICE_AREAS[0].slug);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (fullName.trim().length < 3) {
      setError("name");
      return;
    }
    if (!normalizePhone(phone)) {
      setError("phone");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(apiUrl("/leads"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          citySlug,
          matter: PRACTICE_AREAS.find((p) => p.slug === matter)?.nameEn ?? matter,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.code ?? "FAILED");
      setDone(true);
    } catch {
      setError("send");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-court-50 p-8 text-center ring-1 ring-court-100">
        <p className="font-display text-2xl font-semibold text-court-800">
          <T en="Request received." ur="درخواست موصول ہو گئی۔" />
        </p>
        <p className="mt-3 text-[1.05rem] text-ink-700">
          <T
            en="Our team will call you back within 24 hours. Thank you."
            ur="ہماری ٹیم 24 گھنٹوں کے اندر آپ کو کال کرے گی۔ شکریہ۔"
          />
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-2 block text-[1.02rem] font-semibold text-ink-900">
          <T en="Your name *" ur="آپ کا نام *" />
        </label>
        <input
          className={INPUT}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Muhammad Ahmed"
          autoComplete="name"
        />
        {error === "name" && (
          <p className="mt-2 text-[0.95rem] text-red-700">
            <T en="Please enter your full name." ur="براہ کرم اپنا پورا نام لکھیں۔" />
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[1.02rem] font-semibold text-ink-900">
          <T en="Mobile number *" ur="موبائل نمبر *" />
        </label>
        <div className="flex gap-2">
          <span className="flex min-h-[52px] items-center rounded-xl border border-ink-900/15 bg-ink-50 px-4 text-[1.05rem] font-semibold text-ink-700">
            +92
          </span>
          <input
            className={INPUT}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="300 1234567"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
        {error === "phone" && (
          <p className="mt-2 text-[0.95rem] text-red-700">
            <T en="Please enter a valid mobile number, e.g. 300 1234567." ur="براہ کرم درست موبائل نمبر لکھیں، مثلاً 300 1234567۔" />
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[1.02rem] font-semibold text-ink-900">
            <T en="City *" ur="شہر *" />
          </label>
          <select className={INPUT} value={citySlug} onChange={(e) => setCitySlug(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                <T en={c.nameEn} ur={c.nameUr} />
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[1.02rem] font-semibold text-ink-900">
            <T en="Legal matter *" ur="قانونی مسئلہ *" />
          </label>
          <select className={INPUT} value={matter} onChange={(e) => setMatter(e.target.value)}>
            {PRACTICE_AREAS.map((a) => (
              <option key={a.slug} value={a.slug}>
                <T en={a.nameEn} ur={a.nameUr} />
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[1.02rem] font-semibold text-ink-900">
          <T en="Brief details (optional)" ur="مختصر تفصیل (اختیاری)" />
        </label>
        <textarea
          className={`${INPUT} min-h-[104px] py-3`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="…"
        />
      </div>

      {error === "send" && (
        <p className="text-[0.95rem] text-red-700">
          <T en="Something went wrong. Please try again." ur="کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔" />
        </p>
      )}

      <PrimaryBtn type="submit" disabled={sending} className="w-full justify-center">
        {sending ? (
          <T en="Sending…" ur="بھیجا جا رہا ہے…" />
        ) : (
          <T en="Request a callback" ur="کال بیک کی درخواست کریں" />
        )}
      </PrimaryBtn>
      <p className="text-center text-[0.95rem] text-ink-500">
        <T en="Your number stays private — we only use it to call you back." ur="آپ کا نمبر نجی رہے گا — ہم اسے صرف کال بیک کے لیے استعمال کریں گے۔" />
      </p>
    </form>
  );
}
