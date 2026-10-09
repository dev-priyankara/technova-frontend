
"use client";

import { useState } from "react";
import ProductCard, { type Product } from "@/components/ProductCard";

const demoProducts: Product[] = [
  {
    id: 1,
    name: "Gaming Laptop",
    category: "Laptops",
    price: 285000,
    image: "/images/products/gaming-laptop.png",
    inStock: true,
    badge: "Popular",
  },
  {
    id: 2,
    name: "AMD Ryzen 5 Processor",
    category: "Processors",
    price: 48500,
    image: "/images/products/ryzen-5.png",
    inStock: true,
  },
  {
    id: 3,
    name: "NVIDIA GeForce RTX Graphics Card",
    category: "Graphics Cards",
    price: 175000,
    image: "/images/products/graphics-card.png",
    inStock: true,
    badge: "Featured",
  },
  {
    id: 4,
    name: "16GB DDR4 Desktop RAM",
    category: "Memory",
    price: 12500,
    image: "/images/products/ram.png",
    inStock: true,
  },
  {
    id: 5,
    name: "1TB NVMe SSD",
    category: "Storage",
    price: 24500,
    image: "/images/products/nvme-ssd.png",
    inStock: true,
  },
  {
    id: 6,
    name: "Mechanical Gaming Keyboard",
    category: "Gaming Accessories",
    price: 18500,
    image: "/images/products/gaming-keyboard.png",
    inStock: false,
  },
  {
    id: 7,
    name: "24-inch Full HD Monitor",
    category: "Monitors",
    price: 42500,
    image: "/images/products/monitor.png",
    inStock: true,
  },
  {
    id: 8,
    name: "ATX Motherboard",
    category: "Motherboards",
    price: 39500,
    image: "/images/products/motherboard.png",
    inStock: true,
  },
];

export default function FeaturedProducts() {
  const [message, setMessage] = useState("");

  function handleAddToCart(product: Product) {
    // Demo feedback only.
    // Connect this function to the real cart system later.
    setMessage(`${product.name} selected. Cart integration is pending.`);
  }

  return (
    <section
      id="featured-products"
      className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              TECHNOVA COLLECTION
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Discover computer components, gaming gear and essential
              accessories for your next upgrade.
            </p>
          </div>

          <a
            href="/products"
            className="inline-flex w-fit items-center gap-2 font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            View All Products
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Demo notice */}
        <div className="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
          Demo product data — connect the backend API to display real products
          and current stock information.
        </div>

        {/* Feedback message */}
        {message && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
          >
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="font-semibold text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {demoProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-10 text-center">
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/10 px-7 py-3 font-semibold text-white transition-colors hover:bg-blue-400 hover:text-blue-950"
          >
            Explore All Products
          </a>
        </div>
      </div>
    </section>
  );
}
