"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

function CartItemGraphic({ category }: { category: string }) {
  const cat = category.toLowerCase();
  if (cat.includes("laptop")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
        💻
      </div>
    );
  }
  if (cat.includes("processor") || cat.includes("cpu")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-400">
        ⚡
      </div>
    );
  }
  if (cat.includes("graphic") || cat.includes("gpu")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl text-cyan-400">
        🎮
      </div>
    );
  }
  if (cat.includes("ram") || cat.includes("memory")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-violet-500/10 text-2xl text-violet-400">
        🧠
      </div>
    );
  }
  if (cat.includes("storage") || cat.includes("ssd")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl text-emerald-400">
        💾
      </div>
    );
  }
  if (cat.includes("monitor")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-500/10 text-2xl text-amber-400">
        🖥️
      </div>
    );
  }
  if (cat.includes("keyboard") || cat.includes("accessories") || cat.includes("mouse")) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-rose-500/10 text-2xl text-rose-400">
        🎧
      </div>
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-sky-500/10 text-2xl text-sky-400">
      🔌
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCheckout,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
  const grandTotal = subtotal + deliveryFee;

  return (
    <>
      {/* Backdrop overlay with blur */}
      <div
        role="presentation"
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full sm:w-[420px] lg:w-[460px] xl:w-[28vw] min-w-[320px] max-w-[540px] flex-col border-l border-white/10 bg-slate-950/98 text-white shadow-2xl shadow-blue-950/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                Your Shopping Cart
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {totalItems} {totalItems === 1 ? "item" : "items"} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-400"
                title="Remove all items from cart"
              >
                Clear All
              </button>
            )}

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart drawer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Free delivery banner */}
        <div className="border-b border-white/10 bg-blue-950/40 px-5 py-2.5 text-xs text-blue-200">
          {subtotal >= 50000 ? (
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span>🎉</span> Congratulations! You unlocked <strong>Free Island-wide Delivery</strong>.
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>🚚</span> Add <strong>Rs. {(50000 - subtotal).toLocaleString("en-LK")}</strong> more for Free Delivery.
            </span>
          )}
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 divide-y divide-white/10">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0"
              >
                {/* Product thumbnail */}
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <CartItemGraphic category={item.product.category} />
                </div>

                {/* Info & Quantity */}
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {item.product.category}
                      </span>
                      <h3 className="line-clamp-2 text-xs font-bold text-white sm:text-sm">
                        {item.product.name}
                      </h3>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="text-slate-400 transition-colors hover:text-rose-400 p-1"
                      title="Remove"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-300">
                    Rs. {item.product.price.toLocaleString("en-LK")} each
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-white/20 bg-white/5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white">
                        Rs. {(item.product.price * item.quantity).toLocaleString("en-LK")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-4xl shadow-inner">
                🛒
              </div>
              <h3 className="mt-4 text-base font-bold text-white">
                Your cart is currently empty
              </h3>
              <p className="mt-1 max-w-[240px] text-xs text-slate-400">
                Explore our processors, laptops, graphics cards and gaming accessories to add items.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  const el = document.getElementById("featured-products");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 rounded-xl bg-white px-6 py-2.5 text-xs font-bold !text-black shadow-lg transition-transform hover:bg-blue-50 active:scale-95"
              >
                Start Shopping Now →
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer with Checkout Button */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-slate-950/95 p-5 sm:p-6 backdrop-blur-md">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal:</span>
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
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-black text-white">
                <span>Total Amount:</span>
                <span className="text-base text-blue-400 sm:text-lg">
                  Rs. {grandTotal.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={openCheckout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 transition-all hover:opacity-95 hover:shadow-blue-600/50 active:scale-95"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Checkout (PayHere Sandbox) →</span>
            </button>

            {/* Trust badge */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span>🔒 100% Secure Checkout powered by</span>
              <strong className="text-blue-300">PayHere</strong>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

