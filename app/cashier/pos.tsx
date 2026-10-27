"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  mockPOSProducts,
  mockPOSCategories,
  mockWalkInCustomers,
  calculatePOSTotals,
  type POSProduct,
  type POSCartItem,
  type POSTransaction,
  type WalkInCustomer,
} from "@/lib/cashierData";
import { apiFetch } from "@/lib/auth";
import ReceiptModal from "@/app/cashier/receiptModal";

export default function POSBillingCounter() {
  // State
  const [products, setProducts] = useState<POSProduct[]>(mockPOSProducts);
  const [categories, setCategories] = useState<string[]>(mockPOSCategories);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    apiFetch<any[]>("/products")
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped: POSProduct[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          sku: p.sku,
          price: p.price,
          stockQty: p.stock_count,
          specs: Array.isArray(p.specs) ? p.specs.join(", ") : p.specs || "",
          warranty: p.warranty || "1 Year Warranty",
          badge: p.badge || undefined,
        }));
        setProducts(mapped);
      })
      .catch((err) => console.warn("Using default POS products:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Customer State
  const [customers, setCustomers] = useState<WalkInCustomer[]>(mockWalkInCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<WalkInCustomer>(mockWalkInCustomers[0]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustCity, setNewCustCity] = useState("");

  // Cart State
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [heldCart, setHeldCart] = useState<POSCartItem[] | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card (POS EDC)" | "Bank Transfer">("Cash");
  const [cashTendered, setCashTendered] = useState<number | "">("");
  const [cardAuthRef, setCardAuthRef] = useState("");
  const [transferRef, setTransferRef] = useState("");

  // Receipt Modal State
  const [currentReceipt, setCurrentReceipt] = useState<POSTransaction | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat =
        selectedCategory === "All Items" || prod.category === selectedCategory;
      const matchQuery =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Subtotal & 2% Discount Calculations
  const rawSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cart]);

  const { subtotal, discount, finalAmount, discountApplied, amountNeededForDiscount } = useMemo(() => {
    return calculatePOSTotals(rawSubtotal);
  }, [rawSubtotal]);

  // Change Due for Cash Payments
  const numericCash = typeof cashTendered === "number" ? cashTendered : 0;
  const changeDue = numericCash > finalAmount ? numericCash - finalAmount : 0;
  const cashShortage = finalAmount > numericCash && numericCash > 0 ? finalAmount - numericCash : 0;

  // Add Product to Cart
  function addToCart(product: POSProduct) {
    if (product.stockQty <= 0) {
      triggerToast(`Sorry, ${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stockQty) {
          triggerToast(`Maximum stock limit reached (${product.stockQty} units) for ${product.name}`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                lineTotal: (item.qty + 1) * product.price,
              }
            : item
        );
      }
      return [
        ...prevCart,
        {
          product,
          qty: 1,
          lineTotal: product.price,
        },
      ];
    });
    triggerToast(`Added ${product.name} to bill`);
  }

  // Modify quantity
  function updateQuantity(productId: string, delta: number) {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stockQty) {
              triggerToast(`Only ${item.product.stockQty} available in stock.`);
              return item;
            }
            return {
              ...item,
              qty: newQty,
              lineTotal: newQty * item.product.price,
            };
          }
          return item;
        })
        .filter((item): item is POSCartItem => item !== null);
    });
  }

  // Remove single line
  function removeFromCart(productId: string) {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }

  // Clear Cart
  function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to clear the active POS cart?")) {
      setCart([]);
      setCashTendered("");
      setCardAuthRef("");
      setTransferRef("");
    }
  }

  // Hold / Resume Cart
  function holdCurrentCart() {
    if (cart.length === 0) {
      triggerToast("Cannot hold an empty cart.");
      return;
    }
    setHeldCart(cart);
    setCart([]);
    setCashTendered("");
    triggerToast("Sale #1 put on HOLD. Ready for next walk-in customer.");
  }

  function resumeHeldCart() {
    if (!heldCart) return;
    if (cart.length > 0) {
      if (!confirm("Overwrite current cart with held sale?")) return;
    }
    setCart(heldCart);
    setHeldCart(null);
    triggerToast("Resumed held sale into register.");
  }

  // Quick cash tender preset buttons
  function applyCashPreset(amount: number) {
    setCashTendered(amount);
  }

  // Register New Walk-in Customer
  function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert("Please provide customer name and phone number.");
      return;
    }

    const created: WalkInCustomer = {
      id: `cust-walkin-${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      city: newCustCity.trim() || "In-Store Walk-in",
      totalVisits: 1,
      totalSpent: 0,
      lastPurchaseDate: new Date().toISOString().split("T")[0],
    };

    setCustomers([created, ...customers]);
    setSelectedCustomer(created);
    setShowAddCustomerModal(false);
    setNewCustName("");
    setNewCustPhone("");
    setNewCustCity("");
    triggerToast(`Customer ${created.name} registered and selected.`);
  }

  // Complete Sale & Print Receipt
  function handleCompleteSale() {
    if (cart.length === 0) {
      alert("Cannot complete sale: POS cart is empty. Add products first.");
      return;
    }

    if (paymentMethod === "Cash") {
      if (typeof cashTendered !== "number" || cashTendered < finalAmount) {
        alert(
          `Insufficient cash tendered. Total payable is Rs. ${finalAmount.toLocaleString("en-LK")}, but received Rs. ${(cashTendered || 0).toLocaleString("en-LK")}.`
        );
        return;
      }
    } else if (paymentMethod === "Card (POS EDC)") {
      if (!cardAuthRef.trim()) {
        alert("Please enter the Bank EDC Card Slip / Authorization reference code.");
        return;
      }
    }

    // Build Receipt Transaction
    const receiptNumber = `INV-POS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    const transaction: POSTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: receiptNumber,
      cashierName: "Nimal Perera",
      registerId: "POS-TERMINAL-01",
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-LK", { hour12: false }),
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: cart.map((item) => ({
        name: item.product.name,
        sku: item.product.sku,
        qty: item.qty,
        price: item.product.price,
        lineTotal: item.lineTotal,
        warranty: item.product.warranty,
      })),
      subtotal,
      discount,
      finalAmount,
      paymentMethod,
      cashTendered: paymentMethod === "Cash" ? numericCash : undefined,
      changeDue: paymentMethod === "Cash" ? changeDue : undefined,
      cardRef: paymentMethod === "Card (POS EDC)" ? cardAuthRef : paymentMethod === "Bank Transfer" ? transferRef : undefined,
      status: "Completed",
    };

    // Persist POS Order in MySQL backend & decrement inventory
    apiFetch<any>("/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.qty,
        })),
        shipping_address: {
          recipient_name: selectedCustomer.name || "Walk-In Customer",
          street: "POS In-Store Counter",
          city: selectedCustomer.city || "Colombo",
          district: "",
          postal_code: "",
          phone: selectedCustomer.phone || "+94 77 000 0000",
        },
        payment_method: paymentMethod,
        payment_status: "Paid",
        customer_email: "pos-counter@technova.lk",
      }),
    })
      .then((savedOrder) => {
        if (savedOrder?.id) {
          transaction.receiptNo = savedOrder.id;
        }
      })
      .catch((err) => {
        console.warn("Could not save POS order to backend:", err);
      });

    // Open Receipt
    setCurrentReceipt(transaction);

    // Reset Cart
    setCart([]);
    setCashTendered("");
    setCardAuthRef("");
    setTransferRef("");
    setMobileCartOpen(false);
    triggerToast("Sale completed successfully! Saved to MySQL database.");
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-400/30 bg-blue-950/90 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Walk-in Customer Header & Fast Action Bar */}
      <div className="flex flex-col gap-4">
        {/* Section Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
              ⚡ Live Billing Counter
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              POS Hardware Register
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Scan barcodes, search inventory, manage customer tenders, and apply instant 2% bulk discounts on orders over LKR 400,000.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {heldCart ? (
              <button
                onClick={resumeHeldCart}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-500/40 bg-amber-500/20 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition animate-pulse"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Resume Held Sale ({heldCart.length})</span>
              </button>
            ) : (
              cart.length > 0 && (
                <button
                  onClick={holdCurrentCart}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hold Sale</span>
                </button>
              )
            )}

            {/* Mobile Cart Floating Badge Toggle */}
            <button
              onClick={() => setMobileCartOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart ({cart.reduce((s, i) => s + i.qty, 0)})</span>
              <span className="font-mono font-black text-amber-300">
                Rs. {finalAmount.toLocaleString("en-LK")}
              </span>
            </button>
          </div>
        </div>

        {/* Customer Select Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                Walk-in Customer
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedCustomer.id}
                  onChange={(e) => {
                    const found = customers.find((c) => c.id === e.target.value);
                    if (found) setSelectedCustomer(found);
                  }}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white focus:border-blue-400 outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone !== "N/A" ? `(${c.phone})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition"
                  title="Register new customer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Customer</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <span>Terminal: <strong className="text-white font-mono">POS-01</strong></span>
            <span className="mx-2">•</span>
            <span>Date: <strong className="text-slate-200">{new Date().toISOString().split("T")[0]}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Products on Left, Cart/Billing Counter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Catalog & Item Selection (cols 7 or 8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Search & Barcode Scan Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hardware by product name, SKU, or scan barcode..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 outline-none backdrop-blur-xl transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "border border-white/10 bg-slate-900/40 text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const inCart = cart.find((i) => i.product.id === prod.id);
              const isOutOfStock = prod.stockQty <= 0;

              return (
                <div
                  key={prod.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 ${
                    isOutOfStock
                      ? "border-red-500/20 bg-slate-900/20 opacity-60"
                      : "border-white/10 bg-slate-900/50 hover:border-blue-400/40 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-blue-950/30"
                  }`}
                >
                  {/* Top Badge Info */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 truncate uppercase">
                      {prod.category}
                    </span>
                    {prod.badge ? (
                      <span className="shrink-0 rounded bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-300">
                        {prod.badge}
                      </span>
                    ) : isOutOfStock ? (
                      <span className="shrink-0 rounded bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-red-400">
                        Out of Stock
                      </span>
                    ) : (
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-extrabold ${
                          prod.stockQty <= 4
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {prod.stockQty} in stock
                      </span>
                    )}
                  </div>

                  {/* Title & SKU */}
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-mono text-slate-400">
                      SKU: {prod.sku}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-300 line-clamp-2 leading-tight">
                      {prod.specs}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-300">
                      <svg className="w-3 h-3 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>{prod.warranty}</span>
                    </div>
                  </div>

                  {/* Pricing & Add to Bill Button */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Unit Price</span>
                      <span className="text-sm font-black text-white font-mono">
                        Rs. {prod.price.toLocaleString("en-LK")}
                      </span>
                    </div>

                    {isOutOfStock ? (
                      <button
                        disabled
                        className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    ) : inCart ? (
                      <div className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(prod.id, -1)}
                          className="h-6 w-6 rounded-lg bg-blue-600/40 text-white hover:bg-blue-600 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs text-white px-1">
                          {inCart.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="h-6 w-6 rounded-lg bg-blue-600/40 text-white hover:bg-blue-600 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(prod)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-extrabold text-white hover:brightness-110 transition shadow-md shadow-blue-600/25 active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-slate-900/30 p-12 text-center text-slate-400">
              <svg className="mx-auto w-10 h-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm font-semibold">No hardware products match your search.</p>
              <p className="text-xs text-slate-300 mt-1">Try searching by category, processor model, or GPU series.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: POS Billing Register Cart (cols 5 or 4) */}
        <div
          className={`lg:col-span-5 xl:col-span-4 ${
            mobileCartOpen
              ? "fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto block"
              : "hidden lg:block sticky top-20"
          }`}
        >
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl shadow-2xl flex flex-col space-y-4">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Current In-Store Bill
                </span>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Register Cart</span>
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300 font-bold">
                    {cart.reduce((s, i) => s + i.qty, 0)} items
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-semibold"
                    title="Clear Cart"
                  >
                    Clear
                  </button>
                )}
                {mobileCartOpen && (
                  <button
                    onClick={() => setMobileCartOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-300">
                  <svg className="mx-auto w-12 h-12 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-xs font-bold">Cart is empty</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Select hardware components from the catalog to prepare the walk-in bill.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.product.sku}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-400 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="h-6 w-6 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs text-white px-2">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="h-6 w-6 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-400 block">
                          @{item.product.price.toLocaleString("en-LK")}
                        </span>
                        <span className="text-xs font-bold text-white">
                          Rs. {item.lineTotal.toLocaleString("en-LK")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Discount Rule Breakdown */}
            <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-white">
                  Rs. {subtotal.toLocaleString("en-LK")}
                </span>
              </div>

              {/* 2% Mandatory Discount Notification */}
              {discountApplied ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5 flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold">
                      🎉
                    </span>
                    <div>
                      <span className="font-bold block text-[11px]">2% Auto Discount Applied</span>
                      <span className="text-[10px] text-emerald-400">Subtotal &gt; LKR 400,000 rule</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-300">
                    - Rs. {discount.toLocaleString("en-LK")}
                  </span>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-2.5 text-[11px] text-blue-200">
                  <div className="flex justify-between items-center">
                    <span>Volume Discount (2%):</span>
                    <span className="font-mono text-slate-400">Rs. 0</span>
                  </div>
                  {subtotal > 0 && amountNeededForDiscount > 0 && (
                    <p className="mt-1 text-[10px] text-blue-300/80">
                      💡 Add Rs. {amountNeededForDiscount.toLocaleString("en-LK")} more to unlock 2% auto discount!
                    </p>
                  )}
                </div>
              )}

              {/* Final Amount Payable */}
              <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block">
                    Amount to Pay
                  </span>
                  <span className="text-[10px] text-slate-300">Net walk-in total</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    Rs. {finalAmount.toLocaleString("en-LK")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                Payment Method
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["Cash", "Card (POS EDC)", "Bank Transfer"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-xl py-2 px-1 text-center text-xs font-bold transition border ${
                      paymentMethod === method
                        ? "border-blue-400 bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {method === "Card (POS EDC)" ? "Card (EDC)" : method}
                  </button>
                ))}
              </div>

              {/* Cash Tender & Change Calculations */}
              {paymentMethod === "Cash" && (
                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Cash Received from Customer (LKR)
                    </label>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) =>
                        setCashTendered(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="Enter amount given by customer..."
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm font-mono text-white focus:border-blue-400 outline-none"
                    />
                  </div>

                  {/* Cash Quick Tender Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => applyCashPreset(finalAmount)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-blue-300 hover:bg-white/10"
                    >
                      Exact (Rs. {finalAmount.toLocaleString("en-LK")})
                    </button>
                    {[5000, 10000, 50000, 100000, 500000].map((amt) => {
                      if (amt >= finalAmount) {
                        return (
                          <button
                            key={amt}
                            onClick={() => applyCashPreset(amt)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/10"
                          >
                            Rs. {amt.toLocaleString("en-LK")}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Live Change / Shortage Banner */}
                  {changeDue > 0 && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-2.5 flex justify-between items-center text-emerald-300 font-bold">
                      <span className="text-xs">Change Due to Customer:</span>
                      <span className="font-mono text-sm">
                        Rs. {changeDue.toLocaleString("en-LK")}
                      </span>
                    </div>
                  )}

                  {cashShortage > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-2.5 flex justify-between items-center text-amber-300 font-bold">
                      <span className="text-xs">Shortage:</span>
                      <span className="font-mono text-sm">
                        Rs. {cashShortage.toLocaleString("en-LK")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Card EDC Reference */}
              {paymentMethod === "Card (POS EDC)" && (
                <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Bank EDC Terminal Auth / Slip No.
                    </label>
                    <input
                      type="text"
                      value={cardAuthRef}
                      onChange={(e) => setCardAuthRef(e.target.value)}
                      placeholder="e.g. AUTH-HNB-998124"
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-mono text-white focus:border-blue-400 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-300">
                    🔒 Certified Security: Card transactions are processed directly on the bank terminal. Never enter or store credit card details here.
                  </p>
                </div>
              )}

              {/* Bank Transfer Reference */}
              {paymentMethod === "Bank Transfer" && (
                <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Bank Transfer Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="e.g. CEFT-BOC-887210"
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-mono text-white focus:border-blue-400 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Complete Sale CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 px-4 text-sm font-black text-white shadow-xl shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-98 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete Sale & Issue Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Walk-in Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Register Walk-in Customer
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Kasun Bandara"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Mobile Number * (For Receipt & Warranty)
                </label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 077 123 4567"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  City / Location
                </label>
                <input
                  type="text"
                  value={newCustCity}
                  onChange={(e) => setNewCustCity(e.target.value)}
                  placeholder="e.g. Nugegoda"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-400 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Save & Select Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 80mm Printable Receipt Modal */}
      <ReceiptModal
        transaction={currentReceipt}
        onClose={() => setCurrentReceipt(null)}
      />
    </div>
  );
}

