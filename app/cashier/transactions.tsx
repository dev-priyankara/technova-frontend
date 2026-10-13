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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by receipt number (e.g. INV-POS-2025), customer name, or phone..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-blue-500 outline-none backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Cash", "Card", "Bank"].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition border ${
                methodFilter === m
                  ? "border-blue-400 bg-blue-600 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Date / Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">2% Discount</th>
                <th className="py-3 px-3 text-right">Final Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-300">
                    {tx.receiptNo}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <div>{tx.date}</div>
                    <div className="font-mono text-[10px]">{tx.time}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    <div>{tx.customerName}</div>
                    <div className="text-[10px] text-slate-400">{tx.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      {tx.items.length} item{tx.items.length > 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    Rs. {tx.subtotal.toLocaleString("en-LK")}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {tx.discount > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        - Rs. {tx.discount.toLocaleString("en-LK")}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-white">
                    Rs. {tx.finalAmount.toLocaleString("en-LK")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/30 border border-blue-500/30 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition shadow"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Reprint</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No transactions match your search query.</p>
          </div>
        )}
      </div>

      {/* 80mm Printable Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}

