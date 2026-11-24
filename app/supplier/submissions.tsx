"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import { apiFetch, API_URL } from "@/lib/auth";
import { getStoredSupplierProfile } from "./profile";

interface SupplierContext {
  supplier_id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  status: string;
}

interface Submission {
  id: number;
  name: string;
  brand: string;
  category_name: string;
  sku: string;
  description: string | null;
  image_url: string | null;
  wholesale_price: number | string;
  available_stock: number;
  warranty_period: string | null;
  submission_status: "Pending" | "Approved" | "Rejected";
  rejection_reason: string | null;
  admin_selling_price: number | string | null;
  published_product_id: number | null;
  submitted_at: string;
  reviewed_at: string | null;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function fileUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = API_URL.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

const emptyForm = {
  name: "",
  brand: "",
  category_name: "",
  sku: "",
  description: "",
  wholesale_price: "",
  available_stock: "",
  warranty_period: "",
};

export default function SupplierSubmissions() {
  const [context, setContext] = useState<SupplierContext | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (supplierId: number) => {
    setLoading(true);
    setError("");
    try {
      const [subs, notes] = await Promise.all([
        apiFetch<Submission[]>(`/suppliers/${supplierId}/submissions`),
        apiFetch<Notification[]>(`/suppliers/${supplierId}/notifications`),
      ]);
      setSubmissions(Array.isArray(subs) ? subs : []);
      setNotifications(Array.isArray(notes) ? notes : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch<SupplierContext>("/auth/supplier-context")
      .then((ctx) => {
        if (!active) return;
        setContext(ctx);
        const stored = getStoredSupplierProfile();
        if (stored) {
          setForm((f) => ({
            ...f,
            brand: f.brand || "",
            category_name: f.category_name || "",
          }));
        }
        void load(ctx.supplier_id);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load your supplier account.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!context) return;
    if (!form.name.trim() || !form.sku.trim()) {
      alert("Please provide the product name and SKU.");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.set("name", form.name.trim());
      data.set("brand", form.brand.trim());
      data.set("category_name", form.category_name.trim());
      data.set("sku", form.sku.trim());
      data.set("description", form.description.trim());
      data.set("wholesale_price", form.wholesale_price || "0");
      data.set("available_stock", form.available_stock || "0");
      data.set("warranty_period", form.warranty_period.trim());
      if (image) data.set("image", image);

      await apiFetch(`/suppliers/${context.supplier_id}/submissions`, {
        method: "POST",
        body: data,
      });
      setForm({ ...emptyForm });
      setImage(null);
      setToast("Product submitted to admin for approval. You can track its status below.");
      await load(context.supplier_id);
      setTimeout(() => setToast(""), 4500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function markRead(notificationId: number) {
    if (!context) return;
    try {
      await apiFetch(`/suppliers/${context.supplier_id}/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)),
      );
    } catch {
      // ignore - refresh will show authoritative state
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Submit Products to TECHNOVA</h1>
        <p className="mt-1 text-xs text-slate-300">
          Upload product details and an image for admin review. Once approved, the admin sets the selling price and
          store category and publishes it on the home page.
        </p>
        {context && (
          <p className="mt-2 text-[11px] text-cyan-300">
            Submitting as {context.company_name} ({context.email})
          </p>
        )}
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
          <h2 className="text-base font-extrabold text-white">New Product Submission</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product Name <span className="text-rose-400">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                placeholder="e.g. MSI RTX 4070 Ti Super 16GB"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">SKU / Part Code <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono uppercase focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Suggested Category</label>
                <input
                  type="text"
                  value={form.category_name}
                  onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  placeholder="e.g. Graphics Cards"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Wholesale Price (LKR)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.wholesale_price}
                  onChange={(e) => setForm({ ...form, wholesale_price: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Available Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.available_stock}
                  onChange={(e) => setForm({ ...form, available_stock: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Warranty</label>
                <input
                  type="text"
                  value={form.warranty_period}
                  onChange={(e) => setForm({ ...form, warranty_period: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white"
              />
              <p className="mt-1 text-[10px] text-slate-500">JPG, PNG, WEBP or GIF, up to 5MB.</p>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description / Specifications</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !context}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-extrabold text-white shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit to Admin for Approval"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h2 className="text-base font-extrabold text-white">My Submissions</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Track approval status and admin feedback.</p>
            {loading ? (
              <div className="mt-4 text-xs text-slate-300">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
                No submissions yet. Use the form to submit your first product.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-4">
                    {sub.image_url ? (
                      <img src={fileUrl(sub.image_url)} alt={sub.name} className="h-16 w-16 rounded-xl object-cover border border-white/10 bg-slate-950" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl border border-dashed border-white/15 bg-slate-950/60 flex items-center justify-center text-[10px] text-slate-500">No image</div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{sub.name}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          sub.submission_status === "Pending"
                            ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                            : sub.submission_status === "Approved"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border-rose-500/30 bg-rose-500/15 text-rose-300"
                        }`}>{sub.submission_status}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">SKU: <span className="font-mono">{sub.sku}</span> • Submitted: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "—"}</div>
                      {sub.submission_status === "Approved" && (
                        <div className="text-[11px] text-emerald-300">
                          Approved at LKR {Number(sub.admin_selling_price || 0).toLocaleString("en-LK")}
                          {sub.published_product_id ? " • Published to store catalogue" : ""}
                        </div>
                      )}
                      {sub.submission_status === "Rejected" && sub.rejection_reason && (
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-[11px] text-rose-200">
                          <span className="font-bold">Reason:</span> {sub.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
            <h2 className="text-base font-extrabold text-white">Notifications from ADMIN</h2>
            {notifications.length === 0 ? (
              <div className="mt-3 text-xs text-slate-400">No notifications yet.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void markRead(n.id)}
                    className={`w-full text-left rounded-2xl border p-3.5 transition ${
                      n.is_read
                        ? "border-white/10 bg-white/5"
                        : "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{n.title}</span>
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shrink-0" />}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">{n.message}</p>
                    <div className="mt-1 text-[10px] text-slate-500">{new Date(n.created_at).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
