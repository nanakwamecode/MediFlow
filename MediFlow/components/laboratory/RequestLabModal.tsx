"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatientStore } from "@/store/patientStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
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
  const [customTest, setCustomTest] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [notes, setNotes] = useState("");

  const addLabInvestigation = usePatientStore((s) => s.addLabInvestigation);
  const { showToast } = useToast();

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

  const handleSave = () => {
    if (selectedTests.length === 0) {
      showToast("Please select at least one test", "⚠");
      return;
    }
    if (!requestedBy.trim()) {
      showToast("Please enter requesting doctor", "⚠");
      return;
    }
    // Create one lab investigation per selected test
    selectedTests.forEach(testName => {
      addLabInvestigation(patientId, {
        timeRequested: new Date().toISOString(),
        requestedBy: requestedBy.trim(),
        testName,
        status: "pending",
        notes: notes.trim() || undefined,
      });
    });
    showToast(`${selectedTests.length} test${selectedTests.length > 1 ? "s" : ""} requested`, "✓");
    onClose();
    setSelectedTests([]); setRequestedBy(""); setNotes(""); setCustomTest("");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Request Labs — ${patientName}`} maxWidth="max-w-xl">
      <div className="mb-3">
        <label className={labelClass}>Select Tests * <span className="text-accent">({selectedTests.length} selected)</span></label>
        
        {/* Test Search */}
        <input
          type="text"
          value={testSearch}
          onChange={(e) => setTestSearch(e.target.value)}
          placeholder="🔍 Search tests…"
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
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover">Request {selectedTests.length > 0 ? `${selectedTests.length} Test${selectedTests.length > 1 ? "s" : ""}` : "Investigation"}</button>
      </div>
    </Modal>
  );
}
