"use client";

import { useState } from "react";
import { usePatient } from "@/hooks/queries/usePatients";
import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useDispensePrescription } from "@/hooks/mutations/useDispensePrescription";
import { useDeletePrescription } from "@/hooks/mutations/useDeletePrescription";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatFullDate, getInitials } from "@/lib/constants";
import { isDateMatch } from "@/lib/dateUtils";
import DateFilterBar from "@/components/common/DateFilter/DateFilterBar";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import { exportPrescriptionsPdf } from "@/components/pharmacy/PrescriptionPrintView";

interface Props {
  patientId: string;
  onBack: () => void;
  initialDate?: string;
}

export default function PatientPharmacyDetail({ patientId, onBack, initialDate = "today" }: Props) {
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: meds = [], isLoading } = usePrescriptions(patientId);
  const dispensePrescriptionMut = useDispensePrescription();
  const deletePrescriptionMut = useDeletePrescription();
  const { showToast } = useToast();
  const [filterDate, setFilterDate] = useState(initialDate);
  const [rxOpen, setRxOpen] = useState(false);

  if (isLoading || patientLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading prescriptions…</div>;
  }

  if (!patient) return null;

  const filteredMeds = meds.filter((m) => isDateMatch(m.timePrescribed, filterDate));
  const pending = filteredMeds.filter((m) => m.status === "pending");
  const dispensed = filteredMeds.filter((m) => m.status === "dispensed");

  const handleDelete = async (prescriptionId: number, medication: string) => {
    if (confirm(`Delete prescription for "${medication}"?`)) {
      try {
        await deletePrescriptionMut.mutateAsync({ patientId, prescriptionId });
        showToast("Prescription deleted", "✓");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to delete prescription", "⚠");
      }
    }
  };

  const handleExportAll = () => {
    exportPrescriptionsPdf({
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientOpdNumber: patient.opdNumber,
      prescriptions: filteredMeds.map((m) => ({
        medication: m.medication,
        dosage: m.dosage,
        instructions: m.instructions,
        timePrescribed: m.timePrescribed,
        timeDispensed: m.timeDispensed,
        prescribedBy: m.prescribedBy,
        status: m.status,
      })),
    });
  };

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Pharmacy
        </button>
        <div className="flex items-center gap-2.5">
          {filteredMeds.length > 0 && (
            <button
              onClick={handleExportAll}
              className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink transition-all hover:bg-bg-2 hover:text-accent flex items-center gap-1.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export Rx PDF
            </button>
          )}
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-sm">+ Prescribe</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 font-serif text-xl font-bold text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">{patient.name}</h1>
          <p className="text-xs font-bold text-ink-3 font-mono">{filteredMeds.length} prescription{filteredMeds.length !== 1 ? "s" : ""} · {pending.length} pending</p>
        </div>
      </div>

      <DateFilterBar
        selectedDate={filterDate}
        onDateChange={setFilterDate}
        badgeText={`${pending.length} pending · ${dispensed.length} dispensed`}
      />

      {/* Pending Prescriptions */}
      {pending.length > 0 && (
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-status-crisis">Awaiting Dispense ({pending.length})</div>
          <div className="space-y-2.5">
            {pending.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">{m.medication} <span className="ml-1 text-xs font-semibold text-ink-2">({m.dosage})</span></div>
                  <div className="text-xs font-medium text-ink-2 mt-0.5">&quot;{m.instructions}&quot;</div>
                  <div className="text-xs font-medium text-ink-3 mt-1">Prescribed: {formatFullDate(m.timePrescribed)} · By {m.prescribedBy}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await dispensePrescriptionMut.mutateAsync({ patientId, prescriptionId: m.id });
                      showToast("Prescription marked as dispensed", "✓");
                    }}
                    className="cursor-pointer rounded-xl bg-status-normal px-4 py-2 text-xs font-bold text-white hover:opacity-90 shadow-sm"
                  >
                    Dispense
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.medication)}
                    className="cursor-pointer rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-ink-3 hover:text-status-high hover:border-status-high-border hover:bg-status-high-bg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispensed Prescriptions */}
      {dispensed.length > 0 && (
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-status-normal">Dispensed ({dispensed.length})</div>
          <div className="space-y-2.5">
            {dispensed.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-base font-bold text-ink">{m.medication} <span className="ml-1 text-xs font-semibold text-ink-2">({m.dosage})</span></div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase bg-status-normal-bg text-status-normal border border-status-normal-border">dispensed</span>
                </div>
                <div className="text-xs font-medium text-ink-2 mb-2">&quot;{m.instructions}&quot;</div>
                <div className="flex gap-4 text-xs font-medium text-ink-3">
                  <div>Prescribed: {formatFullDate(m.timePrescribed)} by {m.prescribedBy}</div>
                  {m.timeDispensed && <div>Dispensed: {formatFullDate(m.timeDispensed)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredMeds.length === 0 && (
        <div className="p-8 text-center text-sm font-semibold text-ink-3 border rounded-2xl border-dashed border-border-2">
          No prescriptions found for the selected date. Switch date filter or click &quot;+ Prescribe&quot;.
        </div>
      )}

      {rxOpen && <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} patientId={patientId} patientName={patient.name} />}
    </div>
  );
}
