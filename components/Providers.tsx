"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import PayHereModal from "@/components/PayHereModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <PayHereModal />
    </CartProvider>
  );
}

