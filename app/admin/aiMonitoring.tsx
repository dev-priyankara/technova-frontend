"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

interface AILogRecord {
  id: string;
  timestamp: string;
  budget: string;
  intent: string;
  recommended: string;
  outcome: string;
  status: "Success" | "Engaged" | "Safety Fallback";
  reasoning?: string;
}

interface AIRecommendationApi {
  id: number;
  timestamp: string;
  budget: number | null;
  intent: string;
  recommended: string;
  outcome: string;
  status: AILogRecord["status"];
  reasoning?: string | null;
}

interface AISettingsApi {
  is_active: boolean;
  budget_tolerance_pct: number;
  creativity_mode: "Strict Catalogue Matches" | "Adaptive / High Variance";
  stock_constraint: "Strict In-Stock Only" | "Allow Backorder Pre-order";
  min_confidence_score: number;
}

export default function AdminAIMonitoring() {
  const [toggleActive, setToggleActive] = useState(true);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isEngineConfigOpen, setIsEngineConfigOpen] = useState(false);
  const [viewLog, setViewLog] = useState<AILogRecord | null>(null);
  const [editLog, setEditLog] = useState<AILogRecord | null>(null);

  // Engine Configuration State
  const [engineConfig, setEngineConfig] = useState({
    budgetTolerancePct: 10,
    creativityMode: "Strict Catalogue Matches" as "Strict Catalogue Matches" | "Adaptive / High Variance",
    stockConstraint: "Strict In-Stock Only" as "Strict In-Stock Only" | "Allow Backorder Pre-order",
    minConfidenceScore: 85,
  });
  const [loadError, setLoadError] = useState("");

  // Simulation Form
  const [simForm, setSimForm] = useState({
    budget: "Rs. 350,000",
    intent: "Unreal Engine 5 Game Dev & 4K Video Rendering",
    recommended: "Intel Core i7-14700K + RTX 4070 Ti Super + 64GB DDR5",
    outcome: "Converted (Cart Added)",
    status: "Success" as AILogRecord["status"],
  });

  // AI Logs State
  const [aiLogs, setAiLogs] = useState<AILogRecord[]>([]);

  function mapLog(log: AIRecommendationApi): AILogRecord {
    return {
      id: String(log.id),
      timestamp: new Date(log.timestamp).toLocaleString(),
      budget: log.budget == null ? "—" : `Rs. ${Number(log.budget).toLocaleString("en-LK")}`,
      intent: log.intent || "",
      recommended: log.recommended || "",
      outcome: log.outcome || "",
      status: log.status,
      reasoning: log.reasoning || "",
    };
  }

  function budgetAmount(value: string): number | null {
    const numeric = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  useEffect(() => {
    Promise.all([
      apiFetch<AIRecommendationApi[]>("/admin/ai/logs"),
      apiFetch<AISettingsApi>("/admin/ai/settings"),
    ])
      .then(([logs, settings]) => {
        setAiLogs(logs.map(mapLog));
        setToggleActive(Boolean(settings.is_active));
        setEngineConfig({
          budgetTolerancePct: Number(settings.budget_tolerance_pct),
          creativityMode: settings.creativity_mode,
          stockConstraint: settings.stock_constraint,
          minConfidenceScore: Number(settings.min_confidence_score),
        });
        setLoadError("");
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Could not load AI settings."));
  }, []);

  const filteredLogs = aiLogs.filter(
    (l) =>
      search.trim() === "" ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.intent.toLowerCase().includes(search.toLowerCase()) ||
      l.recommended.toLowerCase().includes(search.toLowerCase()) ||
      l.status.toLowerCase().includes(search.toLowerCase()),
  );

  // CREATE (SIMULATE)
  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const saved = await apiFetch<{ id: number; timestamp: string }>("/admin/ai/logs", {
        method: "POST",
        body: JSON.stringify({
          budget: budgetAmount(simForm.budget),
          intent: simForm.intent.trim(),
          recommended: simForm.recommended.trim(),
          outcome: simForm.outcome.trim(),
          status: simForm.status,
          reasoning: `Matched via ${engineConfig.creativityMode} with ${engineConfig.stockConstraint}. Confidence: ${engineConfig.minConfidenceScore}%.`,
        }),
      });
      const newLog = mapLog({
        ...simForm,
        ...saved,
        budget: budgetAmount(simForm.budget),
        timestamp: saved.timestamp || new Date().toISOString(),
      });
      setAiLogs((current) => [newLog, ...current]);
      setIsSimulateOpen(false);
      setToast(`Telemetry session ${newLog.id} recorded.`);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save AI telemetry.");
    }
  }

  // UPDATE LOG
  async function handleSaveEditLog(e: React.FormEvent) {
    e.preventDefault();
    if (!editLog) return;
    try {
      await apiFetch(`/admin/ai/logs/${editLog.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          budget: budgetAmount(editLog.budget),
          intent: editLog.intent,
          recommended: editLog.recommended,
          outcome: editLog.outcome,
          status: editLog.status,
          reasoning: editLog.reasoning,
        }),
      });
      setAiLogs((prev) => prev.map((log) => log.id === editLog.id ? { ...editLog } : log));
      setToast(`Telemetry log ${editLog.id} updated.`);
      setEditLog(null);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update AI telemetry.");
    }
  }

  // UPDATE ENGINE CONFIG
  async function handleSaveEngineConfig(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch("/admin/ai/settings", {
        method: "PUT",
        body: JSON.stringify({
          budget_tolerance_pct: engineConfig.budgetTolerancePct,
          creativity_mode: engineConfig.creativityMode,
          stock_constraint: engineConfig.stockConstraint,
          min_confidence_score: engineConfig.minConfidenceScore,
          is_active: toggleActive,
        }),
      });
      setIsEngineConfigOpen(false);
      setToast(`AI parameters saved. Budget tolerance: ±${engineConfig.budgetTolerancePct}%.`);
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save AI settings.");
    }
  }

  async function handleToggleEngine() {
    const active = !toggleActive;
    try {
      await apiFetch("/admin/ai/settings", {
        method: "PUT",
        body: JSON.stringify({
          budget_tolerance_pct: engineConfig.budgetTolerancePct,
          creativity_mode: engineConfig.creativityMode,
          stock_constraint: engineConfig.stockConstraint,
          min_confidence_score: engineConfig.minConfidenceScore,
          is_active: active,
        }),
      });
      setToggleActive(active);
      setToast(active ? "AI Assistant Engine is online." : "AI Assistant Engine paused.");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update AI engine status.");
    }
  }

  // DELETE LOG
  async function handleDeleteLog(log: AILogRecord) {
    if (!confirm(`Delete telemetry record "${log.id}"?`)) return;
    try {
      await apiFetch(`/admin/ai/logs/${log.id}`, { method: "DELETE" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete AI log.");
      return;
    }
    setAiLogs((prev) => prev.filter((l) => l.id !== log.id));
    if (viewLog?.id === log.id) setViewLog(null);
    if (editLog?.id === log.id) setEditLog(null);

    setToast(`Telemetry record ${log.id} removed.`);
    setTimeout(() => setToast(""), 3500);
  }

  // CLEAR ALL
  async function handleClearAllLogs() {
    if (!confirm("Are you sure you want to clear all telemetry logs?")) return;
    try {
      await apiFetch("/admin/ai/logs", { method: "DELETE" });
      setAiLogs([]);
      setToast("All AI telemetry logs cleared.");
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to clear AI logs.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
        <div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            AI Product Recommendation Monitor
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Inspect real-time customer recommendation sessions, conversion telemetry, and inventory availability constraints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEngineConfigOpen(true)}
            className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-3.5 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
          >
            ⚙️ Tune Parameters
          </button>

          <button
            type="button"
            onClick={() => setIsSimulateOpen(true)}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>+</span> Simulate AI Query
          </button>

          <button
            type="button"
            onClick={handleToggleEngine}
            className={`rounded-2xl px-4 py-2.5 text-xs font-black transition-all ${
              toggleActive
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/10 text-slate-400"
            }`}
          >
            {toggleActive ? "● ONLINE" : "PAUSED"}
          </button>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs font-semibold text-purple-300">
          ✓ {toast}
        </div>
      )}
      {loadError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          Could not load AI data: {loadError}
        </div>
      )}

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Inquiries</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            {aiLogs.length}
          </span>
          <span className="text-[10px] text-purple-300 block mt-1">This month</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Conversion Rate</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">
            {aiLogs.length
              ? `${((aiLogs.filter((log) => log.status === "Success").length / aiLogs.length) * 100).toFixed(1)}%`
              : "0%"}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Cart adds via AI</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Attributed Revenue</span>
          <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono mt-1 block">
            Not tracked
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Sales driven by AI engine</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Inventory Accuracy</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
            Not measured
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Filtered in-stock only</span>
        </div>
      </div>

      {/* Live AI Telemetry Logs Section */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-white">Recent Recommendation Telemetry Logs</h2>
            <p className="text-xs text-slate-400">Real-time prompt matches using database catalogue items ({filteredLogs.length} entries)</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[220px]">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search session, intent, hardware..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {aiLogs.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllLogs}
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-white/5 p-3 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No AI telemetry sessions recorded.</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-sm text-white">{log.id}</span>
                    <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      log.status === "Success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                        : log.status === "Engaged"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                        : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                    }`}
                  >
                    ● {log.status}
                  </span>
                </div>

                <div className="text-xs text-slate-200">
                  <span className="text-slate-400">Intent:</span> {log.intent}
                </div>

                <div className="text-xs font-bold text-white">
                  <span className="text-slate-400 font-normal">Recommended:</span> {log.recommended}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{log.budget}</span>
                  <span className="text-slate-300 text-[11px]">{log.outcome}</span>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setViewLog(log)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditLog({ ...log })}
                    className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLog(log)}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Session ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Budget</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Intent & Usage</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Recommended Hardware</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Customer Outcome</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No recommendation telemetry sessions recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {log.id}
                      <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                    </td>

                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold">
                      {log.budget}
                    </td>

                    <td className="px-6 py-4 text-slate-200 font-medium max-w-xs">
                      <span className="block truncate">{log.intent}</span>
                    </td>

                    <td className="px-6 py-4 text-white font-bold max-w-xs">
                      <span className="block truncate">{log.recommended}</span>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {log.outcome}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          log.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30"
                            : log.status === "Engaged"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-400/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-400/30"
                        }`}
                      >
                        ● {log.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewLog(log)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditLog({ ...log })}
                          className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLog(log)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View AI Session Details (READ) */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">AI Telemetry Session</h3>
                <span className="text-xs text-purple-400 font-mono">{viewLog.id} • {viewLog.timestamp}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewLog(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Prompt Intent</span>
                <p className="text-white font-medium">{viewLog.intent}</p>
                <div className="text-emerald-400 font-mono font-bold text-sm pt-1">Budget: {viewLog.budget}</div>
              </div>

              <div className="rounded-xl border border-purple-400/20 bg-purple-950/20 p-3 space-y-1">
                <span className="text-[10px] text-purple-300 uppercase font-bold block">Generated Hardware Recommendation</span>
                <p className="text-white font-bold">{viewLog.recommended}</p>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Customer Action Outcome:</span>
                <span className="text-white font-bold">{viewLog.outcome}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Match Status:</span>
                <span className="text-emerald-400 font-bold">● {viewLog.status}</span>
              </div>

              {viewLog.reasoning && (
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">Neural Match Reasoning:</span>
                  <p className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-slate-300 text-[11px]">
                    {viewLog.reasoning}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const l = viewLog;
                  setViewLog(null);
                  setEditLog({ ...l });
                }}
                className="w-1/2 rounded-xl bg-purple-600 py-2.5 font-bold text-white hover:bg-purple-500"
              >
                Edit Log
              </button>
              <button
                type="button"
                onClick={() => setViewLog(null)}
                className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Telemetry Record (UPDATE) */}
      {editLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit AI Telemetry Log</h3>
                <span className="text-xs text-purple-400 font-mono">{editLog.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditLog(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Intent</label>
                <input
                  type="text"
                  required
                  value={editLog.intent}
                  onChange={(e) => setEditLog({ ...editLog, intent: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Recommended Hardware</label>
                <input
                  type="text"
                  required
                  value={editLog.recommended}
                  onChange={(e) => setEditLog({ ...editLog, recommended: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={editLog.status}
                    onChange={(e) => setEditLog({ ...editLog, status: e.target.value as AILogRecord["status"] })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Success">Success (Cart Added)</option>
                    <option value="Engaged">Engaged (Viewed Specs)</option>
                    <option value="Safety Fallback">Safety Fallback (Stock Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Outcome</label>
                  <input
                    type="text"
                    required
                    value={editLog.outcome}
                    onChange={(e) => setEditLog({ ...editLog, outcome: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditLog(null)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-purple-600 py-2.5 font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Simulate AI Query (CREATE) */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Simulate AI Query Recommendation</h3>
                <p className="text-xs text-slate-400">Inject a simulated customer neural interaction</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Budget</label>
                  <input
                    type="text"
                    required
                    value={simForm.budget}
                    onChange={(e) => setSimForm({ ...simForm, budget: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Interaction Status</label>
                  <select
                    value={simForm.status}
                    onChange={(e) => setSimForm({ ...simForm, status: e.target.value as AILogRecord["status"] })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Success">Success (High Conversion)</option>
                    <option value="Engaged">Engaged (Explored Details)</option>
                    <option value="Safety Fallback">Safety Fallback (Triggered Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Query Intent & Needs</label>
                <textarea
                  rows={2}
                  required
                  value={simForm.intent}
                  onChange={(e) => setSimForm({ ...simForm, intent: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Engine Recommended Setup</label>
                <input
                  type="text"
                  required
                  value={simForm.recommended}
                  onChange={(e) => setSimForm({ ...simForm, recommended: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Telemetry Outcome</label>
                <input
                  type="text"
                  required
                  value={simForm.outcome}
                  onChange={(e) => setSimForm({ ...simForm, outcome: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-purple-600 py-2.5 font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  Inject Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tune AI Parameters (UPDATE CONFIG) */}
      {isEngineConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-white">AI Engine Hyperparameters</h3>
                <p className="text-xs text-slate-400">Configure neural matcher tolerance and catalogue boundaries</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEngineConfigOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEngineConfig} className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-bold">Budget Tolerance Flexibility</label>
                  <span className="font-mono text-purple-400 font-bold">±{engineConfig.budgetTolerancePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={engineConfig.budgetTolerancePct}
                  onChange={(e) =>
                    setEngineConfig({ ...engineConfig, budgetTolerancePct: Number(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
                <span className="text-[10px] text-slate-400">Controls how far above customer budget recommendations can reach</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Catalogue Matching Mode</label>
                <select
                  value={engineConfig.creativityMode}
                  onChange={(e) =>
                    setEngineConfig({ ...engineConfig, creativityMode: e.target.value as AISettingsApi["creativity_mode"] })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Strict Catalogue Matches">Strict Catalogue Matches</option>
                  <option value="Adaptive / High Variance">Adaptive / High Variance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Stock Availability Constraint</label>
                <select
                  value={engineConfig.stockConstraint}
                  onChange={(e) =>
                    setEngineConfig({ ...engineConfig, stockConstraint: e.target.value as AISettingsApi["stock_constraint"] })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Strict In-Stock Only">Strict In-Stock Only</option>
                  <option value="Allow Backorder Pre-order">Allow Backorder Pre-order</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEngineConfigOpen(false)}
                  className="w-1/2 rounded-xl bg-white/10 py-2.5 font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-purple-600 py-2.5 font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
