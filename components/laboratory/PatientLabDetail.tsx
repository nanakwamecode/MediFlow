"use client";

import { useState } from "react";
import { usePatient } from "@/hooks/queries/usePatients";
import { useLabs } from "@/hooks/queries/useLabs";
import { formatFullDate, getInitials } from "@/lib/constants";
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";
import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import { exportLabResultsPdf } from "@/components/laboratory/LabResultPrintView";
import type { LabInvestigation } from "@/types";

interface Props {
  patientId: string;
  onBack: () => void;
}

export default function PatientLabDetail({ patientId, onBack }: Props) {
  const { data: patient } = usePatient(patientId);
  const { data: labs = [], isLoading } = useLabs(patientId);
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<LabInvestigation | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading laboratory investigations…</div>;
  }

  if (!patient) return null;

  const pending = labs.filter((l) => l.status === "pending");
  const completed = labs.filter((l) => l.status === "completed");

  const handleExportAll = () => {
    exportLabResultsPdf({
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientOpdNumber: patient.opdNumber,
      labs: labs.map((l) => ({
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
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Lab
        </button>
        <div className="flex items-center gap-2.5">
          {completed.length > 0 && (
            <button
              onClick={handleExportAll}
              className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink transition-all hover:bg-bg-2 hover:text-accent flex items-center gap-1.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export All PDF
            </button>
          )}
          <button onClick={() => setReqOpen(true)} className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-sm">+ Request Lab</button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 font-serif text-xl font-bold text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">{patient.name}</h1>
          <p className="text-xs font-bold text-ink-3 font-mono">{labs.length} investigation{labs.length !== 1 ? "s" : ""} · {pending.length} pending</p>
        </div>
      </div>

      {/* Pending Labs */}
      {pending.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-status-elevated">Pending ({pending.length})</div>
          <div className="space-y-2.5">
            {pending.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">{l.testName}</div>
                  <div className="text-xs font-medium text-ink-3 mt-0.5">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
                </div>
                <button onClick={() => setResultFor({ labId: l.id, testName: l.testName })} className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-sm">Enter Result</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Labs */}
      {completed.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-status-normal">Completed ({completed.length})</div>
          <div className="space-y-2.5">
            {completed.map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-bold text-ink">{l.testName}</div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase bg-status-normal-bg text-status-normal border border-status-normal-border">completed</span>
                </div>
                <div className="text-xs font-medium text-ink-3 mb-3">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
                {l.result && (
                  <button 
                    onClick={() => setViewingResult(l)} 
                    className="w-full cursor-pointer rounded-xl border border-blue-200 bg-blue-bg/80 p-3 text-left transition-colors hover:bg-blue-bg hover:border-blue-300"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-blue block mb-1">Click to View Full Report</span>
                    <span className="text-sm text-ink font-medium line-clamp-2 leading-relaxed">{l.result.split('\n')[0]}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {labs.length === 0 && (
        <div className="p-8 text-center text-sm font-semibold text-ink-3 border rounded-2xl border-dashed border-border-2">
          No lab investigations yet. Click &quot;+ Request Lab&quot; to add one.
        </div>
      )}

      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {reqOpen && <RequestLabModal open={reqOpen} onClose={() => setReqOpen(false)} patientId={patientId} patientName={patient.name} />}
      {viewingResult && (
        <ViewLabResultModal
          open={!!viewingResult}
          onClose={() => setViewingResult(null)}
          testName={viewingResult.testName}
          result={viewingResult.result || ""}
          timeCompleted={viewingResult.timeCompleted}
          timeRequested={viewingResult.timeRequested}
          requestedBy={viewingResult.requestedBy}
          patientName={patient.name}
          patientAge={patient.age}
          patientGender={patient.gender}
          patientOpdNumber={patient.opdNumber}
        />
      )}
    </div>
  );
}
