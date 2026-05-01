"use client";

import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { useState } from "react";
import PatientDetailHeader from "./PatientDetailHeader";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import AddConsultationModal from "@/components/consultations/AddConsultationModal";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";
import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";
import PatientModal from "@/components/patients/PatientModal";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  patientId: string;
}

export default function PatientDetailPage({ patientId }: Props) {
  const patient = usePatientStore((s) =>
    s.patients.find((p) => p.id === patientId)
  );
  const vitals = usePatientStore((s) => s.vitals[patientId]) || [];
  const consults = usePatientStore((s) => s.consultations[patientId]) || [];
  const labs = usePatientStore((s) => s.labInvestigations[patientId]) || [];
  const meds = usePatientStore((s) => s.prescriptions[patientId]) || [];

  const deleteVitals = usePatientStore((s) => s.deleteVitals);
  const dispensePrescription = usePatientStore((s) => s.dispensePrescription);
  const clearViewingPatient = useUiStore((s) => s.clearViewingPatient);

  const [logOpen, setLogOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [editPatientOpen, setEditPatientOpen] = useState(false);
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [viewingResult, setViewingResult] = useState<typeof labs[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"vitals" | "consults" | "labs" | "meds">("vitals");
  const { showToast } = useToast();

  if (!patient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-3xl opacity-20">?</div>
          <div className="text-sm font-semibold text-ink-2">Patient not found</div>
          <button onClick={clearViewingPatient} className="mt-3 cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={clearViewingPatient} className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-ink-2 shadow-sm transition-all hover:border-border-2 hover:bg-bg-2">
          <span className="transition-transform group-hover:-translate-x-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></span> Back
        </button>
        <div className="flex flex-wrap gap-2 rounded-full border border-border bg-card p-1 shadow-sm">
          <button onClick={() => setLogOpen(true)} className="cursor-pointer rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md active:scale-95">
            + Vitals
          </button>
          <button onClick={() => setConsultOpen(true)} className="cursor-pointer rounded-full bg-blue px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-opacity-90 hover:shadow-md active:scale-95">
            + Consult
          </button>
          <button onClick={() => setLabOpen(true)} className="cursor-pointer rounded-full bg-bg-2 px-4 py-1.5 text-xs font-semibold text-ink hover:bg-border active:scale-95 transition-all">
            + Lab
          </button>
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-full bg-bg-2 px-4 py-1.5 text-xs font-semibold text-ink hover:bg-border active:scale-95 transition-all">
            + Rx
          </button>
        </div>
      </div>

      <PatientDetailHeader patient={patient} onEdit={() => setEditPatientOpen(true)} />

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(["vitals", "consults", "labs", "meds"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative cursor-pointer rounded-full px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-wider transition-all",
              activeTab === tab 
                ? "bg-ink text-white shadow-md ring-1 ring-ink/10" 
                : "bg-white text-ink-3 hover:bg-bg-2 hover:text-ink ring-1 ring-border shadow-sm"
            )}
          >
            {tab === "meds" ? `Pharmacy (${meds.length})` : tab === "consults" ? `Consults (${consults.length})` : tab === "labs" ? `Labs (${labs.length})` : `Vitals (${vitals.length})`}
          </button>
        ))}
      </div>

      {/* ─── Vitals Tab ─── */}
      {activeTab === "vitals" && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "BP", "Pulse", "Temp", "Wt", "RR", "Notes", ""].map((h) => (
                  <th key={h} className="bg-bg-2/50 px-4 py-3 text-left font-mono text-[0.6rem] font-medium tracking-[0.15em] text-ink-3 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vitals.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-sm font-medium text-ink-3">No vitals logged yet</td></tr>}
              {vitals.map((v) => (
                <tr key={v.id} className="border-b border-border/50 transition-colors hover:bg-bg">
                  <td className="px-4 py-3 text-[0.7rem] font-medium text-ink-2 whitespace-nowrap">{formatFullDate(v.time).split(',')[0]}</td>
                  <td className="px-4 py-3 text-[0.8rem] font-semibold text-ink">{v.sys ?? "-"}/{v.dia ?? "-"}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem]">{v.pulse ?? "-"}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem]">{v.temperature ? `${v.temperature}°C` : "-"}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem]">{v.weight ? `${v.weight}kg` : "-"}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem]">{v.respiratoryRate ?? "-"}</td>
                  <td className="px-4 py-3 text-[0.7rem] text-ink-3">{v.notes || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { if(confirm("Delete vitals?")) { deleteVitals(patientId, v.id); showToast("Deleted", "—") } }} className="cursor-pointer rounded bg-status-high-bg px-2 py-1 text-[0.65rem] font-medium text-status-high transition-colors hover:bg-status-high hover:text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Consults Tab ─── */}
      {activeTab === "consults" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {consults.length === 0 && (
            <div className="col-span-full p-10 text-center text-sm font-medium text-ink-3 border rounded-2xl border-dashed border-border-2 bg-white/50">
              No consultations yet. Click "+ Consult" to add one.
            </div>
          )}
          {consults.map(c => (
            <div key={c.id} className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-blue opacity-50 backdrop-blur-sm transition-all group-hover:opacity-100"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="font-serif text-[1.15rem] leading-tight text-ink group-hover:text-blue transition-colors">{c.diagnosis || "No Diagnosis"}</div>
                <div className="rounded-full bg-bg-2 px-2.5 py-1 font-mono text-[0.65rem] font-medium text-ink-3 ring-1 ring-border">{formatFullDate(c.time).split(',')[0]}</div>
              </div>
              <div className="text-[0.8rem] text-ink-2 mb-2 flex items-start gap-2">
                <span className="mt-0.5 rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-widest text-ink-4">Sym</span>
                <span className="flex-1">{c.symptoms || "—"}</span>
              </div>
              <div className="text-[0.8rem] text-ink-2 mb-3 flex items-center gap-2">
                <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-widest text-ink-4">Doc</span>
                <span>{c.doctorId}</span>
              </div>
              {c.notes && <div className="text-[0.75rem] bg-amber-50/50 p-3 rounded-xl text-ink-2 shadow-inner ring-1 ring-amber-500/20 italic leading-relaxed">{c.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ─── Labs Tab ─── */}
      {activeTab === "labs" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labs.length === 0 && (
            <div className="col-span-full p-10 text-center text-sm font-medium text-ink-3 border rounded-2xl border-dashed border-border-2 bg-white/50">
              No lab requests yet. Click "+ Lab" to request one.
            </div>
          )}
          {labs.map(l => (
            <div key={l.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-serif text-[1.1rem] font-medium text-ink">{l.testName}</div>
                  <div className={cn(
                    "text-[0.6rem] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest leading-none ring-1",
                    l.status === "completed" ? "bg-status-normal-bg text-status-normal ring-status-normal/30" : "bg-status-elevated-bg text-status-elevated ring-status-elevated/30"
                  )}>{l.status}</div>
                </div>
                <div className="text-[0.7rem] text-ink-3 mb-3 flex flex-col gap-1">
                  <div><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-1">Req:</span> {formatFullDate(l.timeRequested).split(',')[0]}</div>
                  <div><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-1">By:</span> {l.requestedBy}</div>
                </div>
                {l.result && (
                  <button 
                    onClick={() => setViewingResult(l)} 
                    className="w-full text-left opacity-90 cursor-pointer rounded-xl border border-blue-500/20 bg-blue-50/50 p-3 transition-colors hover:bg-blue-100/50 hover:border-blue-500/30 shadow-inner"
                  >
                    <span className="font-mono text-[0.55rem] font-bold uppercase tracking-widest text-blue-500/80 block mb-1">Click to view Result</span>
                    <span className="text-[0.8rem] text-blue-900 font-medium line-clamp-1 leading-relaxed">{l.result.split('\n')[0]}...</span>
                  </button>
                )}
              </div>
              {l.status === "pending" && (
                <button
                  onClick={() => setResultFor({ labId: l.id, testName: l.testName })}
                  className="mt-3 w-full cursor-pointer rounded-xl bg-accent/10 px-3 py-2 text-[0.75rem] font-semibold text-accent ring-1 ring-accent/20 transition-all hover:bg-accent hover:text-white shadow-sm"
                >
                  Enter Result
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Pharmacy Tab ─── */}
      {activeTab === "meds" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meds.length === 0 && (
            <div className="col-span-full p-10 text-center text-sm font-medium text-ink-3 border rounded-2xl border-dashed border-border-2 bg-white/50">
              No prescriptions yet. Click "+ Rx" to add one.
            </div>
          )}
          {meds.map(m => (
            <div key={m.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="font-serif text-[1.1rem] font-medium text-ink leading-tight">
                    {m.medication} 
                    <span className="block font-sans font-normal text-ink-4 text-[0.75rem] mt-0.5 bg-bg-2 px-1.5 py-0.5 rounded w-fit">{m.dosage}</span>
                  </div>
                  <div className={cn(
                    "text-[0.6rem] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest leading-none ring-1 shrink-0",
                    m.status === "dispensed" ? "bg-status-normal-bg text-status-normal ring-status-normal/30" : "bg-status-crisis-bg text-status-crisis ring-status-crisis/30"
                  )}>{m.status}</div>
                </div>
                <div className="text-[0.8rem] text-ink-2 mb-3 bg-ink/5 p-2 rounded-lg italic">
                  &quot;{m.instructions}&quot;
                </div>
                <div className="text-[0.7rem] text-ink-3 flex flex-col gap-1 mb-3">
                  <div><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-1">Rx:</span> {formatFullDate(m.timePrescribed).split(',')[0]} by {m.prescribedBy}</div>
                  {m.timeDispensed && <div><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-1">Disp:</span> {formatFullDate(m.timeDispensed).split(',')[0]}</div>}
                </div>
              </div>
              {m.status === "pending" && (
                <button
                  onClick={() => {
                    if (confirm(`Dispense ${m.medication} ${m.dosage}?`)) {
                      dispensePrescription(patientId, m.id);
                      showToast("Dispensed", "✓");
                    }
                  }}
                  className="mt-2 cursor-pointer rounded-xl bg-status-normal/10 px-3 py-2 text-[0.75rem] font-semibold text-status-normal ring-1 ring-status-normal/20 transition-all hover:bg-status-normal hover:text-white"
                >
                  Mark as Dispensed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <LogVitalsModal open={logOpen} onClose={() => setLogOpen(false)} patientId={patientId} patientName={patient.name} />
      <AddConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} patientId={patientId} patientName={patient.name} />
      <RequestLabModal open={labOpen} onClose={() => setLabOpen(false)} patientId={patientId} patientName={patient.name} />
      <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} patientId={patientId} patientName={patient.name} />
      {editPatientOpen && <PatientModal open={editPatientOpen} onClose={() => setEditPatientOpen(false)} editPatient={patient} />}
      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {viewingResult && <ViewLabResultModal open={!!viewingResult} onClose={() => setViewingResult(null)} testName={viewingResult.testName} result={viewingResult.result || ""} timeCompleted={viewingResult.timeCompleted} requestedBy={viewingResult.requestedBy} />}
    </div>
  );
}
