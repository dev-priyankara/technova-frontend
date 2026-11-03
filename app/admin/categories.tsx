"use client";

import React, { useEffect, useState } from "react";
import type { AdminCategory } from "@/lib/adminData";
import type { CategoryRecord } from "@/lib/categories";
import { apiFetch } from "@/lib/auth";

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    slug: "",
  });

  async function loadCategories() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await apiFetch<CategoryRecord[]>("/categories");
      setCategories(data.map((category) => ({
        id: String(category.id),
        name: category.name,
        description: category.description ?? "",
        itemCount: category.item_count,
        slug: category.slug,
      })));
    } catch (error) {
      setCategories([]);
      setLoadError(error instanceof Error ? error.message : "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void apiFetch<CategoryRecord[]>("/categories")
      .then((data) => {
        setCategories(data.map((category) => ({
          id: String(category.id),
          name: category.name,
          description: category.description ?? "",
          itemCount: category.item_count,
          slug: category.slug,
        })));
      })
      .catch((error: unknown) => {
        setCategories([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load categories.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter(
    (c) =>
      search.trim() === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await apiFetch<CategoryRecord>("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          slug: form.slug ? form.slug.trim().toLowerCase() : undefined,
        }),
      });

      const newCat: AdminCategory = {
        id: String(created.id),
        name: created.name,
        description: created.description ?? "",
        slug: created.slug,
        itemCount: created.item_count,
      };

      setCategories((current) => [...current, newCat]);
      setIsModalOpen(false);
      setForm({ name: "", description: "", slug: "" });
      setToast("Category added successfully and saved to database!");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add category.");
    }
  }

  function openEditModal(cat: AdminCategory) {
    setEditingCategory(cat);
    setEditForm({
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
    });
    setIsEditModalOpen(true);
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const response = await apiFetch<CategoryRecord>(`/categories/${editingCategory.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          slug: editForm.slug.trim().toLowerCase(),
        }),
      });

      const updated: AdminCategory = {
        id: String(response.id),
        name: response.name,
        description: response.description ?? "",
        slug: response.slug,
        itemCount: response.item_count,
      };

      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategory.id ? updated : category,
        ),
      );
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setToast(`Category "${updated.name}" updated successfully!`);
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update category.");
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" });
      setCategories((current) => current.filter((category) => category.id !== id));
      setToast(`Category "${name}" deleted successfully.`);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Category Management
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Organize hardware components, set URL slugs, and inspect catalog distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>＋</span>
          <span>Add New Category</span>
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Could not load categories: {loadError}</span>
          <button
            type="button"
            onClick={loadCategories}
            className="rounded-lg border border-rose-400/30 px-3 py-1.5 font-bold hover:bg-rose-500/10"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs text-slate-400 font-semibold">
          Showing <span className="text-white font-bold">{filteredCategories.length}</span> of {categories.length} categories
        </div>

        <div className="relative min-w-[260px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search category name, slug or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-xs text-slate-400">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400 text-xs">
              No categories found matching &quot;{search}&quot;.
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between hover:border-blue-400/40 transition-colors group"
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
                  <h3 className="mt-3 text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {cat.description || "Hardware catalogue classification."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="truncate max-w-[110px]">/{cat.slug}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="rounded-lg p-1 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors cursor-pointer"
                      title="Edit category"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Add Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">Add Product Category</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
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
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none font-mono"
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
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Edit Category</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">ID: {editingCategory.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Slug (URL Path)</label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
