"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useUpdateLabResult } from "@/hooks/mutations/useUpdateLabResult";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { URINE_FIELDS, RENAL_FIELDS, LIVER_FIELDS, FBC_FIELDS } from "./labTestDefinitions";
import { HepProfileEditor, UrineProfileEditor, QuantitativePanelEditor } from "./LabProfileEditors";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
  labId: number;
  testName: string;
}

export default function EnterLabResultModal({ open, onClose, patientId, labId, testName }: Props) {
  const [result, setResult] = useState("");
  const [hepFields, setHepFields] = useState({ HBsAg: "", HBsAb: "", HBeAg: "", HBeAb: "", HBcAb: "", Comment: "" });
  const [urineFields, setUrineFields] = useState<Record<string, string>>({});
  const [panelFields, setPanelFields] = useState<Record<string, unknown>>({});
  const [remarks, setRemarks] = useState("");
  const [singleResult, setSingleResult] = useState("");

  const updateLabResultMut = useUpdateLabResult();
  const { showToast } = useToast();

  const name = testName.toLowerCase();
  const isUrineProfile = name.includes("urinalysis");
  const isRenalProfile = name.includes("renal") || name.includes("kidney");
  const isLiverProfile = name.includes("liver") || name.includes("lft");
  const isFbcProfile = name.includes("fbc") || name.includes("blood count");
  const isViralScreen = ["hiv", "syphilis", "vdrl", "gonorrhoea", "hepatitis c", "hcv", "hepatitis b virus"].some(v => name.includes(v));
  const isHepProfile = (name.includes("hep") || name.includes("hepatitis")) && !isViralScreen;
  const isBloodGroup = name.includes("blood group");
  const isMalaria = name.includes("malaria") || name.includes("bf");

  useEffect(() => {
    if (open && isMalaria && !singleResult) setSingleResult("NO MPS SEEN");
  }, [open, isMalaria, singleResult]);

  const updatePanelVal = (k: string, prop: string, val: string) => {
    setPanelFields((prev) => {
      const row = (prev[k] as Record<string, string>) || { result: "", flag: "Normal", unit: "", ref: "" };
      return { ...prev, [k]: { ...row, [prop]: val } };
    });
  };

  const handleSave = async () => {
    let finalResult = result.trim();
    if (isHepProfile) {
      finalResult = `HBsAg: ${hepFields.HBsAg || "-"}\nHBsAb: ${hepFields.HBsAb || "-"}\nHBeAg: ${hepFields.HBeAg || "-"}\nHBeAb: ${hepFields.HBeAb || "-"}\nHBcAb: ${hepFields.HBcAb || "-"}\n\nCOMMENT: ${hepFields.Comment || "-"}`;
    } else if (isUrineProfile) {
      finalResult = URINE_FIELDS.map((k) => `${k}: ${urineFields[k] || "-"}`).join("\n");
      if (urineFields.Comment) finalResult += `\n\nCOMMENT: ${urineFields.Comment}`;
    } else if (isRenalProfile || isLiverProfile || isFbcProfile) {
      const fields = isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : FBC_FIELDS;
      finalResult = fields.map((f) => {
        const row = (panelFields[f.key] as Record<string, string>) || {};
        return `${f.label}:\n> ${row.result || "-"} (${row.flag || "Normal"}) — ${row.unit || f.defUnit} [Ref: ${row.ref || f.defRef}]`;
      }).join("\n\n");
      if (remarks) finalResult += `\n\nREMARKS: ${remarks}`;
    } else if (isViralScreen || isBloodGroup || isMalaria) {
      finalResult = `${testName.toUpperCase()}: ${singleResult || "-"}`;
    }

    if (!finalResult.replace(/[-—\[\]]/g, "").trim()) {
      showToast("Please enter a result", "⚠");
      return;
    }

    try {
      await updateLabResultMut.mutateAsync({
        patientId,
        labId,
        data: { result: finalResult, status: "completed" },
      });
      showToast("Result saved", "✓");
      onClose();
      setResult("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save result", "⚠");
    }
  };

  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Enter Result — ${testName}`}
      maxWidth={isRenalProfile || isLiverProfile || isFbcProfile ? "max-w-3xl" : isUrineProfile || isHepProfile ? "max-w-2xl" : "max-w-md"}
    >
      <div className="mb-4">
        {isHepProfile ? (
          <HepProfileEditor fields={hepFields} onChange={setHepFields} />
        ) : isUrineProfile ? (
          <UrineProfileEditor fields={urineFields} onChange={setUrineFields} />
        ) : isRenalProfile || isLiverProfile || isFbcProfile ? (
          <QuantitativePanelEditor
            fields={isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : FBC_FIELDS}
            state={panelFields}
            onUpdate={updatePanelVal}
            remarks={remarks}
            onRemarksChange={setRemarks}
          />
        ) : isViralScreen ? (
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm text-ink w-1/2">{testName.toUpperCase()}</span>
            <select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}>
              <option value="">Select...</option>
              <option value="NEGATIVE">NEGATIVE</option>
              <option value="POSITIVE">POSITIVE</option>
              <option value="REACTIVE">REACTIVE</option>
              <option value="NON-REACTIVE">NON-REACTIVE</option>
            </select>
          </div>
        ) : isBloodGroup ? (
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm text-ink w-1/2">Blood Group & Rh</span>
            <select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}>
              <option value="">Select...</option>
              <option value="A RH POSITIVE">A RH POSITIVE</option>
              <option value="A RH NEGATIVE">A RH NEGATIVE</option>
              <option value="B RH POSITIVE">B RH POSITIVE</option>
              <option value="B RH NEGATIVE">B RH NEGATIVE</option>
              <option value="AB RH POSITIVE">AB RH POSITIVE</option>
              <option value="AB RH NEGATIVE">AB RH NEGATIVE</option>
              <option value="O RH POSITIVE">O RH POSITIVE</option>
              <option value="O RH NEGATIVE">O RH NEGATIVE</option>
            </select>
          </div>
        ) : isMalaria ? (
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm text-ink w-1/2">{testName.toUpperCase()}</span>
            <input type="text" className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)} placeholder="NO MPS SEEN" />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Result *</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Enter laboratory findings…" rows={4} className={fieldClass} />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-bg-2 disabled:opacity-50">Cancel</button>
        <button onClick={handleSave} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg bg-status-normal px-5 py-2 text-xs font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50">
          {updateLabResultMut.isPending ? "Saving…" : "Save Result"}
        </button>
      </div>
    </Modal>
  );
}
