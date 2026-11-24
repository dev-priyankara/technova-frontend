"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";
import { type SupplierSection } from "./sidebar";

interface SupplierOverviewProps {
  onNavigate: (section: SupplierSection) => void;
}

interface SupplierAlert {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface SupplierSummary {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  address: string | null;
  vendor_code: string | null;
  rating: number | null;
  contract_status: string;
  city: string | null;
  unread_notifications: number;
  products_catalogued: number;
  deliveries_to_date: number;
  units_supplied_to_date: number;
  value_supplied_to_date: number;
  returns_to_date: number;
  pending_requests: number;
}

export default function SupplierOverview({ onNavigate }: SupplierOverviewProps) {
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [summary, setSummary] = useState<SupplierSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const [alerts, setAlerts] = useState<SupplierAlert[]>([]);
  const [alertError, setAlertError] = useState("");

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        const context = await apiFetch<{ supplier_id: number }>("/auth/supplier-context");
        setSupplierId(context.supplier_id);
        const summaryData = await apiFetch<SupplierSummary>(
          `/suppliers/${context.supplier_id}/me/dashboard-summary`,
        );
        setSummary(summaryData);
        const notifications = await apiFetch<SupplierAlert[]>(
          `/suppliers/${context.supplier_id}/notifications`,
        );
        setAlerts(
          notifications
            .filter((note) => note.type === "low_stock" && !note.is_read)
            .slice(0, 3),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load dashboard data.";
        setSummaryError(message);
        setAlertError(message);
      }
    });
  }, []);

  async function markAlertRead(notificationId: number) {
    if (supplierId === null) return;
    try {
      await apiFetch(
        `/suppliers/${supplierId}/notifications/${notificationId}/read`,
        { method: "PATCH" },
      );
      setAlerts((previous) => previous.filter((note) => note.id !== notificationId));
    } catch (err) {
      setAlertError(err instanceof Error ? err.message : "Could not update the alert.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome / Distributor Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                Authorized Distributor Portal
              </span>
            </div>
           
           <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Supplier Dashboard
          </h1>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate("submissions")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Submit a Product</span>
            </button>

            <button
              onClick={() => onNavigate("requests")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800/80 px-5 py-3.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
            >
              <span>Restock Orders ({summary?.pending_requests ?? 0})</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      </div>

      {summaryError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-semibold text-amber-200">
          {summaryError}
        </div>
      )}

      {/* Lifetime supplier figures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Deliveries To Date",
            value: (summary?.deliveries_to_date ?? 0).toLocaleString("en-LK"),
            suffix: "consignments",
            accent: "text-emerald-300",
          },
          {
            label: "Units Supplied To Date",
            value: (summary?.units_supplied_to_date ?? 0).toLocaleString("en-LK"),
            suffix: "units",
            accent: "text-blue-300",
          },
          {
            label: "Value Supplied To Date",
            value: `Rs. ${(summary?.value_supplied_to_date ?? 0).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`,
            suffix: "all time",
            accent: "text-amber-300",
          },
          {
            label: "Returns To Date",
            value: (summary?.returns_to_date ?? 0).toLocaleString("en-LK"),
            suffix: `${summary?.unread_notifications ?? 0} unread notifications`,
            accent: "text-purple-300",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {metric.label}
            </p>
            <p className={`mt-2 font-mono text-xl font-black ${metric.accent}`}>
              {metric.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{metric.suffix}</p>
          </div>
        ))}
      </div>

      {/* Critical Shop Low-Stock Warning Banner */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 font-bold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-red-200">
              Low-Stock Alerts from TECHNOVA Admin
            </h3>
            {alerts.length > 0 ? (
              <div className="mt-1 space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-red-200">{alert.title}</span>
                      <button
                        type="button"
                        onClick={() => markAlertRead(alert.id)}
                        className="shrink-0 text-[10px] font-bold text-red-300 hover:text-white"
                      >
                        Mark read
                      </button>
                    </div>
                    <p className="text-[11px] text-red-300/80 mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-300/80 mt-0.5">
                No low-stock alerts from TECHNOVA administrators right now.
              </p>
            )}
            {alertError && (
              <p className="mt-1 text-[11px] font-semibold text-rose-300">{alertError}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate("requests")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/30 border border-red-400/40 px-4 py-2 text-xs font-black text-red-100 hover:bg-red-500/50 transition shrink-0"
        >
          <span>Fulfill Store Restock</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Current status from real supplier data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Catalogued Products",
            value: (summary?.products_catalogued ?? 0).toLocaleString("en-LK"),
            suffix: "approved listings",
            accent: "text-blue-300",
            section: "submissions" as SupplierSection,
          },
          {
            label: "Pending Restock Requests",
            value: (summary?.pending_requests ?? 0).toLocaleString("en-LK"),
            suffix: "awaiting response",
            accent: "text-amber-300",
            section: "requests" as SupplierSection,
          },
          {
            label: "Unread Notifications",
            value: (summary?.unread_notifications ?? 0).toLocaleString("en-LK"),
            suffix: "from TECHNOVA",
            accent: "text-rose-300",
            section: "overview" as SupplierSection,
          },
          {
            label: "Contract Status",
            value: summary?.contract_status ?? "—",
            suffix: summary?.vendor_code ?? "Supplier account",
            accent: "text-emerald-300",
            section: "profile" as SupplierSection,
          },
        ].map((metric) => (
          <button
            key={metric.label}
            type="button"
            onClick={() => onNavigate(metric.section)}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 text-left backdrop-blur-xl transition hover:border-blue-500/40"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {metric.label}
            </p>
            <p className={`mt-3 font-mono text-2xl font-black ${metric.accent}`}>
              {metric.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{metric.suffix}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

