"use client";

import React from "react";
import Link from "next/link";
import { mockAdminStats } from "@/lib/adminData";

export type AdminSection =
  | "dashboard"
  | "users"
  | "products"
  | "categories"
  | "inventory"
  | "sales"
  | "orders"
  | "suppliers"
  | "customers"
  | "reports"
  | "ai";

interface SidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeSection,
  onSelectSection,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
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
      id: "users",
      label: "User Management",
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
      id: "products",
      label: "Product Catalogue",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      id: "categories",
      label: "Categories",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect width="8" height="8" x="3" y="3" rx="2" />
          <path d="m7 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" />
          <path d="M13 15h4" />
          <path d="M13 18h4" />
        </svg>
      ),
    },
    {
      id: "inventory",
      label: "Inventory & Stock",
      badge: mockAdminStats.lowStockAlertsCount,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      id: "sales",
      label: "Sales & POS Logs",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Customer Orders",
      badge: mockAdminStats.pendingOrdersCount,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect width="16" height="13" x="4" y="5" rx="2" />
          <path d="m4 9 8 5 8-5" />
        </svg>
      ),
    },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Customer Directory",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Business Reports",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
    {
      id: "ai",
      label: "AI Recommendation Monitor",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="m16.24 7.76 2.83-2.83" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (>= lg) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 border-r border-white/10 bg-slate-900/60 backdrop-blur-2xl shrink-0 h-screen sticky top-0 overflow-y-auto">
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
                Admin Management
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
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

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/10 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
              KS
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-white">
                Kasun Silva
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold">
                ● Super Admin (POS & Ops)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all text-center"
            >
              <span>← Store</span>
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 text-[11px] font-bold text-rose-300 hover:bg-rose-500/20 transition-all text-center"
            >
              <span>Logout</span>
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
              <span className="font-bold text-sm text-white">Admin Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
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
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="rounded-full bg-rose-500/20 text-rose-300 px-2 py-0.2 text-[10px] font-bold border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              <Link
                href="/"
                className="block w-full rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-bold text-slate-300 text-center"
              >
                ← Back to Store
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl bg-rose-500/10 border border-rose-500/20 py-2.5 text-xs font-bold text-rose-300 text-center"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
