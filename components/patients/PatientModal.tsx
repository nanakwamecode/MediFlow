"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatientStore } from "@/store/patientStore";
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
  const [rdTime, setRdTime] = useState(nowLocalISO());
  const [rdNotes, setRdNotes] = useState("");

  const { addPatient, updatePatient, addVitals } = usePatientStore();
  const { showToast } = useToast();

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );

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

  const handleSave = () => {
    if (!name.trim()) {
      showToast("Please enter a patient name", "⚠");
      return;
    }
    if (isEdit && editPatient) {
      updatePatient(editPatient.id, { name: name.trim(), opdNumber: opdNumber.trim() || undefined, age, phone, town, gender, dob, notes });
      showToast("Patient updated", "✓");
    } else {
      const id = addPatient({ name: name.trim(), opdNumber: opdNumber.trim() || undefined, age, phone, town, gender, dob, notes });
      const sysN = parseInt(sys);
      const diaN = parseInt(dia);
      const pulseN = parseInt(pulse);
      const tempN = parseFloat(temp);
      const weightN = parseFloat(weight);
      
      if (!isNaN(sysN) || !isNaN(diaN) || !isNaN(pulseN) || !isNaN(tempN) || !isNaN(weightN)) {
        addVitals(id, {
          sys: isNaN(sysN) ? undefined : sysN, 
          dia: isNaN(diaN) ? undefined : diaN,
          pulse: isNaN(pulseN) ? undefined : pulseN,
          temperature: isNaN(tempN) ? undefined : tempN,
          weight: isNaN(weightN) ? undefined : weightN,
          time: rdTime ? new Date(rdTime).toISOString() : new Date().toISOString(),
          notes: rdNotes,
        });
      }
      showToast("Patient added", "✓");
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Patient" : "New Patient"} maxWidth="max-w-2xl">
      <div className="mb-1 border-b border-border pb-2 font-mono text-[0.58rem] tracking-[0.2em] text-ink-3 uppercase">
        Patient Information
      </div>
      <div className="mb-3 grid grid-cols-3 gap-3">
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Full Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kwame Mensah" className={fieldClass} /></div>
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">OPD Number</label><input type="text" value={opdNumber} onChange={(e) => setOpdNumber(e.target.value)} placeholder="e.g. OPD-0001" className={fieldClass} /></div>
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Age</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="54" className={fieldClass} /></div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Telephone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 20 000 0000" className={fieldClass} /></div>
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Town / City</label><input type="text" value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Accra" className={fieldClass} /></div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldClass}>
            <option value="">— Select —</option>
            <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
          </select>
        </div>
        <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Date of Birth</label><input type="date" value={dob} onChange={handleDobChange} className={fieldClass} /></div>
      </div>
      <div className="mb-1"><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Medical Notes</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Diabetic, on Amlodipine 5mg" className={fieldClass} /></div>

      {!isEdit && (
        <>
          <div className="mt-4 mb-3 border-b border-border pb-2 font-mono text-[0.58rem] tracking-[0.2em] text-ink-3 uppercase">
            Initial Vitals <span className="text-[0.56rem] normal-case tracking-normal opacity-55">(optional)</span>
          </div>
          <div className="mb-3 grid grid-cols-3 md:grid-cols-5 gap-3">
            <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">SYS</label><input type="number" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="120" className={fieldClass} /></div>
            <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">DIA</label><input type="number" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="80" className={fieldClass} /></div>
            <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Pulse</label><input type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="72" className={fieldClass} /></div>
            <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Temp (°C)</label><input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="36.5" className={fieldClass} /></div>
            <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Wt (kg)</label><input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className={fieldClass} /></div>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-3">
             <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Date & Time</label><input type="datetime-local" value={rdTime} onChange={(e) => setRdTime(e.target.value)} className={cn(fieldClass, "text-[0.7rem]")} /></div>
             <div><label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Vitals Notes</label><input type="text" value={rdNotes} onChange={(e) => setRdNotes(e.target.value)} placeholder="e.g. Triage" className={fieldClass} /></div>
          </div>
        </>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover">Save Patient</button>
      </div>
    </Modal>
  );
}
