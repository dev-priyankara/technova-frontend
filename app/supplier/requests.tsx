"use client";

import React, { useState } from "react";
import {
  mockRestockRequests,
  mockShopBranches,
  mockSupplierProducts,
  type RestockRequest,
} from "@/lib/supplierData";

export default function SupplierRequests() {
  const [requests, setRequests] = useState<RestockRequest[]>(mockRestockRequests);
  const [filter, setFilter] = useState("All");

  // State to simulate a store owner sending a new request
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simBranch, setSimBranch] = useState(mockShopBranches[0].name);
  const [simManager, setSimManager] = useState("Kasun Silva");
  const [simPhone, setSimPhone] = useState("+94 77 123 4567");
  const [simUrgency, setSimUrgency] = useState<"Critical (Out of Stock)" | "High (Low Stock)" | "Normal Restock">("Critical (Out of Stock)");
  const [simProduct, setSimProduct] = useState(mockSupplierProducts[1]);
  const [simQty, setSimQty] = useState(6);
  const [simNotes, setSimNotes] = useState("Stock depleted after sudden weekend walk-in rush.");

  function updateStatus(id: string, newStatus: RestockRequest["status"]) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  }

  function handleCreateSimulatedRequest(e: React.FormEvent) {
    e.preventDefault();
    const lineTotal = simQty * simProduct.wholesalePrice;
    const newReq: RestockRequest = {
      id: `req-${Date.now()}`,
      requestNo: `REQ-TECHNOVA-2025-${Math.floor(100 + Math.random() * 900)}`,
      shopBranch: simBranch,
      shopManager: simManager,
      shopPhone: simPhone,
      requestDate: new Date().toISOString().split("T")[0],
      urgency: simUrgency,
      items: [
        {
          productName: simProduct.name,
          sku: simProduct.sku,
          currentShopStock: 1,
          minThreshold: 4,
          requestedQty: simQty,
          wholesalePrice: simProduct.wholesalePrice,
          lineTotal,
        },
      ],
      totalEstValue: lineTotal,
      status: "Pending Supplier Approval",
      shopNotes: simNotes,
    };

    setRequests([newReq, ...requests]);
    setShowSimulateModal(false);
  }

  const filtered = requests.filter((r) => {
    if (filter === "All") return true;
    return r.status.includes(filter);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            📥 Store Owner Replenishment Demands
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Shop Restock & Replenishment Requests
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            When hardware stock falls below safe retail thresholds in shops, store owners trigger these replenishment orders.
          </p>
        </div>

        <button
          onClick={() => setShowSimulateModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Simulate Store Owner Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Pending", "Accepted", "Dispatched"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              filter === f
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
            }`}
          >
            {f === "All" ? "All Orders" : f}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4"
          >
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-300">
                    {req.requestNo}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      req.urgency.startsWith("Critical")
                        ? "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse"
                        : req.urgency.startsWith("High")
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {req.urgency}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {req.shopBranch}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span>Manager: <strong className="text-slate-200">{req.shopManager}</strong> ({req.shopPhone})</span>
                  <span>•</span>
                  <span>Date: {req.requestDate}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${
                    req.status === "Pending Supplier Approval"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : req.status === "Accepted & Preparing"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : req.status === "Dispatched"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            </div>

            {/* Requested Items Table */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                      <th className="py-2 px-2">Hardware Product</th>
                      <th className="py-2 px-2 font-mono">SKU</th>
                      <th className="py-2 px-2 text-center">Shop Current Stock</th>
                      <th className="py-2 px-2 text-center">Min Threshold</th>
                      <th className="py-2 px-2 text-center">Requested Qty</th>
                      <th className="py-2 px-2 text-right">Wholesale Unit</th>
                      <th className="py-2 px-2 text-right">Total (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {req.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-2 font-bold text-white">
                          {it.productName}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-400">
                          {it.sku}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            it.currentShopStock === 0
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {it.currentShopStock} units
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-400 font-mono">
                          {it.minThreshold}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className="font-mono font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded text-xs">
                            {it.requestedQty} units
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-300">
                          Rs. {it.wholesalePrice.toLocaleString("en-LK")}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-400">
                          Rs. {it.lineTotal.toLocaleString("en-LK")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile item view */}
              <div className="block sm:hidden divide-y divide-white/5 space-y-2">
                {req.items.map((it, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="font-bold text-white">{it.productName}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{it.sku}</span>
                      <span className="text-blue-300 font-bold">{it.requestedQty} units</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-400">Current Stock: {it.currentShopStock}</span>
                      <span className="font-bold text-emerald-400">Rs. {it.lineTotal.toLocaleString("en-LK")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop Notes & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-300">
                {req.shopNotes && (
                  <p className="italic">
                    &ldquo;{req.shopNotes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                <div className="text-right mr-2 font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Est. PO Total</span>
                  <span className="text-base font-black text-white">
                    Rs. {req.totalEstValue.toLocaleString("en-LK")}
                  </span>
                </div>

                {req.status === "Pending Supplier Approval" && (
                  <>
                    <button
                      onClick={() => updateStatus(req.id, "Accepted & Preparing")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
                    >
                      Accept & Prepare Stock
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "Declined")}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                    >
                      Decline
                    </button>
                  </>
                )}

                {req.status === "Accepted & Preparing" && (
                  <button
                    onClick={() => updateStatus(req.id, "Dispatched")}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
                  >
                    Mark as Dispatched & Shipped
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Simulate Store Owner Request */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Simulate Store Owner Low-Stock Request
              </h3>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedRequest} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Retail Store Branch *
                </label>
                <select
                  value={simBranch}
                  onChange={(e) => setSimBranch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  {mockShopBranches.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Requested Hardware Component *
                </label>
                <select
                  value={simProduct.id}
                  onChange={(e) => {
                    const p = mockSupplierProducts.find((x) => x.id === e.target.value);
                    if (p) setSimProduct(p);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  {mockSupplierProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Wholesale: Rs. {p.wholesalePrice.toLocaleString("en-LK")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={simQty}
                    onChange={(e) => setSimQty(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={simUrgency}
                    onChange={(e) => setSimUrgency(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                  >
                    <option value="Critical (Out of Stock)">Critical (Out of Stock)</option>
                    <option value="High (Low Stock)">High (Low Stock)</option>
                    <option value="Normal Restock">Normal Restock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Store Owner Message / Request Reason
                </label>
                <input
                  type="text"
                  value={simNotes}
                  onChange={(e) => setSimNotes(e.target.value)}
                  placeholder="e.g. Need restock before Friday weekend sales..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Submit Replenishment Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

