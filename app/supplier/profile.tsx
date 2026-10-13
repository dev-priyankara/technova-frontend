"use client";

import React, { useState } from "react";
import {
  mockSupplierProfile,
  type SupplierProfile,
} from "@/lib/supplierData";

export default function SupplierProfile() {
  const [profile, setProfile] = useState<SupplierProfile>(mockSupplierProfile);
  const [contactPerson, setContactPerson] = useState(profile.contactPerson);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setProfile({
      ...profile,
      contactPerson,
      phone,
      email,
      address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
            🏢 Authorized Vendor Credentials
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Distributor Profile & Agreements
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Official distributor corporate details, authorized brand distribution licenses, and settlement payout credentials.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-right">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">
            Vendor Status
          </span>
          <span className="text-sm font-black text-white">
            {profile.contractStatus}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300">
          Vendor profile changes saved successfully!
        </div>
      )}

      {/* Main Profile Form & Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Form: Contact Info (cols 7) */}
        <form onSubmit={handleSave} className="md:col-span-7 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Commercial & Contact Information
          </h2>

          <div>
            <label className="block text-slate-400 mb-1">Company Registered Name</label>
            <input
              type="text"
              disabled
              value={profile.companyName}
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-white opacity-70 cursor-not-allowed font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Vendor Code</label>
              <input
                type="text"
                disabled
                value={profile.vendorCode}
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-white font-mono opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">VAT / Tax Identification</label>
              <input
                type="text"
                disabled
                value={profile.taxId}
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 text-white font-mono opacity-70 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Commercial Liaison / Contact Person</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hotline / Mobile</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Warehouse & Office Address</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-600 py-2.5 font-bold text-white hover:bg-cyan-500 transition shadow"
          >
            Save Profile Changes
          </button>
        </form>

        {/* Right: Bank Details & Authorized Brands (cols 5) */}
        <div className="md:col-span-5 space-y-4 text-xs">
          {/* Payout Banking Details */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
              Financial Payout Credentials
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Direct Bank Settlement Account
            </h3>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5 space-y-2 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Bank Name</span>
                <span className="font-bold text-white">{profile.bankAccount.bankName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Branch</span>
                <span className="text-slate-300">{profile.bankAccount.branch}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Account Number</span>
                <span className="font-bold text-emerald-400">{profile.bankAccount.accountNo}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Payments for accepted replenishment purchase orders are settled directly to this corporate account.
            </p>
          </div>

          {/* Authorized Brands */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
              Distributor Representation
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Authorized Distribution Lines
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {profile.authorizedBrands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300"
                >
                  ✓ {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

