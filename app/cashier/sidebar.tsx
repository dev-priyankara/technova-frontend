"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCashierProfile } from "./profile";

export type CashierSection =
  | "overview"
  | "pos"
  | "transactions"
  | "products"
  | "customers"
  | "shift"
  | "profile";

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
  const [cashierName, setCashierName] = useState("Nimal Perera");
  const [cashierAvatar, setCashierAvatar] = useState("");
  const [terminalId, setTerminalId] = useState("POS-01");

  useEffect(() => {
    function loadProfile() {
      const stored = getStoredCashierProfile();
      if (stored) {
        setCashierName(stored.name || "Nimal Perera");
        setCashierAvatar(stored.avatarUrl || "");
        setTerminalId(stored.terminalId || "POS-01");
      }
    }
    loadProfile();

    function handleUpdate(e: any) {
      if (e.detail) {
        setCashierName(e.detail.name || "Nimal Perera");
        setCashierAvatar(e.detail.avatarUrl || "");
        setTerminalId(e.detail.terminalId || "POS-01");
      }
    }
    window.addEventListener("cashier_profile_updated", handleUpdate);
    return () => {
      window.removeEventListener("cashier_profile_updated", handleUpdate);
    };
  }, []);

  function getInitials(nameStr: string): string {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameStr.slice(0, 2) || "NP").toUpperCase();
  }

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
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      id: "pos",
      label: "POS & Billing Counter",
      // Removed "LIVE POS" badge as requested
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 8h10" />
          <path d="M7 12h10" />
          <path d="M7 16h6" />
        </svg>
      ),
    },
    {
      id: "transactions",
      label: "Sales & Receipts",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Price & Stock Check",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Walk-in Customers",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "shift",
      label: "Shift & Cash Drawer",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Cashier Profile",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (>= lg) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 border-r border-white/10 bg-slate-900/60 backdrop-blur-2xl shrink-0 h-screen sticky top-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-black text-white shadow-lg shadow-blue-600/30">
              T
            </div>
            <div>
              <span className="block text-base font-black tracking-tight text-white">
                TECHNOVA
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Cashier & POS Terminal
              </span>
            </div>
          </div>
        </div>

 

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Cashier Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-blue-400"}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => onSelectSection("profile")}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all group cursor-pointer ${
              activeSection === "profile"
                ? "bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400"
                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-blue-400/40"
            }`}
            title="Click to view & edit Cashier Profile"
          >
            {cashierAvatar ? (
              <img
                src={cashierAvatar}
                alt={cashierName}
                className="h-10 w-10 shrink-0 rounded-xl object-cover border border-blue-400/40 shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-600/30">
                {getInitials(cashierName)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                {cashierName}
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold">
                ● POS Register Staff
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-white transition-colors text-xs font-bold">
              ⚙️
            </span>
          </button>

          <div className="pt-1 flex flex-col gap-1.5">
         

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 text-[11px] font-bold text-rose-300 hover:bg-rose-500/20 transition-all text-center cursor-pointer"
            >
              <span> Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-4/5 max-w-xs bg-slate-950 border-r border-white/10 p-5 shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white">
                  T
                </div>
                <span className="font-bold text-sm text-white">Cashier POS Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs">
              <div className="text-white font-bold">{cashierName}</div>
              <div className="text-emerald-400 text-[10px]">Terminal: {terminalId} • Shift Active</div>
            </div>

            <nav className="mt-4 space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-white" : "text-blue-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.2 text-[9px] font-bold border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSelectSection("profile");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                  activeSection === "profile"
                    ? "bg-blue-600/20 border-blue-500/60 ring-1 ring-blue-400"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {cashierAvatar ? (
                  <img
                    src={cashierAvatar}
                    alt={cashierName}
                    className="h-9 w-9 shrink-0 rounded-xl object-cover border border-blue-400/40"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                    {getInitials(cashierName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-white">
                    {cashierName}
                  </span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">
                    View Profile & Settings →
                  </span>
                </div>
              </button>

             
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl bg-rose-500/10 border border-rose-500/20 py-2.5 text-xs font-bold text-rose-300 text-center"
              >
                 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
