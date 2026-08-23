"use client";

import { useState } from "react";
import { useAllConsultations } from "@/hooks/queries/useConsultations";
import { usePatients } from "@/hooks/queries/usePatients";
import { formatTime, formatFullDate } from "@/lib/constants";
import { CardListSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientPickerModal from "./PatientPickerModal";
import AddConsultationModal from "./AddConsultationModal";
import ConsultationDetail from "./ConsultationDetail";
import { cn } from "@/lib/utils";
import type { ConsultationRow } from "@/services/consultations.service";

export default function ConsultationsPage() {
  const { data: consults = [], isLoading: consultsLoading } = useAllConsultations();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  const [search, setSearch] = useState("");
  const [selectedConsult, setSelectedConsult] = useState<ConsultationRow | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addConsultPatient, setAddConsultPatient] = useState<{ id: string; name: string } | null>(null);

  const isLoading = consultsLoading || patientsLoading;

  if (isLoading) {
    return <CardListSkeleton count={5} />;
  }

  if (selectedConsult) {
    return (
      <ConsultationDetail
        patientId={selectedConsult.patientId}
        consultId={selectedConsult.id}
        onBack={() => setSelectedConsult(null)}
      />
    );
  }

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const filtered = consults.filter((c) => {
    const p = patientMap.get(c.patientId);
    const pName = p ? p.name.toLowerCase() : (c.ptName ? c.ptName.toLowerCase() : "");
    const s = search.toLowerCase();
    return pName.includes(s) || (c.diagnosis && c.diagnosis.toLowerCase().includes(s));
  });

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Consultations</h1>
          <p className="text-sm font-medium text-ink-3">
            {consults.length} medical consultation{consults.length !== 1 ? "s" : ""} on record
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95"
        >
          + New Consultation
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, diagnosis, or clinical notes…"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <EmptyState
              icon="file"
              title="No consultations found"
              subtitle={search ? "Try adjusting your search query" : 'Click "+ New Consultation" to start'}
            />
          </div>
        ) : (
          filtered.map((c) => {
            const p = patientMap.get(c.patientId);
            const ptName = p?.name || c.ptName || "Unknown Patient";
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConsult(c)}
                className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:bg-bg/60 hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-base text-ink group-hover:text-accent transition-colors">{ptName}</div>
                    <div className="font-mono text-xs font-semibold text-ink-3">
                      {formatFullDate(c.time)} · {formatTime(c.time)}
                    </div>
                  </div>
                  {c.doctorId && (
                    <span className="rounded-full bg-bg-2 px-2.5 py-1 text-xs font-bold text-ink-2 border border-border">
                      Dr. {c.doctorId}
                    </span>
                  )}
                </div>
                {c.diagnosis && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="truncate">{c.diagnosis}</span>
                  </div>
                )}
                {c.symptoms && (
                  <div className="mt-1 line-clamp-2 text-xs font-medium text-ink-3">
                    {c.symptoms}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pickerOpen && (
        <PatientPickerModal
          onSelect={(id, name) => {
            setPickerOpen(false);
            setAddConsultPatient({ id, name });
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {addConsultPatient && (
        <AddConsultationModal
          open={!!addConsultPatient}
          onClose={() => setAddConsultPatient(null)}
          patientId={addConsultPatient.id}
          patientName={addConsultPatient.name}
        />
      )}
    </div>
  );
}
