"use client";

import React, { useState } from "react";
import { mockAdminProducts, type AdminProduct } from "@/lib/adminData";

export default function AdminInventory() {
  const [products, setProducts] = useState<AdminProduct[]>(mockAdminProducts);
  const [filter, setFilter] = useState<string>("All");
  const [toast, setToast] = useState("");

  const filtered = products.filter((p) => {
    if (filter === "Low Stock") return p.status === "Low Stock";
    if (filter === "Out of Stock") return p.status === "Out of Stock";
    if (filter === "In Stock") return p.status === "In Stock";
    return true;
  });

  const totalValuationLKR = products.reduce((acc, p) => acc + p.costPrice * p.stockQty, 0);

  function handleRestock(id: string, amount: number) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = p.stockQty + amount;
          const newStatus =
            newQty <= 0 ? "Out of Stock" : newQty <= p.minStockLevel ? "Low Stock" : "In Stock";
          return { ...p, stockQty: newQty, status: newStatus };
        }
        return p;
      }),
    );
    setToast(`Restocked +${amount} units successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            📦 Stock Tracking & Auditing
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Inventory & Stock Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Monitor real-time shelf quantities, warehouse reserves, and minimum reorder thresholds.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
          <span className="text-[11px] text-slate-400 block font-bold uppercase">
            Total Inventory Value (Cost)
          </span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono">
            Rs. {totalValuationLKR.toLocaleString("en-LK")}
          </span>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "In Stock", "Low Stock", "Out of Stock"].map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                  : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Inventory Table Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Item & SKU</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Min Threshold</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => {
                const stockPercent = Math.min(100, Math.round((p.stockQty / (p.minStockLevel * 3)) * 100));
                return (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">{p.category}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm font-mono w-8">{p.stockQty}</span>
                        <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.stockQty === 0
                                ? "bg-rose-500 w-full"
                                : p.stockQty <= p.minStockLevel
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            }`}
                            style={{ width: `${p.stockQty === 0 ? 100 : stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400">
                      {p.minStockLevel} units
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === "In Stock"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                            : p.status === "Low Stock"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                            : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        ● {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRestock(p.id, 5)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRestock(p.id, 10)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          +10
                        </button>
                      </div>
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

