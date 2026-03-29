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
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  patientId: string;
}

export default function PatientDetailPage({ patientId }: Props) {
  const patient = usePatientStore((s) =>
    s.patients.find((p) => p.id === patientId)
  );
  const vitals = usePatientStore((s) => s.vitals[patientId] || []);
  const consults = usePatientStore((s) => s.consultations[patientId] || []);
  const labs = usePatientStore((s) => s.labInvestigations[patientId] || []);
  const meds = usePatientStore((s) => s.prescriptions[patientId] || []);

  const deleteVitals = usePatientStore((s) => s.deleteVitals);
  const dispensePrescription = usePatientStore((s) => s.dispensePrescription);
  const clearViewingPatient = useUiStore((s) => s.clearViewingPatient);

  const [logOpen, setLogOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"vitals" | "consults" | "labs" | "meds">("vitals");
  const { showToast } = useToast();

  if (!patient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-3xl opacity-20">?</div>
          <div className="text-sm font-semibold text-ink-2">Patient not found</div>
          <button onClick={clearViewingPatient} className="mt-3 cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <button onClick={clearViewingPatient} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2">
          ← Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => setLogOpen(true)} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover hover:shadow-md">
            + Vitals
          </button>
          <button onClick={() => setConsultOpen(true)} className="cursor-pointer rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white hover:opacity-90 hover:shadow-md">
            + Consult
          </button>
          <button onClick={() => setLabOpen(true)} className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-ink-2 hover:bg-bg-2">
            + Lab
          </button>
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-ink-2 hover:bg-bg-2">
            + Rx
          </button>
        </div>
      </div>

      <PatientDetailHeader patient={patient} />

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {(["vitals", "consults", "labs", "meds"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer",
              activeTab === tab ? "border-accent text-accent" : "border-transparent text-ink-3 hover:text-ink hover:border-border-2"
            )}
          >
            {tab === "meds" ? `Pharmacy (${meds.length})` : tab === "consults" ? `Consults (${consults.length})` : tab === "labs" ? `Labs (${labs.length})` : `Vitals (${vitals.length})`}
          </button>
        ))}
      </div>

      {/* ─── Vitals Tab ─── */}
      {activeTab === "vitals" && (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "BP", "Pulse", "Temp", "Wt", "RR", "Notes", ""].map((h) => (
                  <th key={h} className="bg-bg-2 px-3 py-2 text-left font-mono text-[0.54rem] tracking-[0.18em] text-ink-3 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vitals.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-xs text-ink-3">No vitals logged yet</td></tr>}
              {vitals.map((v) => (
                <tr key={v.id} className="border-b border-border hover:bg-bg">
                  <td className="px-3 py-2 text-[0.68rem] font-mono text-ink-2 whitespace-nowrap">{formatFullDate(v.time)}</td>
                  <td className="px-3 py-2 text-sm font-semibold">{v.sys ?? "-"}/{v.dia ?? "-"}</td>
                  <td className="px-3 py-2 font-mono text-sm">{v.pulse ?? "-"}</td>
                  <td className="px-3 py-2 font-mono text-sm">{v.temperature ? `${v.temperature}°C` : "-"}</td>
                  <td className="px-3 py-2 font-mono text-sm">{v.weight ? `${v.weight}kg` : "-"}</td>
                  <td className="px-3 py-2 font-mono text-sm">{v.respiratoryRate ?? "-"}</td>
                  <td className="px-3 py-2 text-[0.65rem] text-ink-3">{v.notes || "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => { if(confirm("Delete vitals?")) { deleteVitals(patientId, v.id); showToast("Deleted", "✕") } }} className="cursor-pointer text-[0.65rem] text-status-high hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Consults Tab ─── */}
      {activeTab === "consults" && (
        <div className="space-y-3">
          {consults.length === 0 && <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">No consultations yet. Click "+ Consult" to add one.</div>}
          {consults.map(c => (
            <div key={c.id} className="p-4 rounded-lg border border-border bg-card shadow-card">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-sm text-ink">{c.diagnosis || "No Diagnosis"}</div>
                <div className="font-mono text-[0.65rem] text-ink-3 whitespace-nowrap">{formatFullDate(c.time)}</div>
              </div>
              <div className="text-xs text-ink-2 mb-1"><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-2">Symptoms</span>{c.symptoms || "—"}</div>
              <div className="text-xs text-ink-2 mb-2"><span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 mr-2">Doctor</span>{c.doctorId}</div>
              {c.notes && <div className="text-xs bg-bg-2 p-2 rounded text-ink-2 border border-border-2">{c.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ─── Labs Tab ─── */}
      {activeTab === "labs" && (
        <div className="space-y-3">
          {labs.length === 0 && <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">No lab requests yet. Click "+ Lab" to request one.</div>}
          {labs.map(l => (
            <div key={l.id} className="p-4 rounded-lg border border-border bg-card shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-ink">{l.testName}</div>
                <div className={cn(
                  "text-[0.65rem] px-2 py-1 rounded-full font-mono uppercase",
                  l.status === "completed" ? "bg-status-normal-bg text-status-normal" : "bg-status-elevated-bg text-status-elevated"
                )}>{l.status}</div>
              </div>
              <div className="text-[0.65rem] font-mono text-ink-3 uppercase mb-2">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
              {l.result && (
                <div className="text-xs bg-blue-bg text-blue p-2.5 rounded border border-blue/10 mb-2">
                  <span className="font-mono text-[0.5rem] uppercase tracking-wider text-blue/60 block mb-0.5">Result</span>
                  {l.result}
                </div>
              )}
              {l.status === "pending" && (
                <button
                  onClick={() => setResultFor({ labId: l.id, testName: l.testName })}
                  className="cursor-pointer rounded-lg bg-status-normal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
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
        <div className="space-y-3">
          {meds.length === 0 && <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">No prescriptions yet. Click "+ Rx" to add one.</div>}
          {meds.map(m => (
            <div key={m.id} className="p-4 rounded-lg border border-border bg-card shadow-card">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-ink">{m.medication} <span className="font-normal text-ink-3 text-sm ml-1">{m.dosage}</span></div>
                <div className={cn(
                  "text-[0.65rem] px-2 py-1 rounded border font-mono uppercase",
                  m.status === "dispensed" ? "border-status-normal text-status-normal bg-status-normal-bg" : "border-status-crisis text-status-crisis bg-status-crisis-bg"
                )}>{m.status}</div>
              </div>
              <div className="text-sm text-ink-2 mb-2">{m.instructions}</div>
              <div className="text-[0.65rem] text-ink-4 flex gap-4 mb-2">
                <span>Prescribed: {formatFullDate(m.timePrescribed)} by {m.prescribedBy}</span>
                {m.timeDispensed && <span>Dispensed: {formatFullDate(m.timeDispensed)}</span>}
              </div>
              {m.status === "pending" && (
                <button
                  onClick={() => {
                    if (confirm(`Dispense ${m.medication} ${m.dosage}?`)) {
                      dispensePrescription(patientId, m.id);
                      showToast("Dispensed", "✓");
                    }
                  }}
                  className="cursor-pointer rounded-lg bg-status-normal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
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
      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
    </div>
  );
}
