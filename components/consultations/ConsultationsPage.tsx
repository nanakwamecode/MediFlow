"use client";

import { useState } from "react";
import { useAllConsultations } from "@/hooks/queries/useConsultations";
import { formatFullDate, getInitials } from "@/lib/constants";
import AddConsultationModal from "@/components/consultations/AddConsultationModal";
import PatientPickerModal from "@/components/consultations/PatientPickerModal";
import ConsultationDetail from "@/components/consultations/ConsultationDetail";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function ConsultationsPage() {
  const { data: allConsults = [], isLoading } = useAllConsultations();
  const [consultFor, setConsultFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailView, setDetailView] = useState<{ ptId: string; consultId: number } | null>(null);

  const q = search.toLowerCase();

  const filteredConsults = allConsults
    .filter(
      (c) =>
        !q ||
        (c.ptName || "").toLowerCase().includes(q) ||
        (c.ptOpd || "").toLowerCase().includes(q) ||
        (c.diagnosis || "").toLowerCase().includes(q) ||
        (c.symptoms || "").toLowerCase().includes(q) ||
        c.doctorId.toLowerCase().includes(q)
    );

  if (detailView) {
    return (
      <ConsultationDetail
        patientId={detailView.ptId}
        consultId={detailView.consultId}
        onBack={() => setDetailView(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Loading consultations…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Doctor Consultations</h1>
          <p className="text-sm font-medium text-ink-3">
            {allConsults.length} consultation{allConsults.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => setConsultFor({ id: "", name: "" })}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
        >
          + New Consultation
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, OPD number, doctor, diagnosis…"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {filteredConsults.length === 0 ? (
        <EmptyState
          icon="pencil"
          title="No consultations yet"
          subtitle="Click '+ New Consultation' to start one."
        />
      ) : (
        <div className="space-y-3">
          {filteredConsults.map((c) => (
            <div
              key={`${c.patientId}-${c.id}`}
              onClick={() => setDetailView({ ptId: c.patientId, consultId: c.id })}
              className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-xs font-bold text-accent">
                    {getInitials(c.ptName || "")}
                  </div>
                  <div>
                    <div className="text-base font-bold text-ink">{c.ptName}</div>
                    <div className="text-xs font-semibold text-ink-3">Doctor: {c.doctorId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs font-medium text-ink-3 whitespace-nowrap">
                    {formatFullDate(c.time)}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="rounded bg-ink/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink-3">Diagnosis</span>
                <span className="text-sm font-bold text-ink">{c.diagnosis || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-ink/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink-3">Symptoms</span>
                <span className="text-sm font-medium text-ink-2">{c.symptoms || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {consultFor && consultFor.id === "" ? (
        <PatientPickerModal
          onSelect={(id, name) => setConsultFor({ id, name })}
          onClose={() => setConsultFor(null)}
        />
      ) : consultFor ? (
        <AddConsultationModal
          open={true}
          onClose={() => setConsultFor(null)}
          patientId={consultFor.id}
          patientName={consultFor.name}
        />
      ) : null}
    </div>
  );
}
