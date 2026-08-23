"use client";

import { useState } from "react";
import { useAllPrescriptions } from "@/hooks/queries/usePrescriptions";
import { usePatients } from "@/hooks/queries/usePatients";
import { formatTime, formatFullDate } from "@/lib/constants";
import { CardListSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientPickerModal from "@/components/consultations/PatientPickerModal";
import AddPrescriptionModal from "./AddPrescriptionModal";
import PatientPharmacyDetail from "./PatientPharmacyDetail";
import { cn } from "@/lib/utils";
import type { PrescriptionRow } from "@/services/prescriptions.service";

export default function PharmacyPage() {
  const { data: prescriptions = [], isLoading: rxLoading } = useAllPrescriptions();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "dispensed">("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addPatient, setAddPatient] = useState<{ id: string; name: string } | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const isLoading = rxLoading || patientsLoading;

  if (isLoading) {
    return <CardListSkeleton count={5} />;
  }

  if (selectedPatientId) {
    return (
      <PatientPharmacyDetail
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const filtered = prescriptions.filter((rx) => {
    const p = patientMap.get(rx.patientId);
    const pName = p ? p.name.toLowerCase() : (rx.ptName ? rx.ptName.toLowerCase() : "");
    const s = search.toLowerCase();
    const matchSearch = pName.includes(s) || rx.medication.toLowerCase().includes(s);
    const matchStatus = filterStatus === "all" || rx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Pharmacy & Dispensary</h1>
          <p className="text-sm font-medium text-ink-3">
            {prescriptions.filter((r) => r.status === "pending").length} pending · {prescriptions.filter((r) => r.status === "dispensed").length} dispensed
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-95"
        >
          + New Prescription
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name or medication…"
          className={cn(
            "flex-1 min-w-[200px] rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        <div className="flex rounded-xl border border-border bg-card p-1">
          {(["all", "pending", "dispensed"] as const).map((st) => (
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
              icon="pill"
              title="No prescriptions found"
              subtitle={search ? "Try adjusting your filters" : 'Click "+ New Prescription" to issue medication'}
            />
          </div>
        ) : (
          filtered.map((rx) => {
            const p = patientMap.get(rx.patientId);
            const ptName = p?.name || rx.ptName || "Unknown Patient";
            const isPending = rx.status === "pending";
            return (
              <div
                key={rx.id}
                onClick={() => setSelectedPatientId(rx.patientId)}
                className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:bg-bg/60 hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-base text-ink group-hover:text-accent transition-colors">{ptName}</div>
                    <div className="font-mono text-xs font-semibold text-ink-3 mt-0.5">
                      Prescribed: {formatFullDate(rx.timePrescribed)} · {formatTime(rx.timePrescribed)}
                    </div>
                  </div>
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                    isPending ? "bg-status-high-bg text-status-high border border-status-high-border" : "bg-status-normal-bg text-status-normal border border-status-normal-border"
                  )}>
                    {rx.status}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-bg-2 px-2.5 py-1 text-xs font-bold text-ink-2 border border-border">
                    {rx.medication} {rx.dosage ? `(${rx.dosage})` : ""}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-xs font-semibold text-ink-3">
                  <span>Dr: {rx.prescribedBy || "Attending Doctor"}</span>
                  <span className="font-bold text-accent">View Details →</span>
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
            setAddPatient({ id, name });
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {addPatient && (
        <AddPrescriptionModal
          open={!!addPatient}
          onClose={() => setAddPatient(null)}
          patientId={addPatient.id}
          patientName={addPatient.name}
        />
      )}
    </div>
  );
}
