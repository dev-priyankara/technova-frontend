"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeLink from "@/components/HomeLink";
import Footer from "@/components/Footer";
import { clearSession, getSession, type Customer } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setCustomer(session);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  if (!customer) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <p className="text-sm text-slate-300">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <HomeLink />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-xl font-extrabold text-white">
              {customer.name.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-300">
                Customer Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome, {customer.name}
              </h1>
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full name
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {customer.name}
              </dd>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {customer.email}
              </dd>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {customer.phone || "—"}
              </dd>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Member since
              </dt>
              <dd className="mt-1 text-sm font-semibold text-white">
                {new Date(customer.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-blue-50"
            >
              Continue Shopping
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-300 hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
