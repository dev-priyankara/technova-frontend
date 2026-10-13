"use client";

import React, { useState } from "react";
import {
  mockCashierShift,
} from "@/lib/cashierData";

export default function CashierShiftPage() {
  const [shift] = useState(mockCashierShift);
  const [actualCash, setActualCash] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [shiftClosed, setShiftClosed] = useState(false);

  const numericActual = typeof actualCash === "number" ? actualCash : 0;
  const difference = numericActual > 0 ? numericActual - shift.expectedCashInDrawer : 0;

  function handleCloseShift() {
    if (numericActual <= 0) {
      alert("Please enter the counted physical cash amount before closing the register drawer.");
      return;
    }
    if (confirm("Are you sure you want to reconcile and close this cashier shift?")) {
      setShiftClosed(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
            💼 Cash Register & Drawer Settlement
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Register Drawer & Shift #14
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Reconcile physical cash drawer with POS transaction records, verify floats, and prepare daily settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold ${
            shiftClosed
              ? "border-slate-500/30 bg-slate-800 text-slate-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}>
            <span className={`h-2.5 w-2.5 rounded-full ${shiftClosed ? "bg-slate-400" : "bg-emerald-400 animate-pulse"}`}></span>
            <span>{shiftClosed ? "Shift Closed" : "Register Open"}</span>
          </span>
        </div>
      </div>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Financial Audit Breakdown (cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/10 pb-3">
              Shift Settlement Audit Breakdown
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Cashier on Duty</span>
                <span className="font-bold text-white">{shift.cashierName} ({shift.cashierId})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">POS Terminal Assigned</span>
                <span className="font-mono font-bold text-white">{shift.registerId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Shift Started At</span>
                <span className="font-mono text-slate-300">{shift.shiftStart}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Opening Cash Float</span>
                <span className="font-mono font-bold text-white">
                  Rs. {shift.openingFloat.toLocaleString("en-LK")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Cash Sales Collected</span>
                <span className="font-mono font-bold text-emerald-400">
                  + Rs. {shift.cashSales.toLocaleString("en-LK")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Card / EDC Slip Sales</span>
                <span className="font-mono font-bold text-blue-400">
                  + Rs. {shift.cardSales.toLocaleString("en-LK")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Bank Transfer Direct Payments</span>
                <span className="font-mono font-bold text-indigo-400">
                  + Rs. {shift.bankTransferSales.toLocaleString("en-LK")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Volume Discounts (2% &gt; 400k)</span>
                <span className="font-mono font-bold text-purple-400">
                  - Rs. {shift.discountsTotal.toLocaleString("en-LK")}
                </span>
              </div>

              {/* Total Shift Turnover */}
              <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-black">
                <span className="text-white">Total Gross Sales Volume:</span>
                <span className="font-mono text-white">
                  Rs. {shift.totalSales.toLocaleString("en-LK")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Drawer Cash Reconciliation Form (cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Cash Drawer Verification
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                Drawer Cash Balancing
              </h3>
            </div>

            {/* Expected Cash Box */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4">
              <span className="text-[11px] font-semibold text-blue-300 block">
                Expected Physical Cash in Drawer
              </span>
              <div className="font-mono text-2xl font-black text-white mt-1">
                Rs. {shift.expectedCashInDrawer.toLocaleString("en-LK")}
              </div>
              <p className="text-[10px] text-blue-200/80 mt-1">
                Calculated as: Opening Float (Rs. 25,000) + Cash Sales (Rs. 388,500)
              </p>
            </div>

            {/* Actual Count Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Actual Physical Cash Counted (LKR) *
                </label>
                <input
                  type="number"
                  disabled={shiftClosed}
                  value={actualCash}
                  onChange={(e) =>
                    setActualCash(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter physical cash in register..."
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-mono text-white focus:border-blue-400 outline-none disabled:opacity-50"
                />
              </div>

              {/* Live Variance Calculation */}
              {numericActual > 0 && (
                <div
                  className={`rounded-2xl border p-4 ${
                    difference === 0
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                      : difference > 0
                      ? "border-blue-500/40 bg-blue-950/40 text-blue-300"
                      : "border-red-500/40 bg-red-950/40 text-red-300"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>
                      {difference === 0
                        ? "✅ Perfect Match (Balanced)"
                        : difference > 0
                        ? "📈 Cash Overage"
                        : "⚠️ Cash Shortage"}
                    </span>
                    <span className="font-mono text-sm">
                      {difference >= 0 ? "+" : ""}
                      Rs. {difference.toLocaleString("en-LK")}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Shift Settlement Remarks
                </label>
                <textarea
                  rows={2}
                  disabled={shiftClosed}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. All 8 physical bills audited. Cash drawer balanced."
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-800 p-3 text-xs text-white focus:border-blue-400 outline-none disabled:opacity-50 resize-none"
                />
              </div>

              {shiftClosed ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-center text-xs text-emerald-300 font-bold">
                  Shift closed & reconciled successfully. Report archived.
                </div>
              ) : (
                <button
                  onClick={handleCloseShift}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 py-3.5 text-xs font-bold text-white shadow-xl shadow-amber-600/30 hover:from-amber-500 hover:to-amber-400 transition"
                >
                  Reconcile & Close Shift
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

