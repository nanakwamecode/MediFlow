"use client";

import { useState } from "react";
import { useAllLabs } from "@/hooks/queries/useLabs";
import { usePatients } from "@/hooks/queries/usePatients";
import { getInitials } from "@/lib/constants";
import { CardListSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientPickerModal from "@/components/consultations/PatientPickerModal";
import RequestLabModal from "./RequestLabModal";
import PatientLabDetail from "./PatientLabDetail";
import { cn } from "@/lib/utils";

interface PatientLabSummary {
  patientId: string;
  patientName: string;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
}

export default function LabPage() {
  const { data: labs = [], isLoading: labsLoading } = useAllLabs();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [requestPatient, setRequestPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const isLoading = labsLoading || patientsLoading;

  if (isLoading) {
    return <CardListSkeleton count={5} />;
  }

  if (selectedPatientId) {
    return (
      <PatientLabDetail
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const summaryMap = new Map<string, PatientLabSummary>();
  for (const l of labs) {
    const existing = summaryMap.get(l.patientId);
    const p = patientMap.get(l.patientId);
    const name = p?.name || l.ptName || "Unknown Patient";

    if (existing) {
      existing.totalCount++;
      if (l.status === "pending") existing.pendingCount++;
      if (l.status === "completed") existing.completedCount++;
    } else {
      summaryMap.set(l.patientId, {
        patientId: l.patientId,
        patientName: name,
        pendingCount: l.status === "pending" ? 1 : 0,
        completedCount: l.status === "completed" ? 1 : 0,
        totalCount: 1,
      });
    }
  }

  const patientSummaries = Array.from(summaryMap.values());

  const filtered = patientSummaries.filter((s) =>
    s.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = labs.filter((l) => l.status === "pending").length;
  const totalCompleted = labs.filter((l) => l.status === "completed").length;

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
            Laboratory Investigations
          </h1>
          <p className="text-sm font-medium text-ink-3">
            {totalPending} pending · {totalCompleted} completed
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95"
        >
          + Request Investigation
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name…"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <EmptyState
              icon="flask"
              title="No lab orders found"
              subtitle={
                search
                  ? "No patients match your search"
                  : 'Click "+ Request Investigation" to order a lab'
              }
            />
          </div>
        ) : (
          filtered.map((s) => (
            <button
              key={s.patientId}
              type="button"
              onClick={() => setSelectedPatientId(s.patientId)}
              className={cn(
                "w-full cursor-pointer rounded-2xl border border-border bg-card",
                "p-5 shadow-card transition-all text-left",
                "hover:bg-bg/60 hover:shadow-md group"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-lg font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {getInitials(s.patientName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-ink group-hover:text-accent transition-colors truncate">
                    {s.patientName}
                  </div>
                  <div className="text-xs font-semibold text-ink-3 mt-0.5">
                    {s.totalCount} test{s.totalCount !== 1 ? "s" : ""}
                    {s.pendingCount > 0 && (
                      <span className="text-status-high ml-1.5">
                        · {s.pendingCount} pending
                      </span>
                    )}
                    {s.completedCount > 0 && (
                      <span className="text-status-normal ml-1.5">
                        · {s.completedCount} completed
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-ink-4 group-hover:text-accent transition-colors shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>

      {pickerOpen && (
        <PatientPickerModal
          onSelect={(id, name) => {
            setPickerOpen(false);
            setRequestPatient({ id, name });
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {requestPatient && (
        <RequestLabModal
          open={!!requestPatient}
          onClose={() => setRequestPatient(null)}
          patientId={requestPatient.id}
          patientName={requestPatient.name}
        />
      )}
    </div>
  );
}
