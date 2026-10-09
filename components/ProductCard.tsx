"use client";

import Image from "next/image";

export type Product = {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  badge?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* Product image */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-50 p-5">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}

        <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800">
          {product.category}
        </p>

        <h3 className="mb-3 line-clamp-2 min-h-12 text-base font-bold text-slate-900">
          {product.name}
        </h3>

        <div className="mb-4 mt-auto">
          <p className="text-xl font-extrabold text-slate-950">
            Rs. {product.price.toLocaleString("en-LK")}
          </p>

          <p
            className={`mt-2 flex items-center gap-2 text-sm font-medium ${
              product.inStock ? "text-green-700" : "text-red-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.inStock ? "bg-green-600" : "bg-red-500"
              }`}
            />
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
          className="w-full rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
