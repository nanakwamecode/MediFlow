"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { useCreateVitals } from "@/hooks/mutations/useCreateVitals";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { nowLocalISO, classify } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

function generateVitalsNotes(values: {
  sys: string;
  dia: string;
  pulse: string;
  temperature: string;
  respiratoryRate: string;
  weight: string;
  height: string;
  bmi: string;
}): string {
  const parts: string[] = [];

  const sysN = parseInt(values.sys);
  const diaN = parseInt(values.dia);
  if (!isNaN(sysN) && !isNaN(diaN)) {
    const bp = classify(sysN, diaN);
    parts.push(`BP ${sysN}/${diaN} mmHg (${bp.label})`);
  }

  const pulseN = parseInt(values.pulse);
  if (!isNaN(pulseN)) {
    let pulseLabel = "normal";
    if (pulseN < 60) pulseLabel = "bradycardic";
    else if (pulseN > 100) pulseLabel = "tachycardic";
    parts.push(`Pulse ${pulseN} bpm (${pulseLabel})`);
  }

  const tempN = parseFloat(values.temperature);
  if (!isNaN(tempN)) {
    let tempLabel = "normal";
    if (tempN < 36.1) tempLabel = "hypothermic";
    else if (tempN >= 37.5 && tempN < 38.0) tempLabel = "low-grade fever";
    else if (tempN >= 38.0 && tempN < 39.0) tempLabel = "febrile";
    else if (tempN >= 39.0) tempLabel = "high fever";
    parts.push(`Temp ${tempN}°C (${tempLabel})`);
  }

  const rrN = parseInt(values.respiratoryRate);
  if (!isNaN(rrN)) {
    let rrLabel = "normal";
    if (rrN < 12) rrLabel = "bradypneic";
    else if (rrN > 20) rrLabel = "tachypneic";
    parts.push(`RR ${rrN}/min (${rrLabel})`);
  }

  const weightN = parseFloat(values.weight);
  const heightN = parseFloat(values.height);
  const bmiN = parseFloat(values.bmi);

  if (!isNaN(weightN)) parts.push(`Wt ${weightN} kg`);
  if (!isNaN(heightN)) parts.push(`Ht ${heightN} cm`);

  if (!isNaN(bmiN)) {
    let bmiLabel = "normal weight";
    if (bmiN < 18.5) bmiLabel = "underweight";
    else if (bmiN >= 25 && bmiN < 30) bmiLabel = "overweight";
    else if (bmiN >= 30) bmiLabel = "obese";
    parts.push(`BMI ${bmiN} (${bmiLabel})`);
  }

  return parts.join(". ") + (parts.length > 0 ? "." : "");
}

export default function LogVitalsModal({ open, onClose, patientId, patientName }: Props) {
  const { data: patients = [] } = usePatients();
  const createVitalsMut = useCreateVitals();
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [pulse, setPulse] = useState("");
  const [temperature, setTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [respiratoryRate, setRr] = useState("");
  const [time, setTime] = useState(nowLocalISO());
  const [notes, setNotes] = useState("");
  const [notesManuallyEdited, setNotesManuallyEdited] = useState(false);

  const bmi = weight && height ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1) : "";

  /* Auto-generate notes whenever vitals change (unless user manually edited) */
  const regenerateNotes = useCallback(() => {
    if (notesManuallyEdited) return;
    const generated = generateVitalsNotes({
      sys, dia, pulse, temperature, respiratoryRate, weight, height, bmi,
    });
    setNotes(generated);
  }, [sys, dia, pulse, temperature, respiratoryRate, weight, height, bmi, notesManuallyEdited]);

  useEffect(() => {
    regenerateNotes();
  }, [regenerateNotes]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.opdNumber && p.opdNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const selectedPatient = patients.find(p => p.id === (patientId || selectedPatientId));

  const { showToast } = useToast();

  const resetForm = () => {
    setSys(""); setDia(""); setPulse(""); setTemp("");
    setWeight(""); setHeight(""); setRr(""); setNotes("");
    setTime(nowLocalISO()); setSelectedPatientId(patientId || "");
    setNotesManuallyEdited(false);
  };

  const handleSave = async () => {
    const sysN = parseInt(sys);
    const diaN = parseInt(dia);
    const pulseN = parseInt(pulse);
    const tempN = parseFloat(temperature);
    const weightN = parseFloat(weight);
    const heightN = parseFloat(height);
    const bmiN = parseFloat(bmi);
    const rrN = parseInt(respiratoryRate);

    if (isNaN(sysN) && isNaN(diaN) && isNaN(pulseN) && isNaN(tempN) && isNaN(weightN) && isNaN(heightN) && isNaN(rrN)) {
      showToast("Please enter at least one vital sign", "⚠");
      return;
    }

    const targetPatientId = patientId || selectedPatientId;
    if (!targetPatientId) {
      showToast("Please select a patient", "⚠");
      return;
    }

    try {
      await createVitalsMut.mutateAsync({
        patientId: targetPatientId,
        data: {
          sys: isNaN(sysN) ? undefined : sysN,
          dia: isNaN(diaN) ? undefined : diaN,
          pulse: isNaN(pulseN) ? undefined : pulseN,
          temperature: isNaN(tempN) ? undefined : tempN,
          weight: isNaN(weightN) ? undefined : weightN,
          height: isNaN(heightN) ? undefined : heightN,
          bmi: isNaN(bmiN) ? undefined : bmiN,
          respiratoryRate: isNaN(rrN) ? undefined : rrN,
          time: time ? new Date(time).toISOString() : new Date().toISOString(),
          notes,
        },
      });

      showToast("Vitals logged", "✓");
      onClose();
      resetForm();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to log vitals", "⚠");
    }
  };

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1.5 block text-xs font-bold text-ink-2 tracking-wide";

  return (
    <Modal open={open} onClose={onClose} title={`Log Vitals ${patientName ? `- ${patientName}` : ""}`} maxWidth="max-w-xl">
      {!patientId && (
        <div className="mb-4 relative">
          <label className={labelClass}>Select Patient *</label>
          <div 
            className={cn(fieldClass, "flex justify-between items-center cursor-pointer bg-card")}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={selectedPatient ? "text-ink font-semibold" : "text-ink-4"}>
              {selectedPatient ? `${selectedPatient.name} ${selectedPatient.opdNumber ? `(${selectedPatient.opdNumber})` : ""}` : "-- Choose a Patient --"}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-1.5">
              <input 
                type="text" 
                placeholder="Search by name or OPD..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-bg px-3 py-2 text-sm text-ink outline-none mb-1.5 border border-border focus:border-accent"
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-center text-xs text-ink-3">No patients found</div>
                ) : (
                  filteredPatients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "w-full rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                        (patientId || selectedPatientId) === p.id 
                          ? "bg-accent/10 text-accent font-bold" 
                          : "text-ink hover:bg-bg-2"
                      )}
                    >
                      {p.name} {p.opdNumber ? <span className="text-ink-3 text-xs ml-1 font-mono">({p.opdNumber})</span> : ""}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div><label className={labelClass}>Systolic</label><input type="number" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="120" className={fieldClass} /></div>
        <div><label className={labelClass}>Diastolic</label><input type="number" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="80" className={fieldClass} /></div>
        <div><label className={labelClass}>Pulse</label><input type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="72" className={fieldClass} /></div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Temp (°C)</label><input type="number" step="0.1" value={temperature} onChange={(e) => setTemp(e.target.value)} placeholder="36.5" className={fieldClass} /></div>
        <div><label className={labelClass}>Resp Rate</label><input type="number" value={respiratoryRate} onChange={(e) => setRr(e.target.value)} placeholder="16" className={fieldClass} /></div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div><label className={labelClass}>Weight (kg)</label><input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className={fieldClass} /></div>
        <div><label className={labelClass}>Height (cm)</label><input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className={fieldClass} /></div>
        <div><label className={labelClass}>BMI</label><input type="text" value={bmi} readOnly placeholder="Auto" className={cn(fieldClass, "bg-bg-2 cursor-not-allowed font-bold text-ink-2")} /></div>
      </div>
      <div className="mb-2">
        <label className={labelClass}>Date & Time</label>
        <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
      </div>

      {/* Auto-generated Notes */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-bold text-ink-2 tracking-wide">
            Clinical Notes
          </label>
          {notesManuallyEdited && (
            <button
              type="button"
              onClick={() => {
                setNotesManuallyEdited(false);
                const generated = generateVitalsNotes({
                  sys, dia, pulse, temperature, respiratoryRate, weight, height, bmi,
                });
                setNotes(generated);
              }}
              className="cursor-pointer text-[10px] font-bold text-accent hover:underline"
            >
              ↻ Regenerate
            </button>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setNotesManuallyEdited(true);
          }}
          rows={3}
          placeholder="Notes will auto-generate from vitals entered above…"
          className={cn(
            fieldClass,
            "resize-none",
            !notesManuallyEdited && notes
              ? "border-status-normal/40 bg-status-normal-bg/30"
              : ""
          )}
        />
        {!notesManuallyEdited && notes && (
          <p className="mt-1 text-[10px] font-medium text-status-normal">
            ✦ Auto-generated — edit to customize
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={createVitalsMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={createVitalsMut.isPending} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">{createVitalsMut.isPending ? "Logging…" : "Log Vitals"}</button>
      </div>
    </Modal>
  );
}
