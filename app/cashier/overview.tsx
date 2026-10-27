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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Register Open & Active
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 font-mono">
              {shift.registerId}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            POS Cashier Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Welcome back, <span className="text-white font-bold">{shift.cashierName}</span>. Your register is ready for customer walk-in billing, price checks, and receipt generation.
          </p>
        </div>

        {/* Primary Quick Launch POS Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("pos")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>⚡</span>
            <span>Open POS Counter</span>
          </button>
        </div>
      </div>

      {/* Shift Financial Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Today's Sales */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Gross Sales</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-white font-mono">
            Rs. {shift.totalSales.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            +{shift.transactionCount} Walk-in Receipts
          </div>
        </div>

        {/* Cash In Drawer */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cash in Drawer</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            Rs. {shift.expectedCashInDrawer.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Float: Rs. {shift.openingFloat.toLocaleString("en-LK")}
          </div>
        </div>

        {/* 2% Discounts Issued */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">2% Volume Discounts</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-blue-400 font-mono">
            Rs. {shift.discountsTotal.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-blue-300 mt-0.5">
            Auto Applied (&gt; 400k LKR)
          </div>
        </div>

        {/* Card & Bank Collections */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Card / EDC Terminals</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-white font-mono">
            Rs. {(shift.cardSales + shift.bankTransferSales).toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Card + Bank Settlement
          </div>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigate("pos")}
          className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 8h10" />
              <path d="M7 12h10" />
              <path d="M7 16h6" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors">
              POS Terminal
            </span>
            <span className="text-[10px] text-slate-400">Bill Walk-in Customer</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("products")}
          className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors">
              Price Checker
            </span>
            <span className="text-[10px] text-slate-400">Stock & Specs Lookup</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("transactions")}
          className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors">
              Past Receipts
            </span>
            <span className="text-[10px] text-slate-400">Reprint 80mm Invoice</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("shift")}
          className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-blue-300 transition-colors">
              Cash Drawer
            </span>
            <span className="text-[10px] text-slate-400">Shift Reconciliation</span>
          </div>
        </button>
      </div>

      {/* Today's Recent Completed POS Sales Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white">
              Today&apos;s Completed POS Bills
            </h2>
            <p className="text-xs text-slate-400">
              Recent counter transactions settled by this register. Click any bill to reprint the thermal slip.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("transactions")}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Transactions →</span>
          </button>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-blue-300">{tx.receiptNo}</span>
                <span className="font-mono font-black text-white text-sm">
                  Rs. {tx.finalAmount.toLocaleString("en-LK")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Customer: <strong>{tx.customerName}</strong></span>
                <span className="font-mono text-slate-400 text-[11px]">{tx.time}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Subtotal: Rs. {tx.subtotal.toLocaleString("en-LK")}</span>
                {tx.discount > 0 && (
                  <span className="text-emerald-400 font-bold font-mono">
                    2% Off: -Rs. {tx.discount.toLocaleString("en-LK")}
                  </span>
                )}
              </div>

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
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Receipt No</th>
                <th className="py-4 px-6">Time</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6 text-right">Subtotal</th>
                <th className="py-4 px-6 text-right">2% Discount</th>
                <th className="py-4 px-6 text-right">Final Net</th>
                <th className="py-4 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-blue-300">
                    {tx.receiptNo}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                    {tx.time}
                  </td>
                  <td className="py-4 px-6 font-medium text-white">
                    {tx.customerName}
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
