"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { T } from "./LanguageContext";
import { SearchIcon } from "./icons";
import { CITIES, COURTS, LANGUAGES, PRACTICE_AREAS } from "@/lib/data";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[48px] items-center rounded-full border-2 px-5 text-base font-bold transition ${
        active
          ? "border-emerald-700 bg-emerald-700 text-white shadow"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
      }`}
    >
      {children}
    </button>
  );
}

/** Filter bar — writes to the URL so filtered results are shareable. */
export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v);
    else p.delete(k);
    router.push(`/lawyers?${p.toString()}`, { scroll: false });
  };
  const get = (k: string) => sp.get(k) ?? "";

  const selectCls =
    "min-h-[52px] w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 outline-none focus:border-emerald-600";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="City" ur="شہر" /></span>
          <select value={get("city")} onChange={(e) => set("city", e.target.value)} className={selectCls}>
            <option value=""><T en="All Cities" ur="تمام شہر" /></option>
            {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="Legal Problem" ur="قانونی مسئلہ" /></span>
          <select value={get("area")} onChange={(e) => set("area", e.target.value)} className={selectCls}>
            <option value=""><T en="All Areas" ur="تمام شعبے" /></option>
            {PRACTICE_AREAS.map((a) => <option key={a.slug} value={a.slug}>{a.nameEn}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="Court" ur="عدالت" /></span>
          <select value={get("court")} onChange={(e) => set("court", e.target.value)} className={selectCls}>
            <option value=""><T en="All Courts" ur="تمام عدالتیں" /></option>
            {COURTS.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-600"><T en="Language" ur="زبان" /></span>
          <select value={get("lang")} onChange={(e) => set("lang", e.target.value)} className={selectCls}>
            <option value=""><T en="Any Language" ur="کوئی بھی زبان" /></option>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.nameEn}</option>)}
          </select>
        </label>
      </div>

      {/* Sort chips — oladoc-style quick sort */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-slate-600"><T en="Sort by" ur="ترتیب" /></p>
        <div className="flex flex-wrap gap-2">
          <Chip active={(get("sort") || "recommended") === "recommended"} onClick={() => set("sort", "recommended")}>
            <T en="⭐ Recommended" ur="⭐ تجویز کردہ" />
          </Chip>
          <Chip active={get("sort") === "exp"} onClick={() => set("sort", "exp")}>
            <T en="Most Experienced" ur="سب سے تجربہ کار" />
          </Chip>
          <Chip active={get("sort") === "fee"} onClick={() => set("sort", "fee")}>
            <T en="Lowest Fee" ur="کم ترین فیس" />
          </Chip>
          <Chip active={get("sort") === "rating"} onClick={() => set("sort", "rating")}>
            <T en="Highest Rated" ur="بہترین ریٹنگ" />
          </Chip>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={get("availableToday") === "1"} onClick={() => set("availableToday", get("availableToday") === "1" ? "" : "1")}>
          <T en="🟢 Available Today" ur="🟢 آج دستیاب" />
        </Chip>
        <Chip active={get("maxFee") === "200000"} onClick={() => set("maxFee", get("maxFee") === "200000" ? "" : "200000")}>
          <T en="Fee under Rs. 2,000" ur="فیس ۲۰۰۰ سے کم" />
        </Chip>
        <Chip active={get("minExp") === "10"} onClick={() => set("minExp", get("minExp") === "10" ? "" : "10")}>
          <T en="10+ years experience" ur="۱۰+ سال تجربہ" />
        </Chip>
        <Chip active={get("gender") === "female"} onClick={() => set("gender", get("gender") === "female" ? "" : "female")}>
          <T en="Female lawyer" ur="خاتون وکیل" />
        </Chip>
        <Chip active={get("gender") === "male"} onClick={() => set("gender", get("gender") === "male" ? "" : "male")}>
          <T en="Male lawyer" ur="مرد وکیل" />
        </Chip>
      </div>

      {(get("q") || sp.toString()) && (
        <button
          type="button"
          onClick={() => router.push("/lawyers", { scroll: false })}
          className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-base font-bold text-emerald-800 hover:bg-emerald-50"
        >
          <SearchIcon className="h-5 w-5" />
          <T en="Clear all filters" ur="تمام فلٹر صاف کریں" />
        </button>
      )}
    </div>
  );
}
