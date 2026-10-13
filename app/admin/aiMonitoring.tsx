"use client";

import React, { useState } from "react";

export default function AdminAIMonitoring() {
  const [toggleActive, setToggleActive] = useState(true);

  const aiLogs = [
    {
      id: "ai-log-101",
      timestamp: "2026-10-13 13:45",
      budget: "Rs. 450,000",
      intent: "Hardcore 1440p Gaming & Streaming",
      recommended: "ASUS ROG Strix G16 + RTX 4070 Super",
      outcome: "Converted (Cart Added)",
      status: "Success",
    },
    {
      id: "ai-log-102",
      timestamp: "2026-10-13 11:20",
      budget: "Rs. 200,000",
      intent: "Software Engineering & Virtualization",
      recommended: "Ryzen 7 7800X3D + 32GB DDR5 RAM",
      outcome: "Viewed Product Specs",
      status: "Engaged",
    },
    {
      id: "ai-log-103",
      timestamp: "2026-10-12 16:15",
      budget: "Rs. 100,000",
      intent: "Competitive Esports 240Hz Gaming",
      recommended: "ASUS TUF 27\" 165Hz Monitor",
      outcome: "Converted (Checkout Complete)",
      status: "Success",
    },
    {
      id: "ai-log-104",
      timestamp: "2026-10-12 14:00",
      budget: "Rs. 80,000",
      intent: "Ultra-Fast Video Editing Storage Cache",
      recommended: "Samsung 990 PRO 2TB NVMe SSD",
      outcome: "Item Out of Stock Prompted",
      status: "Safety Fallback",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
            🤖 Neural Recommendation Engine
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            AI Product Recommendation Monitor
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Inspect real-time customer recommendation sessions, conversion telemetry, and inventory availability constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-semibold">AI Assistant Engine:</span>
          <button
            type="button"
            onClick={() => setToggleActive(!toggleActive)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              toggleActive
                ? "bg-emerald-500 text-black font-black"
                : "bg-white/10 text-slate-400"
            }`}
          >
            {toggleActive ? "● ONLINE & ACTIVE" : "PAUSED"}
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Inquiries</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            1,248
          </span>
          <span className="text-[10px] text-purple-300 block mt-1">This month</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Conversion Rate</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">
            32.4%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Cart adds via AI</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Attributed Revenue</span>
          <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono mt-1 block">
            Rs. 2,740,000
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Sales driven by AI engine</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Inventory Accuracy</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            100%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Filtered in-stock only</span>
        </div>
      </div>

      {/* AI Telemetry Logs Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-base font-extrabold text-white">Recent Recommendation Telemetry Logs</h2>
          <p className="text-xs text-slate-400">Real-time prompt matches using database catalogue items</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Session ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Budget</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Intent & Usage</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Recommended Hardware</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Outcome</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {aiLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    {log.id}
                    <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                  </td>

                  <td className="px-6 py-4 font-mono text-emerald-400 font-bold">
                    {log.budget}
                  </td>

                  <td className="px-6 py-4 text-slate-200 font-medium">
                    {log.intent}
                  </td>

                  <td className="px-6 py-4 text-white font-bold">
                    {log.recommended}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {log.outcome}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        log.status === "Success"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                          : log.status === "Engaged"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      ● {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

