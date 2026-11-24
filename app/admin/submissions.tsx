"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch, API_URL } from "@/lib/auth";
import type { CategoryRecord } from "@/lib/categories";

type SubmissionStatus = "Pending" | "Approved" | "Rejected";

interface SupplierSubmission {
  id: number;
  supplier_id: number;
  supplier_name: string | null;
  supplier_email: string | null;
  name: string;
  brand: string;
  category_name: string;
  sku: string;
  description: string | null;
  image_url: string | null;
  wholesale_price: number | string;
  available_stock: number;
  warranty_period: string | null;
  submission_status: SubmissionStatus;
  rejection_reason: string | null;
  admin_selling_price: number | string | null;
  admin_category_id: number | null;
  admin_category_name: string | null;
  published_product_id: number | null;
  submitted_at: string;
  reviewed_at: string | null;
}

function fileUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = API_URL.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function money(value: number | string | null | undefined): string {
  const n = Number(value || 0);
  return `Rs. ${n.toLocaleString("en-LK", { maximumFractionDigits: 2 })}`;
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<SupplierSubmission[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | SubmissionStatus>("Pending");

  const [approveTarget, setApproveTarget] = useState<SupplierSubmission | null>(null);
  const [rejectTarget, setRejectTarget] = useState<SupplierSubmission | null>(null);
  const [approveForm, setApproveForm] = useState({
    selling_price: "",
    category_id: "",
    name: "",
    sku: "",
    description: "",
    stock_count: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [subs, cats] = await Promise.all([
        apiFetch<SupplierSubmission[]>("/admin/supplier-submissions"),
        apiFetch<CategoryRecord[]>("/categories"),
      ]);
      setSubmissions(Array.isArray(subs) ? subs : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load supplier submissions.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Defer to a microtask so the fetch starts after the effect body, which
    // keeps React's state updates out of the synchronous effect path.
    queueMicrotask(() => void load());
  }, [load]);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return submissions;
    return submissions.filter((s) => s.submission_status === statusFilter);
  }, [submissions, statusFilter]);

  const pendingCount = submissions.filter((s) => s.submission_status === "Pending").length;

  function openApprove(sub: SupplierSubmission) {
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === (sub.category_name || "").toLowerCase(),
    );
    setApproveTarget(sub);
    setApproveForm({
      selling_price: sub.admin_selling_price ? String(sub.admin_selling_price) : "",
      category_id: sub.admin_category_id
        ? String(sub.admin_category_id)
        : matchedCategory
        ? String(matchedCategory.id)
        : categories[0]
        ? String(categories[0].id)
        : "",
      name: sub.name || "",
      sku: sub.sku || "",
      description: sub.description || "",
      stock_count: String(sub.available_stock ?? 0),
    });
  }

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!approveTarget) return;
    if (!approveForm.selling_price || !approveForm.category_id) {
      alert("Please set a selling price and select a category.");
      return;
    }
    setBusy(true);
    try {
      await apiFetch(`/admin/supplier-submissions/${approveTarget.id}/approve`, {
        method: "POST",
        body: JSON.stringify({
          selling_price: Number(approveForm.selling_price),
          category_id: Number(approveForm.category_id),
          name: approveForm.name.trim() || undefined,
          sku: approveForm.sku.trim() || undefined,
          description: approveForm.description.trim() || undefined,
          stock_count:
            approveForm.stock_count === "" ? undefined : Number(approveForm.stock_count),
        }),
      });
      setToast(`Approved "${approveTarget.name}" and published it to the store catalogue.`);
      setApproveTarget(null);
      await load();
      setTimeout(() => setToast(""), 4500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve submission.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason for the supplier.");
      return;
    }
    setBusy(true);
    try {
      await apiFetch(`/admin/supplier-submissions/${rejectTarget.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      setToast(`Rejected "${rejectTarget.name}". The supplier has been notified with your reason.`);
      setRejectTarget(null);
      setRejectReason("");
      await load();
      setTimeout(() => setToast(""), 4500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject submission.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">Supplier Product Submissions</h1>
          <p className="mt-1 text-xs text-slate-300">
            Review products submitted by suppliers. Approve to set selling price and category and publish to the home
            page, or reject with a reason to notify the supplier.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/10"
        >
          Refresh
        </button>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          ✓ {toast}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {(["Pending", "Approved", "Rejected", "All"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              statusFilter === s
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "border border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10"
            }`}
          >
            {s}
            {s === "Pending" ? ` (${pendingCount})` : ""}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-300">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No submissions found for this filter.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((sub) => (
              <div key={sub.id} className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-44 shrink-0">
                  {sub.image_url ? (
                    <img
                      src={fileUrl(sub.image_url)}
                      alt={sub.name}
                      className="h-36 w-full lg:w-44 rounded-2xl border border-white/10 object-cover bg-slate-950"
                    />
                  ) : (
                    <div className="h-36 w-full lg:w-44 rounded-2xl border border-dashed border-white/15 bg-slate-950/60 flex items-center justify-center text-[11px] text-slate-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{sub.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                        sub.submission_status === "Pending"
                          ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                          : sub.submission_status === "Approved"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-rose-500/30 bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {sub.submission_status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Supplier: <span className="text-slate-200 font-semibold">{sub.supplier_name || `#${sub.supplier_id}`}</span>
                    {sub.supplier_email ? ` • ${sub.supplier_email}` : ""}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    <div><span className="text-slate-500">Brand:</span> {sub.brand || "—"}</div>
                    <div><span className="text-slate-500">Suggested category:</span> {sub.category_name || "—"}</div>
                    <div><span className="text-slate-500">SKU:</span> <span className="font-mono">{sub.sku || "—"}</span></div>
                    <div><span className="text-slate-500">Wholesale price:</span> {money(sub.wholesale_price)}</div>
                    <div><span className="text-slate-500">Available stock:</span> {sub.available_stock}</div>
                    <div><span className="text-slate-500">Warranty:</span> {sub.warranty_period || "—"}</div>
                    <div><span className="text-slate-500">Submitted:</span> {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "—"}</div>
                    {sub.submission_status === "Approved" && (
                      <>
                        <div><span className="text-slate-500">Selling price:</span> {money(sub.admin_selling_price)}</div>
                        <div><span className="text-slate-500">Published category:</span> {sub.admin_category_name || "—"}</div>
                      </>
                    )}
                  </div>
                  {sub.description && <p className="text-[11px] text-slate-400 line-clamp-2">{sub.description}</p>}
                  {sub.submission_status === "Rejected" && sub.rejection_reason && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-[11px] text-rose-200">
                      <span className="font-bold">Rejection reason:</span> {sub.rejection_reason}
                    </div>
                  )}
                  {sub.submission_status === "Approved" && sub.published_product_id && (
                    <div className="text-[11px] text-emerald-300">
                      Published to catalogue (product #{sub.published_product_id}) and visible on the home page.
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2 shrink-0 lg:w-40">
                  {sub.submission_status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openApprove(sub)}
                        className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectTarget(sub);
                          setRejectReason("");
                        }}
                        className="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
                      >
                        Reject
                      </button>
                    </>
                  ) : sub.submission_status === "Rejected" ? (
                    <button
                      type="button"
                      onClick={() => openApprove(sub)}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
                      title="Review again and approve with price/category"
                    >
                      Review & Approve
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 text-center lg:pt-2">No actions</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve modal */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Approve & Publish Product</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Set selling price and category to publish on the home page.</p>
              </div>
              <button type="button" onClick={() => setApproveTarget(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleApprove} className="mt-4 space-y-3.5 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-slate-300">
                <div className="font-bold text-white">{approveTarget.name}</div>
                <div>Supplier: {approveTarget.supplier_name} • Wholesale: {money(approveTarget.wholesale_price)} • Stock: {approveTarget.available_stock}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price (LKR) <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={approveForm.selling_price}
                    onChange={(e) => setApproveForm({ ...approveForm, selling_price: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Store Category <span className="text-rose-400">*</span></label>
                  <select
                    required
                    value={approveForm.category_id}
                    onChange={(e) => setApproveForm({ ...approveForm, category_id: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={approveForm.name}
                    onChange={(e) => setApproveForm({ ...approveForm, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU</label>
                  <input
                    type="text"
                    value={approveForm.sku}
                    onChange={(e) => setApproveForm({ ...approveForm, sku: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono uppercase focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Initial Stock (publish qty)</label>
                <input
                  type="number"
                  min="0"
                  value={approveForm.stock_count}
                  onChange={(e) => setApproveForm({ ...approveForm, stock_count: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={approveForm.description}
                  onChange={(e) => setApproveForm({ ...approveForm, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setApproveTarget(null)} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={busy} className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-500 disabled:opacity-50">
                  {busy ? "Approving..." : "Approve & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Reject Submission</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Provide a reason. The supplier will be notified.</p>
              </div>
              <button type="button" onClick={() => setRejectTarget(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleReject} className="mt-4 space-y-3.5 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-slate-300">
                <div className="font-bold text-white">{rejectTarget.name}</div>
                <div>Supplier: {rejectTarget.supplier_name}</div>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Rejection Reason <span className="text-rose-400">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this product submission is being rejected..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setRejectTarget(null)} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-slate-300 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={busy} className="flex-1 rounded-xl bg-rose-600 py-2.5 font-bold text-white hover:bg-rose-500 disabled:opacity-50">
                  {busy ? "Rejecting..." : "Reject & Notify Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
