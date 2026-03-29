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

export default function LogVitalsModal({ open, onClose, patientId, patientName }: Props) {
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [pulse, setPulse] = useState("");
  const [temperature, setTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [respiratoryRate, setRr] = useState("");
  const [time, setTime] = useState(nowLocalISO());
  const [notes, setNotes] = useState("");

  const addVitals = usePatientStore((s) => s.addVitals);
  const { showToast } = useToast();

  const handleSave = () => {
    const sysN = parseInt(sys);
    const diaN = parseInt(dia);
    const pulseN = parseInt(pulse);
    const tempN = parseFloat(temperature);
    const weightN = parseFloat(weight);
    const rrN = parseInt(respiratoryRate);

    if (isNaN(sysN) && isNaN(diaN) && isNaN(pulseN) && isNaN(tempN) && isNaN(weightN) && isNaN(rrN)) {
      showToast("Please enter at least one vital sign", "⚠");
      return;
    }

    addVitals(patientId, {
      sys: isNaN(sysN) ? undefined : sysN,
      dia: isNaN(diaN) ? undefined : diaN,
      pulse: isNaN(pulseN) ? undefined : pulseN,
      temperature: isNaN(tempN) ? undefined : tempN,
      weight: isNaN(weightN) ? undefined : weightN,
      respiratoryRate: isNaN(rrN) ? undefined : rrN,
      time: time ? new Date(time).toISOString() : new Date().toISOString(),
      notes,
    });

    showToast("Vitals logged", "✓");
    onClose();
    // Reset
    setSys(""); setDia(""); setPulse(""); setTemp(""); setWeight(""); setRr(""); setNotes(""); setTime(nowLocalISO());
  };

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase";

  return (
    <Modal open={open} onClose={onClose} title={`Log Vitals - ${patientName}`} maxWidth="max-w-xl">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div><label className={labelClass}>Systolic</label><input type="number" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="120" className={fieldClass} /></div>
        <div><label className={labelClass}>Diastolic</label><input type="number" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="80" className={fieldClass} /></div>
        <div><label className={labelClass}>Pulse</label><input type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="72" className={fieldClass} /></div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div><label className={labelClass}>Temp (°C)</label><input type="number" step="0.1" value={temperature} onChange={(e) => setTemp(e.target.value)} placeholder="36.5" className={fieldClass} /></div>
        <div><label className={labelClass}>Weight (kg)</label><input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className={fieldClass} /></div>
        <div><label className={labelClass}>Resp Rate</label><input type="number" value={respiratoryRate} onChange={(e) => setRr(e.target.value)} placeholder="16" className={fieldClass} /></div>
      </div>
      <div className="mb-4 grid grid-cols-[1fr_2fr] gap-3">
        <div><label className={labelClass}>Date & Time</label><input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} /></div>
        <div><label className={labelClass}>Notes</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Post-triage" className={fieldClass} /></div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover">Log Vitals</button>
      </div>
    </Modal>
  );
}
