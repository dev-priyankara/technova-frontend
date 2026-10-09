"use client";

import { useState } from "react";
import Image from "next/image";

export type Product = {
  id: number | string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
  specs?: string[];
  description?: string;
  warranty?: string;
  brand?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
};

function CategoryGraphic({ category }: { category: string }) {
  const cat = category.toLowerCase();

  if (cat.includes("laptop")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 100 80" className="h-28 w-28 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <rect x="18" y="14" width="64" height="42" rx="4" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <rect x="23" y="19" width="54" height="32" rx="2" fill="#1e293b" />
        <circle cx="50" cy="35" r="8" fill="#3b82f6" fillOpacity="0.4" />
        <path d="M46 35l3 3 5-5" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 60h80a4 4 0 0 1 4 4v2H6v-2a4 4 0 0 1 4-4z" fill="#334155" stroke="currentColor" strokeWidth="2" />
        <rect x="42" y="60" width="16" height="3" rx="1.5" fill="#94a3b8" />
      </svg>
    );
  }

  if (cat.includes("processor") || cat.includes("cpu")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 80 80" className="h-28 w-28 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.35)]">
        <rect x="16" y="16" width="48" height="48" rx="6" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <rect x="24" y="24" width="32" height="32" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="7" fill="#6366f1" fillOpacity="0.3" />
        <path d="M40 30v20M30 40h20" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 12v4M34 12v4M42 12v4M50 12v4M26 64v4M34 64v4M42 64v4M50 64v4M12 26h4M12 34h4M12 42h4M12 50h4M64 26h4M64 34h4M64 42h4M64 50h4" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (cat.includes("graphic") || cat.includes("gpu")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 90 70" className="h-28 w-28 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.35)]">
        <rect x="10" y="15" width="70" height="40" rx="6" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="35" r="12" fill="#164e63" stroke="#22d3ee" strokeWidth="1.8" />
        <circle cx="58" cy="35" r="12" fill="#164e63" stroke="#22d3ee" strokeWidth="1.8" />
        <circle cx="32" cy="35" r="4" fill="#06b6d4" />
        <circle cx="58" cy="35" r="4" fill="#06b6d4" />
        <path d="M10 25h-5v20h5M20 55h40v4H20z" fill="#0891b2" />
        <rect x="73" y="22" width="4" height="26" rx="2" fill="#22d3ee" />
      </svg>
    );
  }

  if (cat.includes("ram") || cat.includes("memory")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 90 60" className="h-28 w-28 text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]">
        <rect x="10" y="16" width="70" height="28" rx="4" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 18h66v4H12z" fill="#a78bfa" />
        <rect x="18" y="26" width="10" height="12" rx="2" fill="#312e81" stroke="#8b5cf6" strokeWidth="1" />
        <rect x="34" y="26" width="10" height="12" rx="2" fill="#312e81" stroke="#8b5cf6" strokeWidth="1" />
        <rect x="50" y="26" width="10" height="12" rx="2" fill="#312e81" stroke="#8b5cf6" strokeWidth="1" />
        <rect x="66" y="26" width="8" height="12" rx="2" fill="#312e81" stroke="#8b5cf6" strokeWidth="1" />
        <path d="M15 44v3M22 44v3M29 44v3M36 44v3M43 44v3M50 44v3M57 44v3M64 44v3M71 44v3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (cat.includes("storage") || cat.includes("ssd")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 90 60" className="h-28 w-28 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]">
        <rect x="12" y="20" width="66" height="22" rx="3" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <rect x="22" y="23" width="14" height="16" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
        <rect x="40" y="23" width="14" height="16" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
        <rect x="58" y="23" width="12" height="16" rx="2" fill="#065f46" stroke="#34d399" strokeWidth="1" />
        <path d="M12 26h-4v10h4" fill="#fbbf24" />
        <circle cx="72" cy="31" r="2" fill="#a7f3d0" />
      </svg>
    );
  }

  if (cat.includes("monitor")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 90 75" className="h-28 w-28 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]">
        <rect x="12" y="10" width="66" height="44" rx="4" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <rect x="16" y="14" width="58" height="34" rx="2" fill="#1e293b" />
        <path d="M22 36l12-10 14 12 10-6 10 10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M42 54v10M32 64h26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (cat.includes("accessories") || cat.includes("keyboard") || cat.includes("mouse")) {
    return (
      <svg aria-hidden="true" viewBox="0 0 90 70" className="h-28 w-28 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.35)]">
        <rect x="10" y="20" width="52" height="32" rx="4" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
        <path d="M15 27h6M24 27h6M33 27h6M42 27h6M51 27h6M15 35h6M24 35h6M33 35h6M42 35h6M51 35h6M20 43h28" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
        <rect x="68" y="24" width="16" height="26" rx="8" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
        <line x1="76" y1="26" x2="76" y2="34" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Motherboard or Default
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className="h-28 w-28 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]">
      <rect x="14" y="14" width="52" height="52" rx="5" fill="#0f172a" stroke="currentColor" strokeWidth="2.5" />
      <rect x="22" y="22" width="20" height="20" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="48" y="22" width="12" height="36" rx="2" fill="#0369a1" />
      <rect x="22" y="48" width="22" height="6" rx="1.5" fill="#38bdf8" />
      <circle cx="32" cy="32" r="4" fill="#bae6fd" />
      <path d="M18 20h2M18 60h2M60 18v2M60 60v2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-950/60">
      {/* Product Image / Visual Showcase */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 via-slate-900/60 to-blue-950/40 p-4">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-blue-600/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {discountPercentage && (
            <span className="rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-md">
              -{discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Brand pill */}
        {product.brand && (
          <span className="absolute right-3 top-3 z-10 rounded-md border border-white/10 bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-md">
            {product.brand}
          </span>
        )}

        {/* Visual Graphic or Image */}
        <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-108">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <CategoryGraphic category={product.category} />
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/90 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-colors hover:border-blue-400 hover:bg-blue-600"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Quick Specs & Details
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category & Rating Row */}
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-blue-300">
            {product.category}
          </span>

          {product.rating && (
            <span className="flex items-center gap-1 font-bold text-amber-300">
              <span aria-hidden="true">★</span>
              <span>{product.rating.toFixed(1)}</span>
              {product.reviews && (
                <span className="text-slate-400 font-normal">({product.reviews})</span>
              )}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails?.(product)}
          className="mb-2 line-clamp-2 min-h-12 cursor-pointer text-sm font-bold text-white transition-colors hover:text-blue-300 sm:text-base"
        >
          {product.name}
        </h3>

        {/* Quick Spec Pills */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {product.specs.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Pricing & Stock */}
        <div className="mb-4 mt-auto pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white sm:text-xl">
              Rs. {product.price.toLocaleString("en-LK")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                Rs. {product.originalPrice.toLocaleString("en-LK")}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between text-xs font-medium">
            <span
              className={`flex items-center gap-1.5 ${
                product.inStock ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  product.inStock ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                }`}
              />
              {product.inStock
                ? product.stockCount
                  ? `In Stock (${product.stockCount} left)`
                  : "In Stock"
                : "Out of Stock"}
            </span>

            {product.warranty && (
              <span className="text-slate-400 text-[11px]">
                🛡️ {product.warranty}
              </span>
            )}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            aria-label="View specifications"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-colors hover:border-blue-400 hover:bg-white/10"
            title="View Details"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onAddToCart?.(product)}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-xs font-bold !text-black shadow-md transition-all hover:bg-blue-50 hover:shadow-blue-900/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/20 disabled:!text-slate-400"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
