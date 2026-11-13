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
} from "@/lib/auth";
import { isEmailJsConfigured, sendVerificationEmail } from "@/lib/emailjs";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-slate-400 focus:border-blue-400/60 focus:bg-white/10";
const passwordInputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/60 focus:bg-white/10";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    const pending = getPendingRegistration();
    if (!pending) {
      router.replace("/register");
      return;
    }
    // Only reveal the code locally. Production relies on the real email, and
    // EmailJS being configured should hide the hint too.
    if (process.env.NODE_ENV !== "production" && !isEmailJsConfigured()) {
      setDevCode(pending.verification_code);
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const pending = getPendingRegistration();
    if (!pending) return;

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    if (code !== pending.verification_code) {
      setError("The verification code you entered is incorrect.");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const customer = await registerCustomer({
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        password,
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
    const pending = getPendingRegistration();
    if (!pending) return;
    setResending(true);
    setError("");
    try {
      const newCode = Array.from(
        { length: 6 },
        () => String.fromCharCode(48 + Math.floor(Math.random() * 10)),
      ).join("");
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
                Enter the 6-digit code sent to your email address.
              </p>
            </div>

            {devCode && (
              <div
                role="status"
                className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center text-xs text-blue-200"
              >
                <span className="font-semibold text-blue-300">
                  Local testing only — no email was sent. Code:
                </span>{" "}
                <span className="font-mono text-sm tracking-wider font-bold text-white bg-blue-900/60 px-2 py-0.5 rounded">{devCode}</span>
                <button
                  type="button"
                  onClick={() => setCode(devCode)}
                  className="ml-2 text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
                >
                  Auto-fill
                </button>
              </div>
            )}

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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white"
                >
                  Create password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="8-128 characters"
                  className={passwordInputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-white"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  className={passwordInputClass}
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
              Didn&apos;t receive the code?{" "}
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
