"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart, openCheckout } = useCart();

  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
  const grandTotal = subtotal + deliveryFee;

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[75vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Cart Page Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Checkout & Review
            </span>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
              Shopping Cart ({totalItems})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              ← Continue Shopping
            </Link>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items List (2 cols on large screen) */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-3xl">
                      📦
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm font-bold text-white sm:text-base">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300">
                        Rs. {item.product.price.toLocaleString("en-LK")} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="flex items-center rounded-xl border border-white/20 bg-white/5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                      >
                        -
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[110px]">
                      <span className="text-base font-black text-white">
                        Rs. {(item.product.price * item.quantity).toLocaleString("en-LK")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Delete item"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Card (1 col on large screen) */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 sm:p-7 backdrop-blur-xl h-fit">
              <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Order Summary
              </h2>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="font-semibold text-white">
                    Rs. {subtotal.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Island-wide Delivery:</span>
                  <span className={deliveryFee === 0 ? "font-bold text-emerald-400" : "font-semibold text-white"}>
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee.toLocaleString("en-LK")}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Payment Gateway:</span>
                  <span className="font-bold text-blue-300">PayHere Sandbox</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between text-base font-black text-white">
                  <span>Total Payable:</span>
                  <span className="text-xl text-blue-400">
                    Rs. {grandTotal.toLocaleString("en-LK")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={openCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 active:scale-95"
              >
                <span>Checkout (PayHere Sandbox) →</span>
              </button>

              <div className="mt-4 text-center text-[11px] text-slate-400">
                🔒 256-bit encrypted test payments powered by PayHere Sri Lanka
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 py-16 text-center">
            <span className="text-5xl">🛒</span>
            <h2 className="mt-4 text-xl font-bold text-white">Your Cart is Currently Empty</h2>
            <p className="mt-1 text-sm text-slate-400">
              Browse our catalog of laptops, processors, graphics cards and components.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-xs font-bold !text-black shadow-lg hover:bg-blue-50"
            >
              Start Shopping Now →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

