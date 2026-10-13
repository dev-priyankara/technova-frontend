"use client";

import React, { useState } from "react";

export default function AdminReports() {
  const [toast, setToast] = useState("");

  const channelBreakdown = [
    { channel: "In-Store POS Counter", amount: 6240000, percentage: 74 },
    { channel: "Online Web Checkout", amount: 2180000, percentage: 26 },
  ];

  const categoryPerformance = [
    { name: "Laptops & Notebooks", sales: 3850000, share: "45.7%" },
    { name: "Graphics Cards (GPUs)", sales: 2150000, share: "25.5%" },
    { name: "Processors (CPUs)", sales: 1320000, share: "15.6%" },
    { name: "Storage & Memory", sales: 1100000, share: "13.2%" },
  ];

  function handleExport(format: string) {
    setToast(`Generating executive ${format} business report... Download starting!`);
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            📊 Analytics & Auditing
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Business & Financial Reports
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Executive revenue breakdown, sales channel proportions, and hardware profit summaries.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleExport("PDF")}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold !text-black shadow-lg hover:bg-blue-50 active:scale-95 transition-all"
          >
            📥 Export PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport("CSV")}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Financial Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Gross Sales MTD</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            Rs. 8,420,000
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">↑ +14.2% vs last month</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Est. Net Gross Margin</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">
            Rs. 1,480,000
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Average Margin: 17.5%</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">POS Bulk Discounts (&gt;400k)</span>
          <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono mt-1 block">
            Rs. 33,540
          </span>
          <span className="text-[10px] text-blue-300 block mt-1">2% Rule Applied 4 times</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Average Ticket Size</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            Rs. 184,500
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">POS & Web blended</span>
        </div>
      </div>

      {/* Two Column Layout: Top Categories + Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
          <h2 className="text-base font-extrabold text-white border-b border-white/10 pb-4">
            Top Performing Categories (Revenue)
          </h2>
          <div className="mt-4 space-y-4">
            {categoryPerformance.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{c.name}</span>
                  <span className="font-mono text-slate-300 font-bold">
                    Rs. {c.sales.toLocaleString("en-LK")} ({c.share})
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: c.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
          <h2 className="text-base font-extrabold text-white border-b border-white/10 pb-4">
            Sales By Transaction Channel
          </h2>
          <div className="mt-4 space-y-4">
            {channelBreakdown.map((ch) => (
              <div key={ch.channel} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{ch.channel}</span>
                  <span className="font-mono text-slate-300 font-bold">
                    Rs. {ch.amount.toLocaleString("en-LK")} ({ch.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-400">
              <span className="font-bold text-white block">Centralized Business Note:</span>
              <p className="mt-0.5">
                Physical counter POS sales update real-time stock simultaneously with online e-commerce reservations to prevent overselling of high-demand computer hardware.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

