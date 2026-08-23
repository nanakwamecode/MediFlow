"use client";

import { useState, useMemo } from "react";
import { usePatient } from "@/hooks/queries/usePatients";
import { useConsultations } from "@/hooks/queries/useConsultations";
import { useUpdateConsultation } from "@/hooks/mutations/useUpdateConsultation";
import { useLabs } from "@/hooks/queries/useLabs";
import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { formatFullDate, getInitials } from "@/lib/constants";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";
import { cn } from "@/lib/utils";
import type { LabInvestigation } from "@/types";

interface Props {
  patientId: string;
  consultId: number;
  onBack: () => void;
}

export default function ConsultationDetail({ patientId, consultId, onBack }: Props) {
  const { data: patient } = usePatient(patientId);
  const { data: consults = [] } = useConsultations(patientId);
  const { data: allLabs = [] } = useLabs(patientId);
  const { data: allMeds = [] } = usePrescriptions(patientId);
  const updateConsultationMut = useUpdateConsultation();

  const consult = consults.find((c) => c.id === consultId);
  const doctorId = consult?.doctorId;
  const labs = useMemo(() => allLabs.filter((l) => l.requestedBy === doctorId), [allLabs, doctorId]);
  const meds = useMemo(() => allMeds.filter((m) => m.prescribedBy === doctorId), [allMeds, doctorId]);

  const [editing, setEditing] = useState(false);
  const [symptoms, setSymptoms] = useState(consult?.symptoms || "");
  const [diagnosis, setDiagnosis] = useState(consult?.diagnosis || "");
  const [notes, setNotes] = useState(consult?.notes || "");
  const [rxOpen, setRxOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<LabInvestigation | null>(null);

  if (!patient || !consult) return <div className="p-7 text-ink-3 font-semibold">Consultation not found</div>;

  const handleSave = async () => {
    await updateConsultationMut.mutateAsync({
      patientId,
      consultId,
      data: { symptoms, diagnosis, notes },
    });
    setEditing(false);
  };

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3.5 py-2.5",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1.5 block text-xs font-bold text-ink-2 tracking-wide uppercase";

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Consultations
        </button>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={() => { setSymptoms(consult.symptoms || ""); setDiagnosis(consult.diagnosis || ""); setNotes(consult.notes || ""); setEditing(true); }} className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink hover:bg-bg-2 flex items-center gap-1.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Edit
            </button>
          )}
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-sm">+ Prescribe</button>
          <button onClick={() => setLabOpen(true)} className="cursor-pointer rounded-xl border border-blue bg-blue-bg px-4 py-2 text-xs font-bold text-blue hover:bg-blue/10 shadow-sm">+ Lab</button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 font-serif text-xl font-bold text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">{patient.name}</h1>
          <p className="text-xs font-bold text-ink-3 font-mono">Dr. {consult.doctorId} · {formatFullDate(consult.time)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Symptoms</label>
              <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={2} className={cn(fieldClass, "resize-none")} />
            </div>
            <div>
              <label className={labelClass}>Diagnosis</label>
              <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Notes / Plan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={cn(fieldClass, "resize-none")} />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button onClick={() => setEditing(false)} className="cursor-pointer rounded-xl border border-border px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2">Cancel</button>
              <button onClick={handleSave} disabled={updateConsultationMut.isPending} className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover disabled:opacity-50">
                {updateConsultationMut.isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Symptoms</span>
              <p className="text-base font-semibold text-ink">{consult.symptoms || "—"}</p>
            </div>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Diagnosis</span>
              <p className="text-lg font-bold text-ink">{consult.diagnosis || "—"}</p>
            </div>
            {consult.notes && (
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Notes & Clinical Plan</span>
                <p className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm font-medium leading-relaxed text-ink-2">{consult.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prescriptions */}
      {meds.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-2">Related Prescriptions ({meds.length})</div>
          <div className="space-y-2.5">
            {meds.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">{m.medication} <span className="ml-1 text-xs font-semibold text-ink-3">({m.dosage})</span></div>
                  <div className="text-xs font-medium text-ink-2 mt-0.5">&quot;{m.instructions}&quot;</div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", m.status === "dispensed" ? "bg-status-normal-bg text-status-normal border border-status-normal-border" : "bg-status-crisis/10 text-status-crisis border border-status-crisis/20")}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Labs */}
      {labs.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-2">Related Lab Investigations ({labs.length})</div>
          <div className="space-y-2.5">
            {labs.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <div className="text-base font-bold text-ink">{l.testName}</div>
                  {l.result && (
                    <button onClick={() => setViewingResult(l)} className="mt-1.5 flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-bg/80 px-3 py-1 text-left transition-colors hover:bg-blue-bg">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue">Click to View Full Report</span>
                    </button>
                  )}
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", l.status === "completed" ? "bg-status-normal-bg text-status-normal border border-status-normal-border" : "bg-status-elevated-bg text-status-elevated border border-amber-200")}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} patientId={patientId} patientName={patient.name} />
      <RequestLabModal open={labOpen} onClose={() => setLabOpen(false)} patientId={patientId} patientName={patient.name} />
      {viewingResult && <ViewLabResultModal open={!!viewingResult} onClose={() => setViewingResult(null)} testName={viewingResult.testName} result={viewingResult.result || ""} timeCompleted={viewingResult.timeCompleted} requestedBy={viewingResult.requestedBy} />}
    </div>
  );
}
