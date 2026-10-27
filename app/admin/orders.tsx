"use client";

import React, { useEffect, useState } from "react";
import {
  type AdminOrder,
  type TimeFilterPeriod,
  mockAdminOrders,
  isDateInPeriod,
} from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilterPeriod>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiFetch<any[]>("/admin/orders")
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminOrder[] = data.map((o) => ({
            id: o.id,
            customerName: o.shipping_address?.recipient_name || "Customer",
            customerPhone: o.shipping_address?.phone || "",
            date: o.date ? o.date.split("T")[0] : (o.created_at ? o.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
            totalAmount: o.total,
            status: o.status,
            paymentStatus: o.payment_status === "Paid" ? "Paid" : "Pending Verification",
            itemsSummary: (o.items || []).map((it: any) => `${it.name} (${it.quantity}x)`).join(", "),
          }));
          setOrders(mapped);
        } else {
          setOrders(mockAdminOrders);
        }
      })
      .catch((err) => {
        console.warn("Failed to load orders from database, using mock data:", err);
        if (isMounted) setOrders(mockAdminOrders);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allOrdersCount = orders.length;
  const todayOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "today")).length;
  const weeklyOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "weekly")).length;
  const monthlyOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "monthly")).length;

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchTime = isDateInPeriod(o.date, timeFilter);
    const matchSearch =
      search.trim() === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(search.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTime && matchSearch;
  });

  const totalFilteredRevenue = filtered.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrdersCount = filtered.filter((o) => o.status === "Pending").length;
  const deliveredOrdersCount = filtered.filter((o) => o.status === "Delivered").length;

  async function handleStatusChange(id: string, newStatus: AdminOrder["status"]) {
    try {
      await apiFetch<any>(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order status.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🚚 Web E-commerce Orders
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Customer Order Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Track hardware purchases, dispatch workflow, customer delivery dates, and real-time revenue.
          </p>
        </div>
      </div>

      {/* KPI Overview for Filtered Orders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtered Orders</div>
          <div className="mt-1.5 text-2xl font-black text-white">{filtered.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In selected timeframe</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            Rs. {totalFilteredRevenue.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sum of orders</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Action</div>
          <div className="mt-1.5 text-2xl font-black text-amber-300">{pendingOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Requires dispatch</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered</div>
          <div className="mt-1.5 text-2xl font-black text-blue-400">{deliveredOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Completed orders</div>
        </div>
      </div>

      {/* Time-based Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <span>🕒</span> Order Date Filter:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Time", key: "all" as TimeFilterPeriod, count: allOrdersCount, icon: "📦" },
            { label: "Today", key: "today" as TimeFilterPeriod, count: todayOrdersCount, icon: "⚡" },
            { label: "This Week", key: "weekly" as TimeFilterPeriod, count: weeklyOrdersCount, icon: "📅" },
            { label: "This Month", key: "monthly" as TimeFilterPeriod, count: monthlyOrdersCount, icon: "🗓️" },
          ].map((tab) => {
            const isActive = timeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTimeFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Processing", "Delivered"].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/10"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No orders found matching the selected timeframe and filters.
            </div>
          ) : (
            filtered.map((ord) => (
              <div key={ord.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">{ord.id}</span>
                  <select
                    value={ord.status}
                    onChange={(e) =>
                      handleStatusChange(ord.id, e.target.value as AdminOrder["status"])
                    }
                    className={`rounded-lg border border-white/10 px-2 py-1 text-[11px] font-bold bg-slate-950 focus:outline-none ${
                      ord.status === "Delivered"
                        ? "text-emerald-400"
                        : ord.status === "Processing"
                        ? "text-blue-400"
                        : "text-amber-300"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="text-xs text-white font-semibold">{ord.customerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                <div className="text-xs text-slate-300 line-clamp-2">{ord.itemsSummary}</div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    📅 {ord.date}
                    {isDateInPeriod(ord.date, "today") && (
                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-black text-white text-sm">
                    Rs. {ord.totalAmount.toLocaleString("en-LK")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Ordered Hardware</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No customer orders found matching the selected timeframe and filter.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                      {ord.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                    </td>

                    <td className="px-6 py-4 max-w-xs text-slate-300">
                      <span className="block truncate">{ord.itemsSummary}</span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300">{ord.date}</span>
                        {isDateInPeriod(ord.date, "today") && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-black text-white text-sm">
                      Rs. {ord.totalAmount.toLocaleString("en-LK")}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        ● {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as AdminOrder["status"])
                        }
                        className={`rounded-xl border border-white/10 px-2.5 py-1 text-xs font-bold bg-slate-950 focus:outline-none ${
                          ord.status === "Delivered"
                            ? "text-emerald-400"
                            : ord.status === "Processing"
                            ? "text-blue-400"
                            : "text-amber-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

