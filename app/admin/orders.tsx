"use client";

import React, { useState } from "react";
import { mockAdminOrders, type AdminOrder } from "@/lib/adminData";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = orders.filter((o) =>
    statusFilter === "All" ? true : o.status === statusFilter,
  );

  function handleStatusChange(id: string, newStatus: AdminOrder["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
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
            Manage online customer hardware purchases, update dispatch stages, and assign local courier tracking.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
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
                  : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Orders Table Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Ordered Hardware</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((ord) => (
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

                  <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                    {ord.date}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

