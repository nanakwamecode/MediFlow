"use client";

import { useState } from "react";
import { useAllLabs } from "@/hooks/queries/useLabs";
import { usePatients } from "@/hooks/queries/usePatients";
import { formatTime, formatFullDate } from "@/lib/constants";
import { CardListSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientPickerModal from "@/components/consultations/PatientPickerModal";
import RequestLabModal from "./RequestLabModal";
import EnterLabResultModal from "./EnterLabResultModal";
import ViewLabResultModal from "./ViewLabResultModal";
import PatientLabDetail from "./PatientLabDetail";
import { cn } from "@/lib/utils";
import type { LabRow } from "@/services/labs.service";

export default function LabPage() {
  const { data: labs = [], isLoading: labsLoading } = useAllLabs();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [requestPatient, setRequestPatient] = useState<{ id: string; name: string } | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [enterResultFor, setEnterResultFor] = useState<LabRow | null>(null);
  const [viewResultFor, setViewResultFor] = useState<LabRow | null>(null);

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

  const filtered = labs.filter((l) => {
    const p = patientMap.get(l.patientId);
    const pName = p ? p.name.toLowerCase() : (l.ptName ? l.ptName.toLowerCase() : "");
    const s = search.toLowerCase();
    const matchSearch = pName.includes(s) || l.testName.toLowerCase().includes(s);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Laboratory Investigations</h1>
          <p className="text-sm font-medium text-ink-3">
            {labs.filter((l) => l.status === "pending").length} pending · {labs.filter((l) => l.status === "completed").length} completed
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95"
        >
          + Request Investigation
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name or test name…"
          className={cn(
            "flex-1 min-w-[200px] rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        <div className="flex rounded-xl border border-border bg-card p-1">
          {(["all", "pending", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all",
                filterStatus === st ? "bg-accent text-white shadow-sm" : "text-ink-3 hover:text-ink"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <EmptyState
              icon="flask"
              title="No lab orders found"
              subtitle={search ? "Try adjusting your filters" : 'Click "+ Request Investigation" to order a lab'}
            />
          </div>
        ) : (
          filtered.map((l) => {
            const p = patientMap.get(l.patientId);
            const ptName = p?.name || l.ptName || "Unknown Patient";
            const isPending = l.status === "pending";
            return (
              <div
                key={l.id}
                onClick={() => setSelectedPatientId(l.patientId)}
                className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:bg-bg/60 hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-base text-ink group-hover:text-accent transition-colors">{l.testName}</div>
                    <div className="font-bold text-sm text-ink-2">{ptName}</div>
                    <div className="font-mono text-xs font-semibold text-ink-3 mt-1">
                      Ordered: {formatFullDate(l.timeRequested)} · {formatTime(l.timeRequested)}
                    </div>
                  </div>
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                    isPending ? "bg-status-high-bg text-status-high border border-status-high-border" : "bg-status-normal-bg text-status-normal border border-status-normal-border"
                  )}>
                    {l.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-xs font-semibold text-ink-3">
                  <span>Dr: {l.requestedBy || "Attending Doctor"}</span>
                  {isPending ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEnterResultFor(l); }}
                      className="cursor-pointer font-bold text-status-normal hover:underline"
                    >
                      + Enter Result
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewResultFor(l); }}
                      className="cursor-pointer font-bold text-accent hover:underline"
                    >
                      View Report →
                    </button>
                  )}
                </div>
              </div>
            );
          })
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

      {enterResultFor && (
        <EnterLabResultModal
          open={!!enterResultFor}
          onClose={() => setEnterResultFor(null)}
          patientId={enterResultFor.patientId}
          labId={enterResultFor.id}
          testName={enterResultFor.testName}
        />
      )}

      {viewResultFor && (
        <ViewLabResultModal
          open={!!viewResultFor}
          onClose={() => setViewResultFor(null)}
          testName={viewResultFor.testName}
          result={viewResultFor.result || ""}
          timeCompleted={viewResultFor.timeCompleted}
          requestedBy={viewResultFor.requestedBy}
          patientName={patientMap.get(viewResultFor.patientId)?.name || viewResultFor.ptName}
          patientAge={patientMap.get(viewResultFor.patientId)?.age}
          patientGender={patientMap.get(viewResultFor.patientId)?.gender}
          patientOpdNumber={patientMap.get(viewResultFor.patientId)?.opdNumber || viewResultFor.ptOpd}
        />
      )}
    </div>
  );
}
