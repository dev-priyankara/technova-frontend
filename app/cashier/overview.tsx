"use client";

import React, { useState } from "react";
import {
  mockCashierShift,
  mockPOSTransactions,
  type POSTransaction,
} from "@/lib/cashierData";
import ReceiptModal from "@/app/cashier/receiptModal";
import { type CashierSection } from "./sidebar";

interface CashierOverviewProps {
  onNavigate: (section: CashierSection) => void;
}

export default function CashierOverview({ onNavigate }: CashierOverviewProps) {
  const [shift] = useState(mockCashierShift);
  const [transactions] = useState<POSTransaction[]>(mockPOSTransactions);
  const [selectedReceipt, setSelectedReceipt] = useState<POSTransaction | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Register Active Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Register Open & Active
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 font-mono">
                {shift.registerId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              POS Cashier Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Welcome, <span className="text-white font-bold">{shift.cashierName}</span>. Your register is ready for customer walk-in billing, price checks, and receipt generation.
            </p>
          </div>

          {/* Primary Quick Launch POS Button */}
          <div className="shrink-0">
            <button
              onClick={() => onNavigate("pos")}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/40 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95 group text-left"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 group-hover:scale-110 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-blue-200">
                  Walk-in Retail Sale
                </span>
                <span className="text-base font-extrabold">Open POS Counter</span>
              </div>
            </button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Shift Financial Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Today's Sales */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Today&apos;s Gross Sales</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">
              Rs
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            Rs. {shift.totalSales.toLocaleString("en-LK")}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <span>+{shift.transactionCount} Walk-in Receipts Issued</span>
          </div>
        </div>

        {/* Cash In Drawer */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Cash in Drawer</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            Rs. {shift.expectedCashInDrawer.toLocaleString("en-LK")}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Float: Rs. {shift.openingFloat.toLocaleString("en-LK")}</span>
            <span className="text-emerald-400">Cash: Rs. {shift.cashSales.toLocaleString("en-LK")}</span>
          </div>
        </div>

        {/* 2% Discounts Issued */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">2% Volume Discounts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-bold">
              %
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            Rs. {shift.discountsTotal.toLocaleString("en-LK")}
          </div>
          <div className="mt-1 text-xs text-purple-300">
            <span>Auto Applied (&gt; LKR 400k)</span>
          </div>
        </div>

        {/* Card & Bank Collections */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Card / EDC Terminals</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            Rs. {(shift.cardSales + shift.bankTransferSales).toLocaleString("en-LK")}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            <span>Card: {shift.cardSales.toLocaleString("en-LK")} | Bank: {shift.bankTransferSales.toLocaleString("en-LK")}</span>
          </div>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate("pos")}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-blue-500/40 hover:bg-white/10 transition flex items-center gap-3 text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition">
              POS Terminal
            </span>
            <span className="text-[10px] text-slate-400">Bill Walk-in Customer</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("products")}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-blue-500/40 hover:bg-white/10 transition flex items-center gap-3 text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition">
              Price Checker
            </span>
            <span className="text-[10px] text-slate-400">Stock & Specs Lookup</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("transactions")}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-blue-500/40 hover:bg-white/10 transition flex items-center gap-3 text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 group-hover:scale-110 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition">
              Past Receipts
            </span>
            <span className="text-[10px] text-slate-400">Reprint 80mm Invoice</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("shift")}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-blue-500/40 hover:bg-white/10 transition flex items-center gap-3 text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 group-hover:scale-110 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition">
              Cash Drawer
            </span>
            <span className="text-[10px] text-slate-400">Shift Reconciliation</span>
          </div>
        </button>
      </div>

      {/* Today's Recent Completed POS Sales Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-black text-white">
              Today&apos;s Completed POS Bills
            </h2>
            <p className="text-xs text-slate-400">
              Recent counter transactions settled by this register. Click any bill to reprint the 80mm thermal receipt.
            </p>
          </div>
          <button
            onClick={() => onNavigate("transactions")}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">2% Discount</th>
                <th className="py-3 px-3 text-right">Final Amount</th>
                <th className="py-3 px-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-300">
                    {tx.receiptNo}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {tx.time}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {tx.customerName}
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
                      className="rounded-lg bg-blue-600/30 border border-blue-500/30 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition"
                    >
                      Reprint
                    </button>
                  </td>
                </tr>
              ))}
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
