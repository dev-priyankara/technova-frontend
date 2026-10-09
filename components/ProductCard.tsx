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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-950/40">
      {/* Product image */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-white/5 p-5">
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
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
          {product.category}
        </p>

        <h3 className="mb-3 line-clamp-2 min-h-12 text-base font-bold text-white">
          {product.name}
        </h3>

        <div className="mb-4 mt-auto">
          <p className="text-xl font-extrabold text-white">
            Rs. {product.price.toLocaleString("en-LK")}
          </p>

          <p
            className={`mt-2 flex items-center gap-2 text-sm font-medium ${
              product.inStock ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.inStock ? "bg-green-400" : "bg-red-500"
              }`}
            />
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
          className="w-full rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white"
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
