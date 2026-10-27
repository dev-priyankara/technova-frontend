"use client";

import React, { useState } from "react";
import {
  mockAdminPOSTransactions,
  type AdminPOSTransaction,
} from "@/lib/adminData";

export default function AdminSales() {
  const [transactions, setTransactions] = useState<AdminPOSTransaction[]>(mockAdminPOSTransactions);
  const [selectedTx, setSelectedTx] = useState<AdminPOSTransaction | null>(null);
  const [editTx, setEditTx] = useState<AdminPOSTransaction | null>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // New Sale Form
  const [newSaleForm, setNewSaleForm] = useState({
    cashierName: "Kasun Silva",
    itemsCount: 2,
    subtotal: 450000,
    paymentMethod: "Card (PayHere)" as "Cash" | "Card (PayHere)" | "Bank Transfer",
  });

  const filtered = transactions.filter(
    (tx) =>
      search.trim() === "" ||
      tx.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.cashierName.toLowerCase().includes(search.toLowerCase()) ||
      tx.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
      tx.date.includes(search),
  );

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.finalAmount, 0);
  const totalDiscounts = transactions.reduce((sum, tx) => sum + tx.discount, 0);
  const totalCount = transactions.length;

  // CREATE POS SALE
  function handleCreateSale(e: React.FormEvent) {
    e.preventDefault();
    const subtotal = Number(newSaleForm.subtotal) || 0;
    // 2% discount if subtotal > 400,000 LKR
    const discount = subtotal > 400000 ? Math.round(subtotal * 0.02) : 0;
    const finalAmount = Math.max(0, subtotal - discount);

    const now = new Date();
    const newTx: AdminPOSTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `POS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cashierName: newSaleForm.cashierName.trim(),
      subtotal: subtotal,
      discount: discount,
      finalAmount: finalAmount,
      paymentMethod: newSaleForm.paymentMethod,
      itemsCount: Number(newSaleForm.itemsCount) || 1,
    };

    setTransactions([newTx, ...transactions]);
    setIsNewSaleOpen(false);
    setToast(`Receipt ${newTx.receiptNo} settled! Net Amount: Rs. ${finalAmount.toLocaleString("en-LK")}`);
    setTimeout(() => setToast(""), 3500);
  }

  // UPDATE SALE
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTx) return;

    setTransactions((prev) =>
      prev.map((tx) => (tx.id === editTx.id ? { ...editTx } : tx)),
    );

    setToast(`Transaction ${editTx.receiptNo} updated.`);
    setEditTx(null);
    setTimeout(() => setToast(""), 3500);
  }

  // DELETE / VOID SALE
  function handleVoidSale(tx: AdminPOSTransaction) {
    if (!confirm(`Are you sure you want to VOID receipt "${tx.receiptNo}" (Rs. ${tx.finalAmount.toLocaleString("en-LK")})? This action cannot be undone.`)) return;

    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    if (selectedTx?.id === tx.id) setSelectedTx(null);
    if (editTx?.id === tx.id) setEditTx(null);

    setToast(`Receipt ${tx.receiptNo} has been VOIDED.`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Sales & POS Transactions
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Track register receipts, cashier shifts, payment gateways, and automatic 2% discounts (&gt; LKR 400,000).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewSaleOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Record POS Counter Sale
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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Settled Sales</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-white font-mono">
            Rs. {totalRevenue.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{totalCount} POS counter records</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discounts Granted</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            Rs. {totalDiscounts.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">2% automatic tier discount</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Ticket Value</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-blue-400 font-mono">
            Rs. {totalCount ? Math.round(totalRevenue / totalCount).toLocaleString("en-LK") : 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Per counter purchase</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Register Rule</div>
          <div className="mt-1.5 text-base font-bold text-amber-300">2% over 400K</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active retail policy</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Transaction Logs ({filtered.length} found)
        </span>

        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search receipt no, cashier or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Sales Transactions Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No POS transactions match your filter.</div>
          ) : (
            filtered.map((tx) => (
              <div key={tx.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">{tx.receiptNo}</span>
                  <span className="text-sm font-black text-white font-mono">
                    Rs. {tx.finalAmount.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Cashier: <strong>{tx.cashierName}</strong></span>
                  <span className="font-mono text-[11px] text-slate-400">{tx.date} {tx.time}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Subtotal: Rs. {tx.subtotal.toLocaleString("en-LK")}</span>
                  {tx.discount > 0 && <span className="text-emerald-400 font-bold">2% Saved: -Rs. {tx.discount.toLocaleString("en-LK")}</span>}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                    {tx.paymentMethod}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                    >
                      Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTx({ ...tx })}
                      className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVoidSale(tx)}
                      className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-400"
                    >
                      Void
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Receipt No</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Cashier</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Subtotal</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Discount (2%)</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Net Amount</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No POS sales records found matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {tx.receiptNo}
                    </td>

                    <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">
                      {tx.date} {tx.time}
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      {tx.cashierName}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-300">
                      Rs. {tx.subtotal.toLocaleString("en-LK")}
                    </td>

                    <td className="px-6 py-4">
                      {tx.discount > 0 ? (
                        <span className="text-emerald-400 font-bold font-mono">
                          -Rs. {tx.discount.toLocaleString("en-LK")}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono font-black text-white text-sm">
                      Rs. {tx.finalAmount.toLocaleString("en-LK")}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                        >
                          Receipt
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditTx({ ...tx })}
                          className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVoidSale(tx)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Void
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View Receipt Details (READ) */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl font-mono text-xs">
            <div className="text-center border-b border-white/10 pb-4">
              <span className="text-base font-black text-white block">TECHNOVA COMPUTERS</span>
              <span className="text-[10px] text-slate-400 block">Retail POS & Hardware Solutions</span>
              <span className="text-blue-400 text-xs font-bold mt-1 block">
                {selectedTx.receiptNo}
              </span>
            </div>

            <div className="py-4 space-y-2 text-slate-300 border-b border-white/10 text-[11px]">
              <div className="flex justify-between">
                <span>Date/Time:</span>
                <span className="text-white">{selectedTx.date} {selectedTx.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier Staff:</span>
                <span className="text-white">{selectedTx.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="text-white">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Count:</span>
                <span className="text-white">{selectedTx.itemsCount} hardware item(s)</span>
              </div>
            </div>

            <div className="py-4 space-y-2 border-b border-white/10">
              <div className="flex justify-between text-slate-300">
                <span>Gross Subtotal:</span>
                <span>Rs. {selectedTx.subtotal.toLocaleString("en-LK")}</span>
              </div>
              {selectedTx.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>2% POS Bulk Discount:</span>
                  <span>-Rs. {selectedTx.discount.toLocaleString("en-LK")}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-white/5">
                <span>PAID TOTAL:</span>
                <span>Rs. {selectedTx.finalAmount.toLocaleString("en-LK")}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert("Printing POS receipt to thermal printer...");
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500"
              >
                Print Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Transaction (UPDATE) */}
      {editTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit POS Transaction</h3>
                <span className="text-xs text-blue-400 font-mono">{editTx.receiptNo}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditTx(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Cashier Staff</label>
                <input
                  type="text"
                  required
                  value={editTx.cashierName}
                  onChange={(e) => setEditTx({ ...editTx, cashierName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                <select
                  value={editTx.paymentMethod}
                  onChange={(e) => setEditTx({ ...editTx, paymentMethod: e.target.value as any })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card (PayHere)">Card (PayHere / EDC)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Items Sold Count</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editTx.itemsCount}
                  onChange={(e) => setEditTx({ ...editTx, itemsCount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTx(null)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Record POS Counter Sale (CREATE) */}
      {isNewSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Record Counter Sale</h3>
                <p className="text-xs text-slate-400">Cashier terminal settlement</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSaleOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Cashier Staff</label>
                <input
                  type="text"
                  required
                  value={newSaleForm.cashierName}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, cashierName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subtotal (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newSaleForm.subtotal}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, subtotal: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Items Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSaleForm.itemsCount}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, itemsCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Preview of 2% discount */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Gross:</span>
                  <span className="font-mono text-white">Rs. {Number(newSaleForm.subtotal || 0).toLocaleString("en-LK")}</span>
                </div>
                {Number(newSaleForm.subtotal || 0) > 400000 ? (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>2% Bulk Tier Discount:</span>
                    <span className="font-mono">-Rs. {Math.round(Number(newSaleForm.subtotal || 0) * 0.02).toLocaleString("en-LK")}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400">Subtotal below LKR 400,000 — standard price applies</div>
                )}
                <div className="flex justify-between text-white font-bold pt-1 border-t border-white/5">
                  <span>Payable:</span>
                  <span className="font-mono text-blue-400">
                    Rs. {(
                      Number(newSaleForm.subtotal || 0) > 400000
                        ? Math.round(Number(newSaleForm.subtotal || 0) * 0.98)
                        : Number(newSaleForm.subtotal || 0)
                    ).toLocaleString("en-LK")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                <select
                  value={newSaleForm.paymentMethod}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, paymentMethod: e.target.value as any })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="Card (PayHere)">Card (PayHere / EDC)</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSaleOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Complete Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
