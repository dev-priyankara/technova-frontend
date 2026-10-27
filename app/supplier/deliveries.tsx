"use client";

import React, { useState } from "react";
import {
  mockDeliveryDispatches,
  mockShopBranches,
  type DeliveryDispatch,
} from "@/lib/supplierData";

export default function SupplierDeliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryDispatch[]>(mockDeliveryDispatches);
  const [showModal, setShowModal] = useState(false);

  // New Dispatch Form State
  const [targetShop, setTargetShop] = useState(mockShopBranches[0].name);
  const [carrier, setCarrier] = useState("Pronto Lanka Inter-City Courier");
  const [units, setUnits] = useState(10);
  const [value, setValue] = useState(850000);
  const [driverName, setDriverName] = useState("Kamal Wickramasinghe");
  const [driverPhone, setDriverPhone] = useState("+94 77 334 1122");

  function updateStatus(id: string, newStatus: DeliveryDispatch["status"]) {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  }

  function handleCreateDispatch(e: React.FormEvent) {
    e.preventDefault();
    const branch = mockShopBranches.find((b) => b.name === targetShop) || mockShopBranches[0];
    const created: DeliveryDispatch = {
      id: `dsp-${Date.now()}`,
      dispatchNo: `DSP-NANO-2025-${Math.floor(883 + Math.random() * 100)}`,
      requestNo: `REQ-TECHNOVA-2025-${Math.floor(100 + Math.random() * 900)}`,
      destinationShop: branch.name,
      shopAddress: branch.address,
      shopContact: `${branch.managerName} (${branch.phone})`,
      carrier,
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      dispatchDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      estimatedArrival: "Tomorrow, 02:00 PM",
      totalUnits: units,
      totalValue: value,
      status: "Dispatched",
      driverName,
      driverPhone,
    };

    setDeliveries([created, ...deliveries]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🚚 Inter-Branch Dispatch & Logistics
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Retail Shop Deliveries & Dispatches
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Track stock consignments en route to TECHNOVA store counters across Colombo, Kandy, and Galle branches.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Shop Dispatch</span>
        </button>
      </div>

      {/* Dispatches Cards Grid */}
      <div className="space-y-4">
        {deliveries.map((dsp) => (
          <div
            key={dsp.id}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-300">
                    {dsp.dispatchNo}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Ref PO: {dsp.requestNo}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {dsp.destinationShop}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  📍 {dsp.shopAddress}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${
                    dsp.status === "Delivered & Verified"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : dsp.status === "In-Transit"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
                      : dsp.status === "Dispatched"
                      ? "bg-blue-500/10 text-blue-300 border-blue-400/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {dsp.status}
                </span>
              </div>
            </div>

            {/* Logistics & Driver Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Carrier & Logistics
                </span>
                <span className="font-semibold text-white mt-0.5 block truncate">
                  {dsp.carrier}
                </span>
                <span className="font-mono text-[11px] text-blue-400 mt-0.5 block">
                  Waybill: {dsp.trackingNumber}
                </span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Shop Receiver Contact
                </span>
                <span className="font-semibold text-white mt-0.5 block truncate">
                  {dsp.shopContact}
                </span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Driver & Transit Vehicle
                </span>
                <span className="font-semibold text-white mt-0.5 block">
                  {dsp.driverName || "Courier Transit"}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  {dsp.driverPhone || "Assigned by Carrier"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Consignment Payload
                </span>
                <span className="font-mono font-bold text-white mt-0.5 block">
                  {dsp.totalUnits} Units
                </span>
                <span className="font-mono text-emerald-400 text-xs block">
                  Rs. {dsp.totalValue.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            {/* Footer with Status Updater */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-4 text-slate-400">
                <span>Dispatched: <strong className="text-white font-mono">{dsp.dispatchDate}</strong></span>
                <span>•</span>
                <span>ETA: <strong className="text-white font-mono">{dsp.estimatedArrival}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Update Status:</span>
                <select
                  value={dsp.status}
                  onChange={(e) => updateStatus(dsp.id, e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-blue-400"
                >
                  <option value="Preparing Dispatch">Preparing Dispatch</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Delivered & Verified">Delivered & Verified</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Dispatch */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Dispatch Consignment to Shop
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Destination Retail Shop Branch *
                </label>
                <select
                  value={targetShop}
                  onChange={(e) => setTargetShop(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  {mockShopBranches.map((b) => (
                    <option key={b.id} value={b.name}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Logistics Carrier *
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                >
                  <option value="Nanotek Express Fleet Vehicle #WP-CAD-4412">Nanotek Express Fleet Vehicle #WP-CAD-4412</option>
                  <option value="Pronto Lanka Inter-City Courier">Pronto Lanka Inter-City Courier</option>
                  <option value="Certis Lanka Secure Transit Logistics">Certis Lanka Secure Transit Logistics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Units Total *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Invoice Value (LKR) *
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Driver / Courier Person
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Generate Dispatch Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

