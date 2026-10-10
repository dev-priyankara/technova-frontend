"use client";

import { useState } from "react";
import ProductCard, { type Product } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

export const allDemoProducts: Product[] = [
  // --- LAPTOPS ---
  {
    id: "lap-1",
    name: "ASUS ROG Strix G16 Gaming Laptop",
    category: "Laptops",
    brand: "ASUS",
    price: 445000,
    originalPrice: 485000,
    inStock: true,
    stockCount: 5,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 38,
    specs: ["Intel Core i7-13650HX", "RTX 4060 8GB", "16GB DDR5 4800MHz", "512GB PCIe 4.0 SSD", "16-inch 165Hz FHD+"],
    description: "Built for hardcore esports gamers and content creators. Features liquid metal cooling, ROG Intelligent Cooling, and Aura Sync RGB per-key keyboard.",
    warranty: "2 Years ASUS Global Warranty",
  },
  {
    id: "lap-2",
    name: "Lenovo Legion Pro 5 Gen 8",
    category: "Laptops",
    brand: "Lenovo",
    price: 520000,
    originalPrice: 560000,
    inStock: true,
    stockCount: 3,
    badge: "Pro Choice",
    rating: 4.8,
    reviews: 24,
    specs: ["AMD Ryzen 7 7745HX", "RTX 4070 8GB GDDR6", "32GB DDR5 RAM", "1TB Gen4 NVMe", "16-inch WQXGA 240Hz"],
    description: "Dominate every modern AAA game with AI-tuned Lenovo Legion AI Engine+, 500 nits IPS display, and rapid charge pro technology.",
    warranty: "2 Years Official Warranty",
  },
  {
    id: "lap-3",
    name: "Acer Nitro V 15 Gaming Laptop",
    category: "Laptops",
    brand: "Acer",
    price: 275000,
    originalPrice: 295000,
    inStock: true,
    stockCount: 8,
    badge: "Budget King",
    rating: 4.6,
    reviews: 52,
    specs: ["Intel Core i5-13420H", "RTX 3050 6GB", "16GB DDR5", "512GB NVMe SSD", "15.6-inch 144Hz IPS"],
    description: "The ultimate value gaming laptop for students and aspiring gamers. Dual fan cooling system and DTS:X Ultra audio support.",
    warranty: "2 Years TechNova Warranty",
  },

  // --- PROCESSORS ---
  {
    id: "cpu-1",
    name: "AMD Ryzen 7 7800X3D Processor",
    category: "Processors",
    brand: "AMD",
    price: 148000,
    originalPrice: 165000,
    inStock: true,
    stockCount: 6,
    badge: "Fastest Gaming CPU",
    rating: 5.0,
    reviews: 84,
    specs: ["8 Cores / 16 Threads", "Up to 5.0 GHz Boost", "104MB 3D V-Cache", "AM5 Socket", "120W TDP"],
    description: "The undisputed champion of gaming processors. 3D V-Cache technology delivers unbeatable frame rates across competitive and AAA titles.",
    warranty: "3 Years Official Warranty",
  },
  {
    id: "cpu-2",
    name: "Intel Core i7-14700K 14th Gen Desktop CPU",
    category: "Processors",
    brand: "Intel",
    price: 155000,
    originalPrice: 172000,
    inStock: true,
    stockCount: 4,
    badge: "Heavy Workload",
    rating: 4.8,
    reviews: 41,
    specs: ["20 Cores (8P + 12E)", "28 Threads", "Up to 5.6 GHz Max Turbo", "LGA 1700 Socket", "Intel UHD 770"],
    description: "Exceptional multitasking, video editing and streaming performance with 20 cores. Compatible with both DDR4 and DDR5 motherboards.",
    warranty: "3 Years Intel Boxed Warranty",
  },
  {
    id: "cpu-3",
    name: "AMD Ryzen 5 7600 Desktop Processor",
    category: "Processors",
    brand: "AMD",
    price: 68500,
    originalPrice: 75000,
    inStock: true,
    stockCount: 11,
    badge: "Best Value",
    rating: 4.7,
    reviews: 63,
    specs: ["6 Cores / 12 Threads", "Up to 5.1 GHz Boost", "38MB Total Cache", "AM5 Socket", "Includes Wraith Stealth"],
    description: "Affordable entry into the future-proof AM5 platform with Zen 4 architecture and PCIe 5.0 support. Includes AMD cooler.",
    warranty: "3 Years Official Warranty",
  },

  // --- GRAPHICS CARDS ---
  {
    id: "gpu-1",
    name: "NVIDIA GeForce RTX 4070 Super 12GB",
    category: "Graphics Cards",
    brand: "MSI",
    price: 245000,
    originalPrice: 268000,
    inStock: true,
    stockCount: 4,
    badge: "1440p Master",
    rating: 4.9,
    reviews: 49,
    specs: ["12GB GDDR6X VRAM", "DLSS 3.5 Frame Gen", "7168 CUDA Cores", "TORX Fan 4.0", "HDMI 2.1a & DP 1.4a"],
    description: "Incredible 1440p ray-tracing powerhouse equipped with NVIDIA Ada Lovelace architecture and ultra-efficient DLSS 3.5 AI upscaling.",
    warranty: "3 Years Local Warranty",
  },
  {
    id: "gpu-2",
    name: "ASUS TUF Gaming GeForce RTX 4060 Ti 8GB OC",
    category: "Graphics Cards",
    brand: "ASUS",
    price: 168000,
    originalPrice: 185000,
    inStock: true,
    stockCount: 7,
    badge: "Military Grade",
    rating: 4.8,
    reviews: 33,
    specs: ["8GB GDDR6 VRAM", "Factory Overclocked", "Axial-tech Triple Fans", "Dual BIOS Switch", "Metal Backplate"],
    description: "TUF Gaming components built for maximum reliability, extreme durability, and whisper-quiet cooling during extended gaming sessions.",
    warranty: "3 Years ASUS Warranty",
  },
  {
    id: "gpu-3",
    name: "MSI GeForce RTX 3060 Ventus 2X 12GB",
    category: "Graphics Cards",
    brand: "MSI",
    price: 108000,
    inStock: false,
    stockCount: 0,
    badge: "High VRAM",
    rating: 4.7,
    reviews: 95,
    specs: ["12GB GDDR6 Memory", "Ray Tracing Cores", "Dual Fan Cooling", "Zero Frozr Tech", "170W Power Draw"],
    description: "Generous 12GB VRAM makes this a favorite for 3D modeling, video rendering, and solid 1080p high-settings gaming.",
    warranty: "3 Years Local Warranty",
  },

  // --- MOTHERBOARDS ---
  {
    id: "mb-1",
    name: "ASUS ROG Strix B650-A Gaming WiFi Motherboard",
    category: "Motherboards",
    brand: "ASUS",
    price: 89000,
    originalPrice: 98000,
    inStock: true,
    stockCount: 5,
    badge: "White Theme",
    rating: 4.9,
    reviews: 21,
    specs: ["AM5 Socket for Ryzen 7000/8000", "PCIe 5.0 M.2 Support", "12+2 Power Stages", "Wi-Fi 6E & 2.5G LAN", "DDR5 up to 7600+ MHz"],
    description: "Stunning silver-white aesthetic with beefy heatsinks, front USB-C 20Gbps, and SupremeFX ALC4080 premium gaming audio.",
    warranty: "3 Years ASUS Warranty",
  },
  {
    id: "mb-2",
    name: "MSI MAG B760 Tomahawk WiFi DDR5",
    category: "Motherboards",
    brand: "MSI",
    price: 82500,
    inStock: true,
    stockCount: 6,
    rating: 4.8,
    reviews: 28,
    specs: ["Intel LGA 1700 Socket", "DDR5 Dual Channel", "Triple M.2 Shield Frozr", "Wi-Fi 6E Onboard", "Extended Heatsink Design"],
    description: "Built for gamers wanting rock-solid stability for Intel 13th & 14th gen processors without expensive Z-series pricing.",
    warranty: "3 Years MSI Warranty",
  },

  // --- MEMORY (RAM) ---
  {
    id: "ram-1",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    category: "Memory",
    brand: "Corsair",
    price: 42500,
    originalPrice: 47000,
    inStock: true,
    stockCount: 14,
    badge: "Popular Kit",
    rating: 4.9,
    reviews: 77,
    specs: ["32GB (2 x 16GB)", "DDR5 6000MHz CL30", "AMD EXPO & Intel XMP 3.0", "Ten-Zone Dynamic RGB", "Aluminum Heat Spreader"],
    description: "Optimized for next-gen AMD AM5 and Intel rigs with tight CL30 timings for peak responsiveness and mesmerizing iCUE RGB lighting.",
    warranty: "Lifetime Manufacturer Warranty",
  },
  {
    id: "ram-2",
    name: "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz",
    category: "Memory",
    brand: "Kingston",
    price: 13500,
    inStock: true,
    stockCount: 25,
    rating: 4.8,
    reviews: 110,
    specs: ["16GB Kit (2 x 8GB)", "DDR4 3200MHz CL16", "Low Profile Heatsink", "Plug N Play at 2666MHz", "Intel XMP Ready"],
    description: "The most trusted DDR4 kit in Sri Lanka. Low profile design fits under virtually any large CPU tower cooler.",
    warranty: "Lifetime Warranty",
  },

  // --- STORAGE ---
  {
    id: "ssd-1",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD",
    category: "Storage",
    brand: "Samsung",
    price: 65000,
    originalPrice: 72000,
    inStock: true,
    stockCount: 8,
    badge: "Extreme Speed",
    rating: 5.0,
    reviews: 64,
    specs: ["2TB Capacity", "Read up to 7,450 MB/s", "Write up to 6,900 MB/s", "Nickel-Coated Controller", "Samsung Magician Software"],
    description: "The ultimate PCIe 4.0 SSD for PlayStation 5 and high-end PC workstations. Instant game loading with near-zero lag.",
    warranty: "5 Years Official Warranty",
  },
  {
    id: "ssd-2",
    name: "Kingston NV2 1TB PCIe 4.0 NVMe SSD",
    category: "Storage",
    brand: "Kingston",
    price: 22500,
    inStock: true,
    stockCount: 19,
    badge: "Value Pick",
    rating: 4.6,
    reviews: 92,
    specs: ["1TB Storage", "Read up to 3,500 MB/s", "Write up to 2,100 MB/s", "Single-Sided M.2 2280", "Gen 4x4 Controller"],
    description: "Super fast boot drives and bulk storage for budget to mid-tier gaming setups. Low heat and power consumption.",
    warranty: "3 Years Warranty",
  },

  // --- MONITORS ---
  {
    id: "mon-1",
    name: "ASUS TUF Gaming VG27AQ 27-inch QHD 165Hz Monitor",
    category: "Monitors",
    brand: "ASUS",
    price: 98000,
    originalPrice: 110000,
    inStock: true,
    stockCount: 4,
    badge: "G-Sync Ready",
    rating: 4.9,
    reviews: 42,
    specs: ["27-inch IPS Panel", "2560 x 1440 2K QHD", "165Hz Refresh Rate", "1ms MPRT ELMB-Sync", "HDR10 & 99% sRGB"],
    description: "Crystal clear 1440p gaming monitor with ASUS Extreme Low Motion Blur Sync and fully ergonomic stand (height, swivel, pivot).",
    warranty: "3 Years ASUS Warranty",
  },
  {
    id: "mon-2",
    name: "ViewSonic Omni 24-inch 165Hz IPS Gaming Monitor",
    category: "Monitors",
    brand: "ViewSonic",
    price: 52000,
    inStock: true,
    stockCount: 9,
    rating: 4.7,
    reviews: 35,
    specs: ["24-inch IPS Display", "1920 x 1080 Full HD", "165Hz Smooth Refresh", "AMD FreeSync Premium", "Dual HDMI & DP"],
    description: "Crisp IPS colors with high refresh rate for competitive esports titles like Valorant, CS2 and Apex Legends.",
    warranty: "3 Years Warranty",
  },

  // --- GAMING ACCESSORIES ---
  {
    id: "acc-1",
    name: "Razer BlackWidow V4 Mechanical RGB Gaming Keyboard",
    category: "Gaming Accessories",
    brand: "Razer",
    price: 36500,
    originalPrice: 42000,
    inStock: true,
    stockCount: 6,
    badge: "Top Tier",
    rating: 4.8,
    reviews: 47,
    specs: ["Razer Green Clicky Switches", "Chroma RGB Per-Key Lighting", "Dedicated Multi-Function Roller", "Plush Leatherette Wrist Rest", "8000Hz Polling Rate"],
    description: "Tactile satisfying clicks with zero latency HyperPolling technology. Double-shot ABS keycaps for enduring durability.",
    warranty: "2 Years Razer Warranty",
  },
  {
    id: "acc-2",
    name: "Logitech G502 HERO High Performance Gaming Mouse",
    category: "Gaming Accessories",
    brand: "Logitech",
    price: 19500,
    inStock: true,
    stockCount: 15,
    badge: "Legendary",
    rating: 5.0,
    reviews: 140,
    specs: ["HERO 25K Sensor", "100 to 25,600 DPI", "11 Programmable Buttons", "Tunable Weight System (5x 3.6g)", "LIGHTSYNC RGB"],
    description: "The world's favorite gaming mouse. Perfect tracking accuracy, sniper DPI shift button, and customizable weight balance.",
    warranty: "2 Years Official Warranty",
  },
  {
    id: "acc-3",
    name: "HyperX Cloud II Wireless 7.1 Gaming Headset",
    category: "Gaming Accessories",
    brand: "HyperX",
    price: 39500,
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviews: 58,
    specs: ["2.4GHz Low Latency Wireless", "Up to 30 Hours Battery", "HyperX Signature Memory Foam", "53mm Drivers", "Detachable Noise-Cancelling Mic"],
    description: "Iconic Cloud comfort with spatial audio precision. Hear enemy footsteps and directions with pin-point accuracy.",
    warranty: "2 Years TechNova Warranty",
  },

  // --- POWER SUPPLIES & COOLING ---
  {
    id: "psu-1",
    name: "Corsair RM850e 850W 80+ Gold Fully Modular ATX 3.0",
    category: "Power Supplies",
    brand: "Corsair",
    price: 48000,
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviews: 29,
    specs: ["850W True Power", "80 PLUS Gold Certified", "PCIe 5.0 12VHPWR Cable", "Zero RPM Fan Mode", "105°C Rated Capacitors"],
    description: "Native support for modern RTX 40-series graphics cards with included 12VHPWR cable. Super quiet 120mm rifle bearing fan.",
    warranty: "7 Years Manufacturer Warranty",
  },
  {
    id: "cool-1",
    name: "DeepCool AK620 High Performance Dual-Tower CPU Cooler",
    category: "Cooling",
    brand: "DeepCool",
    price: 22500,
    inStock: true,
    stockCount: 8,
    badge: "Air Master",
    rating: 4.8,
    reviews: 36,
    specs: ["260W TDP Dissipation", "6 Advanced Heatpipes", "Dual 120mm FDB PWM Fans", "Checkerboard Fin Matrix", "AM5 & LGA1700 Ready"],
    description: "Liquid cooler performance at air cooler reliability. Handles modern high-TDP Ryzen and Intel processors easily.",
    warranty: "3 Years Warranty",
  },
];

type FeaturedProductsProps = {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
};

export default function FeaturedProducts({
  selectedCategory = "All",
  onSelectCategory,
}: FeaturedProductsProps) {
  const { addToCart, openCheckout } = useCart();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Quick filter tab options
  const filterTabs = [
    { label: "All Products", key: "All" },
    { label: "Laptops", key: "Laptops" },
    { label: "Processors", key: "Processors" },
    { label: "Graphics Cards", key: "Graphics Cards" },
    { label: "Motherboards", key: "Motherboards" },
    { label: "RAM", key: "Memory" },
    { label: "Storage", key: "Storage" },
    { label: "Monitors", key: "Monitors" },
    { label: "Accessories", key: "Gaming Accessories" },
  ];

  // Filter products by selectedCategory
  const filteredProducts =
    selectedCategory === "All" || !selectedCategory
      ? allDemoProducts
      : allDemoProducts.filter((p) => {
          const matchKey = selectedCategory.toLowerCase();
          const prodCat = p.category.toLowerCase();
          return prodCat.includes(matchKey) || matchKey.includes(prodCat);
        });

  // Decide how many products to display
  // If a category filter is active, show all matching products.
  // If "All" is active, show 8 items initially, or all 20+ when "Explore All" is clicked.
  const displayedProducts =
    selectedCategory !== "All"
      ? filteredProducts
      : showAllProducts
      ? filteredProducts
      : filteredProducts.slice(0, 8);

  function handleAddToCart(product: Product, qty: number = 1) {
    addToCart(product, qty, true);
    setToastMessage(`✓ Added ${qty}x "${product.name}" to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  function openProductDetails(product: Product) {
    setActiveModalProduct(product);
    setQuantity(1);
  }

  return (
    <section
      id="featured-products"
      aria-labelledby="featured-heading"
      className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading & Filter Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                TECHNOVA CATALOG
              </span>
              <span className="text-xs font-semibold text-slate-400">
                • {filteredProducts.length} Products Available
              </span>
            </div>

            <h2
              id="featured-heading"
              className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              {selectedCategory === "All" ? (
                <>Featured <span className="text-blue-400">Products</span></>
              ) : (
                <>{selectedCategory} <span className="text-blue-400">Collection</span></>
              )}
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-300 sm:text-sm">
              Authentic hardware with official local warranties and competitive prices in Sri Lanka.
            </p>
          </div>

          {/* Header Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200 transition-colors hover:bg-blue-500/20 hover:text-white"
            >
              <span>{showAllProducts ? "Show Featured (8)" : "View Full Catalog"}</span>
              <span aria-hidden="true">{showAllProducts ? "▲" : "▼"}</span>
            </button>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCategory?.("All")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Clear Filter ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Tabs Carousel */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => {
            const isTabActive =
              (tab.key === "All" && selectedCategory === "All") ||
              (tab.key !== "All" && selectedCategory.toLowerCase().includes(tab.key.toLowerCase()));

            return (
              <button
                type="button"
                key={tab.key}
                onClick={() => onSelectCategory?.(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isTabActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-slate-950/95 px-5 py-3.5 text-sm font-semibold text-emerald-300 shadow-2xl shadow-emerald-950/60 backdrop-blur-md animate-bounce"
          >
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onViewDetails={openProductDetails}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-3 text-lg font-bold text-white">No products found for &quot;{selectedCategory}&quot;</h3>
            <p className="mt-1 text-sm text-slate-400">
              Try selecting another category or view all products.
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory?.("All")}
              className="mt-4 inline-flex rounded-xl bg-white px-5 py-2.5 text-xs font-bold !text-black hover:bg-blue-50"
            >
              Browse All Products
            </button>
          </div>
        )}

        {/* Bottom Expand / View All Action */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:mt-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/10 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500/25 active:scale-95"
            >
              <span>{showAllProducts ? "Show Fewer Products" : "Explore All Products (" + allDemoProducts.length + ")"}</span>
              <span aria-hidden="true">{showAllProducts ? "▲" : "→"}</span>
            </button>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCategory?.("All")}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Reset Filter
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            {showAllProducts
              ? `Showing all ${allDemoProducts.length} products across all categories.`
              : `Showing ${displayedProducts.length} of ${filteredProducts.length} products. Click Explore All to reveal the entire catalog.`}
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRODUCT DETAILS MODAL (Quick Specs & In-Depth Details)        */}
      {/* ============================================================== */}
      {activeModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/75 transition-opacity"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-slate-950 p-6 shadow-2xl shadow-blue-950/80 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalProduct(null)}
              aria-label="Close dialog"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg font-bold text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Content Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pr-10">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-300">
                  {activeModalProduct.category}
                </span>
                {activeModalProduct.brand && (
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-300">
                    {activeModalProduct.brand}
                  </span>
                )}
                {activeModalProduct.badge && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                    {activeModalProduct.badge}
                  </span>
                )}
              </div>

              {activeModalProduct.rating && (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-300 sm:mt-0">
                  <span>★</span>
                  <span>{activeModalProduct.rating.toFixed(1)} / 5.0</span>
                  <span className="text-slate-400 font-normal">
                    ({activeModalProduct.reviews} customer reviews)
                  </span>
                </div>
              )}
            </div>

            <h3
              id="modal-title"
              className="mt-3 text-xl font-extrabold text-white sm:text-2xl"
            >
              {activeModalProduct.name}
            </h3>

            {/* Description */}
            {activeModalProduct.description && (
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {activeModalProduct.description}
              </p>
            )}

            {/* Price & Savings */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-2xl font-black text-white sm:text-3xl">
                Rs. {activeModalProduct.price.toLocaleString("en-LK")}
              </span>
              {activeModalProduct.originalPrice && activeModalProduct.originalPrice > activeModalProduct.price && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    Rs. {activeModalProduct.originalPrice.toLocaleString("en-LK")}
                  </span>
                  <span className="rounded-full bg-rose-500/20 border border-rose-400/30 px-2.5 py-0.5 text-xs font-extrabold text-rose-300">
                    Save Rs. {(activeModalProduct.originalPrice - activeModalProduct.price).toLocaleString("en-LK")}
                  </span>
                </>
              )}
            </div>

            {/* Detailed Technical Specifications Table */}
            {activeModalProduct.specs && activeModalProduct.specs.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technical Specifications & Key Features:
                </h4>
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeModalProduct.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-slate-200"
                    >
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Availability Info */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="block text-slate-400">Availability:</span>
                <span className={`mt-1 font-bold ${activeModalProduct.inStock ? "text-emerald-400" : "text-rose-400"}`}>
                  {activeModalProduct.inStock
                    ? `In Stock (${activeModalProduct.stockCount || 5} units available)`
                    : "Currently Out of Stock"}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="block text-slate-400">Warranty Coverage:</span>
                <span className="mt-1 font-bold text-white">
                  🛡️ {activeModalProduct.warranty || "1 Year TECHNOVA Warranty"}
                </span>
              </div>
            </div>

            {/* Quantity & Purchase Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Quantity selector */}
              <div className="flex items-center rounded-xl border border-white/20 bg-white/5 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-bold text-white hover:text-blue-300"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 font-bold text-white hover:text-blue-300"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                disabled={!activeModalProduct.inStock}
                onClick={() => {
                  handleAddToCart(activeModalProduct, quantity);
                  setActiveModalProduct(null);
                }}
                className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-bold !text-black shadow-lg hover:bg-blue-50 active:scale-95 disabled:opacity-50"
              >
                {activeModalProduct.inStock ? `Add ${quantity} to Cart` : "Out of Stock"}
              </button>

              {/* Instant Buy button */}
              <button
                type="button"
                disabled={!activeModalProduct.inStock}
                onClick={() => {
                  addToCart(activeModalProduct, quantity, false);
                  setActiveModalProduct(null);
                  openCheckout();
                }}
                className="rounded-xl border border-blue-400/50 bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 active:scale-95 disabled:opacity-50"
              >
                Buy Now (PayHere) →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
