"use client";

import React, { useState } from "react";
import {
  mockReturnedProducts,
  mockShopBranches,
  mockSupplierProducts,
  type ReturnedProduct,
} from "@/lib/supplierData";

export default function SupplierReturns() {
  const [returns, setReturns] = useState<ReturnedProduct[]>(mockReturnedProducts);
  const [filter, setFilter] = useState("All");
  const [showLogModal, setShowLogModal] = useState(false);

  // New Return Modal State
  const [targetShop, setTargetShop] = useState(mockShopBranches[0].name);
  const [selectedProduct, setSelectedProduct] = useState(mockSupplierProducts[1]);
  const [serialNo, setSerialNo] = useState("");
  const [reason, setReason] = useState<ReturnedProduct["returnReason"]>("Dead On Arrival (DOA)");
  const [issue, setIssue] = useState("");

  function updateStatus(id: string, newStatus: ReturnedProduct["status"], notes: string) {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, resolutionNotes: notes } : r
      )
    );
  }

  function handleLogReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!serialNo.trim() || !issue.trim()) {
      alert("Please provide the component serial number and customer issue description.");
      return;
    }

    const created: ReturnedProduct = {
      id: `rma-${Date.now()}`,
      rmaNumber: `RMA-NANO-2025-${Math.floor(100 + Math.random() * 900)}`,
      fromShop: targetShop,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      serialNumber: `SN: ${serialNo.trim()}`,
      customerIssue: issue.trim(),
      returnReason: reason,
      returnDate: new Date().toISOString().split("T")[0],
      warrantyValid: true,
      status: "Pending Inspection",
      resolutionNotes: "Received at distributor RMA warehouse. Awaiting technical bench test.",
    };

    setReturns([created, ...returns]);
    setShowLogModal(false);
    setSerialNo("");
    setIssue("");
  }

  const filtered = returns.filter((r) => {
    if (filter === "All") return true;
    return r.status.includes(filter);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🔄 RMA Warranty & Defect Processing
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Returned Products & Defect Claims
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Inspect hardware returned by shop branches due to Dead-on-Arrival (DOA), VRM shorts, or GPU artifacts, and issue replacements or credit notes.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Log Shop Return (RMA)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Pending", "Replacement", "Credit Note", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              filter === f
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
            }`}
          >
            {f === "All" ? "All Returned Units" : f}
          </button>
        ))}
      </div>

      {/* RMA Items Grid */}
      <div className="space-y-4">
        {filtered.map((rma) => (
          <div
            key={rma.id}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-300">
                    {rma.rmaNumber}
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    Returned on {rma.returnDate}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {rma.productName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="font-mono text-blue-300">{rma.serialNumber}</span>
                  <span>•</span>
                  <span>From: <strong className="text-slate-200">{rma.fromShop}</strong></span>
                </div>
              </div>

              <div>
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${
                    rma.status === "Pending Inspection"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                      : rma.status === "Replacement Dispatched"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : rma.status === "Credit Note Issued"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  }`}
                >
                  {rma.status}
                </span>
              </div>
            </div>

            {/* Problem & Reason details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Reported Defect Category
                </span>
                <span className="font-bold text-red-300 block">
                  ⚠️ {rma.returnReason}
                </span>
                <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                  &ldquo;{rma.customerIssue}&rdquo;
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Distributor QA Bench Resolution
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  {rma.resolutionNotes || "Awaiting technical review by hardware technician."}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Resolve Claim:</span>
                <button
                  onClick={() =>
                    updateStatus(
                      rma.id,
                      "Replacement Dispatched",
                      "Tested DOA confirmed. Brand new retail sealed unit dispatched to shop."
                    )
                  }
                  className="rounded-lg bg-emerald-600/30 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
                >
                  Approve Replacement
                </button>
                <button
                  onClick={() =>
                    updateStatus(
                      rma.id,
                      "Credit Note Issued",
                      "Component out of stock. Full wholesale value credited to shop ledger."
                    )
                  }
                  className="rounded-lg bg-blue-600/30 border border-blue-500/30 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition"
                >
                  Issue Credit Note
                </button>
                <button
                  onClick={() =>
                    updateStatus(
                      rma.id,
                      "Rejected (Physical Damage)",
                      "Inspection showed bent pins / physical user damage. Warranty voided."
                    )
                  }
                  className="rounded-lg bg-red-600/30 border border-red-500/30 px-2.5 py-1 text-[11px] font-bold text-red-300 hover:bg-red-600 hover:text-white transition"
                >
                  Reject Claim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Log Return */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Log Product Return from Shop Counter
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLogReturn} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Returning Retail Shop Branch *
                </label>
                <select
                  value={targetShop}
                  onChange={(e) => setTargetShop(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  {mockShopBranches.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Hardware Model *
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = mockSupplierProducts.find((p) => p.id === e.target.value);
                    if (found) setSelectedProduct(found);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  {mockSupplierProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Serial Number (SN) *
                </label>
                <input
                  type="text"
                  required
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  placeholder="e.g. SN-602-V513-XXXXXX"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Defect Reason Category *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  <option value="Dead On Arrival (DOA)">Dead On Arrival (DOA)</option>
                  <option value="GPU Artifacting / Freezing">GPU Artifacting / Freezing</option>
                  <option value="VRM Power Defect">VRM Power Defect</option>
                  <option value="Transit Physical Damage">Transit Physical Damage</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Detailed Failure Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe failure symptoms observed by customer / counter..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3.5 text-white outline-none focus:border-blue-400 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Log Return & Issue RMA
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
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

