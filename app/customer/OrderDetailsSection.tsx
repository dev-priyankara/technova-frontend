"use client";

import { getOrderById, calculateOrderTotals } from "@/lib/customerData";

interface OrderDetailsSectionProps {
  orderId: string;
  onBackToOrders: () => void;
}

export default function OrderDetailsSection({
  orderId,
  onBackToOrders,
}: OrderDetailsSectionProps) {
  const order = getOrderById(orderId);
  const totals = calculateOrderTotals(order);

  // Status step progression helper
  const steps = [
    { title: "Order Placed", date: order.date, completed: true },
    {
      title: "Processing & QC",
      date: order.status !== "Pending" ? "Verified" : "In Progress",
      completed: order.status === "Processing" || order.status === "Delivered",
      current: order.status === "Pending",
    },
    {
      title: "Dispatched / Courier",
      date: order.trackingNumber || "Pending",
      completed: order.status === "Delivered",
      current: order.status === "Processing",
    },
    {
      title: "Delivered",
      date: order.deliveryDate || "Estimated",
      completed: order.status === "Delivered",
      current: false,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBackToOrders}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-blue-400 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <span>← Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2.5">
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
            Status: {order.status}
          </span>

          <span className="text-[11px] text-slate-400 font-mono">
            {order.date}
          </span>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400">
              TECHNOVA Official Invoice Details
            </span>
            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono">
              {order.id}
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Purchased on {order.date} • Courier Delivery via TECHNOVA Express
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Final Total Amount</span>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              Rs. {totals.finalAmount.toLocaleString("en-LK")}
            </div>
            {totals.isDiscountEligible && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400">
                ✨ 2% Privilege Discount Applied (-Rs. {totals.discountAmount.toLocaleString("en-LK")})
              </span>
            )}
          </div>
        </div>

        {/* Order Progression Stepper */}
        <div className="mt-6 pt-5 border-t border-white/10 sm:mt-8 sm:pt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
            Shipment Timeline
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className={`relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border transition-colors ${
                  step.completed
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : step.current
                    ? "border-blue-400/50 bg-blue-500/10 text-blue-300"
                    : "border-white/5 bg-white/[0.02] text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${
                      step.completed
                        ? "bg-emerald-500 text-black font-black"
                        : step.current
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {step.completed ? "✓" : idx + 1}
                  </span>
                  <span className="font-bold text-[11px] sm:text-xs text-white truncate">
                    {step.title}
                  </span>
                </div>
                <span className="block mt-1 text-[9px] sm:text-[10px] text-slate-300 pl-6 sm:pl-8 truncate">
                  {step.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Purchased Items) + Right Column (Pricing Breakdown & Shipping Info) */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Purchased Items List */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white">Purchased Hardware Items</h2>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} included in this shipment
                </p>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                Verified Inventory
              </span>
            </div>

            <div className="mt-3 sm:mt-4 divide-y divide-white/5">
              {order.items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item.id} className="py-3 sm:py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Product Thumbnail / Hardware Badge */}
                      <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 text-xl sm:text-2xl shadow-inner">
                        💻
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-blue-400 border border-blue-400/20">
                            {item.category}
                          </span>
                          {item.sku && (
                            <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-none">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-xs sm:text-sm font-bold text-white">
                          {item.name}
                        </h3>
                        {item.specs && (
                          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-400 line-clamp-2">
                            {item.specs}
                          </p>
                        )}
                        <div className="mt-1.5 text-[11px] sm:text-xs text-slate-300">
                          Unit Price: <span className="font-bold text-white">Rs. {item.price.toLocaleString("en-LK")}</span> × {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 border-t border-white/5 pt-2 sm:border-0 sm:pt-0">
                      <span className="text-[10px] sm:text-xs text-slate-400 block">Item Subtotal</span>
                      <span className="text-sm sm:text-base font-black text-white font-mono">
                        Rs. {itemTotal.toLocaleString("en-LK")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping & Payment Method Cards Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Delivery Address */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5 sm:mb-3">
                <span>📍</span>
                <span>Shipping Address</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <p className="font-bold text-white text-sm">
                  {order.shippingAddress.recipientName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.district}</p>
                <div className="pt-2 text-slate-400 flex items-center gap-1.5 border-t border-white/5 mt-2">
                  <span>📞</span>
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5 sm:mb-3">
                <span>💳</span>
                <span>Payment Method</span>
              </div>
              <div className="text-xs space-y-2 text-slate-300">
                <p className="font-bold text-white text-sm">
                  {order.paymentMethod.type}
                </p>
                <p className="font-mono text-slate-400">
                  {order.paymentMethod.details}
                </p>
                <div className="pt-2 border-t border-white/5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {order.paymentMethod.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown Card */}
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
            <h2 className="text-sm sm:text-base font-extrabold text-white border-b border-white/10 pb-3 sm:pb-4">
              Payment Summary
            </h2>

            <div className="mt-3.5 space-y-3 text-xs">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-slate-300">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="font-bold text-white">
                  Rs. {totals.subtotal.toLocaleString("en-LK")}
                </span>
              </div>

              {/* Crucial Business Rule: 2% Discount when Subtotal > 400,000 LKR */}
              {totals.isDiscountEligible ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 sm:p-3">
                  <div className="flex justify-between items-center font-bold text-emerald-400 text-xs">
                    <div className="flex items-center gap-1">
                      <span>🎉</span>
                      <span>Bulk Privilege Disc (2%)</span>
                    </div>
                    <span>- Rs. {totals.discountAmount.toLocaleString("en-LK")}</span>
                  </div>
                  <p className="mt-1 text-[10px] sm:text-[11px] text-emerald-300/80">
                    Qualified! 2% discount applied because order subtotal exceeds LKR 400,000.
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center text-slate-400">
                  <span>Bulk Hardware Discount</span>
                  <span>Rs. 0</span>
                </div>
              )}

              {/* Shipping Fee */}
              <div className="flex justify-between items-center text-slate-300">
                <span>Shipping & Insurance</span>
                <span className="font-bold text-white">
                  {totals.shippingFee === 0 ? (
                    <span className="text-emerald-400 uppercase font-bold text-[10px] sm:text-[11px]">
                      FREE
                    </span>
                  ) : (
                    `Rs. ${totals.shippingFee.toLocaleString("en-LK")}`
                  )}
                </span>
              </div>

              {/* Total line */}
              <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-white block">Final Total</span>
                  <span className="text-[10px] text-slate-400">Includes all local taxes & duties</span>
                </div>
                <span className="text-lg sm:text-xl font-black text-white font-mono">
                  Rs. {totals.finalAmount.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            {/* Print / Action buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                className="w-full rounded-xl bg-white py-2.5 sm:py-3 text-xs font-bold !text-black shadow-lg transition-transform hover:bg-blue-50 active:scale-95"
              >
                📥 Download Tax Invoice (PDF)
              </button>
              <button
                type="button"
                onClick={onBackToOrders}
                className="block text-center w-full rounded-xl border border-white/10 bg-white/5 py-2.5 sm:py-3 text-xs font-bold text-white transition-colors hover:bg-white/10 active:scale-95"
              >
                ← Back to Order History
              </button>
            </div>
          </div>

          {/* Business Discount Policy Banner */}
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <span>💡</span>
              <span>TECHNOVA Discount Policy</span>
            </div>
            <p className="mt-1.5 text-[11px] sm:text-xs leading-relaxed text-slate-300">
              Orders with an equipment subtotal greater than <strong className="text-white">LKR 400,000</strong> receive an automatic <strong className="text-emerald-400">2% bulk privilege discount</strong> deduction at order placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
