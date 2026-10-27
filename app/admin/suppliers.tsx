"use client";

import React, { useEffect, useState } from "react";
import { type AdminSupplier } from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "Graphics Cards",
  });

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/suppliers")
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return;
        const mapped: AdminSupplier[] = data.map((s) => ({
          id: s.id,
          companyName: s.company_name,
          contactPerson: s.contact_person,
          email: s.email,
          phone: s.phone || "",
          suppliedCategories: typeof s.supplied_categories === "string" ? s.supplied_categories.split(",").map((c: string) => c.trim()) : [],
          pendingRequests: s.pending_requests || 0,
          status: s.status as any,
        }));
        setSuppliers(mapped);
      })
      .catch((err) => console.warn("Failed to load suppliers from database:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDeleteSupplier(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove supplier "${name}" from database?`)) return;
    try {
      await apiFetch<any>(`/suppliers/${id}`, { method: "DELETE" });
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setToast(`Supplier "${name}" removed successfully.`);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete supplier.");
    }
  }

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await apiFetch<any>("/suppliers", {
        method: "POST",
        body: JSON.stringify({
          company_name: form.companyName.trim(),
          contact_person: form.contactPerson.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          supplied_categories: form.category,
        }),
      });

      const newSup: AdminSupplier = {
        id: created.id,
        companyName: created.company_name,
        contactPerson: created.contact_person,
        email: created.email,
        phone: created.phone,
        suppliedCategories: [form.category],
        pendingRequests: 0,
        status: "Active",
      };

      setSuppliers([...suppliers, newSup]);
      setIsModalOpen(false);
      setForm({ companyName: "", contactPerson: "", email: "", phone: "", category: "Graphics Cards" });
      setToast("Supplier onboarded successfully in MySQL database!");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to onboard supplier.");
    }
  }

  function handleSendRequest(companyName: string) {
    setToast(`Supply replenishment purchase order dispatched to ${companyName}!`);
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🏭 Procurement & Supply Chain
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Supplier Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Manage authorized hardware distributors, purchase orders, and stock delivery confirmations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <span>+ Onboard New Supplier</span>
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-base font-black text-white">
                  🏢
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    ● {sup.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSupplier(sup.id, sup.companyName)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/10 text-xs"
                    title="Delete Supplier"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="mt-3 text-base font-bold text-white">{sup.companyName}</h3>
              <p className="text-xs text-slate-400">Contact: {sup.contactPerson}</p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span>📞</span>
                  <span>{sup.phone}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Supplied Categories:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sup.suppliedCategories.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleSendRequest(sup.companyName)}
                className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all text-center"
              >
                Send Supply Request ({sup.pendingRequests} Pending)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Onboard Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Onboard Hardware Supplier</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Redline Components PLC"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gamini Perera"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="supply@company.lk"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+94 11 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Component Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graphic Cards & Processors"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

