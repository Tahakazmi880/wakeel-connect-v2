"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";

const PARTNERS: { src: string; alt: string }[] = [
  { src: "/partners/amreli-steels.png", alt: "Amreli Steels Limited" },
  { src: "/partners/js-bank.png", alt: "JS Bank Limited" },
  { src: "/partners/bankislami.png", alt: "BankIslami Pakistan Limited" },
  { src: "/partners/halan.png", alt: "Halan Microfinance Bank" },
  { src: "/partners/pakistan-rangers.png", alt: "Pakistan Rangers (Sindh)" },
  { src: "/partners/ptcl.png", alt: "PTCL" },
  { src: "/partners/stevta.png", alt: "STEVTA" },
  { src: "/partners/pathfinder-group.png", alt: "Pathfinder Group" },
  { src: "/partners/wackenhut.png", alt: "Wackenhut Pakistan" },
  { src: "/partners/citadel.png", alt: "CITADEL Security Services" },
  { src: "/partners/devtects.png", alt: "DevTects (Pvt) Ltd" },
  { src: "/partners/asaanpay.png", alt: "AsaanPay" },
  { src: "/partners/sms-technologies.png", alt: "SMS Technologies" },
  { src: "/partners/sms-services.png", alt: "SMS Services" },
  { src: "/partners/ipath.png", alt: "iPath (Pvt) Ltd" },
  { src: "/partners/vrg.png", alt: "Virtual Remittance Gateway" },
];

function LogoRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5" aria-hidden={hidden}>
      {PARTNERS.map((p) => (
        <div
          key={p.src}
          className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl bg-white px-4 shadow-card ring-1 ring-ink-900/5 sm:h-24 sm:w-48"
        >
          <img src={p.src} alt={p.alt} loading="lazy" className="max-h-12 max-w-full object-contain sm:max-h-14" />
        </div>
      ))}
    </div>
  );
}

/**
 * "Trusted by leading institutions" — the founding chamber's real
 * institutional retainers & corporate clients (confirmed 2026-09-23),
 * in a slow marquee. Sits right before the partnership CTA as proof.
 */
export default function PartnersMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-20" aria-label="Institutional clients">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="wc-kicker text-brass-700">
            <T en="Corporate & institutional clients" ur="کارپوریٹ و ادارہ جاتی کلائنٹس" />
          </p>
          <h2 className="mt-2 font-display text-[1.7rem] font-semibold leading-tight text-ink-950 sm:text-[2rem]">
            <T en="Trusted by leading institutions" ur="معروف اداروں کا اعتماد" />
          </h2>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-600">
            <T
              en="Banks, telecom operators, security groups and public institutions across Sindh retain our lawyers."
              ur="سندھ بھر کے بینک، ٹیلی کام آپریٹرز، سیکیورٹی گروپس اور سرکاری ادارے ہمارے وکیلوں کی خدمات حاصل کرتے ہیں۔"
            />
          </p>
        </div>
        <Link
          href="/callback"
          className="group inline-flex shrink-0 items-center gap-2 text-[1.02rem] font-bold text-court-700 underline underline-offset-4 transition hover:text-court-900"
        >
          <T en="Partner with us" ur="ہمارے ساتھ شراکت کریں" />
          <span aria-hidden className="transition group-hover:translate-x-1 rtl:rotate-180">→</span>
        </Link>
      </div>
      <div className="group relative overflow-hidden">
        <div
          className="wc-partners-track flex w-max"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          <LogoRow />
          <LogoRow hidden />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" aria-hidden />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="min-h-[44px] rounded-lg px-3 text-[0.85rem] font-bold uppercase tracking-[0.18em] text-ink-600 transition hover:text-court-800"
        >
          {paused ? <T en="Play" ur="چلائیں" /> : <T en="Pause" ur="روکیں" />}
        </button>
      </div>
    </section>
  );
}
