"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useCreateConsultation } from "@/hooks/mutations/useCreateConsultation";
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

  const createConsultationMut = useCreateConsultation();
  const { showToast } = useToast();

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1.5 block text-xs font-bold text-ink-2 tracking-wide";

  const handleSave = async () => {
    if (!doctorId.trim()) {
      showToast("Please enter doctor name", "⚠");
      return;
    }
    try {
      await createConsultationMut.mutateAsync({
        patientId,
        data: {
          time: time ? new Date(time).toISOString() : new Date().toISOString(),
          doctorId: doctorId.trim(),
          symptoms: symptoms.trim(),
          diagnosis: diagnosis.trim(),
          notes: notes.trim(),
        },
      });
      showToast("Consultation saved", "✓");
      onClose();
      setDoctorId(""); setSymptoms(""); setDiagnosis(""); setNotes(""); setTime(nowLocalISO());
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save consultation", "⚠");
    }
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
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Hypertension review" className={fieldClass} />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Notes / Plan</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Treatment plan, follow-up instructions…" rows={3} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={createConsultationMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={createConsultationMut.isPending} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">{createConsultationMut.isPending ? "Saving…" : "Save Consultation"}</button>
      </div>
    </Modal>
  );
}
