"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { useCreateLab } from "@/hooks/mutations/useCreateLab";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

const COMMON_TESTS = [
  "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Liver Function Tests (LFT)",
  "Lipid Panel", "Urinalysis", "Blood Glucose (Fasting)", "Random Blood Sugar (RBS)", "HbA1c",
  "Thyroid Function Tests (TFT)", "Renal Function Tests (RFT)", "Malaria Parasite Test",
  "Hepatitis B Surface Antigen", "Hepatitis B Profile Test", "Hepatitis C", "HIV Screening",
  "Widal Test", "Urine Culture & Sensitivity", "Chest X-Ray", "ECG", "Syphilis (VDRL/RPR)",
  "H. Pylori Test", "Pregnancy Test (hCG)", "Sickling Test", "Blood Group & Rh", "Hemoglobin (Hb)",
];

export default function RequestLabModal({ open, onClose, patientId, patientName }: Props) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [testSearch, setTestSearch] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");

  const { data: patients = [] } = usePatients();
  const createLabMut = useCreateLab();
  const { showToast } = useToast();

  const isSelectablePatient = !patientId;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block text-xs font-bold text-ink-2 tracking-wide";

  const toggleTest = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const addCustom = () => {
    if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
      setSelectedTests((prev) => [...prev, customTest.trim()]);
      setCustomTest("");
    }
  };

  const handleSave = async () => {
    const targetPtId = patientId || selectedPatientId;
    if (isSelectablePatient && !targetPtId) {
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
      await Promise.all(
        selectedTests.map((testName) =>
          createLabMut.mutateAsync({
            patientId: targetPtId,
            data: {
              requestedBy: requestedBy.trim(),
              testName,
              notes: notes.trim() || undefined,
            },
          })
        )
      );

      showToast(`${selectedTests.length} test${selectedTests.length > 1 ? "s" : ""} requested`, "✓");
      onClose();
      setSelectedTests([]); setRequestedBy(""); setNotes(""); setCustomTest("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to request labs", "⚠");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isSelectablePatient ? "Request Labs" : `Request Labs — ${patientName}`} maxWidth="max-w-xl">
      {isSelectablePatient && (
        <div className="mb-4">
          <label className={labelClass}>Select Patient *</label>
          <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className={fieldClass}>
            <option value="">Select a patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.opdNumber ? `(${p.opdNumber})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className={labelClass}>
          Select Tests * <span className="text-accent font-bold">({selectedTests.length} selected)</span>
        </label>
        <input
          type="text"
          value={testSearch}
          onChange={(e) => setTestSearch(e.target.value)}
          placeholder="Filter tests…"
          className={cn(fieldClass, "mb-2 py-1.5 text-xs")}
        />
        <div className="flex max-h-[140px] flex-wrap gap-1.5 overflow-y-auto p-1">
          {COMMON_TESTS.filter((t) => t.toLowerCase().includes(testSearch.toLowerCase())).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTest(t)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                selectedTests.includes(t)
                  ? "border-accent bg-accent/15 font-bold text-accent"
                  : "border-border text-ink-3 hover:bg-bg-2 hover:text-ink-2"
              )}
            >
              {selectedTests.includes(t) ? "✓ " : ""}{t.replace(/ *\(.*\) */g, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <input type="text" value={customTest} onChange={(e) => setCustomTest(e.target.value)} placeholder="Add custom test name…" className={cn(fieldClass, "flex-1")} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} />
        <button type="button" onClick={addCustom} className="cursor-pointer rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2">Add</button>
      </div>

      {selectedTests.length > 0 && (
        <div className="mb-3 rounded-xl border border-border bg-bg-2/70 p-3">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-3">Selected ({selectedTests.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {selectedTests.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {t.replace(/ *\(.*\) */g, "")}
                <button onClick={() => toggleTest(t)} className="cursor-pointer text-accent hover:opacity-75">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className={labelClass}>Requested By *</label>
        <input type="text" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="e.g. Dr. Smith" className={fieldClass} />
      </div>
      <div className="mb-3">
        <label className={labelClass}>Clinical Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for investigation…" rows={2} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={createLabMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={createLabMut.isPending} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
          {createLabMut.isPending ? "Requesting…" : `Request ${selectedTests.length > 0 ? `${selectedTests.length} Test${selectedTests.length > 1 ? "s" : ""}` : "Investigation"}`}
        </button>
      </div>
    </Modal>
  );
}
