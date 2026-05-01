"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatientStore } from "@/store/patientStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

interface MedEntry {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
}

const createEmptyMed = (): MedEntry => ({ id: Math.random().toString(36).substring(2, 11), medication: "", dosage: "", instructions: "" });

export default function AddPrescriptionModal({ open, onClose, patientId, patientName }: Props) {
  const [meds, setMeds] = useState<MedEntry[]>([createEmptyMed()]);
  const [prescribedBy, setPrescribedBy] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");

  const addPrescription = usePatientStore((s) => s.addPrescription);
  const patients = usePatientStore((s) => s.patients);
  const { showToast } = useToast();

  const isSelectablePatient = !patientId;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase";

  const updateMed = (id: string, field: keyof MedEntry, value: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addRow = () => setMeds(prev => [createEmptyMed(), ...prev]);

  const removeRow = (id: string) => {
    if (meds.length <= 1) return;
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (isSelectablePatient && !selectedPatientId) {
      showToast("Please select a patient", "⚠");
      return;
    }
    const validMeds = meds.filter(m => m.medication.trim());
    if (validMeds.length === 0) {
      showToast("Enter at least one medication", "⚠");
      return;
    }
    for (const m of validMeds) {
      if (!m.dosage.trim()) {
        showToast(`Enter dosage for ${m.medication}`, "⚠");
        return;
      }
    }
    if (!prescribedBy.trim()) {
      showToast("Enter prescribing doctor", "⚠");
      return;
    }

    validMeds.forEach(m => {
      addPrescription(selectedPatientId, {
        timePrescribed: new Date().toISOString(),
        prescribedBy: prescribedBy.trim(),
        medication: m.medication.trim(),
        dosage: m.dosage.trim(),
        instructions: m.instructions.trim(),
        status: "pending",
      });
    });

    showToast(`${validMeds.length} medication${validMeds.length > 1 ? "s" : ""} prescribed`, "✓");
    onClose();
    setMeds([createEmptyMed()]);
    setPrescribedBy("");
  };

  return (
    <Modal open={open} onClose={onClose} title={isSelectablePatient ? "Prescribe Medication" : `Prescribe — ${patientName}`} maxWidth="max-w-2xl">
      {isSelectablePatient && (
        <div className="mb-4">
          <label className={labelClass}>Select Patient *</label>
          <select 
            value={selectedPatientId} 
            onChange={(e) => setSelectedPatientId(e.target.value)} 
            className={fieldClass}
          >
            <option value="">Select a patient...</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label className={labelClass}>Prescribed By *</label>
        <input type="text" value={prescribedBy} onChange={(e) => setPrescribedBy(e.target.value)} placeholder="e.g. Dr. Smith" className={fieldClass} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className={labelClass}>Medications ({meds.length})</span>
        <button type="button" onClick={addRow} className="cursor-pointer rounded-lg border border-border bg-card px-2.5 py-1 text-[0.6rem] font-semibold text-accent transition-colors hover:bg-bg-2">
          + Add Medication
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
        {meds.map((m, idx) => (
          <div key={m.id} className="rounded-lg border border-border bg-bg-2/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[0.5rem] text-ink-4 uppercase tracking-wider">Med #{meds.length - idx}</span>
              {meds.length > 1 && (
                <button type="button" onClick={() => removeRow(m.id)} className="cursor-pointer text-[0.6rem] text-status-high hover:underline">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={labelClass}>Medication *</label>
                <input type="text" value={m.medication} onChange={(e) => updateMed(m.id, "medication", e.target.value)} placeholder="e.g. Paracetamol" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Dosage *</label>
                <input type="text" value={m.dosage} onChange={(e) => updateMed(m.id, "dosage", e.target.value)} placeholder="e.g. 500mg TDS" className={fieldClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Instructions</label>
              <input type="text" value={m.instructions} onChange={(e) => updateMed(m.id, "instructions", e.target.value)} placeholder="e.g. Twice daily after meals for 5 days" className={fieldClass} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover">
          Prescribe {meds.filter(m => m.medication.trim()).length > 0 ? `${meds.filter(m => m.medication.trim()).length} Med${meds.filter(m => m.medication.trim()).length > 1 ? "s" : ""}` : ""}
        </button>
      </div>
    </Modal>
  );
}
