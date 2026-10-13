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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            🔍 Price & Stock Verification Counter
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Product Price & Stock Lookup
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Rapidly verify component prices, current physical shop inventory, and warranty terms for walk-in shoppers.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate("pos")}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Open POS Register</span>
          </button>
        )}
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search price, GPU model, processor socket, or part number..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:border-blue-500 outline-none backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                selectedCategory === cat
                  ? "border-blue-400 bg-blue-600 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Product Name & Specifications</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">SKU / Code</th>
                <th className="py-3 px-3 text-center">In-Store Stock</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3">Warranty</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((prod) => {
                const isOutOfStock = prod.stockQty <= 0;
                return (
                  <tr key={prod.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-bold text-white text-xs leading-snug">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {prod.specs}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {prod.category}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isOutOfStock ? (
                        <span className="rounded-md border border-red-500/30 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
                          Out of Stock
                        </span>
                      ) : prod.stockQty <= 4 ? (
                        <span className="rounded-md border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          Low: {prod.stockQty} left
                        </span>
                      ) : (
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          {prod.stockQty} units available
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-black text-white text-sm">
                        Rs. {prod.price.toLocaleString("en-LK")}
                      </div>
                      {prod.price > 400000 && (
                        <span className="text-[9px] text-emerald-400 font-semibold block">
                          Eligible for 2% discount
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{prod.warranty}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onNavigate?.("pos")}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600/30 border border-blue-500/30 px-3 py-1.5 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition"
                      >
                        Bill at POS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No hardware products match the search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
