"use client";

import React, { useState, useMemo } from "react";
import {
  mockPOSTransactions,
  type POSTransaction,
} from "@/lib/cashierData";
import ReceiptModal from "@/app/cashier/receiptModal";

export default function CashierTransactionsPage() {
  const [transactions] = useState<POSTransaction[]>(mockPOSTransactions);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState<POSTransaction | null>(null);

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(search.toLowerCase()) ||
        tx.customerPhone.toLowerCase().includes(search.toLowerCase());
      const matchMethod =
        methodFilter === "All" || tx.paymentMethod.startsWith(methodFilter);
      return matchSearch && matchMethod;
    });
  }, [transactions, search, methodFilter]);

  const totalSettled = filtered.reduce((s, tx) => s + tx.finalAmount, 0);
  const totalDiscounts = filtered.reduce((s, tx) => s + tx.discount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🧾 POS Sales History & Reprint
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Register Invoices & Receipts
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Audit walk-in transactions, inspect items sold, and re-issue 80mm thermal receipts anytime.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              Total Filtered Volume
            </span>
            <span className="text-xl font-black text-white font-mono">
              Rs. {totalSettled.toLocaleString("en-LK")}
            </span>
            {totalDiscounts > 0 && (
              <span className="text-[10px] text-emerald-400 block font-mono">
                (Disc: Rs. {totalDiscounts.toLocaleString("en-LK")})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Payment Method Tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "Cash", "Card", "Bank"].map((m) => {
            const isActive = methodFilter === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
                }`}
              >
                {m === "All" ? "All Payments" : m}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt no, customer, phone..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No transactions match your search criteria.
            </div>
          ) : (
            filtered.map((tx) => (
              <div key={tx.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-blue-300">{tx.receiptNo}</span>
                  <span className="font-mono font-black text-white text-sm">
                    Rs. {tx.finalAmount.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Customer: <strong>{tx.customerName}</strong></span>
                  <span className="font-mono text-slate-400 text-[11px]">{tx.date} {tx.time}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {tx.items?.length || 0} hardware item(s) • Subtotal: Rs. {tx.subtotal.toLocaleString("en-LK")}
                </div>

                {tx.discount > 0 && (
                  <div className="text-[11px] text-emerald-400 font-bold font-mono">
                    2% Bulk Discount Saved: -Rs. {tx.discount.toLocaleString("en-LK")}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {tx.paymentMethod}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(tx)}
                    className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    Reprint Slip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Receipt No</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6 text-right">Gross Subtotal</th>
                <th className="py-4 px-6 text-right">2% Discount</th>
                <th className="py-4 px-6 text-right">Final Amount</th>
                <th className="py-4 px-6 text-right">Invoice Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-300">
                      {tx.receiptNo}
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                      {tx.date} {tx.time}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{tx.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{tx.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-300">
                      Rs. {tx.subtotal.toLocaleString("en-LK")}
                    </td>
                    <td className="py-4 px-6 text-right font-mono">
                      {tx.discount > 0 ? (
                        <span className="text-emerald-400 font-bold">
                          -Rs. {tx.discount.toLocaleString("en-LK")}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-white text-sm">
                      Rs. {tx.finalAmount.toLocaleString("en-LK")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(tx)}
                        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                      >
                        Reprint Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
