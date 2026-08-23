"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/queries/usePatients";
import { useAllVitals } from "@/hooks/queries/useVitals";
import { useAllConsultations } from "@/hooks/queries/useConsultations";
import { useAllLabs } from "@/hooks/queries/useLabs";
import { useAllPrescriptions } from "@/hooks/queries/usePrescriptions";
import { TableSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { exportRecordsPdf } from "./RecordsPrintView";
import RecordEventRow, { RecordEvent } from "./RecordEventRow";
import { cn } from "@/lib/utils";

export default function RecordsPage() {
  const { data: patients = [], isLoading: pL } = usePatients();
  const { data: vitals = [], isLoading: vL } = useAllVitals();
  const { data: consults = [], isLoading: cL } = useAllConsultations();
  const { data: labs = [], isLoading: lL } = useAllLabs();
  const { data: prescriptions = [], isLoading: rL } = useAllPrescriptions();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [search, setSearch] = useState("");

  const isLoading = pL || vL || cL || lL || rL;

  if (isLoading) {
    return <TableSkeleton rows={7} cols={4} />;
  }

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const allEvents: RecordEvent[] = [
    ...vitals.map((v) => ({
      type: "Vitals",
      time: v.time,
      ptId: v.patientId,
      ptName: patientMap.get(v.patientId)?.name || v.ptName || "Unknown Patient",
      detail: `BP: ${v.sys || "-"}/${v.dia || "-"} mmHg · Pulse: ${v.pulse || "-"} bpm · Temp: ${v.temperature || "-"} °C`,
      detail2: `Weight: ${v.weight || "-"} kg · Resp: ${v.respiratoryRate || "-"} cpm`,
    })),
    ...consults.map((c) => ({
      type: "Consultation",
      time: c.time,
      ptId: c.patientId,
      ptName: patientMap.get(c.patientId)?.name || c.ptName || "Unknown Patient",
      detail: c.diagnosis ? `Dx: ${c.diagnosis}` : "Clinical notes recorded",
      detail2: c.doctorId ? `Doctor: Dr. ${c.doctorId}` : undefined,
    })),
    ...labs.map((l) => ({
      type: "Lab",
      time: l.timeRequested,
      ptId: l.patientId,
      ptName: patientMap.get(l.patientId)?.name || l.ptName || "Unknown Patient",
      detail: `${l.testName} (${l.status})`,
      detail2: l.requestedBy ? `Requested by: ${l.requestedBy}` : undefined,
    })),
    ...prescriptions.map((r) => ({
      type: "Prescription",
      time: r.timePrescribed,
      ptId: r.patientId,
      ptName: patientMap.get(r.patientId)?.name || r.ptName || "Unknown Patient",
      detail: `${r.medication} (${r.dosage || "-"})`,
      detail2: `Status: ${r.status} · Prescribed by: ${r.prescribedBy || "-"}`,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const now = new Date();
  const filtered = allEvents.filter((e) => {
    if (filterType !== "all" && e.type !== filterType) return false;
    const eDate = new Date(e.time);
    if (filterPeriod === "today" && eDate.toDateString() !== now.toDateString()) return false;
    if (filterPeriod === "week" && (now.getTime() - eDate.getTime()) > 7 * 86400000) return false;
    if (filterPeriod === "month" && (now.getTime() - eDate.getTime()) > 30 * 86400000) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.ptName.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Clinical Records Log</h1>
          <p className="text-sm font-medium text-ink-3">
            {allEvents.length} total event{allEvents.length !== 1 ? "s" : ""} across all departments
          </p>
        </div>
        <button
          onClick={() => exportRecordsPdf({ events: filtered, period: filterPeriod })}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search records by patient name or detail…"
          className={cn(
            "flex-1 min-w-[200px] rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink outline-none focus:border-accent"
        >
          <option value="all">All Types</option>
          <option value="Vitals">Vitals</option>
          <option value="Consultation">Consultation</option>
          <option value="Lab">Lab</option>
          <option value="Prescription">Prescription</option>
        </select>
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink outline-none focus:border-accent"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Past 7 Days</option>
          <option value="month">Past 30 Days</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <EmptyState
              icon="archive"
              title="No records found"
              subtitle="Try clearing or adjusting your search filters"
            />
          </div>
        ) : (
          filtered.map((e, idx) => (
            <RecordEventRow key={idx} event={e} />
          ))
        )}
      </div>
    </div>
  );
}
