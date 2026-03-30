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
  labId: number;
  testName: string;
}

export default function EnterLabResultModal({ open, onClose, patientId, labId, testName }: Props) {
  const [result, setResult] = useState("");
  const updateLabResult = usePatientStore((s) => s.updateLabResult);
  const { showToast } = useToast();

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );

  const handleSave = () => {
    if (!result.trim()) {
      showToast("Please enter a result", "⚠");
      return;
    }
    updateLabResult(patientId, labId, result.trim());
    showToast("Result saved", "✓");
    onClose();
    setResult("");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Enter Result — ${testName}`} maxWidth="max-w-md">
      <div className="mb-4">
        <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Result *</label>
        <textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Enter lab results…" rows={4} className={cn(fieldClass, "resize-none")} />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-status-normal px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90">Save Result</button>
      </div>
    </Modal>
  );
}
