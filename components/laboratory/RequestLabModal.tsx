"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { useCreateLab } from "@/hooks/mutations/useCreateLab";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { ALL_COMMON_TESTS, LAB_CATEGORIES } from "./labCatalog";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

export default function RequestLabModal({ open, onClose, patientId, patientName }: Props) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [testSearch, setTestSearch] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");

  const { data: patients = [] } = usePatients();
  const createLabMut = useCreateLab();
  const { showToast } = useToast();

  const isSelectablePatient = !patientId;
  const fieldClass = "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2 text-sm font-medium text-ink outline-none transition-all focus:border-accent";
  const labelClass = "mb-1 block text-xs font-bold text-ink-2 tracking-wide";

  const toggleTest = (test: string) => {
    setSelectedTests((prev) => (prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]));
  };

  const addCustom = () => {
    if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
      setSelectedTests((prev) => [...prev, customTest.trim()]);
      setCustomTest("");
    }
  };

  const handleSave = async () => {
    const targetPtId = patientId || selectedPatientId;
    if (isSelectablePatient && !targetPtId) return showToast("Please select a patient", "⚠");
    if (selectedTests.length === 0) return showToast("Please select at least one test", "⚠");
    if (!requestedBy.trim()) return showToast("Please enter requesting doctor", "⚠");

    try {
      await Promise.all(
        selectedTests.map((testName) =>
          createLabMut.mutateAsync({
            patientId: targetPtId,
            data: { requestedBy: requestedBy.trim(), testName, notes: notes.trim() || undefined },
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

  const list = activeCategory === "All"
    ? ALL_COMMON_TESTS
    : (LAB_CATEGORIES.find((c) => c.name === activeCategory)?.tests || []);
  const displayedTests = list.filter((t) => t.toLowerCase().includes(testSearch.toLowerCase()));

  return (
    <Modal open={open} onClose={onClose} title={isSelectablePatient ? "Request Labs" : `Request Labs — ${patientName}`} maxWidth="max-w-2xl">
      {isSelectablePatient && (
        <div className="mb-4">
          <label className={labelClass}>Select Patient *</label>
          <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className={fieldClass}>
            <option value="">Select a patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name} {p.opdNumber ? `(${p.opdNumber})` : ""}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <label className={labelClass}>Select Tests * <span className="text-accent font-bold">({selectedTests.length} selected)</span></label>
          <div className="flex gap-1 overflow-x-auto">
            {["All", ...LAB_CATEGORIES.map((c) => c.name)].map((cat) => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={cn("cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold whitespace-nowrap", activeCategory === cat ? "bg-accent text-white" : "bg-bg-2 text-ink-3 hover:text-ink")}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <input type="text" value={testSearch} onChange={(e) => setTestSearch(e.target.value)} placeholder="Filter tests…" className={cn(fieldClass, "mb-2 py-1.5 text-xs")} />
        <div className="flex max-h-[140px] flex-wrap gap-1.5 overflow-y-auto p-1">
          {displayedTests.map((t) => (
            <button key={t} type="button" onClick={() => toggleTest(t)} className={cn("cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors", selectedTests.includes(t) ? "border-accent bg-accent/15 font-bold text-accent" : "border-border text-ink-3 hover:bg-bg-2 hover:text-ink-2")}>
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
          <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
            {selectedTests.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {t.replace(/ *\(.*\) */g, "")}
                <button onClick={() => toggleTest(t)} className="cursor-pointer text-accent hover:opacity-75">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Requested By *</label>
          <input type="text" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="e.g. Dr. Smith" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Clinical Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for investigation…" className={fieldClass} />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={createLabMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={createLabMut.isPending} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover disabled:opacity-50">
          {createLabMut.isPending ? "Requesting…" : `Request ${selectedTests.length > 0 ? `${selectedTests.length} Test${selectedTests.length > 1 ? "s" : ""}` : "Investigation"}`}
        </button>
      </div>
    </Modal>
  );
}
