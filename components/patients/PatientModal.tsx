"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useCreatePatient } from "@/hooks/mutations/useCreatePatient";
import { useUpdatePatient } from "@/hooks/mutations/useUpdatePatient";
import { useCreateVitals } from "@/hooks/mutations/useCreateVitals";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { nowLocalISO } from "@/lib/constants";
import type { Patient } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  editPatient?: Patient | null;
}

export default function PatientModal({ open, onClose, editPatient }: Props) {
  const isEdit = !!editPatient;
  const [name, setName] = useState(editPatient?.name ?? "");
  const [age, setAge] = useState(editPatient?.age ?? "");
  const [opdNumber, setOpdNumber] = useState(editPatient?.opdNumber ?? "");
  const [phone, setPhone] = useState(editPatient?.phone ?? "");
  const [town, setTown] = useState(editPatient?.town ?? "");
  const [gender, setGender] = useState(editPatient?.gender ?? "");
  const [dob, setDob] = useState(editPatient?.dob ?? "");
  const [notes, setNotes] = useState(editPatient?.notes ?? "");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [pulse, setPulse] = useState("");
  const [temp, setTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [rdTime, setRdTime] = useState(nowLocalISO());
  const [rdNotes, setRdNotes] = useState("");

  const bmi = weight && height ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1) : "";

  const createPatientMut = useCreatePatient();
  const updatePatientMut = useUpdatePatient();
  const createVitalsMut = useCreateVitals();
  const { showToast } = useToast();
  const isSaving = createPatientMut.isPending || updatePatientMut.isPending;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1.5 block text-xs font-bold text-ink-2 tracking-wide";

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthDate = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0) {
        setAge(calculatedAge.toString());
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Please enter a patient name", "⚠");
      return;
    }
    try {
      if (isEdit && editPatient) {
        await updatePatientMut.mutateAsync({ id: editPatient.id, data: { name: name.trim(), opdNumber: opdNumber.trim() || undefined, age, phone, town, gender, dob, notes } });
        showToast("Patient updated", "✓");
      } else {
        const created = await createPatientMut.mutateAsync({ name: name.trim(), opdNumber: opdNumber.trim() || undefined, age, phone, town, gender, dob, notes });
        const sysN = parseInt(sys);
        const diaN = parseInt(dia);
        const pulseN = parseInt(pulse);
        const tempN = parseFloat(temp);
        const weightN = parseFloat(weight);
        const heightN = parseFloat(height);
        const bmiN = parseFloat(bmi);

        if (!isNaN(sysN) || !isNaN(diaN) || !isNaN(pulseN) || !isNaN(tempN) || !isNaN(weightN) || !isNaN(heightN)) {
          await createVitalsMut.mutateAsync({
            patientId: created.id,
            data: {
              sys: isNaN(sysN) ? undefined : sysN,
              dia: isNaN(diaN) ? undefined : diaN,
              pulse: isNaN(pulseN) ? undefined : pulseN,
              temperature: isNaN(tempN) ? undefined : tempN,
              weight: isNaN(weightN) ? undefined : weightN,
              height: isNaN(heightN) ? undefined : heightN,
              bmi: isNaN(bmiN) ? undefined : bmiN,
              time: rdTime ? new Date(rdTime).toISOString() : new Date().toISOString(),
              notes: rdNotes,
            },
          });
        }
        showToast("Patient added", "✓");
      }
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "⚠");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Patient" : "New Patient"} maxWidth="max-w-2xl">
      <div className="mb-2 border-b border-border pb-2 text-xs font-bold uppercase tracking-wider text-ink-3">
        Patient Information
      </div>
      <div className="mb-3.5 grid grid-cols-3 gap-3">
        <div><label className={labelClass}>Full Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kwame Mensah" className={fieldClass} /></div>
        <div><label className={labelClass}>OPD Number</label><input type="text" value={opdNumber} onChange={(e) => setOpdNumber(e.target.value)} placeholder="e.g. OPD-0001" className={fieldClass} /></div>
        <div><label className={labelClass}>Age</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="54" className={fieldClass} /></div>
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Telephone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 20 000 0000" className={fieldClass} /></div>
        <div><label className={labelClass}>Town / City</label><input type="text" value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Accra" className={fieldClass} /></div>
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldClass}>
            <option value="">— Select —</option>
            <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
          </select>
        </div>
        <div><label className={labelClass}>Date of Birth</label><input type="date" value={dob} onChange={handleDobChange} className={fieldClass} /></div>
      </div>
      <div className="mb-2"><label className={labelClass}>Medical Notes</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Diabetic, on Amlodipine 5mg" className={fieldClass} /></div>

      {!isEdit && (
        <>
          <div className="mt-5 mb-3 border-b border-border pb-2 text-xs font-bold uppercase tracking-wider text-ink-3">
            Initial Vitals <span className="font-normal normal-case opacity-75">(optional)</span>
          </div>
          <div className="mb-3.5 grid grid-cols-3 md:grid-cols-6 gap-3">
            <div><label className={labelClass}>SYS</label><input type="number" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="120" className={fieldClass} /></div>
            <div><label className={labelClass}>DIA</label><input type="number" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="80" className={fieldClass} /></div>
            <div><label className={labelClass}>Pulse</label><input type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="72" className={fieldClass} /></div>
            <div><label className={labelClass}>Temp (°C)</label><input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="36.5" className={fieldClass} /></div>
            <div><label className={labelClass}>Wt (kg)</label><input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className={fieldClass} /></div>
            <div><label className={labelClass}>Ht (cm)</label><input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className={fieldClass} /></div>
          </div>
          <div className="mb-3.5 grid grid-cols-2 gap-3">
             <div><label className={labelClass}>Date & Time</label><input type="datetime-local" value={rdTime} onChange={(e) => setRdTime(e.target.value)} className={fieldClass} /></div>
             <div><label className={labelClass}>Vitals Notes</label><input type="text" value={rdNotes} onChange={(e) => setRdNotes(e.target.value)} placeholder="e.g. Triage" className={fieldClass} /></div>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={isSaving} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={isSaving} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">{isSaving ? "Saving…" : "Save Patient"}</button>
      </div>
    </Modal>
  );
}
