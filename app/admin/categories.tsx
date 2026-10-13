"use client";

import React, { useState } from "react";
import { mockAdminCategories, type AdminCategory } from "@/lib/adminData";

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>(mockAdminCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
  });

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const newCat: AdminCategory = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: form.name,
      description: form.description,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      itemCount: 0,
    };

    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    setForm({ name: "", description: "", slug: "" });
    setToast("Category added successfully!");
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            🗂️ Taxonomy & Classification
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Category Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Organize hardware components and peripherals into structured business categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <span>+ Add Category</span>
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between hover:border-blue-400/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/20 text-lg text-blue-400">
                  📁
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                  {cat.itemCount} Products
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{cat.name}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {cat.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>/{cat.slug}</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Add Product Category</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liquid Coolers (AIO)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Slug (URL Path)</label>
                <input
                  type="text"
                  placeholder="e.g. liquid-coolers"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="240mm, 360mm CPU liquid cooling systems..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

