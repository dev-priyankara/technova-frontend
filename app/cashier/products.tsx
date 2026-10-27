"use client";

import React, { useState, useMemo } from "react";
import {
  mockPOSProducts,
  mockPOSCategories,
  type POSProduct,
} from "@/lib/cashierData";
import { type CashierSection } from "./sidebar";

interface CashierProductsProps {
  onNavigate?: (section: CashierSection) => void;
}

export default function CashierProducts({ onNavigate }: CashierProductsProps) {
  const [products] = useState<POSProduct[]>(mockPOSProducts);
  const [categories] = useState<string[]>(mockPOSCategories);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((prod) => {
      const matchCat =
        selectedCategory === "All Items" || prod.category === selectedCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.sku.toLowerCase().includes(search.toLowerCase()) ||
        prod.specs.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🔍 Price & Stock Verification Counter
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Product Price & Stock Lookup
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Rapidly verify component prices, physical shop inventory, and warranty terms for walk-in shoppers.
          </p>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate("pos")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>⚡</span>
            <span>Open POS Counter</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search price, GPU model, specs..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No hardware products match the search query.
            </div>
          ) : (
            filtered.map((prod) => {
              const isOutOfStock = prod.stockQty <= 0;
              return (
                <div key={prod.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{prod.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku} • {prod.category}</div>
                    </div>
                    {isOutOfStock ? (
                      <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-300 shrink-0">
                        Out of Stock
                      </span>
                    ) : prod.stockQty <= 4 ? (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 shrink-0">
                        Low: {prod.stockQty} left
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shrink-0">
                        {prod.stockQty} in stock
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 line-clamp-1">{prod.specs}</div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div>
                      <span className="font-mono font-black text-white text-sm">
                        Rs. {prod.price.toLocaleString("en-LK")}
                      </span>
                      {prod.price > 400000 && (
                        <span className="text-[9px] text-emerald-400 font-bold block">
                          Eligible for 2% discount
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate?.("pos")}
                      className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    >
                      Bill at POS →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Product & Specifications</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">SKU / Code</th>
                <th className="py-4 px-6 text-center">In-Store Stock</th>
                <th className="py-4 px-6 text-right">Selling Price</th>
                <th className="py-4 px-6">Warranty</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No hardware products match the search query.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const isOutOfStock = prod.stockQty <= 0;
                  return (
                    <tr key={prod.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-bold text-white text-sm">{prod.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{prod.specs}</div>
                      </td>

                      <td className="py-4 px-6 text-slate-300">{prod.category}</td>

                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{prod.sku}</td>

                      <td className="py-4 px-6 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                            ● Out of Stock
                          </span>
                        ) : prod.stockQty <= 4 ? (
                          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                            ● Low: {prod.stockQty} left
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            ● {prod.stockQty} in stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="font-mono font-black text-white text-sm">
                          Rs. {prod.price.toLocaleString("en-LK")}
                        </div>
                        {prod.price > 400000 && (
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            2% Bulk discount
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-slate-300 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <span className="text-blue-400">🛡️</span>
                          <span>{prod.warranty}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate?.("pos")}
                          className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                          Bill at POS →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
