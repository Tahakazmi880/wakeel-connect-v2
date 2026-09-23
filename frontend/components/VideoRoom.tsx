"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { T } from "./LanguageContext";
import { PrimaryBtn, SecondaryBtn } from "./ui";
import { PhotoAvatar } from "./PhotoAvatar";
import { getLawyer, formatPKR } from "@/lib/data";
import { getMyBookings, updateBookingStatus } from "@/lib/session";

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function VideoRoom({ bookingId }: { bookingId: string }) {
  const booking = getMyBookings().find((b) => b.id === bookingId);
  const lawyer = booking ? getLawyer(booking.lawyerSlug) : undefined;

  const [phase, setPhase] = useState<"preview" | "call" | "ended">("preview");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chat, setChat] = useState<{ me: boolean; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [camError, setCamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera preview (local only — no video leaves this device in the demo)
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) setCamError(true);
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Apply mic/cam toggles to the live tracks
  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);
  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  // Call timer
  useEffect(() => {
    if (phase !== "call") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (!booking || !lawyer) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-2xl font-extrabold text-slate-900"><T en="Booking not found" ur="بکنگ نہیں ملی" /></p>
        <p className="mt-2 text-base text-slate-600">
          <T en="This video link doesn't match any booking on this device." ur="یہ ویڈیو لنک اس ڈیوائس کی کسی بکنگ سے میل نہیں کھاتا۔" />
        </p>
        <div className="mt-6"><PrimaryBtn href="/dashboard"><T en="My bookings" ur="میری بکنگز" /></PrimaryBtn></div>
      </div>
    );
  }

  const endCall = () => {
    updateBookingStatus(booking.id, "completed");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPhase("ended");
  };

  const sendChat = () => {
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [...c, { me: true, text }]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-900 ring-1 ring-amber-200">
        <span aria-hidden>🧪</span>
        <T en="Demo video room — live calls with the lawyer connect after the backend launch." ur="ڈیمو ویڈیو روم — بیک اینڈ کے بعد وکیل سے اصل کال جڑے گی۔" />
      </p>

      {phase === "preview" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            <T en="Ready to meet your lawyer?" ur="وکیل سے ملنے کے لیے تیار؟" />
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {lawyer.displayName} · {booking.dateLabel} {booking.dateSub} · {booking.time} · {formatPKR(booking.feePaisa)}
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-900">
            {camError ? (
              <div className="flex h-64 items-center justify-center p-6 text-center">
                <p className="text-base font-bold text-slate-300">
                  <T en="Camera unavailable — you can still join with audio." ur="کیمرہ دستیاب نہیں — آپ آڈیو سے شامل ہو سکتے ہیں۔" />
                </p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="h-64 w-full -scale-x-100 object-cover sm:h-80" aria-label="Camera preview" />
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMicOn((v) => !v)}
              aria-pressed={micOn}
              className={`inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-2 px-5 text-lg font-bold ${micOn ? "border-slate-200 text-slate-700" : "border-red-300 bg-red-50 text-red-700"}`}
            >
              <span aria-hidden>{micOn ? "🎙️" : "🔇"}</span>
              <T en={micOn ? "Mic on" : "Mic off"} ur={micOn ? "مائیک آن" : "مائیک آف"} />
            </button>
            <button
              type="button"
              onClick={() => setCamOn((v) => !v)}
              aria-pressed={camOn}
              className={`inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-2 px-5 text-lg font-bold ${camOn ? "border-slate-200 text-slate-700" : "border-red-300 bg-red-50 text-red-700"}`}
            >
              <span aria-hidden>{camOn ? "📷" : "🚫"}</span>
              <T en={camOn ? "Camera on" : "Camera off"} ur={camOn ? "کیمرہ آن" : "کیمرہ آف"} />
            </button>
          </div>
          <div className="mt-6">
            <PrimaryBtn className="w-full sm:w-auto" onClick={() => setPhase("call")}>
              <T en="Join the call" ur="کال میں شامل ہوں" />
            </PrimaryBtn>
          </div>
        </section>
      )}

      {phase === "call" && (
        <section aria-label="Video call">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-extrabold text-slate-900">
              <T en={`Call with ${lawyer.displayName}`} ur={`${lawyer.displayName} سے کال`} />
            </h1>
            <p className="rounded-full bg-slate-900 px-4 py-1.5 font-mono text-lg font-bold text-white" aria-label="Call duration">{fmtTime(elapsed)}</p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Lawyer side (placeholder until live backend) */}
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl bg-slate-900 p-8 text-center">
              <PhotoAvatar name={lawyer.displayName} photo={lawyer.photo} size="lg" />
              <p className="mt-4 text-xl font-extrabold text-white">{lawyer.displayName}</p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-base font-bold text-slate-200">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
                </span>
                <T en="Waiting for the lawyer to join…" ur="وکیل کے شامل ہونے کا انتظار…" />
              </p>
            </div>
            {/* Your side */}
            <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-slate-800">
              {!camError && camOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full -scale-x-100 object-cover" aria-label="Your camera" />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center">
                  <p className="text-lg font-bold text-slate-300"><T en="Your camera is off" ur="آپ کا کیمرہ بند ہے" /></p>
                </div>
              )}
              <p className="absolute bottom-3 left-3 rounded-full bg-black/60 px-4 py-1.5 text-base font-bold text-white">
                <T en="You" ur="آپ" />
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <button type="button" onClick={() => setMicOn((v) => !v)} aria-pressed={micOn}
              className={`inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl border-2 px-4 text-2xl ${micOn ? "border-slate-200" : "border-red-300 bg-red-50"}`}
              aria-label={micOn ? "Mute microphone" : "Unmute microphone"}>
              <span aria-hidden>{micOn ? "🎙️" : "🔇"}</span>
            </button>
            <button type="button" onClick={() => setCamOn((v) => !v)} aria-pressed={camOn}
              className={`inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl border-2 px-4 text-2xl ${camOn ? "border-slate-200" : "border-red-300 bg-red-50"}`}
              aria-label={camOn ? "Turn camera off" : "Turn camera on"}>
              <span aria-hidden>{camOn ? "📷" : "🚫"}</span>
            </button>
            <button type="button" onClick={() => setChatOpen((v) => !v)} aria-pressed={chatOpen}
              className={`inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-2 px-5 text-lg font-bold ${chatOpen ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-700"}`}>
              <span aria-hidden>💬</span><T en="Chat" ur="چیٹ" />
            </button>
            <button type="button" onClick={endCall}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-red-600 px-8 text-lg font-extrabold text-white hover:bg-red-700">
              <span aria-hidden>📞</span><T en="End call" ur="کال ختم کریں" />
            </button>
          </div>

          {/* Chat panel */}
          {chatOpen && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-extrabold text-slate-900"><T en="Call chat" ur="کال چیٹ" /></p>
              <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-4" aria-live="polite">
                {chat.length === 0 ? (
                  <p className="text-base text-slate-500">
                    <T en="No messages yet. Say salaam! (Demo — messages stay on this device.)" ur="ابھی کوئی پیغام نہیں۔ سلام کہیں! (ڈیمو — پیغامات اسی ڈیوائس پر رہتے ہیں۔)" />
                  </p>
                ) : (
                  chat.map((m, i) => (
                    <p key={i} className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-emerald-700 px-4 py-2 text-base font-semibold text-white">
                      {m.text}
                    </p>
                  ))
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Type a message…"
                  className="min-h-[52px] w-full rounded-2xl border-2 border-slate-200 px-4 text-base font-semibold outline-none focus:border-emerald-600"
                  aria-label="Chat message"
                />
                <button type="button" onClick={sendChat} className="inline-flex min-h-[52px] shrink-0 items-center rounded-2xl bg-emerald-700 px-6 text-lg font-extrabold text-white hover:bg-emerald-800">
                  <T en="Send" ur="بھیجیں" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {phase === "ended" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl" aria-hidden>📞</span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900"><T en="Call ended" ur="کال ختم ہو گئی" /></h1>
          <p className="mt-2 text-lg text-slate-600">
            <T en={`You spoke for ${fmtTime(elapsed)}. Your consultation is marked complete.`} ur={`آپ نے ${fmtTime(elapsed)} بات کی۔ آپ کی مشاورت مکمل نشان زد ہو گئی۔`} />
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryBtn href={`/lawyer/${lawyer.slug}#reviews`}>
              <T en="⭐ Rate your consultation" ur="⭐ مشاورت کی درجہ بندی کریں" />
            </PrimaryBtn>
            <SecondaryBtn href="/dashboard">
              <T en="Back to my bookings" ur="میری بکنگز پر واپس" />
            </SecondaryBtn>
          </div>
        </section>
      )}
    </div>
  );
}
