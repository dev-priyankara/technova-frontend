
"use client";

import { useState } from "react";

const recommendationTypes = [
  {
    id: "gaming",
    title: "Gaming",
    description: "Graphics cards, gaming PCs and accessories",
    icon: "🎮",
    products: [
      { name: "Gaming Graphics Card", category: "Graphics Cards" },
      { name: "Gaming Keyboard", category: "Gaming Accessories" },
      { name: "High Performance Processor", category: "Processors" },
    ],
  },
  {
    id: "study",
    title: "Study & Office",
    description: "Reliable products for work and education",
    icon: "💻",
    products: [
      { name: "Laptop for Study", category: "Laptops" },
      { name: "Full HD Monitor", category: "Monitors" },
      { name: "Wireless Keyboard & Mouse", category: "Accessories" },
    ],
  },
  {
    id: "upgrade",
    title: "PC Upgrade",
    description: "Improve speed, storage and performance",
    icon: "⚡",
    products: [
      { name: "16GB Desktop RAM", category: "Memory" },
      { name: "1TB NVMe SSD", category: "Storage" },
      { name: "Desktop Processor", category: "Processors" },
    ],
  },
];

export default function AIRecommendations() {
  const [selected, setSelected] = useState("gaming");

  const recommendation = recommendationTypes.find(
    (item) => item.id === selected,
  );

  return (
    <section className="bg-slate-950/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-200">
            <span aria-hidden="true">✦</span>
            Smart Shopping
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Find Products That Fit You
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-300">
            Choose what you need to explore a product selection tailored to
            your intended use.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {recommendationTypes.map((item) => {
            const isSelected = selected === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item.id)}
                aria-pressed={isSelected}
                className={`rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? "border-blue-400 bg-blue-500/20 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-white hover:border-blue-400/50"
                }`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {item.icon}
                </span>

                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    isSelected ? "text-blue-100" : "text-slate-300"
                  }`}
                >
                  {item.description}
                </p>

                <span className="mt-4 inline-block text-sm font-semibold">
                  {isSelected ? "Selected ✓" : "Explore selection →"}
                </span>
              </button>
            );
          })}
        </div>

        {recommendation && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                  Your selection
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {recommendation.title} Products
                </h3>
              </div>

              <a
                href="/products"
                className="mt-3 inline-flex w-fit items-center gap-2 font-semibold text-white hover:text-blue-200 sm:mt-0"
              >
                Browse Products <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendation.products.map((product) => (
                <div
                  key={product.name}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                    {product.category}
                  </p>

                  <h4 className="mt-2 font-bold text-white">
                    {product.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-300">
                    Suggested for {recommendation.title.toLowerCase()} use.
                  </p>

                  <a
                    href="/products"
                    className="mt-4 inline-flex text-sm font-semibold text-white hover:underline"
                  >
                    View products →
                  </a>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
