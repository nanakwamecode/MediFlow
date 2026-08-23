"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { useCreatePrescription } from "@/hooks/mutations/useCreatePrescription";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import MedEntryRow, { type MedEntry } from "./MedEntryRow";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

const createEmptyMed = (): MedEntry => ({
  id: Math.random().toString(36).substring(2, 11),
  medication: "",
  dosage: "",
  instructions: "",
});

export default function AddPrescriptionModal({
  open,
  onClose,
  patientId,
  patientName,
}: Props) {
  const [meds, setMeds] = useState<MedEntry[]>([createEmptyMed()]);
  const [prescribedBy, setPrescribedBy] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");

  const { data: patients = [] } = usePatients();
  const createPrescriptionMut = useCreatePrescription();
  const { showToast } = useToast();

  const isSelectablePatient = !patientId;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block text-xs font-bold text-ink-2 tracking-wide";

  const updateMed = (id: string, field: keyof MedEntry, value: string) => {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const addRow = () => setMeds((prev) => [...prev, createEmptyMed()]);

  const removeRow = (id: string) => {
    if (meds.length <= 1) return;
    setMeds((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    const targetPtId = patientId || selectedPatientId;
    if (isSelectablePatient && !targetPtId) {
      showToast("Please select a patient", "⚠");
      return;
    }
    const validMeds = meds.filter((m) => m.medication.trim());
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

    try {
      await Promise.all(
        validMeds.map((m) =>
          createPrescriptionMut.mutateAsync({
            patientId: targetPtId,
            data: {
              prescribedBy: prescribedBy.trim(),
              medication: m.medication.trim(),
              dosage: m.dosage.trim(),
              instructions: m.instructions.trim(),
            },
          })
        )
      );

      showToast(`${validMeds.length} medication${validMeds.length > 1 ? "s" : ""} prescribed`, "✓");
      onClose();
      setMeds([createEmptyMed()]);
      setPrescribedBy("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to prescribe", "⚠");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isSelectablePatient ? "Prescribe Medication" : `Prescribe — ${patientName}`}
      maxWidth="max-w-2xl"
    >
      {isSelectablePatient && (
        <div className="mb-4">
          <label className={labelClass}>Select Patient *</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className={fieldClass}
          >
            <option value="">Select a patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.opdNumber ? `(${p.opdNumber})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label className={labelClass}>Prescribed By *</label>
        <input
          type="text"
          value={prescribedBy}
          onChange={(e) => setPrescribedBy(e.target.value)}
          placeholder="e.g. Dr. Smith"
          className={fieldClass}
        />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">Medications ({meds.length})</span>
        <button
          type="button"
          onClick={addRow}
          className="cursor-pointer rounded-lg border border-border bg-card px-3 py-1 text-xs font-bold text-accent transition-colors hover:bg-bg-2"
        >
          + Add Medication
        </button>
      </div>

      <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
        {meds.map((m, idx) => (
          <MedEntryRow
            key={m.id}
            entry={m}
            index={idx}
            total={meds.length}
            onUpdate={updateMed}
            onRemove={removeRow}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          disabled={createPrescriptionMut.isPending}
          className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={createPrescriptionMut.isPending}
          className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {createPrescriptionMut.isPending
            ? "Prescribing…"
            : `Prescribe ${
                meds.filter((m) => m.medication.trim()).length > 0
                  ? `${meds.filter((m) => m.medication.trim()).length} Med${
                      meds.filter((m) => m.medication.trim()).length > 1 ? "s" : ""
                    }`
                  : ""
              }`}
        </button>
      </div>
    </Modal>
  );
}
