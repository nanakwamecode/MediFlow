"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useUpdateLabResult } from "@/hooks/mutations/useUpdateLabResult";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { cn } from "@/lib/utils";
import { URINE_FIELDS, STOOL_FIELDS, HVS_FIELDS } from "./labTestDefinitions";
import { resolvePanelFields } from "./extraLabPanels";
import { formatCellularResult } from "./labFormatters";
import { HepProfileEditor, UrineProfileEditor, QuantitativePanelEditor } from "./LabProfileEditors";
import CultureSensitivityEditor, { type CultureFields, EMPTY_CULTURE } from "./CultureSensitivityEditor";
import WidalTestEditor, { type WidalFields, EMPTY_WIDAL } from "./WidalTestEditor";
import CellularPathologyEditor from "./CellularPathologyEditor";
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
  const [cellState, setCellState] = useState<Record<string, string>>({});
  const [cultureFields, setCultureFields] = useState<CultureFields>(EMPTY_CULTURE);
  const [widalFields, setWidalFields] = useState<WidalFields>(EMPTY_WIDAL);
  const [remarks, setRemarks] = useState("");
  const [singleResult, setSingleResult] = useState("");
  const [singleUnit, setSingleUnit] = useState("");
  const [singleRef, setSingleRef] = useState("");
  const [singleFlag, setSingleFlag] = useState<"Normal" | "Low" | "High" | "Critical">("Normal");

  const updateLabResultMut = useUpdateLabResult();
  const { showToast } = useToast();

  const name = testName.toLowerCase();
  const isUrine = name.includes("urinalysis") || (name.includes("urine") && !name.includes("culture"));
  const isStool = name.includes("stool") && (name.includes("routine") || name.includes("microscopy") || name.includes("r/e"));
  const isHvs = name.includes("hvs") && (name.includes("wet mount") || name.includes("microscopy"));
  const isHepProfile = (name.includes("hep") || name.includes("hepatitis")) && name.includes("profile");
  const isViral = ["hiv", "syphilis", "vdrl", "gonorrhoea", "hepatitis c", "hcv", "hepatitis b virus", "chlamydia", "fobt", "stool occult blood", "sickling"].some((v) => name.includes(v)) || ((name.includes("hep") || name.includes("hepatitis")) && !isHepProfile);
  const isBlood = name.includes("blood group");
  const isMalaria = name.includes("malaria") || name.includes("bf");
  const isCulture = name.includes("culture") || name.includes("c&s");
  const isWidal = name.includes("widal") || name.includes("typhoid");

  const cellType =
    name.includes("electrophoresis") ? "electrophoresis" :
    name.includes("g6pd") ? "g6pd" :
    name.includes("coombs") ? "coombs" :
    name.includes("pap") ? "pap" :
    (name.includes("blood film") || name.includes("pbf") || name.includes("peripheral blood")) ? "pbf" :
    (name.includes("biopsy") || name.includes("histopath") || name.includes("fnac") || name.includes("bone marrow") || name.includes("cytology")) ? "biopsy" : null;

  const panelFieldsList = resolvePanelFields(testName);
  const isPanel = !!panelFieldsList;
  const defaultRef = getDefaultTestRef(testName);
  const isSingleQuant = !isPanel && !cellType && !isUrine && !isStool && !isHvs && !isHepProfile && !isViral && !isBlood && !isMalaria && !isCulture && !isWidal && !!defaultRef;

  useEffect(() => {
    if (open) {
      if (isMalaria) setSingleResult("NO MPS SEEN");
      if (name.includes("afb") || name.includes("zn stain")) setSingleResult("NO ACID FAST BACILLI SEEN");
      if (name.includes("koh mount")) setSingleResult("NO FUNGAL ELEMENTS SEEN");
      if (name.includes("gram stain")) setSingleResult("NO ORGANISMS SEEN");
      if (defaultRef) {
        setSingleUnit(defaultRef.unit);
        setSingleRef(defaultRef.ref);
      }
    } else {
      setResult(""); setSingleResult(""); setRemarks("");
      setPanelFields({}); setCellState({}); setCultureFields(EMPTY_CULTURE); setWidalFields(EMPTY_WIDAL);
    }
  }, [open, testName]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePanelVal = (k: string, prop: string, val: string, defUnit?: string, defRef?: string) => {
    setPanelFields((prev) => {
      const existing = (prev[k] as Record<string, string>) || {};
      const unit = existing.unit !== undefined && existing.unit !== "" ? existing.unit : (defUnit || "");
      const ref = existing.ref !== undefined && existing.ref !== "" ? existing.ref : (defRef || "");
      return { ...prev, [k]: { result: existing.result || "", flag: existing.flag || "Normal", unit, ref, ...existing, [prop]: val } };
    });
  };

  const handleSave = async () => {
    let final = result.trim();
    if (isHepProfile) {
      final = `HBsAg: ${hepFields.HBsAg || "-"}\nHBsAb: ${hepFields.HBsAb || "-"}\nHBeAg: ${hepFields.HBeAg || "-"}\nHBeAb: ${hepFields.HBeAb || "-"}\nHBcAb: ${hepFields.HBcAb || "-"}\n\nCOMMENT: ${hepFields.Comment || "-"}`;
    } else if (isUrine || isStool || isHvs) {
      const fList = isStool ? STOOL_FIELDS : isHvs ? HVS_FIELDS : URINE_FIELDS;
      final = fList.map((k) => `${k}: ${urineFields[k] || "-"}`).join("\n") + (urineFields.Comment ? `\n\nCOMMENT: ${urineFields.Comment}` : "");
    } else if (isCulture) {
      const sus = Object.entries(cultureFields.antibiogram).filter(([, v]) => v === "S").map(([k]) => k);
      const res = Object.entries(cultureFields.antibiogram).filter(([, v]) => v === "R").map(([k]) => k);
      final = `FINAL CULTURE TEST REPORT\n\nNumber of Organism(s): ${cultureFields.organisms || "-"}\nTotal Colony Count: ${cultureFields.colonyCount || "-"}\nCulture Isolate: ${cultureFields.cultureIsolate || "-"}\n\nANTIBIOGRAM REPORT (${cultureFields.cultureIsolate || "-"})\n\nSUSCEPTIBLE:\n${sus.length ? sus.map((a) => `  ${a} — S`).join("\n") : "  None"}\n\nRESISTANT:\n${res.length ? res.map((a) => `  ${a} — R`).join("\n") : "  None"}${cultureFields.remarks ? `\n\nREMARKS: ${cultureFields.remarks}` : ""}`;
    } else if (isWidal) {
      final = `IgM: ${widalFields.igm || "-"}\nIgG: ${widalFields.igg || "-"}${widalFields.comment ? `\n\nCOMMENT: ${widalFields.comment}` : ""}`;
    } else if (cellType) {
      final = formatCellularResult(cellType, cellState, testName);
    } else if (isPanel && panelFieldsList) {
      final = panelFieldsList.map((f) => {
        const row = (panelFields[f.key] as Record<string, string>) || {};
        const resVal = row.result || "-";
        const refVal = row.ref !== undefined && row.ref !== "" ? row.ref : f.defRef;
        const unitVal = row.unit !== undefined && row.unit !== "" ? row.unit : f.defUnit;
        const flagVal = row.flag || (detectLabFlag(resVal, refVal) || "Normal");
        return `${f.label}:\n> ${resVal} (${flagVal}) — ${unitVal} [Ref: ${refVal}]`;
      }).join("\n\n") + (remarks ? `\n\nREMARKS: ${remarks}` : "");
    } else if (isSingleQuant) {
      const flagVal = singleFlag || (detectLabFlag(singleResult, singleRef) || "Normal");
      final = `${testName.toUpperCase()}:\n> ${singleResult || "-"} (${flagVal}) — ${singleUnit} [Ref: ${singleRef}]` + (remarks ? `\n\nREMARKS: ${remarks}` : "");
    } else if (isViral || isBlood || isMalaria) {
      final = `${testName.toUpperCase()}: ${singleResult || "-"}`;
    }

    if (!final.replace(/[-—\[\]\n ]/g, "").trim()) return showToast("Please enter a result", "⚠");

    try {
      await updateLabResultMut.mutateAsync({
        patientId,
        labId,
        data: {
          result: final,
          status: "completed",
          ...(isHepProfile ? { testName: "Hepatitis B Profile Test" } : {}),
        },
      });
      showToast("Result saved", "✓");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save result", "⚠");
    }
  };

  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";

  return (
    <Modal open={open} onClose={onClose} title={`Enter Result — ${isHepProfile ? "Hepatitis B Profile Test" : testName}`} maxWidth={isPanel || isCulture || cellType ? "max-w-3xl" : "max-w-xl"}>
      <div className="mb-4">
        {isHepProfile ? <HepProfileEditor fields={hepFields} onChange={setHepFields} /> :
         (isUrine || isStool || isHvs) ? <UrineProfileEditor fields={urineFields} onChange={setUrineFields} fieldList={isStool ? STOOL_FIELDS : isHvs ? HVS_FIELDS : URINE_FIELDS} /> :
         isCulture ? <CultureSensitivityEditor fields={cultureFields} onChange={setCultureFields} /> :
         isWidal ? <WidalTestEditor fields={widalFields} onChange={setWidalFields} /> :
         cellType ? <CellularPathologyEditor testType={cellType} state={cellState} onChange={setCellState} /> :
         isPanel && panelFieldsList ? <QuantitativePanelEditor fields={panelFieldsList} state={panelFields} onUpdate={updatePanelVal} remarks={remarks} onRemarksChange={setRemarks} /> :
         isSingleQuant ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_0.9fr_1fr] gap-3 items-center">
              <div><label className="mb-1 block text-xs font-bold uppercase text-ink-3">Result *</label><input type="text" className={cn(fieldClass, "font-bold")} placeholder="Result value..." value={singleResult} onChange={(e) => { setSingleResult(e.target.value); const f = detectLabFlag(e.target.value, singleRef); if (f) setSingleFlag(f); }} /></div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-ink-3">Flag (Auto)</label>
                <select className={cn(fieldClass, "font-bold", singleFlag === "High" || singleFlag === "Critical" ? "text-status-high bg-status-high-bg border-status-high-border" : singleFlag === "Low" ? "text-blue bg-blue-bg border-blue/20" : "text-status-normal bg-status-normal-bg border-status-normal-border")} value={singleFlag} onChange={(e) => setSingleFlag(e.target.value as "Normal" | "Low" | "High" | "Critical")}>
                  <option value="Normal">Normal</option><option value="Low">Low</option><option value="High">High</option><option value="Critical">Critical</option>
                </select>
              </div>
              <div><label className="mb-1 block text-xs font-bold uppercase text-ink-3">Unit</label><input type="text" className={fieldClass} value={singleUnit} onChange={(e) => setSingleUnit(e.target.value)} /></div>
              <div><label className="mb-1 block text-xs font-bold uppercase text-ink-3">Ref Range</label><input type="text" className={fieldClass} value={singleRef} onChange={(e) => { setSingleRef(e.target.value); const f = detectLabFlag(singleResult, e.target.value); if (f) setSingleFlag(f); }} /></div>
            </div>
            <div><label className="mb-1 block text-xs font-bold uppercase text-ink-3">Remarks / Clinical Notes</label><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add comments..." rows={2} className={cn(fieldClass, "resize-none")} /></div>
          </div>
        ) : isViral ? (
          <div className="flex items-center justify-between gap-4"><span className="font-bold text-sm text-ink w-1/2">{testName.toUpperCase()}</span><select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}><option value="">Select...</option><option value="NEGATIVE">NEGATIVE</option><option value="POSITIVE">POSITIVE</option><option value="REACTIVE">REACTIVE</option><option value="NON-REACTIVE">NON-REACTIVE</option></select></div>
        ) : isBlood ? (
          <div className="flex items-center justify-between gap-4"><span className="font-bold text-sm text-ink w-1/2">Blood Group & Rh</span><select className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)}><option value="">Select...</option><option value="A RH POSITIVE">A RH POSITIVE</option><option value="A RH NEGATIVE">A RH NEGATIVE</option><option value="B RH POSITIVE">B RH POSITIVE</option><option value="B RH NEGATIVE">B RH NEGATIVE</option><option value="AB RH POSITIVE">AB RH POSITIVE</option><option value="AB RH NEGATIVE">AB RH NEGATIVE</option><option value="O RH POSITIVE">O RH POSITIVE</option><option value="O RH NEGATIVE">O RH NEGATIVE</option></select></div>
        ) : isMalaria ? (
          <div className="flex items-center justify-between gap-4"><span className="font-bold text-sm text-ink w-1/2">{testName.toUpperCase()}</span><input type="text" className={fieldClass} value={singleResult} onChange={(e) => setSingleResult(e.target.value)} placeholder="NO MPS SEEN" /></div>
        ) : (
          <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Result *</label><textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Enter laboratory findings…" rows={4} className={fieldClass} /></div>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2.5">
        <button onClick={onClose} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg border border-border-2 bg-transparent px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} disabled={updateLabResultMut.isPending} className="cursor-pointer rounded-lg bg-status-normal px-5 py-2 text-xs font-bold text-white hover:opacity-90">{updateLabResultMut.isPending ? "Saving…" : "Save Result"}</button>
      </div>
    </Modal>
  );
}
