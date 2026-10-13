"use client";

import React, { useState, useMemo } from "react";
import {
  mockSupplierProducts,
  mockShopBranches,
  type SupplierProduct,
  type ShopBranch,
} from "@/lib/supplierData";

export default function SupplierProducts() {
  const [products, setProducts] = useState<SupplierProduct[]>(mockSupplierProducts);
  const [branches] = useState<ShopBranch[]>(mockShopBranches);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("ASUS ROG");
  const [newCategory, setNewCategory] = useState("Graphics Cards (GPUs)");
  const [newSku, setNewSku] = useState("");
  const [newWholesale, setNewWholesale] = useState<number | "">("");
  const [newMsrp, setNewMsrp] = useState<number | "">("");
  const [newStock, setNewStock] = useState<number | "">("");
  const [newMoq, setNewMoq] = useState<number | "">(2);
  const [newWarranty, setNewWarranty] = useState("3 Years Agent Warranty");

  // Dispatch Stock to Shop Modal State
  const [dispatchModalProduct, setDispatchModalProduct] = useState<SupplierProduct | null>(null);
  const [targetShop, setTargetShop] = useState(branches[0].name);
  const [dispatchQty, setDispatchQty] = useState(5);
  const [toastMessage, setToastMessage] = useState("");

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  const brands = ["All", "ASUS ROG", "MSI", "AMD Ryzen", "Corsair", "Samsung Semiconductor", "Gigabyte"];

  const filtered = useMemo(() => {
    return products.filter((prod) => {
      const matchBrand = selectedBrand === "All" || prod.brand === selectedBrand;
      const matchSearch =
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.sku.toLowerCase().includes(search.toLowerCase()) ||
        prod.category.toLowerCase().includes(search.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [products, selectedBrand, search]);

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newSku.trim() || !newWholesale || !newMsrp || !newStock) {
      alert("Please fill in all required fields.");
      return;
    }

    const created: SupplierProduct = {
      id: `sp-${Date.now()}`,
      name: newName.trim(),
      brand: newBrand,
      category: newCategory,
      sku: newSku.trim().toUpperCase(),
      wholesalePrice: Number(newWholesale),
      retailMSRP: Number(newMsrp),
      availableStock: Number(newStock),
      minOrderQty: Number(newMoq) || 1,
      warrantyPeriod: newWarranty,
      status: Number(newStock) > 5 ? "In Stock" : "Low Supply",
    };

    setProducts([created, ...products]);
    setShowAddModal(false);
    setNewName("");
    setNewSku("");
    setNewWholesale("");
    setNewMsrp("");
    setNewStock("");
    triggerToast(`Added ${created.name} to wholesale catalog.`);
  }

  function handleDispatchStock(e: React.FormEvent) {
    e.preventDefault();
    if (!dispatchModalProduct) return;

    if (dispatchQty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (dispatchQty > dispatchModalProduct.availableStock) {
      alert(`Only ${dispatchModalProduct.availableStock} units available in warehouse.`);
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === dispatchModalProduct.id
          ? {
              ...p,
              availableStock: p.availableStock - dispatchQty,
              status: p.availableStock - dispatchQty <= 5 ? "Low Supply" : "In Stock",
            }
          : p
      )
    );

    triggerToast(`Successfully dispatched ${dispatchQty} units of ${dispatchModalProduct.name} to ${targetShop}!`);
    setDispatchModalProduct(null);
    setDispatchQty(5);
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-950/90 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-xl">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
            📦 Distributor Hardware Inventory
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Wholesale Catalog & Shop Supply
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Manage hardware components supplied to TECHNOVA shop counters, configure wholesale supply pricing, and dispatch bulk stock batches.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-xs font-bold text-white hover:bg-cyan-500 transition shadow-lg shadow-cyan-600/30 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product to Catalog</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wholesale hardware by part name, SKU, or category..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:border-cyan-500 outline-none backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                selectedBrand === b
                  ? "border-cyan-400 bg-cyan-600 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Wholesale Products Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Product Name & Brand</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">SKU Code</th>
                <th className="py-3 px-3 text-right">Wholesale Price</th>
                <th className="py-3 px-3 text-right">Retail MSRP</th>
                <th className="py-3 px-3 text-center">Warehouse Stock</th>
                <th className="py-3 px-3">Warranty</th>
                <th className="py-3 px-3 text-center">Supply Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-bold text-white text-xs">{prod.name}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                      {prod.brand}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{prod.category}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {prod.sku}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    Rs. {prod.wholesalePrice.toLocaleString("en-LK")}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    Rs. {prod.retailMSRP.toLocaleString("en-LK")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        prod.availableStock <= 5
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {prod.availableStock} units
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-[11px]">
                    {prod.warrantyPeriod}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setDispatchModalProduct(prod)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600/30 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-600 hover:text-white transition shadow"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Dispatch to Shop</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Product to Catalog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Add Wholesale Product to Distribution Catalog
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Product Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Corsair Dominator Platinum 32GB DDR5 6400MHz"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Brand *
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    {brands.filter((b) => b !== "All").map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Graphics Cards (GPUs)">Graphics Cards (GPUs)</option>
                    <option value="Processors (CPUs)">Processors (CPUs)</option>
                    <option value="Laptops & Notebooks">Laptops & Notebooks</option>
                    <option value="RAM & Memory">RAM & Memory</option>
                    <option value="Storage (SSDs)">Storage (SSDs)</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="Monitors">Monitors</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    SKU / Part Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. CMT32GX5M2B6400C32"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Initial Warehouse Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 20"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Wholesale Supply Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newWholesale}
                    onChange={(e) => setNewWholesale(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 48000"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Retail Shop MSRP (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newMsrp}
                    onChange={(e) => setNewMsrp(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 56000"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Min Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    value={newMoq}
                    onChange={(e) => setNewMoq(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Warranty Period
                  </label>
                  <input
                    type="text"
                    value={newWarranty}
                    onChange={(e) => setNewWarranty(e.target.value)}
                    placeholder="e.g. 3 Years Distributor Warranty"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyan-600 py-2.5 font-bold text-white hover:bg-cyan-500 transition shadow"
                >
                  Save to Wholesale Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Stock to Shop */}
      {dispatchModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white">
                Dispatch Stock to Shop Branch
              </h3>
              <button
                onClick={() => setDispatchModalProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDispatchStock} className="mt-4 space-y-4 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                <div className="font-bold text-white text-sm">
                  {dispatchModalProduct.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  SKU: {dispatchModalProduct.sku}
                </div>
                <div className="text-xs text-emerald-400 font-mono pt-1">
                  Available in Warehouse: {dispatchModalProduct.availableStock} units
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Select Destination Retail Shop Branch *
                </label>
                <select
                  value={targetShop}
                  onChange={(e) => setTargetShop(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Dispatch Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={dispatchModalProduct.availableStock}
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 flex justify-between items-center font-mono">
                <span className="text-slate-300">Total Supply Invoice:</span>
                <span className="font-bold text-white text-sm">
                  Rs. {(dispatchQty * dispatchModalProduct.wholesalePrice).toLocaleString("en-LK")}
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyan-600 py-2.5 font-bold text-white hover:bg-cyan-500 transition shadow"
                >
                  Confirm & Dispatch Stock
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchModalProduct(null)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

