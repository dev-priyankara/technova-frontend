"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CashierSidebar, { type CashierSection } from "./sidebar";
import CashierOverview from "./overview";
import POSBillingCounter from "./pos";
import CashierTransactionsPage from "./transactions";
import CashierProducts from "./products";
import CashierCustomers from "./customers";
import CashierShiftPage from "./shift";
import CashierProfile, { getStoredCashierProfile } from "./profile";

export default function CashierPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<CashierSection>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cashierName, setCashierName] = useState("Nimal Perera");
  const [cashierAvatar, setCashierAvatar] = useState("");

  useEffect(() => {
    function loadProfile() {
      const stored = getStoredCashierProfile();
      if (stored) {
        setCashierName(stored.name || "Nimal Perera");
        setCashierAvatar(stored.avatarUrl || "");
      }
    }
    loadProfile();

    function handleUpdate(e: any) {
      if (e.detail) {
        setCashierName(e.detail.name || "Nimal Perera");
        setCashierAvatar(e.detail.avatarUrl || "");
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

  function handleLogout() {
    router.push("/login");
  }

  function handleSelectSection(section: CashierSection) {
    setActiveSection(section);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <CashierSidebar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar (< lg) */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:scale-95"
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <span className="font-black text-sm tracking-tight text-white">
              TECHNOVA <span className="text-emerald-400 font-medium text-xs">POS</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
            >
              Store
            </Link>
            <button
              type="button"
              onClick={() => handleSelectSection("profile")}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-[11px] font-black text-white overflow-hidden shadow-md"
              title="Cashier Profile"
            >
              {cashierAvatar ? (
                <img src={cashierAvatar} alt={cashierName} className="h-full w-full object-cover" />
              ) : (
                getInitials(cashierName)
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Flat Section Renderer */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeSection === "overview" && (
            <CashierOverview onNavigate={(sec) => handleSelectSection(sec)} />
          )}

          {activeSection === "pos" && <POSBillingCounter />}
          {activeSection === "transactions" && <CashierTransactionsPage />}
          {activeSection === "products" && (
            <CashierProducts onNavigate={(sec) => handleSelectSection(sec)} />
          )}
          {activeSection === "customers" && (
            <CashierCustomers onNavigate={(sec) => handleSelectSection(sec)} />
          )}
          {activeSection === "shift" && <CashierShiftPage />}
          {activeSection === "profile" && <CashierProfile />}
        </main>
      </div>
    </div>
  );
}
