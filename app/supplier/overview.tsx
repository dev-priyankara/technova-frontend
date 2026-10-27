"use client";

import React, { useState } from "react";
import {
  mockSupplierProfile,
  mockSupplierProducts,
  mockRestockRequests,
  mockDeliveryDispatches,
  mockReturnedProducts,
  type RestockRequest,
} from "@/lib/supplierData";
import { type SupplierSection } from "./sidebar";

interface SupplierOverviewProps {
  onNavigate: (section: SupplierSection) => void;
}

export default function SupplierOverview({ onNavigate }: SupplierOverviewProps) {
  const [profile] = useState(mockSupplierProfile);
  const [products] = useState(mockSupplierProducts);
  const [requests, setRequests] = useState<RestockRequest[]>(mockRestockRequests);
  const [deliveries] = useState(mockDeliveryDispatches);
  const [returns] = useState(mockReturnedProducts);

  const pendingRequests = requests.filter((r) => r.status === "Pending Supplier Approval");
  const inTransitDeliveries = deliveries.filter(
    (d) => d.status === "In-Transit" || d.status === "Preparing Dispatch"
  );
  const pendingRMAs = returns.filter((r) => r.status === "Pending Inspection");

  function acceptRequest(id: string) {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "Accepted & Preparing" } : r
      )
    );
    alert("Shop restock request accepted! Added to dispatch queue.");
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome / Distributor Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                Authorized Distributor Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {profile.companyName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Distributor ID: <strong className="text-white font-mono">{profile.vendorCode}</strong> • Direct wholesale inventory pipeline & fulfillment for TECHNOVA retail stores.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate("products")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Dispatch Stock to Shops</span>
            </button>

            <button
              onClick={() => onNavigate("requests")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800/80 px-5 py-3.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
            >
              <span>Restock Orders ({pendingRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      </div>

      {/* Critical Shop Low-Stock Warning Banner */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 font-bold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-red-200">
              Low-Stock Replenishment Alert from Store Owners
            </h3>
            <p className="text-xs text-red-300/80 mt-0.5">
              TECHNOVA Flagship (Colombo) ran out of Samsung 990 PRO SSDs and Kandy branch has only 1 Ryzen 7800X3D unit left.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("requests")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/30 border border-red-400/40 px-4 py-2 text-xs font-black text-red-100 hover:bg-red-500/50 transition shrink-0"
        >
          <span>Fulfill Store Restock</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("products")}
          className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl cursor-pointer hover:border-blue-500/40 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Catalog SKUs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold">
              📦
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            {products.length} Hardware SKUs
          </div>
          <div className="mt-1 text-xs text-slate-300">
            <span>Wholesale inventory active</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate("requests")}
          className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl cursor-pointer hover:border-amber-500/40 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold">
              📥
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            {pendingRequests.length} Restock POs
          </div>
          <div className="mt-1 text-xs text-amber-300 font-mono">
            <span>Value: Rs. {pendingRequests.reduce((s, r) => s + r.totalEstValue, 0).toLocaleString("en-LK")}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate("deliveries")}
          className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl cursor-pointer hover:border-blue-500/40 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Dispatches Active</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-bold">
              🚚
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            {inTransitDeliveries.length} Shipments
          </div>
          <div className="mt-1 text-xs text-blue-300">
            <span>En route to Galle & Kandy</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate("returns")}
          className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl cursor-pointer hover:border-purple-500/40 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Returns & RMAs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-bold">
              🔄
            </div>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">
            {returns.length} Returned Items
          </div>
          <div className="mt-1 text-xs text-purple-300">
            <span>{pendingRMAs.length} awaiting QA testing</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Store Restock Requests & Active Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Store Owner Restock Inquiries
              </h2>
              <p className="text-xs text-slate-300">
                Replenishment purchase orders sent when shop stocks drop low.
              </p>
            </div>
            <button
              onClick={() => onNavigate("requests")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All ({requests.length})</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 hover:border-white/20 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-300 block">
                      {req.requestNo}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {req.shopBranch}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border self-start sm:self-auto ${
                      req.urgency.startsWith("Critical")
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : req.urgency.startsWith("High")
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {req.urgency}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 bg-black/20 p-2.5 rounded-xl">
                  {req.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate pr-2">
                        {it.requestedQty}x {it.productName}
                      </span>
                      <span className="font-mono text-slate-300 shrink-0">
                        Shop stock: {it.currentShopStock} units
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-300 block">Order Valuation</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Rs. {req.totalEstValue.toLocaleString("en-LK")}
                    </span>
                  </div>

                  {req.status === "Pending Supplier Approval" ? (
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
                    >
                      Accept & Dispatch
                    </button>
                  ) : (
                    <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Branch Deliveries
              </h2>
              <p className="text-xs text-slate-300">
                Live transit tracking to store counters.
              </p>
            </div>
            <button
              onClick={() => onNavigate("deliveries")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              All Deliveries
            </button>
          </div>

          <div className="space-y-3">
            {deliveries.map((dsp) => (
              <div
                key={dsp.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-300">
                    {dsp.dispatchNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      dsp.status === "In-Transit"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
                        : dsp.status === "Delivered & Verified"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {dsp.status}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="font-bold text-white">{dsp.destinationShop}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Carrier: {dsp.carrier}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    Waybill: {dsp.trackingNumber}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-slate-300">
                  <span>Units: {dsp.totalUnits} items</span>
                  <span className="text-slate-300">ETA: {dsp.estimatedArrival}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

