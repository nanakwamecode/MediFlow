"use client";

import { exportLabResultsPdf } from "@/components/laboratory/LabResultPrintView";
import { cn } from "@/lib/utils";
import type { LabInvestigation, Patient, Prescription } from "@/types";

interface Props {
  patient: Patient;
  meds: Prescription[];
  labs: LabInvestigation[];
  onViewLabResult: (lab: LabInvestigation) => void;
}

export default function ConsultationRelatedSection({
  patient,
  meds,
  labs,
  onViewLabResult,
}: Props) {
  const completedLabs = labs.filter((l) => l.status === "completed" && l.result);

  const handleExportLabs = () => {
    exportLabResultsPdf({
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientOpdNumber: patient.opdNumber,
      labs: completedLabs.map((l) => ({
        id: l.id,
        testName: l.testName,
        result: l.result || "",
        timeRequested: l.timeRequested,
        timeCompleted: l.timeCompleted,
        requestedBy: l.requestedBy,
        status: l.status,
      })),
    });
  };

  return (
    <>
      {meds.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-2">
            Related Prescriptions ({meds.length})
          </div>
          <div className="space-y-2.5">
            {meds.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">
                    {m.medication}{" "}
                    <span className="ml-1 text-xs font-semibold text-ink-3">({m.dosage})</span>
                  </div>
                  <div className="text-xs font-medium text-ink-2 mt-0.5">&quot;{m.instructions}&quot;</div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", m.status === "dispensed" ? "bg-status-normal-bg text-status-normal border border-status-normal-border" : "bg-status-crisis/10 text-status-crisis border border-status-crisis/20")}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {labs.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-2">
              Related Lab Investigations ({labs.length})
            </div>
            {completedLabs.length > 0 && (
              <button
                type="button"
                onClick={handleExportLabs}
                className="cursor-pointer rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-ink hover:bg-bg-2 hover:text-accent shadow-sm"
              >
                {completedLabs.length > 1 ? `Export Combined PDF (${completedLabs.length})` : "Export PDF"}
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {labs.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">{l.testName}</div>
                  {l.result && (
                    <button onClick={() => onViewLabResult(l)} className="mt-1.5 flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-bg/80 px-3 py-1 text-left transition-colors hover:bg-blue-bg">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue">Click to View Full Report</span>
                    </button>
                  )}
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", l.status === "completed" ? "bg-status-normal-bg text-status-normal border border-status-normal-border" : "bg-status-elevated-bg text-status-elevated border border-amber-200")}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
