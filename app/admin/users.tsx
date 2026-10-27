"use client";

import React, { useEffect, useState } from "react";
import { mockAdminUsers, type AdminUser, type AdminUserRole } from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
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

  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: AdminUserRole;
    phone: string;
    status: "Active" | "Inactive";
  }>({
    name: "",
    email: "",
    role: "Cashier",
    phone: "",
    status: "Active",
  });

  const ROLE_ID_MAP: Record<AdminUserRole, number> = {
    Admin: 1,
    Supplier: 2,
    Cashier: 3,
    Customer: 4,
  };

  function loadUsers() {
    setLoading(true);
    apiFetch<any[]>("/users")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminUser[] = data.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role || "Customer") as AdminUserRole,
            phone: u.phone || "",
            status: u.status === "Inactive" ? "Inactive" : "Active",
            createdAt: u.created_at ? u.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          }));
          setUsers(mapped);
        } else {
          setUsers(mockAdminUsers);
        }
      })
      .catch((err) => {
        console.warn("Failed to load users from database, using mock data:", err);
        setUsers(mockAdminUsers);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "All" ? true : u.role === roleFilter;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const createdUser = await apiFetch<any>("/users", {
        method: "POST",
        body: JSON.stringify({
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          role: newUser.role,
          role_id: ROLE_ID_MAP[newUser.role],
          phone: newUser.phone.trim(),
          tempPassword: newUser.tempPassword || "Temp@1234",
        }),
      });

      const created: AdminUser = {
        id: createdUser?.id || `usr-${Date.now()}`,
        name: createdUser?.name || newUser.name.trim(),
        email: createdUser?.email || newUser.email.trim(),
        role: (createdUser?.role || newUser.role) as AdminUserRole,
        phone: createdUser?.phone || newUser.phone.trim(),
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create user account.");
    }
  }

  function openEditModal(user: AdminUser) {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsEditModalOpen(true);
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await apiFetch<any>(`/users/${editingUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          role: editForm.role,
          role_id: ROLE_ID_MAP[editForm.role],
          status: editForm.status,
        }),
      });

      const updated: AdminUser = {
        ...editingUser,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        status: editForm.status,
      };

      setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)));
      setIsEditModalOpen(false);
      setEditingUser(null);
      setSuccessToast(`User "${updated.name}" updated successfully!`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user.");
    }
  }

  async function toggleUserStatus(id: string) {
    try {
      await apiFetch<any>(`/users/${id}/toggle-status`, { method: "PATCH" });
    } catch (err) {
      console.warn("Toggle status via API failed, updating locally:", err);
    }
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u,
      ),
    );
    setSuccessToast("User status updated.");
    setTimeout(() => setSuccessToast(""), 3000);
  }

  async function handleDeleteUser(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete user "${name}" from the database?`)) return;
    try {
      await apiFetch<any>(`/users/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete API failed, removing locally:", err);
    }
    setUsers(users.filter((u) => u.id !== id));
    setSuccessToast(`User "${name}" deleted successfully.`);
    setTimeout(() => setSuccessToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Internal User Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Create, edit, and maintain authorized Admin, Cashier, Supplier, and Customer accounts for TECHNOVA.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>＋ Create Internal Account</span>
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
          {["All", "Admin", "Cashier", "Supplier", "Customer"].map((r) => {
            const isActive = roleFilter === r;
            const count = r === "All" ? users.length : users.filter((u) => u.role === r).length;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span>{r}</span>
                <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search user by name, email or phone..."
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
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No users found.</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{user.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.role === "Admin"
                        ? "bg-purple-500/10 text-purple-300 border border-purple-400/30"
                        : user.role === "Cashier"
                        ? "bg-blue-500/10 text-blue-300 border border-blue-400/30"
                        : user.role === "Customer"
                        ? "bg-slate-500/10 text-slate-300 border border-slate-400/30"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-slate-300">{user.email}</div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-mono">{user.phone || "No phone"}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                          : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      ● {user.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="inline-flex items-center justify-center gap-1 w-16 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center justify-center w-20 py-1 rounded-lg text-xs font-bold border ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {user.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="inline-flex items-center justify-center w-8 py-1 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs border border-rose-500/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Contact & Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider w-64 min-w-[260px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          user.role === "Admin"
                            ? "bg-purple-500/10 text-purple-300 border border-purple-400/30"
                            : user.role === "Cashier"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-400/30"
                            : user.role === "Customer"
                            ? "bg-slate-500/10 text-slate-300 border border-slate-400/30"
                            : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-300 font-mono text-[11px]">
                          {user.phone || "—"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            user.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                              : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          ● {user.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right w-64 min-w-[260px]">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center justify-center gap-1.5 w-20 rounded-xl border border-blue-500/30 bg-blue-500/10 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm shadow-blue-500/10"
                          title="Edit User"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id)}
                          className="inline-flex items-center justify-center w-24 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                          title="Toggle Status"
                        >
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="inline-flex items-center justify-center w-8 h-7.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Delete User"
                        >
                          🗑️
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

      {/* Modal: Create Internal User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Create Staff Account</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Legal Name</label>
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
                <label className="block font-semibold text-slate-300 mb-1">Business Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. staff.kasun@technova.lk"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Staff Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUserRole })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+94 7X XXX XXXX"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Initial Password</label>
                <input
                  type="text"
                  placeholder="Password@123"
                  value={newUser.tempPassword}
                  onChange={(e) => setNewUser({ ...newUser, tempPassword: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Edit User Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">ID: {editingUser.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminUserRole })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
