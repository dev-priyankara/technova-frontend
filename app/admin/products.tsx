"use client";

import React, { useState } from "react";
import {
  mockAdminProducts,
  mockAdminCategories,
  type AdminProduct,
} from "@/lib/adminData";

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>(mockAdminProducts);
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState<{
    name: string;
    category: string;
    sku: string;
    costPrice: number;
    sellingPrice: number;
    stockQty: number;
    minStockLevel: number;
    specs: string;
  }>({
    name: "",
    category: mockAdminCategories[0].name,
    sku: "",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 5,
    minStockLevel: 3,
    specs: "",
  });

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === "All" || p.category === selectedCat;
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const newProd: AdminProduct = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: form.name,
      category: form.category,
      sku: form.sku,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      stockQty: Number(form.stockQty),
      minStockLevel: Number(form.minStockLevel),
      specs: form.specs,
      status: Number(form.stockQty) <= 0 ? "Out of Stock" : Number(form.stockQty) <= Number(form.minStockLevel) ? "Low Stock" : "In Stock",
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    setForm({
      name: "",
      category: mockAdminCategories[0].name,
      sku: "",
      costPrice: 0,
      sellingPrice: 0,
      stockQty: 5,
      minStockLevel: 3,
      specs: "",
    });
    setToast("Product created successfully in master catalogue!");
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            💻 Hardware Catalogue
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Product Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Maintain selling prices, procurement costs, inventory thresholds, and hardware specifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <span>+ Add Hardware Product</span>
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 text-xs font-bold text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="All">All Categories ({products.length})</option>
            {mockAdminCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, SKU or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Product List Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white truncate max-w-[200px]">{p.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === "In Stock"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                      : p.status === "Low Stock"
                      ? "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                      : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{p.category} • SKU: {p.sku}</div>
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Selling Price</span>
                  <span className="font-black text-white font-mono">
                    Rs. {p.sellingPrice.toLocaleString("en-LK")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Stock Qty</span>
                  <span className="font-bold text-white">{p.stockQty} Units</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Cost (Procurement)</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Selling Price</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.specs}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{p.category}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">
                    Rs. {p.costPrice.toLocaleString("en-LK")}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                    Rs. {p.sellingPrice.toLocaleString("en-LK")}
                  </td>
                  <td className="px-6 py-4 font-mono">
                    <span className="font-bold text-white">{p.stockQty}</span>
                    <span className="text-slate-400 text-[10px] block">Min: {p.minStockLevel}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Add Hardware Product</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gigabyte B650 AORUS Elite AX Motherboard"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  >
                    {mockAdminCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU / Model Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B650-AORUS-AX"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cost Price (LKR)</label>
                  <input
                    type="number"
                    required
                    value={form.costPrice || ""}
                    onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price (LKR)</label>
                  <input
                    type="number"
                    required
                    value={form.sellingPrice || ""}
                    onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={form.stockQty}
                    onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Min Reorder Threshold</label>
                  <input
                    type="number"
                    required
                    value={form.minStockLevel}
                    onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hardware Specifications</label>
                <textarea
                  rows={2}
                  placeholder="e.g. AM5 Socket, DDR5, PCIe 5.0, Wi-Fi 6E, 2.5GbE LAN"
                  value={form.specs}
                  onChange={(e) => setForm({ ...form, specs: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Add to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

