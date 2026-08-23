"use client";

import { useState, useMemo } from "react";
import { useAllVitals } from "@/hooks/queries/useVitals";
import { useAllConsultations } from "@/hooks/queries/useConsultations";
import { useAllLabs } from "@/hooks/queries/useLabs";
import { useAllPrescriptions } from "@/hooks/queries/usePrescriptions";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { exportRecordsPdf } from "@/components/records/RecordsPrintView";
import RecordEventRow, { type RecordEvent } from "./RecordEventRow";

type Period = "daily" | "weekly" | "monthly";

export default function RecordsPage() {
  const { data: vitals = [], isLoading: vitalsLoading } = useAllVitals();
  const { data: consultations = [], isLoading: consultsLoading } = useAllConsultations();
  const { data: labs = [], isLoading: labsLoading } = useAllLabs();
  const { data: prescriptions = [], isLoading: rxLoading } = useAllPrescriptions();

  const [period, setPeriod] = useState<Period>("daily");
  const [search, setSearch] = useState("");

  const isLoading = vitalsLoading || consultsLoading || labsLoading || rxLoading;

  const events = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === "daily") cutoff.setHours(0, 0, 0, 0);
    else if (period === "weekly") cutoff.setDate(now.getDate() - 7);
    else cutoff.setMonth(now.getMonth() - 1);

    const q = search.toLowerCase();
    const list: RecordEvent[] = [];

    vitals.forEach((v) => {
      if (new Date(v.time) >= cutoff) {
        const ptName = v.ptName || "Unknown Patient";
        if (!q || ptName.toLowerCase().includes(q) || (v.ptOpd || "").toLowerCase().includes(q)) {
          list.push({
            type: "Vitals",
            time: v.time,
            ptId: v.patientId,
            ptName,
            detail: `BP: ${v.sys ?? "-"}/${v.dia ?? "-"} · Pulse: ${v.pulse ?? "-"}`,
            detail2: v.notes || undefined,
          });
        }
      }
    });

    consultations.forEach((c) => {
      if (new Date(c.time) >= cutoff) {
        const ptName = c.ptName || "Unknown Patient";
        if (!q || ptName.toLowerCase().includes(q) || (c.ptOpd || "").toLowerCase().includes(q) || (c.diagnosis || "").toLowerCase().includes(q)) {
          list.push({
            type: "Consultation",
            time: c.time,
            ptId: c.patientId,
            ptName,
            detail: c.diagnosis || "No diagnosis",
            detail2: `${c.doctorId} — ${c.symptoms || ""}`,
          });
        }
      }
    });

    labs.forEach((l) => {
      if (new Date(l.timeRequested) >= cutoff) {
        const ptName = l.ptName || "Unknown Patient";
        if (!q || ptName.toLowerCase().includes(q) || (l.ptOpd || "").toLowerCase().includes(q) || l.testName.toLowerCase().includes(q)) {
          list.push({
            type: "Lab",
            time: l.timeRequested,
            ptId: l.patientId,
            ptName,
            detail: l.testName,
            detail2: `${l.status} · By ${l.requestedBy}`,
          });
        }
      }
    });

    prescriptions.forEach((m) => {
      if (new Date(m.timePrescribed) >= cutoff) {
        const ptName = m.ptName || "Unknown Patient";
        if (!q || ptName.toLowerCase().includes(q) || (m.ptOpd || "").toLowerCase().includes(q) || m.medication.toLowerCase().includes(q)) {
          list.push({
            type: "Prescription",
            time: m.timePrescribed,
            ptId: m.patientId,
            ptName,
            detail: `${m.medication} ${m.dosage}`,
            detail2: `${m.status} · By ${m.prescribedBy}`,
          });
        }
      }
    });

    return list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [vitals, consultations, labs, prescriptions, period, search]);

  const handleExportCsv = () => {
    const header = "Date,Type,Patient,Detail,Details\n";
    const rows = events
      .map((e) => `"${formatFullDate(e.time)}","${e.type}","${e.ptName}","${e.detail}","${(e.detail2 || "").replace(/"/g, '""')}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediflow_records_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Loading clinical records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Records & History</h1>
          <p className="text-sm font-medium text-ink-3">
            {events.length} record{events.length !== 1 ? "s" : ""} for {period === "daily" ? "today" : period === "weekly" ? "this week" : "this month"}
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={handleExportCsv} className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 shadow-sm transition-all hover:bg-bg-2 hover:text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            CSV
          </button>
          <button onClick={() => exportRecordsPdf({ events, period })} className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search records by patient name, OPD number, test, or diagnosis…"
          className={cn("w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]")}
        />
      </div>

      <div className="mb-5 flex gap-2">
        {(["daily", "weekly", "monthly"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={cn("cursor-pointer rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all", period === p ? "bg-accent text-white shadow-sm" : "border border-border bg-card text-ink-3 hover:bg-bg-2 hover:text-ink")}>
            {p}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-2 p-10 text-center text-sm font-semibold text-ink-3 bg-card/50">
          No records for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e, i) => <RecordEventRow key={i} event={e} />)}
        </div>
      )}
    </div>
  );
}
