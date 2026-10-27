"use client";

import React, { useEffect, useState } from "react";
import { type AdminSupplier, mockAdminSuppliers } from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>(mockAdminSuppliers);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<AdminSupplier | null>(null);
  const [editSupplier, setEditSupplier] = useState<AdminSupplier | null>(null);
  const [poSupplier, setPoSupplier] = useState<AdminSupplier | null>(null);

  // Add Form
  const [addForm, setAddForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "Graphics Cards",
  });

  // Purchase Order Form
  const [poForm, setPoForm] = useState({
    itemCategory: "Graphics Cards",
    requestedQty: 25,
    urgency: "Normal" as "Normal" | "Urgent Expedited",
    notes: "Consignment expected within 5 business days",
  });

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/suppliers")
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped: AdminSupplier[] = data.map((s) => ({
          id: s.id,
          companyName: s.company_name,
          contactPerson: s.contact_person,
          email: s.email,
          phone: s.phone || "",
          suppliedCategories:
            typeof s.supplied_categories === "string"
              ? s.supplied_categories.split(",").map((c: string) => c.trim())
              : Array.isArray(s.supplied_categories)
              ? s.supplied_categories
              : ["Computer Hardware"],
          pendingRequests: s.pending_requests || 0,
          status: s.status as any || "Active",
        }));
        setSuppliers(mapped);
      })
      .catch((err) => console.warn("Failed to load suppliers from database, using mock data:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = suppliers.filter(
    (s) =>
      search.trim() === "" ||
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.suppliedCategories.some((cat) => cat.toLowerCase().includes(search.toLowerCase())),
  );

  // DELETE
  async function handleDeleteSupplier(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove supplier "${name}" from the system?`)) return;
    try {
      await apiFetch<any>(`/suppliers/${id}`, { method: "DELETE" });
    } catch {
      // Local fallback
    }
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    if (viewSupplier?.id === id) setViewSupplier(null);
    if (editSupplier?.id === id) setEditSupplier(null);
    if (poSupplier?.id === id) setPoSupplier(null);

    setToast(`Supplier "${name}" removed successfully.`);
    setTimeout(() => setToast(""), 3500);
  }

  // CREATE
  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await apiFetch<any>("/suppliers", {
        method: "POST",
        body: JSON.stringify({
          company_name: addForm.companyName.trim(),
          contact_person: addForm.contactPerson.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim(),
          supplied_categories: addForm.category,
        }),
      });

      const newSup: AdminSupplier = {
        id: created.id || `sup-${Date.now()}`,
        companyName: created.company_name || addForm.companyName.trim(),
        contactPerson: created.contact_person || addForm.contactPerson.trim(),
        email: created.email || addForm.email.trim(),
        phone: created.phone || addForm.phone.trim(),
        suppliedCategories: [addForm.category],
        pendingRequests: 0,
        status: "Active",
      };

      setSuppliers([newSup, ...suppliers]);
    } catch {
      // Local fallback
      const fallbackSup: AdminSupplier = {
        id: `sup-${Date.now()}`,
        companyName: addForm.companyName.trim(),
        contactPerson: addForm.contactPerson.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim(),
        suppliedCategories: [addForm.category],
        pendingRequests: 0,
        status: "Active",
      };
      setSuppliers([fallbackSup, ...suppliers]);
    }

    setIsAddModalOpen(false);
    setAddForm({ companyName: "", contactPerson: "", email: "", phone: "", category: "Graphics Cards" });
    setToast("Supplier onboarded successfully!");
    setTimeout(() => setToast(""), 4000);
  }

  // UPDATE
  async function handleUpdateSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!editSupplier) return;

    try {
      await apiFetch(`/suppliers/${editSupplier.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          company_name: editSupplier.companyName.trim(),
          contact_person: editSupplier.contactPerson.trim(),
          email: editSupplier.email.trim(),
          phone: editSupplier.phone.trim(),
          supplied_categories: editSupplier.suppliedCategories.join(", "),
          status: editSupplier.status,
        }),
      });
    } catch {}

    setSuppliers((prev) =>
      prev.map((s) => (s.id === editSupplier.id ? { ...editSupplier } : s)),
    );
    setEditSupplier(null);
    setToast(`Supplier "${editSupplier.companyName}" updated successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  // SUBMIT PURCHASE ORDER (PO)
  function handleSendPurchaseOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!poSupplier) return;

    const updatedRequests = (poSupplier.pendingRequests || 0) + 1;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === poSupplier.id ? { ...s, pendingRequests: updatedRequests } : s,
      ),
    );

    setToast(
      `Purchase Order #${Date.now().toString().slice(-5)} (${poForm.requestedQty} units, ${poForm.urgency}) dispatched to ${poSupplier.companyName}!`,
    );
    setPoSupplier(null);
    setTimeout(() => setToast(""), 4500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Supplier Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Manage authorized hardware distributors, purchase orders, restocking lead times, and vendor verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Onboard New Supplier
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Total Authorized Vendors: <strong className="text-white font-mono">{suppliers.length}</strong>
          </span>
        </div>

        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search supplier, contact, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400 text-xs">
            No suppliers found matching your query.
          </div>
        ) : (
          filtered.map((sup) => (
            <div
              key={sup.id}
              className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-blue-400/40 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-base font-black text-white">
                    🏢
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        sup.status === "Active"
                          ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-400/30 text-amber-300"
                      }`}
                    >
                      ● {sup.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setEditSupplier({ ...sup })}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs"
                      title="Edit Supplier"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSupplier(sup.id, sup.companyName)}
                      className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all text-xs"
                      title="Delete Supplier"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold text-white">{sup.companyName}</h3>
                <p className="text-xs text-slate-400">Rep: <strong className="text-slate-200">{sup.contactPerson}</strong></p>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
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
                    Supplied Hardware:
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

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pending Replenishments:</span>
                  <span className="font-mono font-bold text-amber-300">{sup.pendingRequests} Orders</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setViewSupplier(sup)}
                    className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all text-center"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPoSupplier(sup);
                      setPoForm({
                        itemCategory: sup.suppliedCategories[0] || "Graphics Cards",
                        requestedQty: 25,
                        urgency: "Normal",
                        notes: "Standard warehouse restock consignment",
                      });
                    }}
                    className="rounded-xl bg-blue-600/90 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-all text-center shadow-md shadow-blue-600/20"
                  >
                    Send PO
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: View Supplier (READ) */}
      {viewSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">{viewSupplier.companyName}</h3>
                <span className="text-xs text-blue-400 font-mono">Supplier ID: {viewSupplier.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewSupplier(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Representative:</span>
                <span className="text-white font-bold">{viewSupplier.contactPerson}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Official Email:</span>
                <span className="text-slate-200 font-mono">{viewSupplier.email}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Hotline / Phone:</span>
                <span className="text-slate-200 font-mono">{viewSupplier.phone}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">● {viewSupplier.status}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Pending Orders:</span>
                <span className="text-amber-300 font-mono font-bold">{viewSupplier.pendingRequests} purchase requests</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Contract Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {viewSupplier.suppliedCategories.map((cat) => (
                    <span key={cat} className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-slate-300">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const s = viewSupplier;
                  setViewSupplier(null);
                  setEditSupplier({ ...s });
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setViewSupplier(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Supplier (UPDATE) */}
      {editSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit Supplier Details</h3>
                <span className="text-xs text-blue-400 font-mono">{editSupplier.companyName}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditSupplier(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Company / Distributor Name</label>
                <input
                  type="text"
                  required
                  value={editSupplier.companyName}
                  onChange={(e) => setEditSupplier({ ...editSupplier, companyName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contact Representative</label>
                <input
                  type="text"
                  required
                  value={editSupplier.contactPerson}
                  onChange={(e) => setEditSupplier({ ...editSupplier, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editSupplier.email}
                    onChange={(e) => setEditSupplier({ ...editSupplier, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editSupplier.phone}
                    onChange={(e) => setEditSupplier({ ...editSupplier, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Supplied Categories (comma separated)</label>
                <input
                  type="text"
                  required
                  value={editSupplier.suppliedCategories.join(", ")}
                  onChange={(e) =>
                    setEditSupplier({
                      ...editSupplier,
                      suppliedCategories: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Verification Status</label>
                <select
                  value={editSupplier.status}
                  onChange={(e) =>
                    setEditSupplier({ ...editSupplier, status: e.target.value as "Active" | "Pending Verification" })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="Active">Active Partner</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditSupplier(null)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Dispatch Purchase Order (PO) */}
      {poSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Create Purchase Order (PO)</h3>
                <span className="text-xs text-blue-400 font-mono">Vendor: {poSupplier.companyName}</span>
              </div>
              <button
                type="button"
                onClick={() => setPoSupplier(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendPurchaseOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Hardware Category to Restock</label>
                <select
                  value={poForm.itemCategory}
                  onChange={(e) => setPoForm({ ...poForm, itemCategory: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  {poSupplier.suppliedCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="General Hardware Components">General Hardware Components</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poForm.requestedQty}
                    onChange={(e) => setPoForm({ ...poForm, requestedQty: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Shipping Priority</label>
                  <select
                    value={poForm.urgency}
                    onChange={(e) => setPoForm({ ...poForm, urgency: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Normal">Normal Sea/Air Freight</option>
                    <option value="Urgent Expedited">⚡ Urgent Expedited Air Freight</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Consignment Notes & Instructions</label>
                <textarea
                  rows={2}
                  value={poForm.notes}
                  onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPoSupplier(null)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Onboard New Supplier (CREATE) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Onboard Hardware Supplier</h3>
                <p className="text-xs text-slate-400">Add an authorized distributor to the supply chain</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Company / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gigabyte Sri Lanka Direct"
                  value={addForm.companyName}
                  onChange={(e) => setAddForm({ ...addForm, companyName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contact Representative</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Perera"
                  value={addForm.contactPerson}
                  onChange={(e) => setAddForm({ ...addForm, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@vendor.lk"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+94 11 234 5678"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Primary Product Category</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="Graphics Cards">Graphics Cards</option>
                  <option value="Processors">Processors</option>
                  <option value="Memory & RAM">Memory & RAM</option>
                  <option value="Motherboards">Motherboards</option>
                  <option value="Storage & SSD">Storage & SSD</option>
                  <option value="Laptops & Notebooks">Laptops & Notebooks</option>
                  <option value="Power Supplies">Power Supplies</option>
                  <option value="Peripherals">Peripherals</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Onboard Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
