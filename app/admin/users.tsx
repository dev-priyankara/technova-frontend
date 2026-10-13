"use client";

import React, { useState } from "react";
import { mockAdminUsers, type AdminUser, type AdminUserRole } from "@/lib/adminData";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: AdminUserRole;
    phone: string;
    tempPassword: string;
  }>({
    name: "",
    email: "",
    role: "Cashier",
    phone: "",
    tempPassword: "",
  });

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "All" ? true : u.role === roleFilter;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    const created: AdminUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([created, ...users]);
    setIsModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "Cashier",
      phone: "",
      tempPassword: "",
    });

    setSuccessToast(`New ${created.role} account created successfully!`);
    setTimeout(() => setSuccessToast(""), 4000);
  }

  function toggleUserStatus(id: string) {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u,
      ),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🔐 Role-Based Access Control (RBAC)
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Internal User Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Create and maintain authorized Admin, Cashier, and Supplier accounts for TECHNOVA operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <span>+ Create Internal Account</span>
        </button>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {successToast}
        </div>
      )}

      {/* Controls: Role filter tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Admin", "Cashier", "Supplier"].map((r) => {
            const isActive = roleFilter === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Users List (Mobile Cards + Desktop Table) */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{user.name}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    user.role === "Admin"
                      ? "bg-purple-500/10 text-purple-300 border border-purple-400/30"
                      : user.role === "Cashier"
                      ? "bg-blue-500/10 text-blue-300 border border-blue-400/30"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-300">{user.email}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{user.phone}</span>
                <button
                  type="button"
                  onClick={() => toggleUserStatus(user.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {user.status} (Toggle)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        user.role === "Admin"
                          ? "bg-purple-500/10 text-purple-300 border border-purple-400/30"
                          : user.role === "Cashier"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-400/30"
                          : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">
                    {user.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      ● {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                    {user.createdAt}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition-all"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Internal User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Create Staff Account</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@technova.lk"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">User Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUserRole })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="Cashier">Cashier (POS & Billing Access)</option>
                  <option value="Supplier">Supplier (Supply Management Access)</option>
                  <option value="Admin">Admin (Full System Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+94 77 000 0000"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUser.tempPassword}
                  onChange={(e) => setNewUser({ ...newUser, tempPassword: e.target.value })}
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

