"use client";

import React from "react";
import { type Customer } from "@/lib/auth";

export type CustomerTab = "overview" | "orders" | "settings";

interface SidebarProps {
  activeTab: CustomerTab;
  onSelectTab: (tab: CustomerTab) => void;
  customer: Customer | null;
  onLogout: () => void;
  ordersCount: number;
}

export default function CustomerSidebar({
  activeTab,
  onSelectTab,
  customer,
  onLogout,
  ordersCount,
}: SidebarProps) {
  const navItems: {
    id: CustomerTab;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "overview",
      label: "Profile Overview",
      shortLabel: "Overview",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "My Orders",
      shortLabel: "Orders",
      badge: ordersCount,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Account Settings",
      shortLabel: "Settings",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full">
      {/* =========================================
          MOBILE & TABLET VIEW (< lg)
          Compact card + horizontal tabs
          ========================================= */}
      <div className="block lg:hidden rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xl mb-2 sm:mb-4">
        {/* User Mini Profile Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white shadow-md">
              {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold text-white">
                {customer?.name || "Customer Account"}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Verified
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-bold text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all"
          >
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.shortLabel}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================
          DESKTOP VIEW (>= lg)
          Full sticky vertical sidebar
          ========================================= */}
      <div className="hidden lg:block rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-xl shadow-blue-950/40 backdrop-blur-xl">
        {/* User Profile Mini Badge */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg shadow-blue-600/30">
            {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm font-bold text-white">
              {customer?.name || "Customer Account"}
            </span>
            <span className="block truncate text-xs text-slate-400">
              {customer?.email || "customer@technova.lk"}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified Customer
            </span>
          </div>
        </div>

        {/* Navigation Tabs List */}
        <nav aria-label="Customer Navigation" className="mt-5 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-blue-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200 active:scale-95"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout Account</span>
            </button>
          </div>
        </nav>

        {/* Quick Customer Support Help Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            TECHNOVA Helpdesk
          </span>
          <p className="mt-1 text-[11px] text-slate-300">
            Need assistance with a warranty claim or hardware delivery?
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-white">
            <span>📞</span>
            <span>+94 11 234 5678</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
