"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

type PaymentStep = "form" | "processing" | "success" | "failed";

export default function PayHereModal() {
  const { isCheckoutOpen, closeCheckout, subtotal, items, clearCart } = useCart();

  const [step, setStep] = useState<PaymentStep>("form");
  const [processingMessage, setProcessingMessage] = useState("Connecting to PayHere Sandbox...");

  // Customer billing details (always empty on load)
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  // Card details (always empty on load)
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardError, setCardError] = useState("");

  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
  const grandTotal = subtotal + deliveryFee;

  // Reset all input fields to completely empty whenever checkout modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep("form");
      setCardError("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomerCity("");
      setCardNumber("");
      setCardHolder("");
      setCardExpiry("");
      setCardCvv("");
      setOrderId(`PAYHERE-TN-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Formatting card number with spaces
  function handleCardNumberChange(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  }

  // Formatting MM/YY
  function handleExpiryChange(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  }

  // Fill sample sandbox test cards
  function fillTestCard(type: "visa" | "master" | "declined") {
    if (type === "visa") {
      setCardNumber("4111 1111 1111 1111");
      setCardHolder(customerName ? customerName.toUpperCase() : "TEST CARDHOLDER");
      setCardExpiry("12/28");
      setCardCvv("123");
      setCardError("");
    } else if (type === "master") {
      setCardNumber("5555 5555 5555 5555");
      setCardHolder(customerName ? customerName.toUpperCase() : "TEST CARDHOLDER");
      setCardExpiry("10/27");
      setCardCvv("789");
      setCardError("");
    } else {
      setCardNumber("4000 0000 0000 0002");
      setCardHolder("DECLINED TEST");
      setCardExpiry("05/26");
      setCardCvv("000");
      setCardError("");
    }
  }

  // Handle Pay simulation
  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCardError("");

    const cleanNum = cardNumber.replace(/\s/g, "");
    if (cleanNum.length < 16) {
      setCardError("Please enter a valid 16-digit card number.");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setCardError("Please enter valid card expiry (MM/YY).");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setCardError("Please enter valid 3-digit CVV.");
      return;
    }

    // Begin PayHere simulation
    setStep("processing");
    setProcessingMessage("Initiating PayHere Sandbox gateway...");

    setTimeout(() => {
      setProcessingMessage("Contacting issuing bank for 3-D Secure Authorization...");
    }, 900);

    setTimeout(() => {
      // If user selected the declined test card
      if (cleanNum.endsWith("0002")) {
        setStep("failed");
      } else {
        const txn = `TXN_PH_${Date.now()}`;
        setTransactionId(txn);
        setStep("success");
      }
    }, 2200);
  }

  function handleCompleteOrder() {
    clearCart();
    closeCheckout();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payhere-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 transition-opacity"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/20 bg-slate-950 p-6 shadow-2xl shadow-blue-950/90 text-white sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* PayHere Sandbox Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {/* PayHere Logo Branding Badge */}
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-sm font-black text-white shadow-md">
              <span className="text-yellow-400">⚡</span>
              <span>payhere</span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close payment modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Form View */}
        {step === "form" && (
          <div className="mt-5">
            {/* Merchant and Order Summary Box */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs text-slate-400">Payment to Merchant:</span>
                  <h3 className="text-sm font-bold text-white">TECHNOVA Computers (Pvt) Ltd</h3>
                  <span className="text-[11px] text-blue-300 font-mono">Order ID: {orderId}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400">Total Payable:</span>
                  <div className="text-xl font-black text-emerald-400 sm:text-2xl">
                    LKR {grandTotal.toLocaleString("en-LK")}.00
                  </div>
                  <span className="text-[11px] text-slate-400">
                    ({items.length} {items.length === 1 ? "item" : "items"} included)
                  </span>
                </div>
              </div>
            </div>

            

            {/* Payment Form */}
            <form onSubmit={handlePaymentSubmit} className="mt-5 space-y-4">
              {/* Customer Details Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Perera"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Customer Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kasun@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Card Inputs Header */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Card Information (Visa / MasterCard)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-bold text-[10px]">VISA</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-bold text-[10px]">MASTER</span>
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300">Card Number</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-sm tracking-wider text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">💳</span>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300">Name on Card</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KASUN PERERA"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs uppercase text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-xs text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">CVV / CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-xs text-white outline-none focus:border-blue-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {cardError && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-300">
                  {cardError}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
              >
                <span>Pay LKR {grandTotal.toLocaleString("en-LK")}.00</span>
                <span aria-hidden="true">🔒</span>
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Processing View */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border-4 border-blue-400/20 border-t-blue-500 animate-spin" />
              <span className="text-2xl">⚡</span>
            </div>

            <h3 className="mt-6 text-lg font-bold text-white">Processing Payment</h3>
            <p className="mt-2 text-xs text-blue-300 animate-pulse">{processingMessage}</p>
            <p className="mt-4 max-w-xs text-[11px] text-slate-400">
              Please do not refresh or close this window while the sandbox transaction is completing.
            </p>
          </div>
        )}

        {/* Step 3: Success View */}
        {step === "success" && (
          <div className="py-6 text-center">
            {/* Success Check Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-3xl text-emerald-300 shadow-xl shadow-emerald-500/20 animate-bounce">
              ✓
            </div>

            <span className="mt-4 inline-block rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              PAYMENT APPROVED (SANDBOX)
            </span>

            <h3 className="mt-2 text-2xl font-black text-white">Payment Successful!</h3>
            <p className="mt-1 text-xs text-slate-300">
              Thank you! Your payment has been processed and order confirmed.
            </p>

            {/* Official Receipt Box */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-bold text-white">TECHNOVA Computers (Pvt) Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono text-blue-300 font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-300">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white">{customerName} ({customerEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-white">Visa / MasterCard (•••• {cardNumber.slice(-4) || "1111"})</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold">
                <span className="text-slate-300">Amount Paid:</span>
                <span className="text-emerald-400 font-black">LKR {grandTotal.toLocaleString("en-LK")}.00</span>
              </div>
            </div>

            {/* Done Action */}
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10"
              >
                🖨️ Print Receipt
              </button>
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="flex-1 rounded-xl bg-white py-3 text-xs font-bold !text-black shadow-lg hover:bg-blue-50 active:scale-95"
              >
                Done & Return to Store →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Failed View */}
        {step === "failed" && (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/20 border-2 border-rose-400 text-3xl text-rose-300 shadow-xl shadow-rose-500/20">
              ✕
            </div>

            <span className="mt-4 inline-block rounded-full bg-rose-500/10 border border-rose-400/30 px-3 py-1 text-xs font-bold text-rose-300">
              TRANSACTION DECLINED (SANDBOX)
            </span>

            <h3 className="mt-2 text-2xl font-black text-white">Payment Failed</h3>
            <p className="mt-1 text-xs text-slate-300">
              Your test card was declined by the sandbox issuing bank.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500"
              >
                Try With Another Test Card
              </button>
              <button
                type="button"
                onClick={closeCheckout}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

