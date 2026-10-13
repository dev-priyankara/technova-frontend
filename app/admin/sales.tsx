"use client";

import React, { useState } from "react";
import {
  mockAdminPOSTransactions,
  type AdminPOSTransaction,
} from "@/lib/adminData";

export default function AdminSales() {
  const [transactions] = useState<AdminPOSTransaction[]>(mockAdminPOSTransactions);
  const [selectedTx, setSelectedTx] = useState<AdminPOSTransaction | null>(null);

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.finalAmount, 0);
  const totalDiscounts = transactions.reduce((sum, tx) => sum + tx.discount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🧾 Point of Sale (POS) Records
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Sales & POS Transactions
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Track register receipts, cashier shifts, payment gateways, and the 2% discount rule (&gt; LKR 400,000).
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Sales Settled</span>
            <span className="text-xl font-black text-white font-mono">
              Rs. {totalRevenue.toLocaleString("en-LK")}
            </span>
          </div>
        </div>
      </div>

      {/* POS Rule Notification Card */}
      <div className="rounded-2xl border border-blue-400/20 bg-blue-950/20 p-4 text-xs text-blue-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">⚖️</span>
          <div>
            <strong className="text-white block font-bold">POS Automatic Discount Rule Active:</strong>
            <span className="text-[11px] text-slate-300">
              Purchases with a subtotal strictly exceeding LKR 400,000 receive an automatic 2% discount. Total discounts granted: <strong>Rs. {totalDiscounts.toLocaleString("en-LK")}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
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
                    <button
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      View Receipt →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Receipt Details */}
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
                onClick={() => setSelectedTx(null)}
                className="w-full rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

