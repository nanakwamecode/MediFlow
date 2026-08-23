"use client";

import { useState } from "react";
import { useAllVitals } from "@/hooks/queries/useVitals";
import { useUiStore } from "@/store/uiStore";
import { formatFullDate, getInitials, classify } from "@/lib/constants";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import StatusPill from "@/components/common/Badge/StatusPill";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function VitalsPage() {
  const { data: allVitals = [], isLoading } = useAllVitals();
  const { viewPatient } = useUiStore();
  const [logFor, setLogFor] = useState<{ id: string; name: string } | null>(null);
  const [genericLogOpen, setGenericLogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();

  const filteredVitals = allVitals
    .filter((v) => !q || (v.ptName || "").toLowerCase().includes(q) || (v.ptOpd || "").toLowerCase().includes(q) || (v.notes || "").toLowerCase().includes(q));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Loading vitals…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Vitals & Triage</h1>
          <p className="text-sm font-medium text-ink-3">
            {allVitals.length} vitals record{allVitals.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => setGenericLogOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
        >
          + Log Vitals
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, OPD number, or notes…"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {filteredVitals.length === 0 ? (
        <EmptyState icon="heart" title="No vitals recorded" subtitle="Log vitals for a patient using the button above." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-bg-2/70">
                {["Patient", "Date", "BP", "Pulse", "Temp", "Wt", "Ht", "BMI", "RR", "BP Status", "Notes"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-ink-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredVitals.map((v) => {
                const bpCat = v.sys && v.dia ? classify(v.sys, v.dia) : null;
                const ptName = v.ptName || "Unknown Patient";
                return (
                  <tr
                    key={v.id}
                    onClick={() => viewPatient(v.patientId)}
                    className="cursor-pointer transition-colors hover:bg-bg/60"
                  >
                    <td className="px-4 py-3.5 text-sm font-bold text-ink">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{getInitials(ptName)}</div>
                        <span className="hover:text-accent transition-colors">{ptName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-medium text-ink-3 whitespace-nowrap">{formatFullDate(v.time)}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ink">{v.sys ?? "-"}/{v.dia ?? "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-ink-2">{v.pulse ?? "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-ink-2">{v.temperature ? `${v.temperature}°C` : "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-ink-2">{v.weight ? `${v.weight}kg` : "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-ink-2">{v.height ? `${v.height}cm` : "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-bold text-ink">{v.bmi ?? "-"}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-ink-2">{v.respiratoryRate ?? "-"}</td>
                    <td className="px-4 py-3.5">{bpCat ? <StatusPill label={bpCat.label} size="sm" /> : <span className="text-ink-4 text-xs font-medium">-</span>}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-ink-3 max-w-[140px] truncate">{v.notes || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {logFor && (
        <LogVitalsModal open={!!logFor} onClose={() => setLogFor(null)} patientId={logFor.id} patientName={logFor.name} />
      )}
      {genericLogOpen && (
        <LogVitalsModal open={genericLogOpen} onClose={() => setGenericLogOpen(false)} />
      )}
    </div>
  );
}
