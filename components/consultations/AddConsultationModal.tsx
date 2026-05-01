"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatientStore } from "@/store/patientStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { nowLocalISO } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

export default function AddConsultationModal({ open, onClose, patientId, patientName }: Props) {
  const [doctorId, setDoctorId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState(nowLocalISO());

  const addConsultation = usePatientStore((s) => s.addConsultation);
  const { showToast } = useToast();

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase";

  const handleSave = () => {
    if (!doctorId.trim()) {
      showToast("Please enter doctor name", "⚠");
      return;
    }
    addConsultation(patientId, {
      time: time ? new Date(time).toISOString() : new Date().toISOString(),
      doctorId: doctorId.trim(),
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      notes: notes.trim(),
    });
    showToast("Consultation saved", "✓");
    onClose();
    setDoctorId(""); setSymptoms(""); setDiagnosis(""); setNotes(""); setTime(nowLocalISO());
  };

  return (
    <Modal open={open} onClose={onClose} title={`New Consultation — ${patientName}`} maxWidth="max-w-xl">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Doctor *</label><input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="e.g. Dr. Smith" className={fieldClass} /></div>
        <div><label className={labelClass}>Date & Time</label><input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} /></div>
      </div>
      <div className="mb-4">
        <label className={labelClass}>Presenting Symptoms</label>
        <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe symptoms…" rows={2} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Diagnosis</label>
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Tension headache" className={fieldClass} />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Notes / Plan</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Treatment plan, follow-up instructions…" rows={3} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover">Save Consultation</button>
      </div>
    </Modal>
  );
}
