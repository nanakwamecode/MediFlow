"use client";

import { usePatientStore } from "@/store/patientStore";
import { useState, useMemo } from "react";
import { formatFullDate, getInitials } from "@/lib/constants";
import AddConsultationModal from "@/components/consultations/AddConsultationModal";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function ConsultationsPage() {
  const { patients, consultations } = usePatientStore();
  const [consultFor, setConsultFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailView, setDetailView] = useState<{ ptId: string; consultId: number } | null>(null);

  const q = search.toLowerCase();

  const allConsults = patients
    .flatMap((p) =>
      (consultations[p.id] || []).map((c) => ({ ...c, ptId: p.id, ptName: p.name }))
    )
    .filter((c) => !q || c.ptName.toLowerCase().includes(q) || (c.diagnosis || "").toLowerCase().includes(q) || (c.symptoms || "").toLowerCase().includes(q) || c.doctorId.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  if (detailView) {
    return (
      <ConsultationDetail
        patientId={detailView.ptId}
        consultId={detailView.consultId}
        onBack={() => setDetailView(null)}
      />
    );
  }

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Doctor Consultations</h1>
          <p className="text-xs text-ink-3">{allConsults.length} consultation{allConsults.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setConsultFor({ id: "", name: "" })} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-md">
          + New Consultation
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient, doctor, diagnosis, or symptoms…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {allConsults.length === 0 ? (
        <EmptyState icon="pencil" title="No consultations yet" subtitle="Click '+ New Consultation' to start one." />
      ) : (
        <div className="space-y-3">
          {allConsults.map((c) => (
            <div
              key={`${c.ptId}-${c.id}`}
              onClick={() => setDetailView({ ptId: c.ptId, consultId: c.id })}
              className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.6rem] text-accent">{getInitials(c.ptName)}</div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{c.ptName}</div>
                    <div className="font-mono text-[0.55rem] text-ink-4">{c.doctorId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-[0.65rem] text-ink-3 whitespace-nowrap">{formatFullDate(c.time)}</div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ink-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
              <div className="mb-1">
                <span className="font-mono text-[0.5rem] tracking-[0.18em] text-ink-4 uppercase mr-2">Diagnosis</span>
                <span className="text-sm font-medium text-ink">{c.diagnosis || "—"}</span>
              </div>
              <div className="mb-1">
                <span className="font-mono text-[0.5rem] tracking-[0.18em] text-ink-4 uppercase mr-2">Symptoms</span>
                <span className="text-xs text-ink-2">{c.symptoms || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Consultation - patient picker */}
      {consultFor && consultFor.id === "" ? (
        <PatientPickerModal
          onSelect={(id, name) => setConsultFor({ id, name })}
          onClose={() => setConsultFor(null)}
        />
      ) : consultFor ? (
        <AddConsultationModal open={true} onClose={() => setConsultFor(null)} patientId={consultFor.id} patientName={consultFor.name} />
      ) : null}
    </div>
  );
}

// ─── Patient Picker Modal ───
import Modal from "@/components/common/Modal/Modal";

function PatientPickerModal({ onSelect, onClose }: { onSelect: (id: string, name: string) => void; onClose: () => void }) {
  const patients = usePatientStore((s) => s.patients);
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  const filtered = patients.filter(p => !q || p.name.toLowerCase().includes(q));

  return (
    <Modal open={true} onClose={onClose} title="Select Patient" maxWidth="max-w-md">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients…"
        className="w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none mb-3 focus:border-accent"
      />
      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id, p.name)}
            className="w-full text-left cursor-pointer flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-bg-2 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.6rem] text-accent">{getInitials(p.name)}</div>
            <div>
              <div className="text-sm font-semibold text-ink">{p.name}</div>
              <div className="font-mono text-[0.55rem] text-ink-4">{[p.age ? `Age ${p.age}` : "", p.gender].filter(Boolean).join(" · ")}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="p-4 text-center text-xs text-ink-3">No patients found</div>}
      </div>
    </Modal>
  );
}

import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";

function ConsultationDetail({ patientId, consultId, onBack }: { patientId: string; consultId: number; onBack: () => void }) {
  const patient = usePatientStore(s => s.patients.find(p => p.id === patientId));
  const consult = usePatientStore(s => (s.consultations[patientId] || []).find(c => c.id === consultId));
  const updateConsultation = usePatientStore(s => s.updateConsultation);
  const allLabs = usePatientStore(s => s.labInvestigations[patientId]);
  const allMeds = usePatientStore(s => s.prescriptions[patientId]);

  const doctorId = consult?.doctorId;
  const labs = useMemo(() => (allLabs || []).filter(l => l.requestedBy === doctorId), [allLabs, doctorId]);
  const meds = useMemo(() => (allMeds || []).filter(m => m.prescribedBy === doctorId), [allMeds, doctorId]);

  const [editing, setEditing] = useState(false);
  const [symptoms, setSymptoms] = useState(consult?.symptoms || "");
  const [diagnosis, setDiagnosis] = useState(consult?.diagnosis || "");
  const [notes, setNotes] = useState(consult?.notes || "");
  const [rxOpen, setRxOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<typeof labs[0] | null>(null);

  if (!patient || !consult) return <div className="p-7 text-ink-3">Consultation not found</div>;

  const handleSave = () => {
    updateConsultation(patientId, consultId, { symptoms, diagnosis, notes });
    setEditing(false);
  };

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Consultations</button>
        <div className="flex gap-2">
          {!editing && <button onClick={() => setEditing(true)} className="cursor-pointer rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Edit</button>}
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover">+ Prescribe</button>
          <button onClick={() => setLabOpen(true)} className="cursor-pointer rounded-lg border border-blue bg-blue-bg px-3 py-1.5 text-xs font-semibold text-blue hover:border-blue/60">+ Lab</button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-serif text-lg text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-2xl text-ink">{patient.name}</h1>
          <p className="font-mono text-xs text-ink-3">{consult.doctorId} · {formatFullDate(consult.time)}</p>
        </div>
      </div>

      {/* Consultation Data */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-5">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Symptoms</label>
              <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={2} className={cn(fieldClass, "resize-none")} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Diagnosis</label>
              <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Notes / Plan</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={cn(fieldClass, "resize-none")} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setEditing(false); setSymptoms(consult.symptoms || ""); setDiagnosis(consult.diagnosis || ""); setNotes(consult.notes || ""); }} className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2">Cancel</button>
              <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover">Save Changes</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 block mb-0.5">Symptoms</span>
              <p className="text-sm text-ink">{consult.symptoms || "—"}</p>
            </div>
            <div>
              <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 block mb-0.5">Diagnosis</span>
              <p className="text-sm font-semibold text-ink">{consult.diagnosis || "—"}</p>
            </div>
            {consult.notes && (
              <div>
                <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-4 block mb-0.5">Notes / Plan</span>
                <p className="text-xs bg-bg-2 p-2.5 rounded border border-border-2 text-ink-2">{consult.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Prescriptions */}
      {meds.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">Prescriptions ({meds.length})</div>
          <div className="space-y-2">
            {meds.map(m => (
              <div key={m.id} className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-ink">{m.medication} <span className="font-normal text-ink-3 ml-1">{m.dosage}</span></div>
                  <div className="text-xs text-ink-2">{m.instructions}</div>
                </div>
                <span className={cn("text-[0.65rem] px-2 py-0.5 rounded-full font-mono uppercase", m.status === "dispensed" ? "bg-status-normal-bg text-status-normal" : "bg-status-crisis-bg text-status-crisis")}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Labs */}
      {labs.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">Lab Investigations ({labs.length})</div>
          <div className="space-y-2">
            {labs.map(l => (
              <div key={l.id} className="rounded-lg border border-border bg-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-ink">{l.testName}</div>
                  {l.result && (
                    <button 
                      onClick={() => setViewingResult(l)} 
                      className="mt-1.5 flex cursor-pointer items-center gap-1 rounded bg-blue-bg/60 border border-blue/10 px-2 py-1 text-left transition-colors hover:bg-blue-bg"
                    >
                      <span className="font-mono text-[0.55rem] font-bold uppercase tracking-wider text-blue/80">Click to View Result</span>
                    </button>
                  )}
                </div>
                <span className={cn("text-[0.65rem] px-2 py-0.5 rounded-full font-mono uppercase", l.status === "completed" ? "bg-status-normal-bg text-status-normal" : "bg-status-elevated-bg text-status-elevated")}>{l.status}</span>
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
