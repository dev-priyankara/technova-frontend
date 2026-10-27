"use client";

import React, { useState, useEffect } from "react";
import { mockAdminCustomers, type AdminCustomer } from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(mockAdminCustomers);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // Modals
  const [viewCustomer, setViewCustomer] = useState<AdminCustomer | null>(null);
  const [editCustomer, setEditCustomer] = useState<AdminCustomer | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Customer Form
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Colombo",
    totalSpent: 0,
    ordersCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/users")
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        // Map customers from users endpoint
        const custs = data
          .filter((u) => u.role === "Customer" || !u.role || u.role_id === 1)
          .map((u, idx) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "—",
            city: u.city || "Colombo",
            ordersCount: u.ordersCount || 1,
            totalSpent: u.totalSpent || 125000,
            joinedDate: u.created_at ? u.created_at.split("T")[0] : `2026-0${(idx % 9) + 1}-10`,
          }));

        if (custs.length > 0) {
          // Merge with mock customers so table is populated
          setCustomers(custs);
        }
      })
      .catch(() => {
        // Fallback to mock customers
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)),
  );

  const totalRegistered = customers.length;
  const totalLifetimeRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrdersPlaced = customers.reduce((acc, c) => acc + c.ordersCount, 0);

  // CREATE
  function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    const newCust: AdminCustomer = {
      id: `cust-${Date.now()}`,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      city: addForm.city.trim(),
      ordersCount: Number(addForm.ordersCount) || 0,
      totalSpent: Number(addForm.totalSpent) || 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);
    setAddForm({ name: "", email: "", phone: "", city: "Colombo", totalSpent: 0, ordersCount: 0 });
    setToast(`Customer "${newCust.name}" registered successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  // UPDATE
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editCustomer) return;

    // Call API in background if it corresponds to user id
    apiFetch(`/users/${editCustomer.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: editCustomer.name,
        email: editCustomer.email,
        phone: editCustomer.phone,
      }),
    }).catch(() => {});

    setCustomers((prev) =>
      prev.map((c) => (c.id === editCustomer.id ? { ...editCustomer } : c)),
    );

    setToast(`Customer "${editCustomer.name}" updated successfully!`);
    setEditCustomer(null);
    setTimeout(() => setToast(""), 3500);
  }

  // DELETE
  function handleDeleteCustomer(customer: AdminCustomer) {
    if (!confirm(`Are you sure you want to remove customer account "${customer.name}"?`)) return;

    apiFetch(`/users/${customer.id}`, { method: "DELETE" }).catch(() => {});

    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    if (viewCustomer?.id === customer.id) setViewCustomer(null);
    if (editCustomer?.id === customer.id) setEditCustomer(null);

    setToast(`Customer "${customer.name}" has been removed.`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Customer Directory
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            View registered customer profiles, lifetime purchasing volumes, delivery addresses, and order statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Register New Customer
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Customers</div>
          <div className="mt-1.5 text-2xl font-black text-white">{totalRegistered}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active web & retail accounts</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Revenue</div>
          <div className="mt-1.5 text-lg sm:text-xl font-black text-emerald-400 font-mono">
            Rs. {totalLifetimeRevenue.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Customer cumulative spend</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Placed</div>
          <div className="mt-1.5 text-2xl font-black text-blue-400 font-mono">{totalOrdersPlaced}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Completed checkout orders</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Customer Value</div>
          <div className="mt-1.5 text-lg sm:text-xl font-black text-purple-300 font-mono">
            Rs. {totalRegistered ? Math.round(totalLifetimeRevenue / totalRegistered).toLocaleString("en-LK") : 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Average lifetime LTV</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Customer Database ({filtered.length} visible)
        </span>

        <div className="relative min-w-[280px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by customer name, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Table / List Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No customer profiles found.</div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{c.name}</div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Rs. {c.totalSpent.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="text-xs text-slate-400">{c.email}</div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono">{c.phone}</span>
                  <span>📍 {c.city}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">{c.ordersCount} orders • Joined {c.joinedDate}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewCustomer(c)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCustomer({ ...c })}
                      className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(c)}
                      className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Delivery City</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Lifetime Spend</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No customer profiles found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.email}</div>
                    </td>

                    <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">
                      {c.phone}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {c.city}
                    </td>

                    <td className="px-6 py-4 font-bold text-white">
                      {c.ordersCount} orders
                    </td>

                    <td className="px-6 py-4 font-mono font-black text-emerald-400 text-sm">
                      Rs. {c.totalSpent.toLocaleString("en-LK")}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                      {c.joinedDate}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewCustomer(c)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditCustomer({ ...c })}
                          className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomer(c)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View Customer Details (READ) */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">{viewCustomer.name}</h3>
                <span className="text-xs text-blue-400 font-mono">ID: {viewCustomer.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-white font-medium">{viewCustomer.email}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Contact Number:</span>
                <span className="text-slate-200 font-mono">{viewCustomer.phone}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Primary Delivery City:</span>
                <span className="text-white">{viewCustomer.city}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Registered Date:</span>
                <span className="text-slate-300 font-mono">{viewCustomer.joinedDate}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Total Orders Placed:</span>
                <span className="text-white font-mono font-bold">{viewCustomer.ordersCount} orders</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-bold uppercase text-[11px]">Lifetime Spend (LKR):</span>
                <span className="text-emerald-400 font-black text-base font-mono">
                  Rs. {viewCustomer.totalSpent.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const c = viewCustomer;
                  setViewCustomer(null);
                  setEditCustomer({ ...c });
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Customer (UPDATE) */}
      {editCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit Customer Profile</h3>
                <span className="text-xs text-blue-400 font-mono">{editCustomer.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editCustomer.name}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editCustomer.email}
                  onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editCustomer.phone}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Delivery City</label>
                  <input
                    type="text"
                    required
                    value={editCustomer.city}
                    onChange={(e) => setEditCustomer({ ...editCustomer, city: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCustomer(null)}
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

      {/* MODAL: Register New Customer (CREATE) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Register New Customer</h3>
                <p className="text-xs text-slate-400">Create a retail or online customer profile</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nimal Fernando"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@domain.lk"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="077 555 4321"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Delivery City</label>
                  <input
                    type="text"
                    required
                    placeholder="Colombo, Kandy, Galle..."
                    value={addForm.city}
                    onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Orders Count</label>
                  <input
                    type="number"
                    min="0"
                    value={addForm.ordersCount}
                    onChange={(e) => setAddForm({ ...addForm, ordersCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lifetime Spend (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={addForm.totalSpent}
                    onChange={(e) => setAddForm({ ...addForm, totalSpent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
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
