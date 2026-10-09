"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeLink from "@/components/HomeLink";
import { loginCustomer, setSession } from "@/lib/auth";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400/60 focus:bg-white/10";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const customer = loginCustomer(email, password);
      setSession(customer);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
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
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Login to your TECHNOVA Computers account
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
                  htmlFor="email"
                  className="block text-sm font-semibold text-white"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-bold !text-black transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-300 hover:text-blue-200"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
