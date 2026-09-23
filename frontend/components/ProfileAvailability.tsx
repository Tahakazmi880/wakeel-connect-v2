"use client";

import { useEffect, useState } from "react";
import { T } from "./LanguageContext";
import { PrimaryBtn } from "./ui";
import { ArrowIcon, CalendarIcon, OfficeIcon, VideoIcon } from "./icons";
import SlotPicker, { type SlotPick } from "./SlotPicker";
import { getLawyerSlots, type SlotDay } from "@/lib/api";

export interface ChamberRef {
  id: string;
  name: string;
  address: string;
  isPrimary: boolean;
}

interface Row {
  key: string;
  mode: "online" | "chamber";
  titleEn: string;
  titleUr: string;
  subEn: string | null;
  subUr: string | null;
  fee: string | null;
}

/**
 * Per-location availability cards for lawyer profiles (oladoc pattern):
 * one collapsible row for Online consultation plus one per chamber, each
 * showing the fee and expanding to the real weekly slot picker with a
 * full-width Book button for that mode.
 *
 * Slots come from the lawyer's real weekly availability endpoint. No fees,
 * timings, or availability are invented — where the fee is unknown the UI
 * shows "Fee on request".
 */
export default function ProfileAvailability({
  lawyerSlug,
  offersOnline,
  onlineFee,
  chamberFee,
  chambers,
}: {
  lawyerSlug: string;
  offersOnline: boolean;
  onlineFee: string | null;
  chamberFee: string | null;
  chambers: ChamberRef[];
}) {
  const rows: Row[] = [
    ...(offersOnline
      ? [
          {
            key: "online",
            mode: "online" as const,
            titleEn: "Online consultation",
            titleUr: "آن لائن مشاورت",
            subEn: "Online consultation from anywhere in Pakistan",
            subUr: "پاکستان میں کہیں سے بھی آن لائن مشاورت",
            fee: onlineFee,
          },
        ]
      : []),
    ...chambers.map((c) => ({
      key: `chamber-${c.id}`,
      mode: "chamber" as const,
      titleEn: c.name,
      titleUr: c.name,
      subEn: c.address,
      subUr: c.address,
      fee: chamberFee,
    })),
  ];

  const [open, setOpen] = useState<string | null>(rows[0]?.key ?? null);
  const [days, setDays] = useState<SlotDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [picks, setPicks] = useState<Record<string, SlotPick | null>>({});

  useEffect(() => {
    let alive = true;
    getLawyerSlots(lawyerSlug, 14)
      .then((r) => {
        if (alive) {
          setDays(r.days);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [lawyerSlug]);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-paper p-5 text-base font-semibold text-ink-500">
        <T en="Timings on request — please book and the lawyer will confirm." ur="اوقات معلوم کریں — بک کریں، وکیل تصدیق کرے گا۔" />
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const isOpen = open === row.key;
        const pick = picks[row.key] ?? null;
        const Icon = row.mode === "online" ? VideoIcon : OfficeIcon;
        const bookHref = pick
          ? `/book/${lawyerSlug}?mode=${row.mode}&date=${pick.date}&start=${pick.start}`
          : undefined;
        return (
          <div
            key={row.key}
            className={`overflow-hidden rounded-lg border transition ${
              isOpen ? "border-court-700/40 shadow-card" : "border-ink-900/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : row.key)}
              aria-expanded={isOpen}
              aria-controls={`avail-${row.key}`}
              className="flex w-full items-center gap-3.5 bg-white px-5 py-4 text-left transition hover:bg-court-50/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-court-50">
                <Icon className="h-6 w-6 text-court-700" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.05rem] font-bold text-ink-950">
                  <T en={row.titleEn} ur={row.titleUr} />
                </span>
                {row.subEn && (
                  <span className="mt-0.5 block truncate text-[0.95rem] font-medium text-ink-500">
                    <T en={row.subEn} ur={row.subUr ?? row.subEn} />
                  </span>
                )}
              </span>
              <span className="wc-fee shrink-0 text-[1.05rem] font-bold text-ink-950">
                {row.fee ?? <T en="Fee on request" ur="فیس معلوم کریں" />}
              </span>
              <ArrowIcon
                className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
            </button>
            {isOpen && (
              <div id={`avail-${row.key}`} className="border-t border-ink-900/10 bg-white px-5 py-5">
                {error ? (
                  <p className="rounded-lg bg-paper p-5 text-base font-semibold text-ink-500">
                    <T
                      en="Could not load availability right now — please try booking directly."
                      ur="دستیابی ابھی لوڈ نہیں ہو سکی — براہِ راست بک کرنے کی کوشش کریں۔"
                    />
                  </p>
                ) : (
                  <>
                    <SlotPicker
                      days={days}
                      loading={loading}
                      onPick={(p) => setPicks((prev) => ({ ...prev, [row.key]: p }))}
                    />
                    <div className="mt-5">
                      <PrimaryBtn
                        href={bookHref}
                        disabled={!pick}
                        icon={<CalendarIcon className="h-6 w-6" />}
                        className="w-full"
                      >
                        {row.mode === "online" ? (
                          <T en="Book Online Consultation" ur="آن لائن مشاورت بک کریں" />
                        ) : (
                          <T en="Book Office Visit" ur="دفتر کی ملاقات بک کریں" />
                        )}
                      </PrimaryBtn>
                      {!pick && !loading && (
                        <p className="mt-2 text-center text-sm font-semibold text-ink-500">
                          <T en="Pick a day and time above to continue" ur="آگے بڑھنے کے لیے اوپر دن اور وقت چنیں" />
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
