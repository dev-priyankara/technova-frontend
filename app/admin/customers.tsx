"use client";

import React, { useState } from "react";
import { mockAdminCustomers, type AdminCustomer } from "@/lib/adminData";

export default function AdminCustomers() {
  const [customers] = useState<AdminCustomer[]>(mockAdminCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            👥 Retail & Web Customers
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Customer Directory
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            View registered customer accounts, lifetime purchasing volumes, and order statistics.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by customer, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Table Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Delivery City</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Lifetime Spend</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>

                  <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">
                    {c.phone}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {c.city}
                  </td>

                  <td className="px-6 py-4 font-bold text-white">
                    {c.ordersCount} orders
                  </td>

                  <td className="px-6 py-4 font-mono font-black text-white text-sm">
                    Rs. {c.totalSpent.toLocaleString("en-LK")}
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-400 text-[11px]">
                    {c.joinedDate}
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

