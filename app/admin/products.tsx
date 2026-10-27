"use client";

import React, { useEffect, useState } from "react";
import {
  type AdminProduct,
  type AdminCategory,
  type TimeFilterPeriod,
  mockAdminProducts,
  mockAdminCategories,
  isDateInPeriod,
} from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilterPeriod>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

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
    category: "Laptops",
    sku: "",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 5,
    minStockLevel: 3,
    specs: "",
  });

  function loadData() {
    setLoading(true);
    Promise.all([
      apiFetch<any[]>("/products"),
      apiFetch<any[]>("/categories"),
    ])
      .then(([prods, cats]) => {
        if (Array.isArray(prods) && prods.length > 0) {
          const mappedProds: AdminProduct[] = prods.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            sku: p.sku,
            costPrice: p.cost_price || 0,
            sellingPrice: p.price,
            stockQty: p.stock_count,
            minStockLevel: p.min_stock_level || 3,
            specs: Array.isArray(p.specs) ? p.specs.join(", ") : p.specs || "",
            status:
              p.stock_count <= 0
                ? "Out of Stock"
                : p.stock_count <= (p.min_stock_level || 3)
                ? "Low Stock"
                : "In Stock",
            createdAt: p.created_at ? p.created_at.split("T")[0] : (p.createdAt || new Date().toISOString().split("T")[0]),
          }));
          setProducts(mappedProds);
        } else {
          setProducts(mockAdminProducts);
        }
        if (Array.isArray(cats) && cats.length > 0) {
          const mappedCats: AdminCategory[] = cats.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            itemCount: c.item_count,
            slug: c.slug,
          }));
          setCategories(mappedCats);
          if (mappedCats.length > 0) {
            setForm((prev) => ({ ...prev, category: mappedCats[0].name }));
          }
        } else {
          setCategories(mockAdminCategories);
          setForm((prev) => ({ ...prev, category: mockAdminCategories[0].name }));
        }
      })
      .catch((err) => {
        console.warn("Failed to load products/categories from database, using mock data:", err);
        setProducts(mockAdminProducts);
        setCategories(mockAdminCategories);
        setForm((prev) => ({ ...prev, category: mockAdminCategories[0].name }));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const allCount = products.length;
  const todayCount = products.filter((p) => isDateInPeriod(p.createdAt, "today")).length;
  const weeklyCount = products.filter((p) => isDateInPeriod(p.createdAt, "weekly")).length;
  const monthlyCount = products.filter((p) => isDateInPeriod(p.createdAt, "monthly")).length;

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === "All" || p.category === selectedCat;
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchTime = isDateInPeriod(p.createdAt, timeFilter);
    return matchCat && matchSearch && matchTime;
  });

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await apiFetch<any>("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          sku: form.sku.trim().toUpperCase(),
          price: Number(form.sellingPrice),
          cost_price: Number(form.costPrice),
          stock_count: Number(form.stockQty),
          min_stock_level: Number(form.minStockLevel),
          specs: form.specs ? form.specs.split(",").map((s) => s.trim()) : [],
          description: form.name.trim(),
          warranty: "Official Warranty",
        }),
      });

      const todayStr = new Date().toISOString().split("T")[0];
      const newProd: AdminProduct = {
        id: created.id,
        name: created.name,
        category: created.category,
        sku: created.sku,
        costPrice: created.cost_price || Number(form.costPrice),
        sellingPrice: created.price,
        stockQty: created.stock_count,
        minStockLevel: created.min_stock_level || Number(form.minStockLevel),
        specs: Array.isArray(created.specs) ? created.specs.join(", ") : form.specs,
        status: created.stock_count <= 0 ? "Out of Stock" : created.stock_count <= (created.min_stock_level || 3) ? "Low Stock" : "In Stock",
        createdAt: created.created_at ? created.created_at.split("T")[0] : todayStr,
      };

      setProducts([newProd, ...products]);
      setIsModalOpen(false);
      setForm({
        name: "",
        category: categories[0]?.name || "Laptops",
        sku: "",
        costPrice: 0,
        sellingPrice: 0,
        stockQty: 5,
        minStockLevel: 3,
        specs: "",
      });
      setToast("Product created successfully in master catalogue!");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save product in database.");
    }
  }

  async function handleDeleteProduct(id: string, name: string) {
    if (!confirm(`Are you sure you want to deactivate/delete product "${name}" from the database?`)) return;
    try {
      await apiFetch<any>(`/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
      setToast(`Product "${name}" deleted successfully.`);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product.");
    }
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
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <span className="text-base leading-none">＋</span>
          <span>Add Hardware Product</span>
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Time-based Arrival Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <span>🕒</span> Arrival Filter:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Time", key: "all" as TimeFilterPeriod, count: allCount, icon: "📦" },
            { label: "Today", key: "today" as TimeFilterPeriod, count: todayCount, icon: "⚡" },
            { label: "This Week", key: "weekly" as TimeFilterPeriod, count: weeklyCount, icon: "📅" },
            { label: "This Month", key: "monthly" as TimeFilterPeriod, count: monthlyCount, icon: "🗓️" },
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 text-xs font-bold text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
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
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No products found matching the selected arrival timeframe and filters.
            </div>
          ) : (
            filtered.map((p) => (
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
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    📅 Arrival: <span className="text-slate-300 font-mono">{p.createdAt || "2026-10-27"}</span>
                  </span>
                  {isDateInPeriod(p.createdAt, "today") && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      New Today
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Selling Price</span>
                    <span className="font-black text-white font-mono">
                      Rs. {p.sellingPrice.toLocaleString("en-LK")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Stock Qty</span>
                      <span className="font-bold text-white">{p.stockQty} Units</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs"
                      title="Delete product"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Arrival Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No hardware products found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
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
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300">{p.createdAt || "2026-10-27"}</span>
                        {isDateInPeriod(p.createdAt, "today") && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium text-xs inline-flex items-center gap-1"
                        title="Delete Product"
                      >
                        <span>🗑️</span>
                        <span className="hidden lg:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                    {categories.map((c) => (
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

