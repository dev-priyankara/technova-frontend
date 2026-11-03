"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import type { CategoryRecord } from "@/lib/categories";

type CategoryItem = CategoryRecord & {
  icon: string;
  accent: string;
};

const accents = [
  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "bg-rose-500/15 text-rose-400 border-rose-500/30",
  "bg-teal-500/15 text-teal-400 border-teal-500/30",
];

const categoryIcons: Record<string, string> = {
  laptops: "💻",
  processors: "⚡",
  "graphics-cards": "🎮",
  motherboards: "🔌",
  "memory-ram": "🧠",
  storage: "💾",
  monitors: "🖥️",
  "gaming-accessories": "🎧",
  "power-supplies": "🔋",
  "cooling-cases": "❄️",
  networking: "📡",
  "software-os": "💿",
};

type CategorySectionProps = {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
};

export default function CategorySection({
  selectedCategory = "All",
  onSelectCategory,
}: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiFetch<CategoryRecord[]>("/categories")
      .then((data) => {
        if (!isMounted) return;
        setCategories(data.map((category, index) => ({
          ...category,
          icon: categoryIcons[category.slug] ?? "📁",
          accent: accents[index % accents.length],
        })));
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setCategories([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load categories.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedCategories = showAll ? categories : categories.slice(0, 8);

  function handleCategoryClick(category: CategoryItem) {
    if (onSelectCategory) {
      const nextCategory = selectedCategory === category.name ? "All" : category.name;
      onSelectCategory(nextCategory);
    }

    const element =
      document.getElementById("products") ||
      document.getElementById("featured-products");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="relative bg-slate-950/40 py-10 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          {selectedCategory !== "All" && (
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

        {loadError && (
          <p role="alert" className="mb-5 text-center text-sm text-rose-300">
            Categories are unavailable: {loadError}
          </p>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Loading categories...
          </p>
        ) : displayedCategories.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
            No categories have been added yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {displayedCategories.map((category) => {
              const isSelected = selectedCategory === category.name;

              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`group relative flex h-full flex-col text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isSelected
                      ? "border-blue-400 bg-blue-950/70 shadow-xl shadow-blue-500/20 ring-2 ring-blue-400 -translate-y-1"
                      : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/8 hover:shadow-lg hover:shadow-blue-950/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border ${category.accent} text-2xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl`}
                    >
                      <span aria-hidden="true">{category.icon}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {category.item_count} Items
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-white transition-colors group-hover:text-blue-300 sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-1 flex-1 text-xs leading-5 text-slate-300">
                    {category.description || "Browse products in this category."}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-semibold">
                    <span
                      className={
                        isSelected
                          ? "text-blue-300 font-bold"
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
        )}

        {!loading && categories.length > 8 && (
          <div className="mt-8 flex justify-center text-center sm:mt-10">
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-600/20 active:scale-95"
            >
              <span>{showAll ? "Show Fewer Categories" : `Browse All Categories (${categories.length})`}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
