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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
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
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer mobile number or name..."
          className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:border-blue-500 outline-none backdrop-blur-xl"
        />
      </div>

      {/* Customer Cards / Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Phone / Contact</th>
                <th className="py-3 px-3">City / Area</th>
                <th className="py-3 px-3 text-center">In-Store Visits</th>
                <th className="py-3 px-3 text-right">Lifetime Volume</th>
                <th className="py-3 px-3 text-center">Last Purchase</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-3 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-300 font-bold text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {cust.phone}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {cust.city}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold text-white font-mono">
                      {cust.totalVisits} visits
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    Rs. {cust.totalSpent.toLocaleString("en-LK")}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                    {cust.lastPurchaseDate}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onNavigate?.("pos")}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600/30 border border-blue-500/30 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition"
                    >
                      Bill Customer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Add Walk-in Customer
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

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Bandara"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 077 123 4567"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Email (Optional - for e-invoices)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ruwan@gmail.com"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Maharagama"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5"
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
