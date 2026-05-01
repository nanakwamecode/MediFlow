"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { useCreateLab } from "@/hooks/mutations/usePatientMutations";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

const COMMON_TESTS = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Liver Function Tests (LFT)",
  "Lipid Panel",
  "Urinalysis",
  "Blood Glucose (Fasting)",
  "Random Blood Sugar (RBS)",
  "HbA1c",
  "Thyroid Function Tests (TFT)",
  "Renal Function Tests (RFT)",
  "Malaria Parasite Test",
  "Hepatitis B Surface Antigen",
  "Hepatitis B Profile Test",
  "Hepatitis C",
  "HIV Screening",
  "Widal Test",
  "Urine Culture & Sensitivity",
  "Chest X-Ray",
  "ECG",
  "Syphilis (VDRL/RPR)",
  "Gonorrhea",
  "H. Pylori Test",
  "Pregnancy Test (hCG)",
  "Sickling Test",
  "Blood Group & Rh",
  "Hemoglobin (Hb)",
];

export default function RequestLabModal({ open, onClose, patientId, patientName }: Props) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [testSearch, setTestSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");

  const { data: patients = [] } = usePatients();
  const { mutateAsync: addLabInvestigation, isPending } = useCreateLab();
  const { showToast } = useToast();

  const isSelectablePatient = !patientId;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase";

  const toggleTest = (test: string) => {
    setSelectedTests(prev =>
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const addCustom = () => {
    if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
      setSelectedTests(prev => [...prev, customTest.trim()]);
      setCustomTest("");
    }
  };

  const handleSave = async () => {
    if (isSelectablePatient && !selectedPatientId) {
      showToast("Please select a patient", "⚠");
      return;
    }
    if (selectedTests.length === 0) {
      showToast("Please select at least one test", "⚠");
      return;
    }
    if (!requestedBy.trim()) {
      showToast("Please enter requesting doctor", "⚠");
      return;
    }
    
    try {
      // Create one lab investigation per selected test using Promise.all
      await Promise.all(selectedTests.map(testName => 
        addLabInvestigation({
          patientId: selectedPatientId,
          data: {
            timeRequested: new Date().toISOString(),
            requestedBy: requestedBy.trim(),
            testName,
            status: "pending",
            notes: notes.trim() || undefined,
          }
        })
      ));

      showToast(`${selectedTests.length} test${selectedTests.length > 1 ? "s" : ""} requested`, "✓");
      onClose();
      setSelectedTests([]); setRequestedBy(""); setNotes(""); setCustomTest("");
    } catch (e) {
      showToast("An error occurred", "⚠");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isSelectablePatient ? "Request Labs" : `Request Labs — ${patientName}`} maxWidth="max-w-xl">
      {isSelectablePatient && (
        <div className="mb-4">
          {!selectedPatientId ? (
            <>
              <div className="mb-2.5 flex items-center justify-between">
                <label className="font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Select Patient *</label>
              </div>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                  type="text" 
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patient name..."
                  className="w-full rounded-lg border-[1.5px] border-border bg-bg py-2.5 pl-9 pr-3 font-mono text-sm text-ink outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
                />
              </div>
              <div className="max-h-[160px] overflow-y-auto space-y-1 rounded-xl border border-border-2 bg-card p-1 shadow-inner">
                {patients.filter(p => !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase())).slice(0, 5).length === 0 ? (
                  <div className="p-3 text-center text-xs text-ink-3">No patients found</div>
                ) : patients.filter(p => !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase())).slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-bg-2"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-serif text-[0.75rem] text-accent border border-accent/10">
                      {getInitials(p.name)}
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-[0.85rem] font-semibold text-ink group-hover:text-accent">{p.name}</div>
                      <div className="font-mono text-[0.62rem] text-ink-3 mt-0.5">
                        {[p.age ? `Age ${p.age}` : null, p.gender].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (() => {
            const pt = patients.find(p => p.id === selectedPatientId);
            if (!pt) return null;
            return (
              <div className="rounded-xl border border-border bg-card p-3 shadow-md flex items-center justify-between ring-1 ring-accent/5">
                 <div className="flex items-center gap-3.5">
                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-hover font-serif text-[0.8rem] text-white shadow-sm ring-2 ring-accent/20">
                     {getInitials(pt.name)}
                   </div>
                   <div className="leading-tight">
                     <div className="font-mono text-[0.55rem] tracking-[0.2em] text-accent-hover uppercase mb-1 flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                       Selected Patient
                     </div>
                     <div className="text-sm font-bold text-ink">{pt.name}</div>
                   </div>
                 </div>
                 <button type="button" onClick={() => setSelectedPatientId("")} className="cursor-pointer rounded-lg bg-stone-100 px-3.5 py-2 text-xs font-semibold text-ink-2 transition-all hover:bg-stone-200 hover:text-ink">
                   Change
                 </button>
              </div>
            );
          })()}
        </div>
      )}
      <div className="mb-3">
        <label className={labelClass}>Select Tests * <span className="text-accent">({selectedTests.length} selected)</span></label>
        
        {/* Test Search */}
        <input
          type="text"
          value={testSearch}
          onChange={(e) => setTestSearch(e.target.value)}
          placeholder="Search tests…"
          className={cn(fieldClass, "mb-2 py-1.5 text-xs")}
        />

        <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto p-1">
          {COMMON_TESTS.filter(t => t.toLowerCase().includes(testSearch.toLowerCase())).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTest(t)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[0.6rem] font-mono transition-colors cursor-pointer",
                selectedTests.includes(t)
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-border text-ink-3 hover:bg-bg-2 hover:text-ink-2"
              )}
            >
              {selectedTests.includes(t) ? "✓ " : ""}{t.replace(/ *\(.*\) */g, "")}
            </button>
          ))}
          {testSearch && COMMON_TESTS.filter(t => t.toLowerCase().includes(testSearch.toLowerCase())).length === 0 && (
            <div className="text-xs text-ink-3 p-1">No matches in common tests</div>
          )}
        </div>
      </div>

      {/* Custom test */}
      <div className="mb-4 flex gap-2">
        <input type="text" value={customTest} onChange={(e) => setCustomTest(e.target.value)} placeholder="Add custom test…" className={cn(fieldClass, "flex-1")} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} />
        <button type="button" onClick={addCustom} className="cursor-pointer rounded-lg border border-border px-3 py-2 text-xs font-semibold text-ink-2 hover:bg-bg-2">Add</button>
      </div>

      {/* Selected preview */}
      {selectedTests.length > 0 && (
        <div className="mb-4 p-2.5 rounded-lg bg-bg-2 border border-border-2">
          <div className="font-mono text-[0.5rem] text-ink-4 uppercase tracking-wider mb-1">Selected ({selectedTests.length})</div>
          <div className="flex flex-wrap gap-1">
            {selectedTests.map(t => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 text-[0.6rem] font-mono">
                {t.replace(/ *\(.*\) */g, "")}
                <button onClick={() => toggleTest(t)} className="text-accent/60 hover:text-accent cursor-pointer">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className={labelClass}>Requested By *</label>
        <input type="text" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="e.g. Dr. Smith" className={fieldClass} />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Clinical Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for investigation…" rows={2} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} disabled={isPending} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={isPending} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
          {isPending ? "Requesting..." : `Request ${selectedTests.length > 0 ? `${selectedTests.length} Test${selectedTests.length > 1 ? "s" : ""}` : "Investigation"}`}
        </button>
      </div>
    </Modal>
  );
}
