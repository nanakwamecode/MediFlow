"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useUpdateLabResult } from "@/hooks/mutations/useUpdateLabResult";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { URINE_FIELDS, RENAL_FIELDS, LIVER_FIELDS, FBC_FIELDS, LIPID_FIELDS, TFT_FIELDS, BMP_FIELDS } from "./labTestDefinitions";
import { HepProfileEditor, UrineProfileEditor, QuantitativePanelEditor } from "./LabProfileEditors";
import { detectLabFlag, getDefaultTestRef } from "@/lib/labUtils";

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
  const [singleUnit, setSingleUnit] = useState("");
  const [singleRef, setSingleRef] = useState("");
  const [singleFlag, setSingleFlag] = useState<"Normal" | "Low" | "High" | "Critical">("Normal");

  const updateLabResultMut = useUpdateLabResult();
  const { showToast } = useToast();

  const name = testName.toLowerCase();
  const isUrineProfile = name.includes("urinalysis");
  const isRenalProfile = name.includes("renal") || name.includes("kidney") || name.includes("rft");
  const isLiverProfile = name.includes("liver") || name.includes("lft");
  const isFbcProfile = name.includes("fbc") || name.includes("blood count") || name.includes("cbc");
  const isLipidProfile = name.includes("lipid") || name.includes("cholesterol panel");
  const isTftProfile = name.includes("thyroid") || name.includes("tft");
  const isBmpProfile = name.includes("basic metabolic") || name.includes("bmp") || name.includes("electrolytes");
  const isViralScreen = ["hiv", "syphilis", "vdrl", "gonorrhoea", "hepatitis c", "hcv", "hepatitis b virus"].some(v => name.includes(v));
  const isHepProfile = (name.includes("hep") || name.includes("hepatitis")) && !isViralScreen;
  const isBloodGroup = name.includes("blood group");
  const isMalaria = name.includes("malaria") || name.includes("bf");

  const defaultRef = getDefaultTestRef(testName);
  const isSingleQuant = !!defaultRef;

  useEffect(() => {
    if (open) {
      if (isMalaria && !singleResult) setSingleResult("NO MPS SEEN");
      if (defaultRef) {
        setSingleUnit(defaultRef.unit);
        setSingleRef(defaultRef.ref);
      }
    }
  }, [open, isMalaria, testName]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePanelVal = (k: string, prop: string, val: string, defUnit?: string, defRef?: string) => {
    setPanelFields((prev) => {
      const existing = (prev[k] as Record<string, string>) || {};
      const unit = existing.unit !== undefined && existing.unit !== "" ? existing.unit : (defUnit || "");
      const ref = existing.ref !== undefined && existing.ref !== "" ? existing.ref : (defRef || "");
      const row = { result: existing.result || "", flag: existing.flag || "Normal", unit, ref, ...existing, [prop]: val };
      return { ...prev, [k]: row };
    });
  };

  const handleSingleResultChange = (val: string) => {
    setSingleResult(val);
    const flag = detectLabFlag(val, singleRef);
    if (flag) setSingleFlag(flag);
  };

  const handleSingleRefChange = (refVal: string) => {
    setSingleRef(refVal);
    const flag = detectLabFlag(singleResult, refVal);
    if (flag) setSingleFlag(flag);
  };

  const handleSave = async () => {
    let finalResult = result.trim();
    if (isHepProfile) {
      finalResult = `HBsAg: ${hepFields.HBsAg || "-"}\nHBsAb: ${hepFields.HBsAb || "-"}\nHBeAg: ${hepFields.HBeAg || "-"}\nHBeAb: ${hepFields.HBeAb || "-"}\nHBcAb: ${hepFields.HBcAb || "-"}\n\nCOMMENT: ${hepFields.Comment || "-"}`;
    } else if (isUrineProfile) {
      finalResult = URINE_FIELDS.map((k) => `${k}: ${urineFields[k] || "-"}`).join("\n");
      if (urineFields.Comment) finalResult += `\n\nCOMMENT: ${urineFields.Comment}`;
    } else if (isRenalProfile || isLiverProfile || isFbcProfile || isLipidProfile || isTftProfile || isBmpProfile) {
      const fields = isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : isFbcProfile ? FBC_FIELDS : isLipidProfile ? LIPID_FIELDS : isTftProfile ? TFT_FIELDS : BMP_FIELDS;
      finalResult = fields.map((f) => {
        const row = (panelFields[f.key] as Record<string, string>) || {};
        const resVal = row.result || "-";
        const refVal = row.ref !== undefined && row.ref !== "" ? row.ref : f.defRef;
        const unitVal = row.unit !== undefined && row.unit !== "" ? row.unit : f.defUnit;
        const flagVal = row.flag || (detectLabFlag(resVal, refVal) || "Normal");
        return `${f.label}:\n> ${resVal} (${flagVal}) — ${unitVal} [Ref: ${refVal}]`;
      }).join("\n\n");
      if (remarks) finalResult += `\n\nREMARKS: ${remarks}`;
    } else if (isSingleQuant) {
      const flagVal = singleFlag || (detectLabFlag(singleResult, singleRef) || "Normal");
      finalResult = `${testName.toUpperCase()}:\n> ${singleResult || "-"} (${flagVal}) — ${singleUnit} [Ref: ${singleRef}]`;
      if (remarks) finalResult += `\n\nREMARKS: ${remarks}`;
    } else if (isViralScreen || isBloodGroup || isMalaria) {
      finalResult = `${testName.toUpperCase()}: ${singleResult || "-"}`;
    }

    if (!finalResult.replace(/[-—\[\]]/g, "").trim()) {
      showToast("Please enter a result", "⚠");
      return;
    }

    try {
      await updateLabResultMut.mutateAsync({ patientId, labId, data: { result: finalResult, status: "completed" } });
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
      maxWidth={isRenalProfile || isLiverProfile || isFbcProfile || isLipidProfile || isTftProfile || isBmpProfile ? "max-w-3xl" : "max-w-xl"}
    >
      <div className="mb-4">
        {isHepProfile ? (
          <HepProfileEditor fields={hepFields} onChange={setHepFields} />
        ) : isUrineProfile ? (
          <UrineProfileEditor fields={urineFields} onChange={setUrineFields} />
        ) : isRenalProfile || isLiverProfile || isFbcProfile || isLipidProfile || isTftProfile || isBmpProfile ? (
          <QuantitativePanelEditor
            fields={isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : isFbcProfile ? FBC_FIELDS : isLipidProfile ? LIPID_FIELDS : isTftProfile ? TFT_FIELDS : BMP_FIELDS}
            state={panelFields}
            onUpdate={updatePanelVal}
            remarks={remarks}
            onRemarksChange={setRemarks}
          />
        ) : isSingleQuant ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_0.9fr_1fr] gap-3 items-center">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Result *</label>
                <input type="text" className={cn(fieldClass, "font-bold")} placeholder="Result value..." value={singleResult} onChange={(e) => handleSingleResultChange(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Flag (Auto)</label>
                <select
                  className={cn(
                    fieldClass,
                    "font-bold",
                    singleFlag === "High" || singleFlag === "Critical" ? "text-status-high bg-status-high-bg border-status-high-border" :
                    singleFlag === "Low" ? "text-blue bg-blue-bg border-blue/20" : "text-status-normal bg-status-normal-bg border-status-normal-border"
                  )}
                  value={singleFlag}
                  onChange={(e) => setSingleFlag(e.target.value as any)}
                >
                  <option value="Normal">Normal</option><option value="Low">Low</option><option value="High">High</option><option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Unit</label>
                <input type="text" className={fieldClass} value={singleUnit} onChange={(e) => setSingleUnit(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Ref Range</label>
                <input type="text" className={fieldClass} value={singleRef} onChange={(e) => handleSingleRefChange(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Remarks / Clinical Notes</label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add comments..." rows={2} className={cn(fieldClass, "resize-none")} />
            </div>
          </div>
        ) : isViralScreen || isBloodGroup || isMalaria ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-sm text-ink w-1/2">{testName.toUpperCase()}</span>
              {isViralScreen ? (
                <select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}>
                  <option value="">Select...</option><option value="NEGATIVE">NEGATIVE</option><option value="POSITIVE">POSITIVE</option><option value="REACTIVE">REACTIVE</option><option value="NON-REACTIVE">NON-REACTIVE</option>
                </select>
              ) : isBloodGroup ? (
                <select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}>
                  <option value="">Select...</option><option value="A RH POSITIVE">A RH POSITIVE</option><option value="A RH NEGATIVE">A RH NEGATIVE</option><option value="B RH POSITIVE">B RH POSITIVE</option><option value="B RH NEGATIVE">B RH NEGATIVE</option><option value="AB RH POSITIVE">AB RH POSITIVE</option><option value="AB RH NEGATIVE">AB RH NEGATIVE</option><option value="O RH POSITIVE">O RH POSITIVE</option><option value="O RH NEGATIVE">O RH NEGATIVE</option>
                </select>
              ) : (
                <input type="text" className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)} placeholder="NO MPS SEEN" />
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Result *</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Enter laboratory findings…" rows={4} className={fieldClass} />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg bg-status-normal px-5 py-2 text-xs font-bold text-white hover:opacity-90">
          {updateLabResultMut.isPending ? "Saving…" : "Save Result"}
        </button>
      </div>
    </Modal>
  );
}
