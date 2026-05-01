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
  patientId?: string;
  patientName?: string;
}

export default function LogVitalsModal({ open, onClose, patientId, patientName }: Props) {
  const { patients, addVitals } = usePatientStore();
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

  const bmi = weight && height ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1) : "";

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.opdNumber && p.opdNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const { showToast } = useToast();

  const handleSave = () => {
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

    addVitals(targetPatientId, {
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
    });

    showToast("Vitals logged", "✓");
    onClose();
    // Reset
    setSys(""); setDia(""); setPulse(""); setTemp(""); setWeight(""); setHeight(""); setRr(""); setNotes(""); setTime(nowLocalISO()); setSelectedPatientId(patientId || "");
  };

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase";

  return (
    <Modal open={open} onClose={onClose} title={`Log Vitals ${patientName ? `- ${patientName}` : ""}`} maxWidth="max-w-xl">
      {!patientId && (
        <div className="mb-4 relative">
          <label className={labelClass}>Select Patient</label>
          <div 
            className={cn(fieldClass, "flex justify-between items-center cursor-pointer bg-card")}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={selectedPatient ? "text-ink" : "text-ink-4"}>
              {selectedPatient ? `${selectedPatient.name} ${selectedPatient.opdNumber ? `(${selectedPatient.opdNumber})` : ""}` : "-- Choose a Patient --"}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-1">
              <input 
                type="text" 
                placeholder="Search by name or OPD..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-bg px-3 py-2 text-sm text-ink outline-none mb-1 border border-border focus:border-accent"
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredPatients.length === 0 ? (
                  <div className="p-2 text-center text-xs text-ink-4">No patients found</div>
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
                        selectedPatientId === p.id 
                          ? "bg-accent/10 text-accent font-semibold" 
                          : "text-ink hover:bg-bg-2"
                      )}
                    >
                      {p.name} {p.opdNumber ? <span className="text-ink-4 text-[0.7rem] ml-1">({p.opdNumber})</span> : ""}
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
        <div><label className={labelClass}>BMI</label><input type="text" value={bmi} readOnly placeholder="Auto" className={cn(fieldClass, "bg-bg-2 cursor-not-allowed")} /></div>
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
