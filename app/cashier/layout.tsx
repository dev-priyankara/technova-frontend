"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: "Shift Overview",
      href: "/cashier",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "POS & Billing Counter",
      href: "/cashier/pos",
      badge: "LIVE POS",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Sales & Receipts",
      href: "/cashier/transactions",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: "Price & Stock Check",
      href: "/cashier/products",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      name: "Walk-in Customers",
      href: "/cashier/customers",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Shift & Cash Drawer",
      href: "/cashier/shift",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  function isActive(href: string) {
    if (href === "/cashier") {
      return pathname === "/cashier" || pathname === "/cashier/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/cashier" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-black text-white shadow-lg shadow-blue-500/30">
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition">
                    TECHNOVA
                  </span>
                  <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                    POS Cashier
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Retail Counter & Billing Terminal
                </p>
              </div>
            </Link>
          </div>

          {/* Center / Status Bar */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-300">Terminal:</span>
              <span className="font-mono font-bold text-white">POS-01 (Main Counter)</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 backdrop-blur-md">
              <span className="text-slate-400">Shift #14:</span>
              <span className="font-semibold text-emerald-400">Active</span>
            </div>
          </div>

          {/* Quick Action Button & Cashier Identity */}
          <div className="flex items-center gap-3">
            {pathname !== "/cashier/pos" && (
              <Link
                href="/cashier/pos"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400 transition active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New POS Sale</span>
              </Link>
            )}

            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-xs font-bold text-blue-300">
                NP
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">Nimal Perera</div>
                <div className="text-[10px] text-slate-400 leading-tight">Cashier Staff</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-slate-950/60 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              POS Modules
            </p>
            <nav className="space-y-1 pt-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={active ? "text-white" : "text-slate-300"}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          active
                            ? "bg-white text-blue-700"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* In-Store 2% Discount Rule Callout */}
          <div className="mt-auto rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/60 p-3.5 text-xs">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[11px]">
                %
              </span>
              <span>2% POS Discount Rule</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              Automatic 2% discount is applied strictly when walk-in purchase subtotal is &gt; LKR 400,000.
            </p>
          </div>

          {/* Quick Exit / Switch */}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-1 text-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Public Store</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Slide-Over Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 p-5 flex flex-col space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-white">
                    T
                  </div>
                  <span className="font-extrabold text-white text-base">TECHNOVA POS</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-1.5 flex-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 pt-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Public Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

