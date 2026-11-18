"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/queries/usePatients";
import { useVitals } from "@/hooks/queries/useVitals";
import { useDeletePatient } from "@/hooks/mutations/useDeletePatient";
import { useUiStore } from "@/store/uiStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { getInitials } from "@/lib/constants";
import { CardListSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types";

function PatientVitalsBadge({ patientId }: { patientId: string }) {
  const { data: vitals = [] } = useVitals(patientId);
  return (
    <span className="rounded-full bg-card px-2.5 py-1 text-xs font-mono font-semibold text-ink-3 border border-border">
      {vitals.length} log{vitals.length !== 1 ? "s" : ""}
    </span>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const { data: patients = [], isLoading } = usePatients(search || undefined);
  const deletePatientMut = useDeletePatient();
  const { viewPatient } = useUiStore();
  const { showToast } = useToast();
  const [ptModalOpen, setPtModalOpen] = useState(false);
  const [editPt, setEditPt] = useState<Patient | null>(null);
  const [logFor, setLogFor] = useState<Patient | null>(null);

  if (isLoading) {
    return <CardListSkeleton count={6} />;
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Patients</h1>
          <p className="text-sm font-medium text-ink-3">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => { setEditPt(null); setPtModalOpen(true); }}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
        >
          + New Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, OPD number, phone, or location…"
          className={cn(
            "flex-1 rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        {search && (
          <span className="font-mono text-xs font-bold text-ink-3 whitespace-nowrap">
            {patients.length} result{patients.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {patients.length === 0 ? (
          <EmptyState
            icon="heart"
            title={search ? "No matches found" : "No patients yet"}
            subtitle={search ? "Try different search terms" : 'Click "+ New Patient" to add one'}
          />
        ) : (
          patients.map((p) => {
            const meta = [p.age ? `Age ${p.age}` : "", p.gender, p.town, p.opdNumber ? `OPD: ${p.opdNumber}` : ""]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={p.id}
                onClick={() => viewPatient(p.id)}
                className="flex cursor-pointer items-center gap-4 border-b border-border/60 px-5 py-3.5 transition-all last:border-b-0 hover:bg-bg/60 group"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-accent/5 font-serif text-sm font-bold text-accent shadow-sm ring-1 ring-accent/15 group-hover:scale-105 transition-all">
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-bold text-ink transition-colors group-hover:text-accent">
                    {p.name}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-xs font-medium text-ink-3">
                    {meta || "General Record"}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PatientVitalsBadge patientId={p.id} />
                </div>
                <div
                  className="flex shrink-0 items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setLogFor(p)}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold text-status-normal transition-colors hover:bg-status-normal-bg"
                  >
                    + Vitals
                  </button>
                  <span className="text-border-2">·</span>
                  <button
                    onClick={() => { setEditPt(p); setPtModalOpen(true); }}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold text-blue transition-colors hover:bg-blue-bg"
                  >
                    Edit
                  </button>
                  <span className="text-border-2">·</span>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${p.name}" and all records?`)) {
                        await deletePatientMut.mutateAsync(p.id);
                        showToast("Patient deleted", "✕");
                      }
                    }}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold text-status-high transition-colors hover:bg-status-high-bg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PatientModal
        open={ptModalOpen}
        onClose={() => { setPtModalOpen(false); setEditPt(null); }}
        editPatient={editPt}
      />
      {logFor && (
        <LogVitalsModal
          open={!!logFor}
          onClose={() => setLogFor(null)}
          patientId={logFor.id}
          patientName={logFor.name}
        />
      )}
    </div>
  );
}
