"use client";

import React from "react";
import { type Customer } from "@/lib/auth";
import { dummyOrders } from "@/lib/customerData";

interface OverviewSectionProps {
  customer: Customer | null;
  onNavigateToOrders: () => void;
  onNavigateToSettings: () => void;
  onSelectOrder: (orderId: string) => void;
}

export default function OverviewSection({
  customer,
  onNavigateToOrders,
  onNavigateToSettings,
  onSelectOrder,
}: OverviewSectionProps) {
  const pendingOrdersCount = dummyOrders.filter(
    (order) => order.status === "Pending" || order.status === "Processing",
  ).length;

  const deliveredOrdersCount = dummyOrders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const totalSpentLKR = dummyOrders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
    return sum + orderTotal;
  }, 0);

  const recentOrders = dummyOrders.slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-[11px] sm:text-xs font-bold text-blue-300">
            <span>👋</span> Customer Portal
          </span>
          <h2 className="mt-2 sm:mt-3 text-xl font-black text-white sm:text-2xl lg:text-3xl">
            Welcome back, {customer?.name || "Customer"}!
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Manage your personal details, monitor active hardware delivery shipments, and review past purchases from TECHNOVA Computers.
          </p>

          <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onNavigateToOrders}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold !text-black shadow-lg transition-transform hover:bg-blue-50 active:scale-95"
            >
              <span>View My Orders ({dummyOrders.length})</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToSettings}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              <span>Edit Account Settings</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"
        />
      </div>

      {/* Quick Snapshot Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 text-sm">
              🚚
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-300 sm:text-3xl">
            {pendingOrdersCount}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
            {pendingOrdersCount > 0
              ? `You have ${pendingOrdersCount} active orders in progress.`
              : "No active pending orders right now."}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivered Orders
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 text-sm">
              ✓
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 sm:text-3xl">
            {deliveredOrdersCount}
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
            Successfully completed hardware shipments.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Spend
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 text-sm">
              💳
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400 sm:text-3xl">
            Rs. {(totalSpentLKR / 1000).toFixed(0)}k+
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
            Total lifetime hardware purchases with us.
          </p>
        </div>
      </div>

      {/* Personal Info & Activity Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Personal Details Summary Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">Personal Information</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Primary contact & delivery information</p>
            </div>
            <button
              type="button"
              onClick={onNavigateToSettings}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              Edit Details →
            </button>
          </div>

          <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3.5 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Full Name:</span>
              <span className="font-bold text-white">{customer?.name || "Kasun Perera"}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-white/5">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-white truncate max-w-[180px] sm:max-w-none">
                {customer?.email || "kasun.perera@example.lk"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-white/5">
              <span className="text-slate-400">Phone:</span>
              <span className="font-semibold text-white">{customer?.phone || "+94 77 123 4567"}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-white/5">
              <span className="text-slate-400">Default City:</span>
              <span className="font-semibold text-white">Colombo 04, Western Province</span>
            </div>
            <div className="flex justify-between py-1 border-t border-white/5">
              <span className="text-slate-400">Member Since:</span>
              <span className="font-semibold text-slate-300">April 2025</span>
            </div>
          </div>
        </div>

        {/* Quick Snapshot Card: Recent Activity & Status */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">Recent Account Activity</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Latest updates on your orders & privileges</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          </div>

          <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
            {/* Notice 1 */}
            <div className="rounded-xl sm:rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 sm:p-3.5 text-xs text-blue-200">
              <div className="flex items-start gap-2.5">
                <span className="text-sm">📦</span>
                <div>
                  <strong className="block text-white font-bold">
                    Order {dummyOrders[0].id} is Pending Verification
                  </strong>
                  <span className="text-[11px] text-slate-300">
                    Your gaming laptop order is currently queued for packaging and local courier dispatch.
                  </span>
                </div>
              </div>
            </div>

            {/* Notice 2: Bulk privilege discount rule */}
            <div className="rounded-xl sm:rounded-2xl border border-purple-400/20 bg-purple-500/10 p-3 sm:p-3.5 text-xs text-purple-200">
              <div className="flex items-start gap-2.5">
                <span className="text-sm">🎁</span>
                <div>
                  <strong className="block text-white font-bold">
                    TECHNOVA Bulk Hardware Privilege Active
                  </strong>
                  <span className="text-[11px] text-slate-300">
                    Orders with subtotal exceeding LKR 400,000 automatically receive an instant 2% discount at checkout.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Snapshot (Responsive: Mobile Cards + Desktop Table) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Recent Orders Snapshot</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Your most recent purchases</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            View All ({dummyOrders.length}) →
          </button>
        </div>

        {/* Mobile View (< md) */}
        <div className="mt-3 space-y-2.5 block md:hidden">
          {recentOrders.map((order) => {
            const total = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
            return (
              <div
                key={order.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">
                    {order.id}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                        : order.status === "Processing"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                        : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{order.date}</span>
                    <span className="font-bold text-white text-xs">
                      Rs. {total.toLocaleString("en-LK")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="inline-flex rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 active:scale-95 transition-all"
                  >
                    View →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (>= md) */}
        <div className="mt-4 hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => {
                const total = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">
                      {order.id}
                    </td>
                    <td className="py-3 text-slate-300">{order.date}</td>
                    <td className="py-3 font-bold text-white">
                      Rs. {total.toLocaleString("en-LK")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                            : order.status === "Processing"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order.id)}
                        className="inline-flex rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
