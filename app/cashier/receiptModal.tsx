"use client";

import React from "react";
import { type POSTransaction } from "@/lib/cashierData";

interface ReceiptModalProps {
  transaction: POSTransaction | null;
  onClose: () => void;
}

export default function ReceiptModal({
  transaction,
  onClose,
}: ReceiptModalProps) {
  if (!transaction) return null;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-slate-900 shadow-2xl p-6 text-slate-100 my-8">
        {/* Actions bar at top of modal */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>80mm POS Thermal Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 80mm Printable Paper Receipt Area */}
        <div
          id="printable-receipt"
          className="bg-white text-black p-6 rounded-lg font-mono text-[11px] leading-tight shadow-inner"
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
            <h2 className="text-base font-black tracking-widest uppercase">
              TECHNOVA COMPUTERS
            </h2>
            <p className="text-[10px] text-gray-600">
              No. 142, Galle Road, Bambalapitiya, Colombo 03
            </p>
            <p className="text-[10px] text-gray-600">
              Hotline: +94 11 234 5678 | VAT Reg: LK-992019
            </p>
            <p className="text-[10px] font-bold text-gray-800">
              ORIGINAL RETAIL TAX INVOICE
            </p>
          </div>

          {/* Metadata */}
          <div className="py-2.5 border-b border-dashed border-gray-400 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Receipt No:</span>
              <span className="font-bold">{transaction.receiptNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span>{transaction.date} {transaction.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Register / Shift:</span>
              <span>{transaction.registerId} (Shift #14)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cashier:</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-bold">{transaction.customerName}</span>
            </div>
            {transaction.customerPhone && transaction.customerPhone !== "N/A" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span>{transaction.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Items Header */}
          <div className="py-2 border-b border-gray-300 font-bold grid grid-cols-12 text-[10px]">
            <span className="col-span-6">Item / Warranty</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-4 text-right">Amount (LKR)</span>
          </div>

          {/* Items List */}
          <div className="py-2 space-y-2 border-b border-dashed border-gray-400">
            {transaction.items.map((item, index) => (
              <div key={index} className="text-[10px]">
                <div className="font-bold">{item.name}</div>
                <div className="text-[9px] text-gray-500 flex justify-between">
                  <span>SKU: {item.sku}</span>
                  <span>{item.warranty}</span>
                </div>
                <div className="grid grid-cols-12 text-gray-700">
                  <span className="col-span-6 text-[9px]">
                    @{item.price.toLocaleString("en-LK")}
                  </span>
                  <span className="col-span-2 text-center font-bold">
                    x{item.qty}
                  </span>
                  <span className="col-span-4 text-right font-bold text-black">
                    {item.lineTotal.toLocaleString("en-LK")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {transaction.subtotal.toLocaleString("en-LK")}</span>
            </div>

            {/* 2% Mandatory Discount breakdown */}
            {transaction.discount > 0 ? (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Auto 2% Discount (&gt;400k):</span>
                <span>- Rs. {transaction.discount.toLocaleString("en-LK")}</span>
              </div>
            ) : (
              <div className="flex justify-between text-gray-500 text-[10px]">
                <span>Discount:</span>
                <span>Rs. 0 (Subtotal &le; 400k)</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-300">
              <span>NET PAYABLE:</span>
              <span>Rs. {transaction.finalAmount.toLocaleString("en-LK")}</span>
            </div>
          </div>

          {/* Payment Method & Change */}
          <div className="py-2 space-y-1 text-[10px] border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Mode:</span>
              <span className="font-bold">{transaction.paymentMethod}</span>
            </div>

            {transaction.paymentMethod === "Cash" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Tendered:</span>
                  <span>Rs. {(transaction.cashTendered || transaction.finalAmount).toLocaleString("en-LK")}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Change Given:</span>
                  <span>Rs. {(transaction.changeDue || 0).toLocaleString("en-LK")}</span>
                </div>
              </>
            )}

            {transaction.paymentMethod !== "Cash" && transaction.cardRef && (
              <div className="flex justify-between">
                <span className="text-gray-600">Card Ref / Auth:</span>
                <span className="font-bold">{transaction.cardRef}</span>
              </div>
            )}
          </div>

          {/* Warranty Terms & Barcode */}
          <div className="pt-3 text-center space-y-2 text-[9px] text-gray-600">
            <p>
              Hardware warranty applies strictly per manufacturer serial numbers.
              Physical damages, burnt components, and lightning strikes void warranty.
            </p>
            <div className="py-1 tracking-widest font-black text-black text-xs">
              ||| | ||||| |||| || |||||| | |||
            </div>
            <p className="font-bold text-gray-800">
              THANK YOU FOR SHOPPING AT TECHNOVA!
            </p>
            <p className="text-[8px] text-gray-400">
              System Powered by TECHNOVA Next.js POS Engine
            </p>
          </div>
        </div>

        {/* Modal Bottom Buttons */}
        <div className="mt-4 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition"
          >
            Print Receipt (80mm)
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

