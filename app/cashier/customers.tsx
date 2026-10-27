"use client";

import React, { useState, useMemo } from "react";
import {
  mockWalkInCustomers,
  type WalkInCustomer,
} from "@/lib/cashierData";
import { type CashierSection } from "./sidebar";

interface CashierCustomersProps {
  onNavigate?: (section: CashierSection) => void;
}

export default function CashierCustomers({ onNavigate }: CashierCustomersProps) {
  const [customers, setCustomers] = useState<WalkInCustomer[]>(mockWalkInCustomers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Name and phone number are required.");
      return;
    }

    const created: WalkInCustomer = {
      id: `cust-walkin-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || "Colombo",
      totalVisits: 1,
      totalSpent: 0,
      lastPurchaseDate: new Date().toISOString().split("T")[0],
    };

    setCustomers([created, ...customers]);
    setShowModal(false);
    setName("");
    setPhone("");
    setCity("");
    setEmail("");
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            👥 Walk-in Customer Directory
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Walk-in & Regular Clients
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Keep track of physical store customers, link phone numbers to receipts for warranty claims, and register new shoppers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span>+</span>
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Registered Walk-in Clients ({filtered.length} found)
        </span>

        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer mobile number or name..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Cards / Table Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No walk-in customers found.</div>
          ) : (
            filtered.map((cust) => (
              <div key={cust.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <span>{cust.name}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    Rs. {cust.totalSpent.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono">{cust.phone}</span>
                  <span>📍 {cust.city}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-slate-400">
                  <span>{cust.totalVisits} visits • Last: {cust.lastPurchaseDate}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("pos")}
                    className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    Bill Customer →
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
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Phone / Contact</th>
                <th className="py-4 px-6">City / Area</th>
                <th className="py-4 px-6 text-center">In-Store Visits</th>
                <th className="py-4 px-6 text-right">Lifetime Volume</th>
                <th className="py-4 px-6 text-center">Last Purchase</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customers match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300 font-bold text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{cust.name}</div>
                          {cust.email && <div className="text-[10px] text-slate-400 font-normal">{cust.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {cust.phone}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {cust.city}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-white font-mono">
                        {cust.totalVisits} visits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-emerald-400 text-sm">
                      Rs. {cust.totalSpent.toLocaleString("en-LK")}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-300 font-mono text-[11px]">
                      {cust.lastPurchaseDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate?.("pos")}
                        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                      >
                        Bill Customer →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-white">
                  Add Walk-in Customer
                </h3>
                <p className="text-xs text-slate-400">Save client details for invoice and warranty</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo 03"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
