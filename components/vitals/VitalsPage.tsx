"use client";

import { useState } from "react";
import { useAllVitals } from "@/hooks/queries/useVitals";
import { usePatients } from "@/hooks/queries/usePatients";
import { useDeleteVitals } from "@/hooks/mutations/useDeleteVitals";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatTime, formatFullDate } from "@/lib/constants";
import { TableSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import LogVitalsModal from "./LogVitalsModal";
import { cn } from "@/lib/utils";

export default function VitalsPage() {
  const { data: vitals = [], isLoading: vitalsLoading } = useAllVitals();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const deleteVitalsMut = useDeleteVitals();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const isLoading = vitalsLoading || patientsLoading;

  if (isLoading) {
    return <TableSkeleton rows={7} cols={8} />;
  }

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const filtered = vitals.filter((v) => {
    const p = patientMap.get(v.patientId);
    const pName = p ? p.name.toLowerCase() : (v.ptName ? v.ptName.toLowerCase() : "");
    const s = search.toLowerCase();
    const matchSearch = pName.includes(s) || v.time.toLowerCase().includes(s);
    const matchPatient = !selectedPatientId || v.patientId === selectedPatientId;
    return matchSearch && matchPatient;
  });

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Triage & Vitals</h1>
          <p className="text-sm font-medium text-ink-3">
            {vitals.length} recorded vital session{vitals.length !== 1 ? "s" : ""} across all patients
          </p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95"
        >
          + Record Vitals
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter vitals by patient name or date…"
          className={cn(
            "flex-1 min-w-[200px] rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink outline-none transition-colors focus:border-accent"
        >
          <option value="">All Patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon="activity"
            title="No vitals recorded"
            subtitle={search || selectedPatientId ? "No matching logs found" : 'Click "+ Record Vitals" to log the first session'}
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-2/70 text-xs font-bold uppercase tracking-wider text-ink-2 border-b border-border/80">
              <tr>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">BP (mmHg)</th>
                <th className="px-5 py-3.5">Pulse</th>
                <th className="px-5 py-3.5">Temp</th>
                <th className="px-5 py-3.5">Weight / Height</th>
                <th className="px-5 py-3.5">BMI</th>
                <th className="px-5 py-3.5">Resp</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((v) => {
                const p = patientMap.get(v.patientId);
                const ptName = p?.name || v.ptName || "Unknown Patient";
                const bmi = v.bmi || (v.weight && v.height ? +(v.weight / ((v.height / 100) ** 2)).toFixed(1) : "—");
                return (
                  <tr key={v.id} className="hover:bg-bg/60 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-ink-3">
                      <div>{formatFullDate(v.time)}</div>
                      <div className="text-[0.7rem] text-ink-4 font-bold">{formatTime(v.time)}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {ptName}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {v.sys && v.dia ? `${v.sys}/${v.dia}` : "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {v.pulse ? `${v.pulse} bpm` : "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {v.temperature ? `${v.temperature} °C` : "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {v.weight || "—"} kg / {v.height || "—"} cm
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {bmi}
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {v.respiratoryRate ? `${v.respiratoryRate} cpm` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Delete this vitals log?")) {
                            await deleteVitalsMut.mutateAsync({ patientId: v.patientId, vitalId: v.id });
                            showToast("Vitals log deleted", "✕");
                          }
                        }}
                        className="cursor-pointer text-xs font-bold text-status-high hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {logOpen && <LogVitalsModal open={logOpen} onClose={() => setLogOpen(false)} />}
    </div>
  );
}
