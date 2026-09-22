"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { T } from "@/components/LanguageContext";
import { PrimaryBtn, SecondaryBtn, SectionHead } from "@/components/ui";
import { CheckIcon, PhoneIcon, ArrowIcon } from "@/components/icons";
import { getSession, setSession } from "@/lib/session";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace(next);
  }, [router, next]);

  const doLogin = () => {
    if (otp.length !== 4) return;
    setSession(phone);
    router.replace(next);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <SectionHead
        eyebrowUr="لاگ اِن"
        title={<T en="Login with your phone" ur="فون سے لاگ اِن کریں" />}
        sub={<T en="No password to remember — we'll send a code to your mobile." ur="پاس ورڈ یاد رکھنے کی ضرورت نہیں — آپ کے موبائل پر کوڈ آئے گا۔" />}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Login">
        {!otpSent ? (
          <>
            <label className="block">
              <span className="mb-1 block text-base font-extrabold text-slate-700">
                <T en="Mobile number" ur="موبائل نمبر" />
              </span>
              <span className="flex overflow-hidden rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600">
                <span className="flex min-h-[60px] items-center bg-slate-100 px-4 text-lg font-extrabold text-slate-700">+92</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  inputMode="numeric"
                  placeholder="300 1234567"
                  className="min-h-[60px] w-full px-4 text-xl font-bold tracking-wider text-slate-900 outline-none"
                  aria-label="Mobile number"
                  autoFocus
                />
              </span>
            </label>
            <div className="mt-6">
              <PrimaryBtn className="w-full" icon={<PhoneIcon className="h-6 w-6" />} onClick={() => phone.length >= 10 && setOtpSent(true)}>
                <T en="Send login code" ur="لاگ اِن کوڈ بھیجیں" />
              </PrimaryBtn>
              {phone.length > 0 && phone.length < 10 && (
                <p className="mt-2 text-center text-sm font-semibold text-amber-700">
                  <T en="Please enter a full 10-digit number." ur="پورا ۱۰ ہندسوں کا نمبر لکھیں۔" />
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-slate-700">
              <T en={`Code sent to +92 ${phone} (demo — any 4 digits work)`} ur={`+92 ${phone} پر کوڈ بھیجا گیا (ڈیمو — کوئی بھی ۴ ہندسے)`} />
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-base font-extrabold text-slate-700">
                <T en="Enter code" ur="کوڈ لکھیں" />
              </span>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="----"
                className="min-h-[60px] w-full rounded-2xl border-2 border-slate-200 px-4 text-center text-2xl font-extrabold tracking-[0.5em] text-slate-900 outline-none focus:border-emerald-600"
                aria-label="Login code"
                autoFocus
              />
            </label>
            <div className="mt-6">
              <PrimaryBtn className="w-full" icon={<CheckIcon className="h-6 w-6" />} onClick={doLogin}>
                <T en="Login" ur="لاگ اِن" />
              </PrimaryBtn>
            </div>
            <div className="mt-4 text-center">
              <SecondaryBtn icon={<ArrowIcon className="h-5 w-5" />} onClick={() => { setOtpSent(false); setOtp(""); }}>
                <T en="Wrong number? Go back" ur="نمبر غلط؟ واپس جائیں" />
              </SecondaryBtn>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm font-semibold text-slate-500">
          <T
            en="This number becomes your account — your bookings will be linked to it."
            ur="یہی نمبر آپ کا اکاؤنٹ ہے — آپ کی بکنگز اسی سے جڑیں گی۔"
          />
        </p>
      </section>

      <p className="mt-6 text-center">
        <Link href="/" className="text-base font-bold text-emerald-700 hover:underline">
          <T en="← Back to home" ur="← ہوم پر واپس" />
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
