"use client";

import React from "react";
import {
  mockAdminStats,
  mockAdminProducts,
  mockAdminPOSTransactions,
  mockAdminOrders,
} from "@/lib/adminData";

interface OverviewProps {
  onNavigate: (section: "products" | "users" | "inventory" | "sales" | "orders" | "suppliers") => void;
}

export default function AdminOverview({ onNavigate }: OverviewProps) {
  const lowStockItems = mockAdminProducts.filter(
    (p) => p.status === "Low Stock" || p.status === "Out of Stock",
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-6 backdrop-blur-xl shadow-xl shadow-blue-950/40">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            TECHNOVA Store Operations
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-xl">
            Real-time business analytics, POS sales synchronization, stock thresholds, and multi-role operations monitoring.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold !text-black shadow-lg hover:bg-blue-50 active:scale-95 transition-all"
          >
            <span>+ Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("users")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            <span>+ New Staff User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Today&apos;s POS Sales
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-sm">
              💵
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-white font-mono">
            Rs. {mockAdminStats.todaySalesLKR.toLocaleString("en-LK")}
          </div>
          <span className="mt-1 inline-flex items-center text-[10px] text-emerald-400 font-semibold">
            ↑ Active Cashier Counters
          </span>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Revenue
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-sm">
              📈
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-white font-mono">
            Rs. {(mockAdminStats.monthlySalesLKR / 1000000).toFixed(2)}M
          </div>
          <span className="mt-1 inline-flex items-center text-[10px] text-blue-300 font-semibold">
            Oct 2026 Fiscal Target: 92%
          </span>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
              Stock Alerts
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 text-sm">
              ⚠️
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-rose-400 font-mono">
            {mockAdminStats.lowStockAlertsCount} Items
          </div>
          <span className="mt-1 inline-flex items-center text-[10px] text-rose-300 font-semibold">
            {mockAdminStats.outOfStockCount} Out of Stock
          </span>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Web Orders
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 text-sm">
              📦
            </span>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-amber-300 font-mono">
            {mockAdminStats.pendingOrdersCount} Pending
          </div>
          <span className="mt-1 inline-flex items-center text-[10px] text-slate-400 font-semibold">
            Requires Courier Dispatch
          </span>
        </div>
      </div>

      {/* Critical Low-Stock Warning Section */}
      {lowStockItems.length > 0 && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-sm font-extrabold text-white">
                Critical Low-Stock & Reorder Alerts ({lowStockItems.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("inventory")}
              className="text-xs font-bold text-rose-300 hover:text-white"
            >
              Open Full Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate">
                    {item.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "Out of Stock"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  SKU: {item.sku} • Current Stock:{" "}
                  <strong className="text-white">{item.stockQty}</strong> (Min: {item.minStockLevel})
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("suppliers")}
                  className="block text-center w-full rounded-lg border border-blue-400/30 bg-blue-500/10 py-1.5 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Create Supply Request
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent POS Transactions + Online Customer Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent POS Sales */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Recent POS Billings</h2>
              <p className="text-xs text-slate-400">Counter sales with 2% discount check</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("sales")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              All Sales ({mockAdminPOSTransactions.length}) →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {mockAdminPOSTransactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/5 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {tx.receiptNo}
                    </span>
                    <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.2 text-slate-300">
                      {tx.paymentMethod}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Cashier: {tx.cashierName} • {tx.date} {tx.time}
                  </span>
                  {tx.discount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-400 block">
                      ✨ 2% Discount Applied (-Rs. {tx.discount.toLocaleString("en-LK")})
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-black text-white block">
                    Rs. {tx.finalAmount.toLocaleString("en-LK")}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {tx.itemsCount} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Online Orders */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Online Web Orders</h2>
              <p className="text-xs text-slate-400">Customer web checkout requests</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              All Orders ({mockAdminOrders.length}) →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {mockAdminOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/5 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {ord.id}
                    </span>
                    <span
                      className={`text-[10px] rounded-full px-2 py-0.2 font-bold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                          : ord.status === "Processing"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-0.5 font-medium truncate max-w-[220px]">
                    {ord.customerName} ({ord.customerPhone})
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[220px]">
                    {ord.itemsSummary}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-black text-white block">
                    Rs. {ord.totalAmount.toLocaleString("en-LK")}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {ord.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

