"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar, { type AdminSection } from "./sidebar";
import AdminOverview from "./overview";
import AdminUsers from "./users";
import AdminProducts from "./products";
import AdminCategories from "./categories";
import AdminInventory from "./inventory";
import AdminSales from "./sales";
import AdminOrders from "./orders";
import AdminSuppliers from "./suppliers";
import AdminCustomers from "./customers";
import AdminReports from "./reports";
import AdminAIMonitoring from "./aiMonitoring";

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    router.push("/login");
  }

  function handleSelectSection(section: AdminSection) {
    setActiveSection(section);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar
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
              TECHNOVA <span className="text-blue-400 font-medium text-xs">Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
            >
              Store
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-[11px] font-black text-white">
              KS
            </div>
          </div>
        </header>

        {/* Dynamic Section Renderer */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeSection === "dashboard" && (
            <AdminOverview onNavigate={(sec) => handleSelectSection(sec)} />
          )}

          {activeSection === "users" && <AdminUsers />}
          {activeSection === "products" && <AdminProducts />}
          {activeSection === "categories" && <AdminCategories />}
          {activeSection === "inventory" && <AdminInventory />}
          {activeSection === "sales" && <AdminSales />}
          {activeSection === "orders" && <AdminOrders />}
          {activeSection === "suppliers" && <AdminSuppliers />}
          {activeSection === "customers" && <AdminCustomers />}
          {activeSection === "reports" && <AdminReports />}
          {activeSection === "ai" && <AdminAIMonitoring />}
        </main>
      </div>
    </div>
  );
}
