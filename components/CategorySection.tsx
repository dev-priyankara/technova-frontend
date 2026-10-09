"use client";

import { useState } from "react";

export type CategoryItem = {
  name: string;
  filterKey: string;
  description: string;
  icon: string;
  itemCount: number;
  popularBrands: string[];
  accent: string;
  badge?: string;
};

const initialCategories: CategoryItem[] = [
  {
    name: "Laptops",
    filterKey: "Laptops",
    description: "Powerful laptops for gaming, creative work & study.",
    icon: "💻",
    itemCount: 18,
    popularBrands: ["ASUS ROG", "Lenovo", "Acer", "MSI"],
    accent: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    badge: "Hot Deals",
  },
  {
    name: "Processors",
    filterKey: "Processors",
    description: "High performance Intel Core & AMD Ryzen CPUs.",
    icon: "⚡",
    itemCount: 24,
    popularBrands: ["Intel Core i7/i9", "AMD Ryzen 7/9"],
    accent: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    badge: "Gen 14 / AM5",
  },
  {
    name: "Graphics Cards",
    filterKey: "Graphics Cards",
    description: "Ray-tracing RTX 40-Series & AMD Radeon GPUs.",
    icon: "🎮",
    itemCount: 16,
    popularBrands: ["NVIDIA RTX", "ASUS TUF", "MSI", "Gigabyte"],
    accent: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    badge: "Top Seller",
  },
  {
    name: "Motherboards",
    filterKey: "Motherboards",
    description: "Reliable B650, B760, Z790 & X670 PC mainboards.",
    icon: "🔌",
    itemCount: 20,
    popularBrands: ["ASUS ROG", "MSI MAG", "Gigabyte AORUS"],
    accent: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  },
  {
    name: "Memory (RAM)",
    filterKey: "Memory",
    description: "High-speed DDR4 & DDR5 kits with RGB heatsinks.",
    icon: "🧠",
    itemCount: 22,
    popularBrands: ["Corsair", "G.Skill", "Kingston Fury"],
    accent: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  },
  {
    name: "Storage",
    filterKey: "Storage",
    description: "Blazing fast Gen4 NVMe M.2 SSDs & high capacity HDDs.",
    icon: "💾",
    itemCount: 26,
    popularBrands: ["Samsung EVO", "Kingston", "Seagate"],
    accent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    badge: "Up to 7450 MB/s",
  },
  {
    name: "Monitors",
    filterKey: "Monitors",
    description: "High refresh 165Hz–240Hz IPS & Curved OLED displays.",
    icon: "🖥️",
    itemCount: 14,
    popularBrands: ["ASUS TUF", "Samsung Odyssey", "ViewSonic"],
    accent: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  {
    name: "Gaming Accessories",
    filterKey: "Gaming Accessories",
    description: "Mechanical keyboards, precision mice & 7.1 headsets.",
    icon: "🎧",
    itemCount: 35,
    popularBrands: ["Razer", "Logitech G", "HyperX"],
    accent: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    badge: "Popular",
  },
];

const additionalCategories: CategoryItem[] = [
  {
    name: "Power Supplies",
    filterKey: "Power Supplies",
    description: "80+ Gold & Platinum certified ATX 3.0 modular PSUs.",
    icon: "🔋",
    itemCount: 15,
    popularBrands: ["Corsair RM", "Antec", "Cooler Master"],
    accent: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  },
  {
    name: "Cooling & Cases",
    filterKey: "Cooling",
    description: "AIO 360mm Liquid coolers, ARGB fans & tempered cases.",
    icon: "❄️",
    itemCount: 28,
    popularBrands: ["NZXT", "DeepCool", "Lian Li"],
    accent: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  },
  {
    name: "Networking",
    filterKey: "Networking",
    description: "Wi-Fi 6E / 7 mesh routers, PCIe adapters & gigabit switches.",
    icon: "📡",
    itemCount: 12,
    popularBrands: ["TP-Link Archer", "ASUS Gaming Router"],
    accent: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  {
    name: "Software & OS",
    filterKey: "Software",
    description: "Genuine Microsoft Windows 11 Pro & security software.",
    icon: "💿",
    itemCount: 8,
    popularBrands: ["Microsoft Windows", "Kaspersky", "Bitdefender"],
    accent: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },
];

type CategorySectionProps = {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
};

export default function CategorySection({
  selectedCategory = "All",
  onSelectCategory,
}: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll
    ? [...initialCategories, ...additionalCategories]
    : initialCategories;

  function handleCategoryClick(cat: CategoryItem) {
    if (onSelectCategory) {
      // Toggle if already selected, otherwise set
      const nextCategory = selectedCategory === cat.filterKey ? "All" : cat.filterKey;
      onSelectCategory(nextCategory);
    }

    // Smooth scroll down to Featured Products
    const element = document.getElementById("featured-products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section
      id="category-section"
      aria-labelledby="categories-heading"
      className="relative bg-slate-950/40 py-10 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            <span>✨</span> Explore TECHNOVA
          </span>

          <h2
            id="categories-heading"
            className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Explore By <span className="text-blue-400">Category</span>
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-300 sm:text-sm">
            Click any category to instantly filter and browse corresponding computer products below.
          </p>

          {/* Active filter badge if any */}
          {selectedCategory && selectedCategory !== "All" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-900/30 px-3.5 py-1 text-xs text-blue-200 backdrop-blur-sm">
              <span>Filtering products by:</span>
              <strong className="text-white">{selectedCategory}</strong>
              <button
                type="button"
                onClick={() => onSelectCategory?.("All")}
                className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white hover:bg-white/20"
              >
                Clear ✕
              </button>
            </div>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {displayedCategories.map((category) => {
            const isSelected =
              selectedCategory === category.filterKey ||
              (selectedCategory === "Memory" && category.filterKey === "Memory") ||
              selectedCategory.toLowerCase() === category.name.toLowerCase();

            return (
              <button
                type="button"
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className={`group relative flex h-full flex-col text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isSelected
                    ? "border-blue-400 bg-blue-950/70 shadow-xl shadow-blue-500/20 ring-2 ring-blue-400 -translate-y-1"
                    : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/8 hover:shadow-lg hover:shadow-blue-950/40"
                }`}
              >
                {/* Header Row: Icon + Badge / Item Count */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${category.accent} text-2xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl`}
                  >
                    <span aria-hidden="true">{category.icon}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {category.badge && (
                      <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-[10px] font-bold text-blue-200">
                        {category.badge}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      {category.itemCount}+ Items
                    </span>
                  </div>
                </div>

                {/* Category Details */}
                <h3 className="mt-4 text-sm font-bold text-white transition-colors group-hover:text-blue-300 sm:text-base">
                  {category.name}
                </h3>

                <p className="mt-1 flex-1 text-xs leading-5 text-slate-300">
                  {category.description}
                </p>

                {/* Popular Brands tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {category.popularBrands.slice(0, 2).map((brand) => (
                    <span
                      key={brand}
                      className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400"
                    >
                      {brand}
                    </span>
                  ))}
                </div>

                {/* Explore / Selected CTA Pill */}
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-semibold">
                  <span
                    className={
                      isSelected
                        ? "text-blue-300 font-bold flex items-center gap-1"
                        : "text-slate-300 group-hover:text-blue-300"
                    }
                  >
                    {isSelected ? "Active Filter ✓" : "View Products"}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${
                      isSelected
                        ? "translate-x-0.5 text-blue-300"
                        : "group-hover:translate-x-1 text-slate-400"
                    }`}
                  >
                    ↓
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Browse All Categories Button with Toggle Expansion */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-600/20 active:scale-95"
            >
              <span>{showAll ? "Show Fewer Categories" : "Browse All Categories (12)"}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCategory?.("All")}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Reset To All Products
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {showAll
              ? "Displaying all 12 hardware & software component categories."
              : "Showing top 8 hardware categories. Click Browse All to view all 12 categories."}
          </p>
        </div>
      </div>
    </section>
  );
}