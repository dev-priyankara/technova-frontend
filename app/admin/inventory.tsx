"use client";

import React, { useState, useEffect } from "react";
import { mockAdminProducts, type AdminProduct } from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

interface StockAuditRecord {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  change: number;
  resultingStock: number;
  reason: string;
  timestamp: string;
}

export default function AdminInventory() {
  const [products, setProducts] = useState<AdminProduct[]>(mockAdminProducts);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals state
  const [auditModalProduct, setAuditModalProduct] = useState<AdminProduct | null>(null);
  const [auditMode, setAuditMode] = useState<"add" | "deduct" | "set">("add");
  const [auditQty, setAuditQty] = useState<number>(10);
  const [auditMinLevel, setAuditMinLevel] = useState<number>(5);
  const [auditReason, setAuditReason] = useState<string>("Supplier Consignment Arrival");

  // View Details Modal
  const [viewProduct, setViewProduct] = useState<AdminProduct | null>(null);

  // New Batch Modal
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: "",
    category: "Graphics Cards",
    sku: "",
    costPrice: 50000,
    sellingPrice: 65000,
    stockQty: 20,
    minStockLevel: 5,
    specs: "Standard Batch Consignment",
  });

  // Audit Logs History
  const [auditLogs, setAuditLogs] = useState<StockAuditRecord[]>([
    {
      id: "log-1",
      productId: "prod-1",
      productName: "RTX 4090 Gaming OC 24GB",
      sku: "GPU-NV-4090",
      change: +4,
      resultingStock: 12,
      reason: "Direct air freight replenishment batch",
      timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: "log-2",
      productId: "prod-3",
      productName: "Kingston Fury Beast 32GB RGB",
      sku: "RAM-KF-32G",
      change: -2,
      resultingStock: 2,
      reason: "Display bench allocation & testing",
      timestamp: new Date(Date.now() - 3600000 * 18).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/products")
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped: AdminProduct[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category_name || (typeof p.category === "string" ? p.category : p.category?.name) || "Hardware",
          sku: p.sku || `SKU-${p.id}`,
          costPrice: p.cost_price || Math.round((p.price || 0) * 0.82),
          sellingPrice: p.price || p.selling_price || 0,
          stockQty: p.stock_count ?? p.stock_qty ?? 0,
          minStockLevel: p.min_stock_level ?? 5,
          specs: p.specs || "",
          status:
            (p.stock_count ?? 0) === 0
              ? "Out of Stock"
              : (p.stock_count ?? 0) <= (p.min_stock_level ?? 5)
              ? "Low Stock"
              : "In Stock",
        }));
        setProducts(mapped);
      })
      .catch((err) => {
        console.warn("Using offline mock products for inventory tracking:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = products.filter((p) => {
    const matchFilter =
      filter === "All" ||
      (filter === "Low Stock" && p.status === "Low Stock") ||
      (filter === "Out of Stock" && p.status === "Out of Stock") ||
      (filter === "In Stock" && p.status === "In Stock");

    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const totalValuationCostLKR = products.reduce((acc, p) => acc + p.costPrice * p.stockQty, 0);
  const totalValuationRetailLKR = products.reduce((acc, p) => acc + p.sellingPrice * p.stockQty, 0);
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

  async function handleQuickStockChange(id: string, delta: number) {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newQty = Math.max(0, target.stockQty + delta);
    const newStatus =
      newQty <= 0 ? "Out of Stock" : newQty <= target.minStockLevel ? "Low Stock" : "In Stock";

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQty: newQty, status: newStatus } : p)),
    );

    // Call backend API in background
    apiFetch(`/products/${id}/stock?stock_delta=${delta}`, { method: "PATCH" }).catch(() => {});

    // Add log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        productId: id,
        productName: target.name,
        sku: target.sku,
        change: delta,
        resultingStock: newQty,
        reason: delta > 0 ? `Quick restock (+${delta})` : `Quick deduction (${delta})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 19),
    ]);

    setToast(`Updated ${target.name} stock (${delta > 0 ? `+${delta}` : delta} units)`);
    setTimeout(() => setToast(""), 3000);
  }

  function openAuditModal(product: AdminProduct) {
    setAuditModalProduct(product);
    setAuditMode("add");
    setAuditQty(10);
    setAuditMinLevel(product.minStockLevel);
    setAuditReason("Supplier Consignment Arrival");
  }

  async function handleApplyAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!auditModalProduct) return;

    let targetQty = auditModalProduct.stockQty;
    let delta = 0;

    if (auditMode === "add") {
      delta = Number(auditQty);
      targetQty += delta;
    } else if (auditMode === "deduct") {
      delta = -Number(auditQty);
      targetQty = Math.max(0, targetQty - Number(auditQty));
    } else if (auditMode === "set") {
      targetQty = Math.max(0, Number(auditQty));
      delta = targetQty - auditModalProduct.stockQty;
    }

    const minLevel = Number(auditMinLevel) || 5;
    const newStatus =
      targetQty <= 0 ? "Out of Stock" : targetQty <= minLevel ? "Low Stock" : "In Stock";

    setProducts((prev) =>
      prev.map((p) =>
        p.id === auditModalProduct.id
          ? { ...p, stockQty: targetQty, minStockLevel: minLevel, status: newStatus }
          : p,
      ),
    );

    // Synchronize with API if delta is non-zero
    if (delta !== 0) {
      apiFetch(`/products/${auditModalProduct.id}/stock?stock_delta=${delta}`, { method: "PATCH" }).catch(() => {});
    }

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        productId: auditModalProduct.id,
        productName: auditModalProduct.name,
        sku: auditModalProduct.sku,
        change: delta,
        resultingStock: targetQty,
        reason: auditReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 19),
    ]);

    setAuditModalProduct(null);
    setToast(`Audit applied for ${auditModalProduct.name}! New stock: ${targetQty} units.`);
    setTimeout(() => setToast(""), 3500);
  }

  function handleZeroOutStock(product: AdminProduct) {
    if (!confirm(`Are you sure you want to write off all remaining ${product.stockQty} units of "${product.name}"?`)) return;

    const delta = -product.stockQty;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stockQty: 0, status: "Out of Stock" } : p,
      ),
    );

    if (delta !== 0) {
      apiFetch(`/products/${product.id}/stock?stock_delta=${delta}`, { method: "PATCH" }).catch(() => {});
    }

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        change: delta,
        resultingStock: 0,
        reason: "Damaged / Obsolete Stock Write-Off to Zero",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 19),
    ]);

    setToast(`Stock written off for ${product.name}. Status set to Out of Stock.`);
    setTimeout(() => setToast(""), 3500);
  }

  function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    const newId = `prod-${Date.now()}`;
    const qty = Number(newBatch.stockQty) || 0;
    const minLvl = Number(newBatch.minStockLevel) || 5;
    const cost = Number(newBatch.costPrice) || 0;
    const sellingPrice = Number(newBatch.sellingPrice) || 0;

    const created: AdminProduct = {
      id: newId,
      name: newBatch.name.trim(),
      category: newBatch.category,
      sku: newBatch.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      costPrice: cost,
      sellingPrice: sellingPrice,
      stockQty: qty,
      minStockLevel: minLvl,
      specs: newBatch.specs || "Standard Batch Consignment",
      status: qty === 0 ? "Out of Stock" : qty <= minLvl ? "Low Stock" : "In Stock",
    };

    setProducts([created, ...products]);
    setIsAddBatchOpen(false);
    setNewBatch({
      name: "",
      category: "Graphics Cards",
      sku: "",
      costPrice: 50000,
      sellingPrice: 65000,
      stockQty: 20,
      minStockLevel: 5,
      specs: "Standard Batch Consignment",
    });

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        productId: newId,
        productName: created.name,
        sku: created.sku,
        change: qty,
        resultingStock: qty,
        reason: "New Hardware Batch Registered",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    setToast(`New batch "${created.name}" registered with ${qty} units!`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Inventory & Stock Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Monitor real-time shelf quantities, warehouse reserves, write-offs, and minimum reorder thresholds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddBatchOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Register Stock Batch
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Inventory Cost</div>
          <div className="mt-1.5 text-lg sm:text-xl font-black text-white font-mono">
            Rs. {totalValuationCostLKR.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">At supplier cost</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Retail Valuation</div>
          <div className="mt-1.5 text-lg sm:text-xl font-black text-emerald-400 font-mono">
            Rs. {totalValuationRetailLKR.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Potential revenue</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</div>
          <div className="mt-1.5 text-2xl font-black text-amber-300">{lowStockCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">At or below reorder limit</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</div>
          <div className="mt-1.5 text-2xl font-black text-rose-400">{outOfStockCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Requires urgent restock</div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search item, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No inventory records found matching your filters.
            </div>
          ) : (
            filtered.map((p) => {
              const stockPercent = Math.min(100, Math.round((p.stockQty / (p.minStockLevel * 3 || 15)) * 100));
              return (
                <div key={p.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku} | {p.category}</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.status === "In Stock"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                          : p.status === "Low Stock"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                          : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      ● {p.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Stock: <strong className="text-white font-mono">{p.stockQty}</strong> (Min: {p.minStockLevel})</span>
                    <span className="font-mono text-emerald-400 font-bold">Rs. {p.sellingPrice.toLocaleString("en-LK")}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
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

                  {/* Action buttons */}
                  <div className="flex items-center justify-between gap-1.5 pt-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickStockChange(p.id, 5)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickStockChange(p.id, 10)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickStockChange(p.id, -1)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-rose-600 hover:text-white"
                      >
                        -1
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openAuditModal(p)}
                        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white"
                      >
                        Audit / Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewProduct(p)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300"
                      >
                        View
                      </button>
                    </div>
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
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Item & SKU</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Min Threshold</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Valuation</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions & Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No hardware products found matching inventory criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const stockPercent = Math.min(100, Math.round((p.stockQty / (p.minStockLevel * 3 || 15)) * 100));
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
                        <div className="font-mono text-white font-bold">
                          Rs. {(p.costPrice * p.stockQty).toLocaleString("en-LK")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Unit Cost: Rs. {p.costPrice.toLocaleString("en-LK")}
                        </div>
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
                            title="Quick add 5 units"
                            onClick={() => handleQuickStockChange(p.id, 5)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            title="Quick add 10 units"
                            onClick={() => handleQuickStockChange(p.id, 10)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            title="Quick deduct 1 unit"
                            onClick={() => handleQuickStockChange(p.id, -1)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            -1
                          </button>

                          <button
                            type="button"
                            onClick={() => openAuditModal(p)}
                            className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            Audit Stock
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewProduct(p)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition-all"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            title="Write-off remaining stock to zero"
                            onClick={() => handleZeroOutStock(p)}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            Write Off
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Audit Trail Card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <h2 className="text-base font-extrabold text-white border-b border-white/10 pb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>📋</span> Real-time Stock Audit & Consignment Trail
          </span>
          <span className="text-xs font-normal text-slate-400">Recent {auditLogs.length} events</span>
        </h2>

        <div className="mt-4 divide-y divide-white/5">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                    log.change > 0
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {log.change > 0 ? `+${log.change}` : log.change} units
                </span>
                <div>
                  <span className="text-white font-bold">{log.productName}</span>{" "}
                  <span className="text-slate-400 font-mono text-[11px]">({log.sku})</span>
                  <div className="text-[11px] text-slate-400">{log.reason}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="text-slate-300 font-mono">Result: <strong>{log.resultingStock}</strong> in stock</span>
                <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Manual Stock Audit & Adjustment (UPDATE) */}
      {auditModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Stock Audit & Adjustment</h3>
                <p className="text-xs text-slate-400">{auditModalProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalProduct(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyAudit} className="space-y-4 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex justify-between items-center font-mono">
                <span className="text-slate-400">Current Shelf Stock:</span>
                <span className="text-white font-black text-base">{auditModalProduct.stockQty} units</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "add", label: "+ Add Stock" },
                    { key: "deduct", label: "- Deduct" },
                    { key: "set", label: "= Set Exact" },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setAuditMode(mode.key as any)}
                      className={`rounded-xl py-2 font-bold text-center transition-all ${
                        auditMode === mode.key
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Quantity ({auditMode === "set" ? "New Total Count" : "Units to Change"})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={auditQty}
                  onChange={(e) => setAuditQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Minimum Reorder Threshold Level
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={auditMinLevel}
                  onChange={(e) => setAuditMinLevel(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Reason / Audit Log Note
                </label>
                <select
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white text-xs focus:border-blue-400 focus:outline-none"
                >
                  <option value="Supplier Consignment Arrival">Supplier Consignment Arrival</option>
                  <option value="Routine Physical Audit Correction">Routine Physical Audit Correction</option>
                  <option value="Damaged Goods Write-Off">Damaged Goods Write-Off</option>
                  <option value="Warranty Replacement Claim Return">Warranty Replacement Claim Return</option>
                  <option value="Internal Testing / Benchmark Reservation">Internal Testing / Benchmark Reservation</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuditModalProduct(null)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Confirm Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Product Details (READ) */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">{viewProduct.name}</h3>
                <span className="text-[11px] text-blue-400 font-mono">SKU: {viewProduct.sku}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Category:</span>
                <span className="text-white font-medium">{viewProduct.category}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">In-Stock Quantity:</span>
                <span className="text-white font-mono font-bold">{viewProduct.stockQty} units</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Minimum Threshold:</span>
                <span className="text-amber-400 font-mono font-bold">{viewProduct.minStockLevel} units</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Unit Cost Price:</span>
                <span className="text-white font-mono">Rs. {viewProduct.costPrice.toLocaleString("en-LK")}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Retail Selling Price:</span>
                <span className="text-emerald-400 font-mono font-bold">Rs. {viewProduct.sellingPrice.toLocaleString("en-LK")}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Holding Valuation (Cost):</span>
                <span className="text-white font-mono font-bold">
                  Rs. {(viewProduct.costPrice * viewProduct.stockQty).toLocaleString("en-LK")}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    viewProduct.status === "In Stock"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                      : viewProduct.status === "Low Stock"
                      ? "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                      : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  ● {viewProduct.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const p = viewProduct;
                  setViewProduct(null);
                  openAuditModal(p);
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500"
              >
                Audit / Adjust
              </button>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Stock Batch (CREATE) */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Register Hardware Stock Batch</h3>
                <p className="text-xs text-slate-400">Receive and track new consignment hardware</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBatchOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intel Core i9-14900KS Special Edition"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newBatch.category}
                    onChange={(e) => setNewBatch({ ...newBatch, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="Processors">Processors</option>
                    <option value="Memory & RAM">Memory & RAM</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="Storage & SSD">Storage & SSD</option>
                    <option value="Laptops & Notebooks">Laptops & Notebooks</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="Peripherals">Peripherals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU / Serial Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. CPU-INT-14900KS"
                    value={newBatch.sku}
                    onChange={(e) => setNewBatch({ ...newBatch, sku: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cost Price (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newBatch.costPrice}
                    onChange={(e) => setNewBatch({ ...newBatch, costPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newBatch.sellingPrice}
                    onChange={(e) => setNewBatch({ ...newBatch, sellingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Batch Quantity (Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newBatch.stockQty}
                    onChange={(e) => setNewBatch({ ...newBatch, stockQty: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Min Alert Threshold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newBatch.minStockLevel}
                    onChange={(e) => setNewBatch({ ...newBatch, minStockLevel: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Save & Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
