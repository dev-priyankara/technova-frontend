"use client";

import React from "react";
import Link from "next/link";

export type CashierSection =
  | "overview"
  | "pos"
  | "transactions"
  | "products"
  | "customers"
  | "shift";

interface CashierSidebarProps {
  activeSection: CashierSection;
  onSelectSection: (section: CashierSection) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function CashierSidebar({
  activeSection,
  onSelectSection,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}: CashierSidebarProps) {
  const navItems: Array<{
    id: CashierSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: "overview",
      label: "Shift Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "pos",
      label: "POS & Billing Counter",
      badge: "LIVE POS",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "transactions",
      label: "Sales & Receipts",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Price & Stock Check",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Walk-in Customers",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "shift",
      label: "Shift & Cash Drawer",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  function handleNavClick(id: CashierSection) {
    onSelectSection(id);
    setMobileMenuOpen(false);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 text-slate-100">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-black text-white shadow-lg shadow-blue-500/30">
            T
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
                TECHNOVA
              </span>
              <span className="rounded bg-emerald-500/20 border border-emerald-400/30 px-1 py-0.2 text-[9px] font-extrabold uppercase text-emerald-300">
                POS
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Retail Counter & Billing
            </p>
          </div>
        </div>

        {/* Shift / Terminal Widget */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Terminal</span>
            <span className="font-mono font-bold text-white text-[11px]">POS-01</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-white truncate">
            Nimal Perera (Cashier)
          </div>
          <div className="mt-0.5 text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Shift #14 Active</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            POS Navigation
          </p>
          <nav className="space-y-1 pt-1.5">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-left ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-white" : "text-slate-300"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2% Discount Rule Info */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/30 p-3 text-xs">
          <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
            <span>%</span>
            <span>2% POS Rule Applied</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-300 leading-relaxed">
            Auto 2% discount activates when purchase subtotal &gt; LKR 400,000.
          </p>
        </div>
      </div>

      {/* Footer / Exit Actions */}
      <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Storefront</span>
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-red-300 hover:bg-red-500/10 transition font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>End Shift / Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-slate-950/80 sticky top-0 h-screen shrink-0 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

