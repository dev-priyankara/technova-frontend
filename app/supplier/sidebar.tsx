"use client";

import React from "react";
import Link from "next/link";

export type SupplierSection =
  | "overview"
  | "products"
  | "requests"
  | "deliveries"
  | "returns"
  | "profile";

interface SupplierSidebarProps {
  activeSection: SupplierSection;
  onSelectSection: (section: SupplierSection) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function SupplierSidebar({
  activeSection,
  onSelectSection,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SupplierSidebarProps) {
  const navItems: Array<{
    id: SupplierSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: "overview",
      label: "Supplier Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Supply Catalog",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: "requests",
      label: "Shop Restock Requests",
      badge: "1 URGENT",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "deliveries",
      label: "Shop Deliveries",
      badge: "2 EN ROUTE",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
    {
      id: "returns",
      label: "Returns & RMA Defects",
      badge: "3 ACTIVE",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Distributor Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  function handleNavClick(id: SupplierSection) {
    onSelectSection(id);
    setMobileMenuOpen(false);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 text-slate-100">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 font-black text-white shadow-lg shadow-blue-500/30">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
                TECHNOVA
              </span>
              <span className="rounded bg-cyan-500/20 border border-cyan-400/30 px-1 py-0.2 text-[9px] font-extrabold uppercase text-cyan-300">
                Supplier
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Authorized Hardware Distributor
            </p>
          </div>
        </div>

        {/* Distributor Badge */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Vendor ID</span>
            <span className="font-mono font-bold text-cyan-300 text-[11px]">VEND-NANO-7701</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-white truncate">
            Nanotek Distribution (Pvt) Ltd
          </div>
          <div className="mt-0.5 text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Distributor Agreement</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Supply Modules
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
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${
                        active
                          ? "bg-white text-blue-700 border-white"
                          : item.badgeColor || "bg-white/10 text-white border-white/20"
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
      </div>

      {/* Footer / Account Actions */}
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
          <span>Log out</span>
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

