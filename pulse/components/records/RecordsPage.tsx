"use client";

import { usePatientStore } from "@/store/patientStore";
import { useState } from "react";
import { formatFullDate, getInitials } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

export default function RecordsPage() {
  const { patients, vitals, consultations, labInvestigations, prescriptions } = usePatientStore();
  const [period, setPeriod] = useState<Period>("daily");
  const [search, setSearch] = useState("");

  const now = new Date();
  const cutoff = new Date();
  if (period === "daily") cutoff.setHours(0, 0, 0, 0);
  else if (period === "weekly") cutoff.setDate(now.getDate() - 7);
  else cutoff.setMonth(now.getMonth() - 1);

  const q = search.toLowerCase();

  // Gather all events
  type Event = { type: string; time: string; ptId: string; ptName: string; detail: string; detail2?: string };
  const events: Event[] = [];

  patients.forEach(p => {
    (vitals[p.id] || []).forEach(v => {
      if (new Date(v.time) >= cutoff) {
        if (!q || p.name.toLowerCase().includes(q))
          events.push({ type: "Vitals", time: v.time, ptId: p.id, ptName: p.name, detail: `BP: ${v.sys ?? "-"}/${v.dia ?? "-"} · Pulse: ${v.pulse ?? "-"}`, detail2: v.notes });
      }
    });
    (consultations[p.id] || []).forEach(c => {
      if (new Date(c.time) >= cutoff) {
        if (!q || p.name.toLowerCase().includes(q) || (c.diagnosis || "").toLowerCase().includes(q))
          events.push({ type: "Consultation", time: c.time, ptId: p.id, ptName: p.name, detail: c.diagnosis || "No diagnosis", detail2: `${c.doctorId} — ${c.symptoms || ""}` });
      }
    });
    (labInvestigations[p.id] || []).forEach(l => {
      if (new Date(l.timeRequested) >= cutoff) {
        if (!q || p.name.toLowerCase().includes(q) || l.testName.toLowerCase().includes(q))
          events.push({ type: "Lab", time: l.timeRequested, ptId: p.id, ptName: p.name, detail: l.testName, detail2: `${l.status} · By ${l.requestedBy}` });
      }
    });
    (prescriptions[p.id] || []).forEach(m => {
      if (new Date(m.timePrescribed) >= cutoff) {
        if (!q || p.name.toLowerCase().includes(q) || m.medication.toLowerCase().includes(q))
          events.push({ type: "Prescription", time: m.timePrescribed, ptId: p.id, ptName: p.name, detail: `${m.medication} ${m.dosage}`, detail2: `${m.status} · By ${m.prescribedBy}` });
      }
    });
  });

  events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const typeColors: Record<string, string> = {
    Vitals: "bg-status-high-bg text-status-high",
    Consultation: "bg-blue-bg text-blue",
    Lab: "bg-status-elevated-bg text-status-elevated",
    Prescription: "bg-status-normal-bg text-status-normal",
  };

  // Export function
  const handleExport = () => {
    const header = "Date,Type,Patient,Detail,Details\n";
    const rows = events.map(e =>
      `"${formatFullDate(e.time)}","${e.type}","${e.ptName}","${e.detail}","${(e.detail2 || "").replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediflow_records_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Records & History</h1>
          <p className="text-xs text-ink-3">{events.length} record{events.length !== 1 ? "s" : ""} for {period === "daily" ? "today" : period === "weekly" ? "this week" : "this month"}</p>
        </div>
        <button onClick={handleExport} className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-ink-2 transition-all hover:bg-bg-2 hover:text-accent">
          ↓ Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search records…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {/* Period Filter */}
      <div className="mb-5 flex gap-1">
        {(["daily", "weekly", "monthly"] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer",
              period === p ? "bg-accent text-white" : "bg-card border border-border text-ink-3 hover:bg-bg-2"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">No records for this period.</div>
      ) : (
        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-card">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.6rem] text-accent mt-0.5">
                {getInitials(e.ptName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-ink">{e.ptName}</span>
                  <span className={cn("text-[0.55rem] px-2 py-0.5 rounded-full font-mono uppercase", typeColors[e.type] || "bg-bg-2 text-ink-3")}>{e.type}</span>
                </div>
                <div className="text-xs text-ink-2">{e.detail}</div>
                {e.detail2 && <div className="text-[0.65rem] text-ink-3 mt-0.5">{e.detail2}</div>}
              </div>
              <div className="font-mono text-[0.6rem] text-ink-4 whitespace-nowrap mt-0.5">{formatFullDate(e.time)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
