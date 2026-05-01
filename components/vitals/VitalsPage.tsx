"use client";

import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { useState } from "react";
import { formatFullDate, getInitials, classify } from "@/lib/constants";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import StatusPill from "@/components/common/Badge/StatusPill";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function VitalsPage() {
  const { patients, vitals } = usePatientStore();
  const { viewPatient } = useUiStore();
  const [logFor, setLogFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();

  // Flatten all vitals across patients, attach patient info
  const allVitals = patients
    .flatMap((p) =>
      (vitals[p.id] || []).map((v) => ({ ...v, ptId: p.id, ptName: p.name, ptOpd: p.opdNumber }))
    )
    .filter((v) => !q || v.ptName.toLowerCase().includes(q) || (v.ptOpd || "").toLowerCase().includes(q) || (v.notes || "").toLowerCase().includes(q))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Vitals & Triage</h1>
          <p className="text-xs text-ink-3">
            {allVitals.length} vitals record{allVitals.length !== 1 ? "s" : ""} across {patients.length} patient{patients.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name or OPD number…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {allVitals.length === 0 ? (
        <EmptyState icon="heart" title="No vitals recorded" subtitle="Log vitals for a patient using the buttons above." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Patient", "Date", "BP", "Pulse", "Temp", "Wt", "Ht", "BMI", "RR", "BP Status", "Notes"].map((h) => (
                  <th key={h} className="bg-bg-2 px-3 py-2 text-left font-mono text-[0.54rem] tracking-[0.18em] text-ink-3 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allVitals.map((v) => {
                const bpCat = v.sys && v.dia ? classify(v.sys, v.dia) : null;
                return (
                  <tr
                    key={`${v.ptId}-${v.id}`}
                    onClick={() => viewPatient(v.ptId)}
                    className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-bg"
                  >
                    <td className="px-3 py-2 text-xs font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.6rem] text-accent">{getInitials(v.ptName)}</div>
                        {v.ptName}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[0.68rem] text-ink-3 whitespace-nowrap">{formatFullDate(v.time)}</td>
                    <td className="px-3 py-2 text-sm font-semibold">{v.sys ?? "-"}/{v.dia ?? "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.pulse ?? "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.temperature ? `${v.temperature}°C` : "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.weight ? `${v.weight}kg` : "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.height ? `${v.height}cm` : "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.bmi ?? "-"}</td>
                    <td className="px-3 py-2 font-mono text-sm text-ink-3">{v.respiratoryRate ?? "-"}</td>
                    <td className="px-3 py-2">{bpCat ? <StatusPill label={bpCat.label} size="sm" /> : <span className="text-ink-4 text-xs">-</span>}</td>
                    <td className="px-3 py-2 text-[0.65rem] text-ink-3 max-w-[120px] truncate">{v.notes || "-"}</td>
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
    </div>
  );
}
