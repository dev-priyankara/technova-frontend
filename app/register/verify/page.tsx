"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeLink from "@/components/HomeLink";
import {
  clearPendingRegistration,
  getPendingRegistration,
  registerCustomer,
  setPendingRegistration,
  setSession,
  type PendingRegistration,
} from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/emailjs";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-slate-400 focus:border-blue-400/60 focus:bg-white/10";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState<PendingRegistration | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const data = getPendingRegistration();
    if (!data) {
      router.replace("/register");
    } else {
      setPending(data);
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!pending) return;

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    if (code !== pending.verification_code) {
      setError("The verification code you entered is incorrect.");
      return;
    }

    setLoading(true);
    try {
      const customer = await registerCustomer({
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        password: pending.password,
      });
      setSession(customer);
      clearPendingRegistration();
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!pending) return;
    setResending(true);
    setError("");
    try {
      const newCode = Array.from(
        { length: 6 },
        () => String.fromCharCode(48 + Math.floor(Math.random() * 10)),
      ).join("");
      setPending({ ...pending, verification_code: newCode });
      setPendingRegistration({ ...pending, verification_code: newCode });
      await sendVerificationEmail({
        to_email: pending.email,
        name: pending.name,
        verification_code: newCode,
      });
      setCode("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the verification code.",
      );
    } finally {
      setResending(false);
    }
  }

  if (!pending) {
    return null;
  }

  const maskedEmail = pending.email.replace(/^([^@]{1}).*?(@.*)$/, "$1***$2");

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <HomeLink />
      </div>
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-md">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-2xl font-extrabold text-white">
                T
              </div>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                Verify your email
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-white">{maskedEmail}</span>.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-white"
                >
                  Verification code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="______"
                  className={inputClass}
                  autoComplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-bold !text-black transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Verify & register"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-blue-300 hover:text-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending ? "Resending…" : "Resend"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
