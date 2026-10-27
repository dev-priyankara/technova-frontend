"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredSupplierProfile } from "./profile";
import { mockSupplierProfile } from "@/lib/supplierData";

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
  const [vendorName, setVendorName] = useState(mockSupplierProfile.companyName || "Nanotek Distribution");
  const [vendorAvatar, setVendorAvatar] = useState("");
  const [vendorCode, setVendorCode] = useState("VEND-NANO-7701");

  useEffect(() => {
    function loadProfile() {
      const stored = getStoredSupplierProfile();
      if (stored) {
        setVendorName(stored.companyName || "Nanotek Distribution");
        setVendorAvatar(stored.avatarUrl || "");
        setVendorCode(stored.vendorCode || "VEND-NANO-7701");
      }
    }
    loadProfile();

    function handleUpdate(e: any) {
      if (e.detail) {
        setVendorName(e.detail.companyName || "Nanotek Distribution");
        setVendorAvatar(e.detail.avatarUrl || "");
        setVendorCode(e.detail.vendorCode || "VEND-NANO-7701");
      }
    }
    window.addEventListener("supplier_profile_updated", handleUpdate);
    return () => {
      window.removeEventListener("supplier_profile_updated", handleUpdate);
    };
  }, []);

  function getInitials(nameStr: string): string {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameStr.slice(0, 2) || "ND").toUpperCase();
  }

  const navItems: Array<{
    id: SupplierSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: "overview",
      label: "Supplier Overview",
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
      id: "products",
      label: "Supply Catalog",
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
      id: "requests",
      label: "Shop Restock Requests",
      badge: "1 URGENT",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect width="16" height="13" x="4" y="5" rx="2" />
          <path d="m4 9 8 5 8-5" />
        </svg>
      ),
    },
    {
      id: "deliveries",
      label: "Shop Deliveries",
      badge: "2 ACTIVE",
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
      id: "returns",
      label: "Returns & RMA Defects",
      badge: "3 RMA",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Supplier Profile",
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
                Supplier & Distributor
              </span>
            </div>
          </div>
        </div>

     
        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Supplier Navigation">
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
            title="Click to view & edit Distributor Profile"
          >
            {vendorAvatar ? (
              <img
                src={vendorAvatar}
                alt={vendorName}
                className="h-10 w-10 shrink-0 rounded-xl object-cover border border-blue-400/40 shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-600/30">
                {getInitials(vendorName)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                {vendorName}
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold">
                ● Hardware Vendor Rep
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
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white">
                  T
                </div>
                <span className="font-bold text-sm text-white">Supplier Menu</span>
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
              <div className="text-white font-bold">{vendorName}</div>
              <div className="text-emerald-400 text-[10px]">Vendor: {vendorCode} • Verified</div>
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
                      <span
                        className={`rounded-full px-2 py-0.2 text-[9px] font-bold border ${
                          item.badge.includes("URGENT")
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
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
                {vendorAvatar ? (
                  <img
                    src={vendorAvatar}
                    alt={vendorName}
                    className="h-9 w-9 shrink-0 rounded-xl object-cover border border-blue-400/40"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                    {getInitials(vendorName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-white">
                    {vendorName}
                  </span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">
                    View Profile & Settings →
                  </span>
                </div>
              </button>

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
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
