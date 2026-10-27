"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dummyOrders, calculateOrderTotals, type Order } from "@/lib/customerData";
import { apiFetch } from "@/lib/auth";

type StatusFilter = "All" | "Pending" | "Processing" | "Delivered";

interface OrdersSectionProps {
  onSelectOrder: (orderId: string) => void;
}

export default function OrdersSection({ onSelectOrder }: OrdersSectionProps) {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/orders")
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped: Order[] = data.map((o) => ({
          id: o.id,
          date: o.date ? o.date.split("T")[0] : new Date().toISOString().split("T")[0],
          status: o.status as any,
          items: (o.items || []).map((it: any) => ({
            id: it.product_id,
            name: it.name,
            category: "Hardware Component",
            quantity: it.quantity,
            price: it.price,
            sku: it.sku,
          })),
          shippingAddress: {
            recipientName: o.shipping_address?.recipient_name || "",
            street: o.shipping_address?.street || "",
            city: o.shipping_address?.city || "",
            district: o.shipping_address?.district || "",
            postalCode: o.shipping_address?.postal_code || "",
            phone: o.shipping_address?.phone || "",
          },
          paymentMethod: {
            type: o.payment_method || "PayHere Online Gateway",
            details: "Direct Payment",
            status: o.payment_status || "Paid",
          },
          trackingNumber: `TN-EXP-${o.id}`,
          deliveryDate: "Estimated 2-3 Business Days",
        }));
        setOrders(mapped);
      })
      .catch((err) => {
        console.warn("Could not fetch customer orders from backend, using default list:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedFilter === "All" ? true : order.status === selectedFilter;

      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : order.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            order.items.some((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
            );

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  const countByStatus = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-blue-300">
            📦 Purchases & Shipments
          </span>
          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Order History</h2>
          <p className="mt-1 text-xs text-slate-300">
            View all your past hardware orders, shipment tracking numbers, and invoice receipts.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold !text-black shadow-lg transition-transform hover:bg-blue-50 active:scale-95"
        >
          <span>Explore More Products</span>
          <span>→</span>
        </Link>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(["All", "Pending", "Processing", "Delivered"] as StatusFilter[]).map(
            (status) => {
              const isActive = selectedFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedFilter(status)}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md sm:shadow-lg shadow-blue-600/30 ring-1 ring-blue-400"
                      : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {countByStatus[status]}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-8 sm:p-12 text-center backdrop-blur-xl">
          <span className="text-3xl sm:text-4xl">📦</span>
          <h3 className="mt-3 text-sm sm:text-base font-bold text-white">No orders found</h3>
          <p className="mt-1 text-xs text-slate-400">
            {searchQuery
              ? `No orders matching "${searchQuery}". Try a different keyword.`
              : `There are currently no orders under the "${selectedFilter}" status.`}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-white/10"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* =========================================
              MOBILE CARD VIEW (< md)
              Fully responsive card per order
              ========================================= */}
          <div className="space-y-3 block md:hidden">
            {filteredOrders.map((order) => {
              const totals = calculateOrderTotals(order);
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-mono text-xs font-black text-blue-400">
                      {order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        order.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                          : order.status === "Processing"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-400"
                            : order.status === "Processing"
                            ? "bg-blue-400"
                            : "bg-amber-400"
                        }`}
                      />
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-white truncate">
                      {order.items[0]?.name}
                    </div>
                    {order.items.length > 1 && (
                      <span className="text-[11px] text-blue-400 block">
                        +{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}
                      </span>
                    )}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Date: {order.date}</span>
                      {order.trackingNumber && (
                        <span className="font-mono">Trk: {order.trackingNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total</span>
                      <span className="font-black text-white text-sm">
                        Rs. {totals.finalAmount.toLocaleString("en-LK")}
                      </span>
                      {totals.isDiscountEligible && (
                        <span className="text-[9px] font-bold text-emerald-400 block">
                          2% Bulk Discount Applied
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectOrder(order.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-600 active:scale-95 transition-all"
                    >
                      <span>Details</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================
              DESKTOP TABLE VIEW (>= md)
              Clean responsive full data table
              ========================================= */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider">Items Ordered</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const totals = calculateOrderTotals(order);
                    return (
                      <tr
                        key={order.id}
                        className="group transition-colors hover:bg-white/[0.04]"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {order.id}
                          </span>
                          {order.trackingNumber && (
                            <span className="block text-[11px] text-slate-400 mt-0.5">
                              Trk: {order.trackingNumber}
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-slate-300">
                          <span className="block font-medium">{order.date}</span>
                          <span className="text-[11px] text-slate-400">
                            {order.deliveryDate || "Standard Courier"}
                          </span>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <div className="max-w-[220px]">
                            <span className="block font-bold text-white truncate">
                              {order.items[0]?.name}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[11px] text-blue-400 font-medium">
                                +{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="px-6 py-4">
                          <div className="font-black text-white text-sm">
                            Rs. {totals.finalAmount.toLocaleString("en-LK")}
                          </div>
                          {totals.isDiscountEligible && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                              2% Bulk Disc Applied
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                              order.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                                : order.status === "Processing"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                                : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-emerald-400"
                                  : order.status === "Processing"
                                  ? "bg-blue-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            {order.status}
                          </span>
                        </td>

                        {/* Action Button */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectOrder(order.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white transition-all hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/30"
                          >
                            <span>View Details</span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Hardware Guarantee & Help Footer Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-base sm:text-lg text-blue-400">
            🛡️
          </span>
          <div>
            <h4 className="text-xs font-bold text-white">TECHNOVA Hardware Warranty</h4>
            <p className="text-[11px] text-slate-400">
              All computer systems and components are covered under manufacturer warranty for 1 to 3 years.
            </p>
          </div>
        </div>
        <a
          href="tel:+94112345678"
          className="text-xs font-bold text-blue-400 hover:text-blue-300 whitespace-nowrap"
        >
          Contact Warranty Claims →
        </a>
      </div>
    </div>
  );
}
