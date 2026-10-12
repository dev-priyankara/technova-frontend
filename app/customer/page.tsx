"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSession, clearSession, type Customer } from "@/lib/auth";
import { dummyOrders } from "@/lib/customerData";
import CustomerSidebar, { type CustomerTab } from "./Sidebar";
import OverviewSection from "./OverviewSection";
import OrdersSection from "./OrdersSection";
import OrderDetailsSection from "./OrderDetailsSection";
import SettingsSection from "./SettingsSection";

type ViewSection = CustomerTab | "order-detail";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ViewSection>("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    dummyOrders[0]?.id || "ORD-94821",
  );
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setCustomer(session);
    } else {
      setCustomer({
        id: "demo-cust-01",
        name: "Kasun Perera",
        email: "kasun.perera@example.lk",
        phone: "+94 77 123 4567",
        password: "",
        createdAt: "2025-04-12",
      });
    }
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  function handleSelectOrder(orderId: string) {
    setSelectedOrderId(orderId);
    setActiveTab("order-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb & Header Title */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`transition-colors hover:text-white ${
                  activeTab === "overview" ? "text-blue-400 font-bold" : "text-slate-400"
                }`}
              >
                Customer Account
              </button>
              {activeTab === "orders" && (
                <>
                  <span>/</span>
                  <span className="text-slate-200">My Orders</span>
                </>
              )}
              {activeTab === "order-detail" && (
                <>
                  <span>/</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="hover:text-white transition-colors text-slate-400"
                  >
                    Orders
                  </button>
                  <span>/</span>
                  <span className="text-blue-400 font-mono truncate max-w-[120px] sm:max-w-none">
                    {selectedOrderId}
                  </span>
                </>
              )}
              {activeTab === "settings" && (
                <>
                  <span>/</span>
                  <span className="text-slate-200">Account Settings</span>
                </>
              )}
            </div>

            <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
              {activeTab === "overview" && "Customer Dashboard"}
              {activeTab === "orders" && "Order History"}
              {activeTab === "order-detail" && `Order Details • ${selectedOrderId}`}
              {activeTab === "settings" && "Account & Security Settings"}
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-300 transition-colors hover:border-blue-400/50 hover:bg-white/10 hover:text-white active:scale-95"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Dashboard Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {/* Sidebar / Mobile Nav Header */}
          <div className="lg:col-span-1">
            <CustomerSidebar
              activeTab={activeTab === "order-detail" ? "orders" : activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              customer={customer}
              onLogout={handleLogout}
              ordersCount={dummyOrders.length}
            />
          </div>

          {/* Active Section Content */}
          <div className="lg:col-span-3 min-w-0">
            {activeTab === "overview" && (
              <OverviewSection
                customer={customer}
                onNavigateToOrders={() => {
                  setActiveTab("orders");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNavigateToSettings={() => {
                  setActiveTab("settings");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectOrder={handleSelectOrder}
              />
            )}

            {activeTab === "orders" && (
              <OrdersSection onSelectOrder={handleSelectOrder} />
            )}

            {activeTab === "order-detail" && (
              <OrderDetailsSection
                orderId={selectedOrderId}
                onBackToOrders={() => {
                  setActiveTab("orders");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
