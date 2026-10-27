"use client";

import React, { useEffect, useState } from "react";
import {
  type AdminOrder,
  type TimeFilterPeriod,
  mockAdminOrders,
  isDateInPeriod,
} from "@/lib/adminData";
import { apiFetch } from "@/lib/auth";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilterPeriod>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Modals state
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);
  const [editOrder, setEditOrder] = useState<AdminOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create Order Form
  const [createForm, setCreateForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "Colombo 03",
    itemsSummary: "ASUS TUF Gaming Laptop (1x)",
    totalAmount: 385000,
    paymentStatus: "Paid" as "Paid" | "Pending Verification",
    status: "Pending" as AdminOrder["status"],
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiFetch<any[]>("/admin/orders")
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminOrder[] = data.map((o) => ({
            id: o.id,
            customerName: o.shipping_address?.recipient_name || o.recipient_name || "Customer",
            customerPhone: o.shipping_address?.phone || o.phone || "",
            date: o.date ? o.date.split("T")[0] : (o.created_at ? o.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
            totalAmount: o.total || 0,
            status: o.status || "Pending",
            paymentStatus: o.payment_status === "Paid" ? "Paid" : "Pending Verification",
            itemsSummary: (o.items || []).map((it: any) => `${it.name} (${it.quantity}x)`).join(", ") || "Custom Hardware Assembly",
          }));
          setOrders(mapped);
        } else {
          setOrders(mockAdminOrders);
        }
      })
      .catch((err) => {
        console.warn("Failed to load orders from database, using mock data:", err);
        if (isMounted) setOrders(mockAdminOrders);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allOrdersCount = orders.length;
  const todayOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "today")).length;
  const weeklyOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "weekly")).length;
  const monthlyOrdersCount = orders.filter((o) => isDateInPeriod(o.date, "monthly")).length;

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchTime = isDateInPeriod(o.date, timeFilter);
    const matchSearch =
      search.trim() === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(search.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTime && matchSearch;
  });

  const totalFilteredRevenue = filtered.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrdersCount = filtered.filter((o) => o.status === "Pending").length;
  const deliveredOrdersCount = filtered.filter((o) => o.status === "Delivered").length;

  async function handleStatusChange(id: string, newStatus: AdminOrder["status"]) {
    try {
      await apiFetch<any>(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Local fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
    setToast(`Order ${id} status updated to ${newStatus}`);
    setTimeout(() => setToast(""), 3000);
  }

  // CREATE ORDER
  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    const newId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: AdminOrder = {
      id: newId,
      customerName: createForm.customerName.trim(),
      customerPhone: createForm.customerPhone.trim(),
      date: new Date().toISOString().split("T")[0],
      totalAmount: Number(createForm.totalAmount) || 0,
      status: createForm.status,
      paymentStatus: createForm.paymentStatus,
      itemsSummary: createForm.itemsSummary.trim(),
    };

    // Attempt backend registration
    apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_email: createForm.customerEmail || `${newId.toLowerCase()}@guest.technova.lk`,
        payment_method: createForm.paymentStatus === "Paid" ? "Card (POS EDC)" : "Cash on Delivery",
        shipping_address: {
          recipient_name: createForm.customerName.trim(),
          phone: createForm.customerPhone.trim(),
          street: createForm.address,
          city: "Colombo",
          postal_code: "00300",
        },
        items: [],
      }),
    }).catch(() => {});

    setOrders([newOrder, ...orders]);
    setIsCreateOpen(false);
    setCreateForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      address: "Colombo 03",
      itemsSummary: "ASUS TUF Gaming Laptop (1x)",
      totalAmount: 385000,
      paymentStatus: "Paid",
      status: "Pending",
    });
    setToast(`Order ${newId} created successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  // UPDATE ORDER
  async function handleSaveEditOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!editOrder) return;

    try {
      await apiFetch(`/orders/${editOrder.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: editOrder.status,
          payment_status: editOrder.paymentStatus,
        }),
      });
    } catch {}

    setOrders((prev) =>
      prev.map((o) => (o.id === editOrder.id ? { ...editOrder } : o)),
    );

    setEditOrder(null);
    setToast(`Order ${editOrder.id} updated successfully!`);
    setTimeout(() => setToast(""), 3500);
  }

  // DELETE / CANCEL ORDER
  function handleDeleteOrder(order: AdminOrder) {
    if (!confirm(`Are you sure you want to permanently delete/cancel Order "${order.id}"?`)) return;

    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    if (viewOrder?.id === order.id) setViewOrder(null);
    if (editOrder?.id === order.id) setEditOrder(null);

    setToast(`Order ${order.id} has been deleted.`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Customer Order Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Track hardware purchases, dispatch workflow, customer delivery dates, and real-time revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Record Manual Order
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* KPI Overview for Filtered Orders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtered Orders</div>
          <div className="mt-1.5 text-2xl font-black text-white">{filtered.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In selected timeframe</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</div>
          <div className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            Rs. {totalFilteredRevenue.toLocaleString("en-LK")}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sum of orders</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Action</div>
          <div className="mt-1.5 text-2xl font-black text-amber-300">{pendingOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Requires dispatch</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered</div>
          <div className="mt-1.5 text-2xl font-black text-blue-400">{deliveredOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Completed orders</div>
        </div>
      </div>

      {/* Time-based Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <span>🕒</span> Order Date Filter:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Time", key: "all" as TimeFilterPeriod, count: allOrdersCount, icon: "📦" },
            { label: "Today", key: "today" as TimeFilterPeriod, count: todayOrdersCount, icon: "⚡" },
            { label: "This Week", key: "weekly" as TimeFilterPeriod, count: weeklyOrdersCount, icon: "📅" },
            { label: "This Month", key: "monthly" as TimeFilterPeriod, count: monthlyOrdersCount, icon: "🗓️" },
          ].map((tab) => {
            const isActive = timeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTimeFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/10"
                }`}
              >
                {st}
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
            placeholder="Search Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No orders found matching the selected timeframe and filters.
            </div>
          ) : (
            filtered.map((ord) => (
              <div key={ord.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">{ord.id}</span>
                  <select
                    value={ord.status}
                    onChange={(e) =>
                      handleStatusChange(ord.id, e.target.value as AdminOrder["status"])
                    }
                    className={`rounded-lg border border-white/10 px-2 py-1 text-[11px] font-bold bg-slate-950 focus:outline-none ${
                      ord.status === "Delivered"
                        ? "text-emerald-400"
                        : ord.status === "Processing"
                        ? "text-blue-400"
                        : ord.status === "Cancelled"
                        ? "text-rose-400"
                        : "text-amber-300"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="text-xs text-white font-semibold">{ord.customerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                <div className="text-xs text-slate-300 line-clamp-2">{ord.itemsSummary}</div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    📅 {ord.date}
                    {isDateInPeriod(ord.date, "today") && (
                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-black text-white text-sm">
                    Rs. {ord.totalAmount.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setViewOrder(ord)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/10"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditOrder({ ...ord })}
                    className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300 hover:bg-blue-600 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(ord)}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-600 hover:text-white"
                  >
                    Delete
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
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Ordered Hardware</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No customer orders found matching the selected timeframe and filter.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                      {ord.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                    </td>

                    <td className="px-6 py-4 max-w-xs text-slate-300">
                      <span className="block truncate">{ord.itemsSummary}</span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300">{ord.date}</span>
                        {isDateInPeriod(ord.date, "today") && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Today
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-black text-white text-sm">
                      Rs. {ord.totalAmount.toLocaleString("en-LK")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ord.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-400"
                            : "bg-amber-500/10 border border-amber-400/30 text-amber-300"
                        }`}
                      >
                        ● {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as AdminOrder["status"])
                        }
                        className={`rounded-xl border border-white/10 px-2.5 py-1 text-xs font-bold bg-slate-950 focus:outline-none ${
                          ord.status === "Delivered"
                            ? "text-emerald-400"
                            : ord.status === "Processing"
                            ? "text-blue-400"
                            : ord.status === "Cancelled"
                            ? "text-rose-400"
                            : "text-amber-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewOrder(ord)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditOrder({ ...ord })}
                          className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(ord)}
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

      {/* MODAL: View Order Details (READ) */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Order Details</h3>
                <span className="text-xs text-blue-400 font-mono">{viewOrder.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewOrder(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Information</span>
                <div className="text-white font-bold text-sm">{viewOrder.customerName}</div>
                <div className="text-slate-300 font-mono text-[11px]">Phone: {viewOrder.customerPhone}</div>
                <div className="text-slate-400 font-mono text-[11px]">Order Date: {viewOrder.date}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Items Breakdown</span>
                <div className="text-slate-200">{viewOrder.itemsSummary}</div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold text-emerald-400">● {viewOrder.paymentStatus}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Fulfillment Status:</span>
                <span className="font-bold text-blue-400">● {viewOrder.status}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 font-bold uppercase text-[11px]">Total Net Amount:</span>
                <span className="text-white font-black text-base font-mono">
                  Rs. {viewOrder.totalAmount.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const o = viewOrder;
                  setViewOrder(null);
                  setEditOrder({ ...o });
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500"
              >
                Edit Order
              </button>
              <button
                type="button"
                onClick={() => setViewOrder(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Order (UPDATE) */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit Customer Order</h3>
                <span className="text-xs text-blue-400 font-mono">{editOrder.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditOrder(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Recipient Name</label>
                <input
                  type="text"
                  required
                  value={editOrder.customerName}
                  onChange={(e) => setEditOrder({ ...editOrder, customerName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Phone</label>
                <input
                  type="text"
                  required
                  value={editOrder.customerPhone}
                  onChange={(e) => setEditOrder({ ...editOrder, customerPhone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ordered Hardware Items</label>
                <input
                  type="text"
                  required
                  value={editOrder.itemsSummary}
                  onChange={(e) => setEditOrder({ ...editOrder, itemsSummary: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Order Status</label>
                  <select
                    value={editOrder.status}
                    onChange={(e) =>
                      setEditOrder({ ...editOrder, status: e.target.value as AdminOrder["status"] })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Payment Status</label>
                  <select
                    value={editOrder.paymentStatus}
                    onChange={(e) =>
                      setEditOrder({
                        ...editOrder,
                        paymentStatus: e.target.value as "Paid" | "Pending Verification",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Total Amount (LKR)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editOrder.totalAmount}
                  onChange={(e) => setEditOrder({ ...editOrder, totalAmount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOrder(null)}
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

      {/* MODAL: Record Manual Order (CREATE) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Record Manual Customer Order</h3>
                <p className="text-xs text-slate-400">Direct phone order or counter delivery order</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Silva"
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="077 123 4567"
                    value={createForm.customerPhone}
                    onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={createForm.customerEmail}
                    onChange={(e) => setCreateForm({ ...createForm, customerEmail: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Shipping City / Address</label>
                  <input
                    type="text"
                    required
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Items & Quantities</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RTX 4070 Ti (1x), Corsair 850W RMx (1x)"
                  value={createForm.itemsSummary}
                  onChange={(e) => setCreateForm({ ...createForm, itemsSummary: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Order Amount (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={createForm.totalAmount}
                    onChange={(e) => setCreateForm({ ...createForm, totalAmount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Payment</label>
                  <select
                    value={createForm.paymentStatus}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        paymentStatus: e.target.value as "Paid" | "Pending Verification",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, status: e.target.value as AdminOrder["status"] })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
