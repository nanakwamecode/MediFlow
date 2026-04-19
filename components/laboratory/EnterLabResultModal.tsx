"use client";

import { useState, Fragment, useEffect } from "react";
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

const URINE_FIELDS = [
  "Appearance", "Colour", "PH", "SG", "Protein", "Nitrite", "Glucose",
  "Blood", "Ketone", "Urobillinogen", "Bilirubin", "Leukocytes",
  "Pus cells", "Epithelia cells", "RBCs", "Yeast cells", "Ova (Type)",
  "T.vaginalis", "Cast (Type)", "Crystals (Type)", "Others"
] as const;

const RENAL_FIELDS = [
  { key: "UREA", label: "UREA", defUnit: "mmol/L", defRef: "2.10-7.10" },
  { key: "CREATININE", label: "CREATININE", defUnit: "umol/L", defRef: "53-115" },
  { key: "SERUM_GLUCOSE", label: "SERUM GLUCOSE", defUnit: "mmol/L", defRef: "3.9-12.9" },
  { key: "EGFR", label: "ESTIMATED GFR (EGFR)", defUnit: "mL/min/1.73m^2", defRef: "60-205" },
  { key: "BUN", label: "BUN", defUnit: "mmol/L", defRef: "0.1-8.5" },
  { key: "BUN_CREATININE_RATIO", label: "BUN/CREAT. RATIO", defUnit: "N/A", defRef: "2-20" }
] as const;

const LIVER_FIELDS = [
  { key: "Total_protein", label: "Total protein", defUnit: "g/L", defRef: "53-89", group: "PROTEINS" },
  { key: "Albumin", label: "Albumin", defUnit: "g/L", defRef: "28.0-54.0", group: "PROTEINS" },
  { key: "Globulin", label: "Globulin", defUnit: "g/L", defRef: "18-38", group: "PROTEINS" },

  { key: "Total_Bilirubin", label: "Total Bilirubin", defUnit: "umol/L", defRef: "0.0-20.50", group: "BILIRUBINS" },
  { key: "Direct_Bilirubin", label: "Direct Bilirubin", defUnit: "umol/L", defRef: "0.0-4.3", group: "BILIRUBINS" },
  { key: "Indirect", label: "Indirect", defUnit: "umol/L", defRef: "0.0-15", group: "BILIRUBINS" },

  { key: "AST_GOT", label: "AST/GOT", defUnit: "IU/L", defRef: "0.0-37.0", group: "LIVER ENZYME" },
  { key: "ALT_GPT", label: "ALT/GPT", defUnit: "IU/L", defRef: "0.0-45", group: "LIVER ENZYME" },
  { key: "ALP", label: "ALP", defUnit: "IU/L", defRef: "70.0-430.0", group: "LIVER ENZYME" },
  { key: "GGT", label: "GGT", defUnit: "IU/L", defRef: "3.0-55.0", group: "LIVER ENZYME" }
] as const;

const FBC_FIELDS = [
  { key: "WBC", label: "WBC", defUnit: "", defRef: "3.5-9.5" },
  { key: "LYM_PCT", label: "LYM%", defUnit: "%", defRef: "20.0-50" },
  { key: "MID_PCT", label: "MID %", defUnit: "%", defRef: "3.0-10.0" },
  { key: "GRAN_PCT", label: "GRAN %", defUnit: "%", defRef: "40.0-75.0" },
  { key: "LYM_NUM", label: "LYM #", defUnit: "10*9/L", defRef: "1.1-3.2" },
  { key: "MID_NUM", label: "MID#", defUnit: "10*9/L", defRef: "0.1-0.6" },
  { key: "GRAN_NUM", label: "GRAN #", defUnit: "10*9/L", defRef: "1.8-6.3" },
  { key: "RBC", label: "RBC", defUnit: "10*9/L", defRef: "3.80-5.10" },
  { key: "HB", label: "HB", defUnit: "g/dL", defRef: "11.5-15.0" },
  { key: "HCT", label: "HCT", defUnit: "%", defRef: "35.0-45.0" },
  { key: "MCV", label: "MCV", defUnit: "fL", defRef: "82.0-99" },
  { key: "MCH", label: "MCH", defUnit: "pg", defRef: "27.0-34.0" },
  { key: "MCHC", label: "MCHC", defUnit: "g/dL", defRef: "31.6-35.4" },
  { key: "RDW_CV", label: "RDW-CV", defUnit: "%", defRef: "11.5-14.5" },
  { key: "RDW_SD", label: "RDW- SD", defUnit: "fL", defRef: "37.0-54.0" },
  { key: "PLATELET", label: "PLATELET", defUnit: "10*9/L", defRef: "125-350" },
  { key: "MPV", label: "MPV", defUnit: "fL", defRef: "7.4-10.4" },
  { key: "PCT", label: "PCT", defUnit: "%", defRef: "0.10-0.28" },
  { key: "P_LCR", label: "P-LCR", defUnit: "%", defRef: "13.0-43.0" },
  { key: "P_LCC", label: "P-LCC", defUnit: "10*9/L", defRef: "13.0-129" },
  { key: "PDW_SD", label: "PDW-SD", defUnit: "fL", defRef: "10.0-14.0" },
  { key: "PDW_CV", label: "PDW-CV", defUnit: "%", defRef: "15.0-18.0" }
] as const;


export default function EnterLabResultModal({ open, onClose, patientId, labId, testName }: Props) {
  const [result, setResult] = useState("");
  const [hepFields, setHepFields] = useState({
    HBsAg: "", HBsAb: "", HBeAg: "", HBeAb: "", HBcAb: "", Comment: ""
  });
  const [urineFields, setUrineFields] = useState<Record<string, string>>({});
  const [renalFields, setRenalFields] = useState<Record<string, any>>({});
  const [liverFields, setLiverFields] = useState<Record<string, any>>({});
  const [fbcFields, setFbcFields] = useState<Record<string, any>>({});
  const [remarks, setRemarks] = useState("");

  const [singleResult, setSingleResult] = useState("");
  const [typhoidFields, setTyphoidFields] = useState({ igm: "NEGATIVE", igg: "NEGATIVE" });
  const [hbEstimate, setHbEstimate] = useState({ result: "", flag: "Normal", unit: "g/dL", ref: "12.0-16.0" });
  
  const updateLabResult = usePatientStore((s) => s.updateLabResult);
  const { showToast } = useToast();

  const isUrineProfile = testName.toLowerCase().includes("urinalysis");
  const isRenalProfile = testName.toLowerCase().includes("renal") || testName.toLowerCase().includes("kidney");
  const isLiverProfile = testName.toLowerCase().includes("liver") || testName.toLowerCase().includes("lft");
  const isFbcProfile = testName.toLowerCase().includes("fbc") || testName.toLowerCase().includes("blood count");

  const isHbEstimate = testName.toLowerCase().includes("hb estimate") || testName.toLowerCase().includes("haemoglobin estimate") || testName.toLowerCase() === "hb";
  const isTyphoid = testName.toLowerCase().includes("typhoid");
  const isBloodGroup = testName.toLowerCase().includes("blood group");
  const isMalaria = testName.toLowerCase().includes("malaria") || testName.toLowerCase().includes("bf for") || testName.toLowerCase() === "bf";
  const isViralScreen = ["hiv", "syphilis", "vdrl", "gonorrhoea", "hepatitis c", "hcv", "hepatitis b virus"].some(val => testName.toLowerCase().includes(val));
  
  const isHepProfile = (testName.toLowerCase().includes("hep") || testName.toLowerCase().includes("hepatitis")) && !isViralScreen;
  const isSmallForm = isHbEstimate || isTyphoid || isBloodGroup || isMalaria || isViralScreen;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg px-3 py-2",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  
  useEffect(() => {
    if (open && isMalaria && !singleResult) {
      setSingleResult("NO MPS SEEN");
    }
  }, [open, isMalaria, singleResult]);

  const autoDetectFlag = (valStr: string, refStr: string) => {
    if (!valStr.trim() || !refStr.includes('-')) return null;
    const value = parseFloat(valStr);
    if (isNaN(value)) return null;
    const parts = refStr.split('-');
    if (parts.length !== 2) return null;
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);
    if (isNaN(min) || isNaN(max)) return null;
    
    if (value < min) return "Low";
    if (value > max) return "High";
    return "Normal";
  };

  const updateRenalVal = (k: string, prop: string, val: string) => {
    setRenalFields(prev => {
      let row = prev[k] || { result: "", flag: "Normal", unit: RENAL_FIELDS.find(f => f.key === k)?.defUnit || "", ref: RENAL_FIELDS.find(f => f.key === k)?.defRef || "" };
      const nextRow = { ...row, [prop]: val };
      if (prop === "result" || prop === "ref") {
        const auto = autoDetectFlag(nextRow.result, nextRow.ref);
        if (auto) nextRow.flag = auto;
      }
      return { ...prev, [k]: nextRow };
    });
  };

  const updateLiverVal = (k: string, prop: string, val: string) => {
    setLiverFields(prev => {
      let row = prev[k] || { result: "", flag: "Normal", unit: LIVER_FIELDS.find(f => f.key === k)?.defUnit || "", ref: LIVER_FIELDS.find(f => f.key === k)?.defRef || "" };
      const nextRow = { ...row, [prop]: val };
      if (prop === "result" || prop === "ref") {
        const auto = autoDetectFlag(nextRow.result, nextRow.ref);
        if (auto) nextRow.flag = auto;
      }
      return { ...prev, [k]: nextRow };
    });
  };

  const updateFbcVal = (k: string, prop: string, val: string) => {
    setFbcFields(prev => {
      let row = prev[k] || { result: "", flag: "Normal", unit: FBC_FIELDS.find(f => f.key === k)?.defUnit || "", ref: FBC_FIELDS.find(f => f.key === k)?.defRef || "" };
      const nextRow = { ...row, [prop]: val };
      if (prop === "result" || prop === "ref") {
        const auto = autoDetectFlag(nextRow.result, nextRow.ref);
        if (auto) nextRow.flag = auto;
      }
      return { ...prev, [k]: nextRow };
    });
  };

  const updateHbEstimateVal = (prop: string, val: string) => {
    setHbEstimate(prev => {
      const next = { ...prev, [prop]: val };
      if (prop === "result" || prop === "ref") {
        const auto = autoDetectFlag(next.result, next.ref);
        if (auto) next.flag = auto;
      }
      return next;
    });
  };

  const handleSave = () => {
    let finalResult = result.trim();
    
    if (isHepProfile) {
      finalResult = `HBsAg: ${hepFields.HBsAg || "-"}\nHBsAb: ${hepFields.HBsAb || "-"}\nHBeAg: ${hepFields.HBeAg || "-"}\nHBeAb: ${hepFields.HBeAb || "-"}\nHBcAb: ${hepFields.HBcAb || "-"}\n\nCOMMENT: ${hepFields.Comment || "-"}`;
    } else if (isUrineProfile) {
      finalResult = URINE_FIELDS.map(k => `${k}: ${urineFields[k] || "-"}`).join("\n");
      if (urineFields.Comment) {
        finalResult += `\n\nCOMMENT: ${urineFields.Comment}`;
      }
    } else if (isRenalProfile) {
      finalResult = RENAL_FIELDS.map(f => {
        const val = (prop: string) => renalFields[f.key]?.[prop] ?? (
           prop === "flag" ? "Normal" : prop === "unit" ? f.defUnit : prop === "ref" ? f.defRef : ""
        );
        return `${f.label}:\n> ${val("result") || "-"} (${val("flag")}) — ${val("unit")} [Ref: ${val("ref")}]`;
      }).join("\n\n");
      if (remarks) {
        finalResult += `\n\nREMARKS: ${remarks}`;
      }
    } else if (isLiverProfile) {
      let currentGrp = "";
      finalResult = LIVER_FIELDS.map(f => {
        let res = "";
        if (f.group !== currentGrp) {
           currentGrp = f.group;
           res += `\n[ ${f.group} ]\n`;
        }
        const val = (prop: string) => liverFields[f.key]?.[prop] ?? (
           prop === "flag" ? "Normal" : prop === "unit" ? f.defUnit : prop === "ref" ? f.defRef : ""
        );
        res += `${f.label}:\n> ${val("result") || "-"} (${val("flag")}) — ${val("unit")} [Ref: ${val("ref")}]`;
        return res;
      }).join("\n");
      finalResult = finalResult.trim();
      if (remarks) {
        finalResult += `\n\nREMARKS: ${remarks}`;
      }
    } else if (isFbcProfile) {
      finalResult = FBC_FIELDS.map(f => {
        const val = (prop: string) => fbcFields[f.key]?.[prop] ?? (
           prop === "flag" ? "Normal" : prop === "unit" ? f.defUnit : prop === "ref" ? f.defRef : ""
        );
        return `${f.label}:\n> ${val("result") || "-"} (${val("flag")}) — ${val("unit")} [Ref: ${val("ref")}]`;
      }).join("\n\n");
      if (remarks) {
        finalResult += `\n\nREMARKS: ${remarks}`;
      }
    } else if (isTyphoid) {
      finalResult = `TYPHOID Ab IgM: ${typhoidFields.igm || "-"}\nIgG: ${typhoidFields.igg || "-"}`;
    } else if (isHbEstimate) {
      finalResult = `HB ESTIMATE:\n> ${hbEstimate.result || "-"} (${hbEstimate.flag}) — ${hbEstimate.unit} [Ref: ${hbEstimate.ref}]`;
    } else if (isViralScreen || isBloodGroup || isMalaria) {
      finalResult = `${testName.toUpperCase()}: ${singleResult || "-"}`;
    }

    if (!finalResult.replace(/-/g, "").trim() && !finalResult.replace(/—/g, "").trim() && !finalResult.replace(/\[.*\]/g, "").trim()) {
      showToast("Please enter a result", "⚠");
      return;
    }
    
    updateLabResult(patientId, labId, finalResult);
    showToast("Result saved", "✓");
    onClose();
    setResult("");
  };

  return (
    <Modal open={open} onClose={onClose} title={`Enter Result — ${testName}`} maxWidth={isRenalProfile || isLiverProfile || isFbcProfile || isHbEstimate ? "max-w-3xl" : isUrineProfile || isHepProfile ? "max-w-2xl" : "max-w-md"}>
      <div className="mb-4">
        {isHepProfile ? (
          <div className="space-y-2.5">
            <div className="mb-3 border-b border-border pb-2 flex justify-between font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink-3">
              <span>Test</span>
              <span className="w-1/2">Result Observed</span>
            </div>
            {(["HBsAg", "HBsAb", "HBeAg", "HBeAb", "HBcAb"] as const).map(k => (
              <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="font-semibold text-[0.85rem] text-ink">{k}</span>
                <select 
                  className={cn(fieldClass, "w-full sm:w-1/2 py-1.5 px-2 font-semibold")} 
                  value={hepFields[k as keyof typeof hepFields]}
                  onChange={e => setHepFields({...hepFields, [k]: e.target.value})}
                >
                  <option value="">Select...</option>
                  <option value="POSITIVE">POSITIVE</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            ))}
            <div className="mt-4 border-t border-border pt-4">
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Comment</label>
              <textarea 
                value={hepFields.Comment} 
                onChange={e => setHepFields({...hepFields, Comment: e.target.value})} 
                placeholder="E.g., CHRONIC INACTIVE VIRAL HEPATITIS B INFECTION" 
                rows={2} 
                className={cn(fieldClass, "resize-none uppercase")} 
              />
            </div>
          </div>
        ) : isUrineProfile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {URINE_FIELDS.map(k => (
                <div key={k} className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
                  <span className="font-semibold text-[0.8rem] text-ink">{k}</span>
                  <input 
                    type="text"
                    className={cn(fieldClass, "w-[60%] py-1.5 px-2 text-[0.8rem] font-medium")} 
                    placeholder="Result..."
                    value={urineFields[k] || ""}
                    onChange={e => setUrineFields({...urineFields, [k]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Comment</label>
              <textarea 
                value={urineFields.Comment || ""} 
                onChange={e => setUrineFields({...urineFields, Comment: e.target.value})} 
                placeholder="Add any additional comments..." 
                rows={2} 
                className={cn(fieldClass, "resize-none")} 
              />
            </div>
          </div>
        ) : isHbEstimate ? (
          <div className="space-y-4">
             <div className="hidden sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-3 border-b border-border pb-2 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink-3">
                <span>Test</span>
                <span>Result Observed</span>
                <span>Flag</span>
                <span>Unit</span>
                <span>Ref Range</span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-1.5 sm:gap-3 sm:items-center pb-4 sm:pb-0 border-b border-border sm:border-0 last:border-0">
                <span className="font-semibold text-[0.75rem] text-ink sm:mb-0 mb-1 leading-tight">{testName.toUpperCase()}</span>
                <input type="text" className={cn(fieldClass, "py-1.5 px-2")} value={hbEstimate.result} onChange={e => updateHbEstimateVal("result", e.target.value)} placeholder="Result..."/>
                <select className={cn(fieldClass, "py-1.5 px-2")} value={hbEstimate.flag} onChange={e => updateHbEstimateVal("flag", e.target.value)}>
                  <option value="Normal">Normal</option><option value="Low">Low</option><option value="High">High</option><option value="Critical">Critical</option>
                </select>
                <input type="text" className={cn(fieldClass, "py-1.5 px-2")} value={hbEstimate.unit} onChange={e => updateHbEstimateVal("unit", e.target.value)}/>
                <input type="text" className={cn(fieldClass, "py-1.5 px-2")} value={hbEstimate.ref} onChange={e => updateHbEstimateVal("ref", e.target.value)}/>
            </div>
          </div>
        ) : isTyphoid ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-4">
                <span className="font-semibold text-[0.8rem] text-ink w-1/2">TYPHOID Ab IgM</span>
                <select className={fieldClass} value={typhoidFields.igm} onChange={e => setTyphoidFields({...typhoidFields, igm: e.target.value})}>
                  <option value="NEGATIVE">NEGATIVE</option>
                  <option value="POSITIVE">POSITIVE</option>
                </select>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-4">
                <span className="font-semibold text-[0.8rem] text-ink w-1/2">IgG</span>
                <select className={fieldClass} value={typhoidFields.igg} onChange={e => setTyphoidFields({...typhoidFields, igg: e.target.value})}>
                  <option value="NEGATIVE">NEGATIVE</option>
                  <option value="POSITIVE">POSITIVE</option>
                </select>
              </div>
            </div>
          </div>
        ) : isViralScreen ? (
          <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-4">
            <span className="font-semibold text-[0.8rem] text-ink w-1/2">{testName.toUpperCase()}</span>
            <select className={fieldClass} value={singleResult} onChange={e => setSingleResult(e.target.value)}>
               <option value="">Select...</option>
               <option value="NEGATIVE">NEGATIVE</option>
               <option value="POSITIVE">POSITIVE</option>
               <option value="REACTIVE">REACTIVE</option>
               <option value="NON-REACTIVE">NON-REACTIVE</option>
            </select>
          </div>
        ) : isBloodGroup ? (
          <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-4">
            <span className="font-semibold text-[0.8rem] text-ink w-1/2">{testName.toUpperCase()}</span>
            <select className={fieldClass} value={singleResult} onChange={e => setSingleResult(e.target.value)}>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 pb-2 gap-4">
            <span className="font-semibold text-[0.8rem] text-ink w-1/2">{testName.toUpperCase()}</span>
            <input type="text" className={fieldClass} value={singleResult} onChange={e => setSingleResult(e.target.value)} placeholder="NO MPS SEEN"/>
          </div>
        ) : isRenalProfile || isLiverProfile || isFbcProfile ? (
          <div className="space-y-4">
            <div className="hidden sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-3 border-b border-border pb-2 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink-3">
              <span>Test</span>
              <span>Result Observed</span>
              <span>Flag</span>
              <span>Unit</span>
              <span>Ref Range</span>
            </div>
            <div className="flex flex-col gap-y-4 sm:gap-y-2">
              {(isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : FBC_FIELDS).map((f, i) => {
                const targetFieldsObj = isRenalProfile ? RENAL_FIELDS : isLiverProfile ? LIVER_FIELDS : FBC_FIELDS;
                const fieldGroup = (f as any).group;
                const isGroupStart = fieldGroup && (i === 0 || fieldGroup !== (targetFieldsObj as any)[i - 1]?.group);
                
                const val = (prop: string) => {
                  const stateObj = isRenalProfile ? renalFields : isLiverProfile ? liverFields : fbcFields;
                  return stateObj[f.key]?.[prop] ?? (
                    prop === "flag" ? "Normal" : prop === "unit" ? f.defUnit : prop === "ref" ? f.defRef : ""
                  );
                };
                
                const updater = isRenalProfile ? updateRenalVal : isLiverProfile ? updateLiverVal : updateFbcVal;
                
                return (
                  <Fragment key={f.key}>
                    {fieldGroup && isGroupStart && (
                      <div className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink-3/80 mt-2 sm:col-span-full border-b border-dashed border-border/70 pb-1">
                        {fieldGroup}
                      </div>
                    )}
                    <div className="flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-1.5 sm:gap-3 sm:items-center pb-4 sm:pb-0 border-b border-border sm:border-0 last:border-0">
                      <span className="font-semibold text-[0.75rem] text-ink sm:mb-0 mb-1 leading-tight">{f.label}</span>
                      <input 
                        type="text"
                        className={cn(fieldClass, "py-1.5 px-2 text-[0.8rem] font-medium")} 
                        placeholder="Result..."
                        value={val("result")}
                        onChange={e => updater(f.key, "result", e.target.value)}
                      />
                      <select 
                        className={cn(fieldClass, "py-1.5 px-2 text-[0.75rem] font-medium")}
                        value={val("flag")}
                        onChange={e => updater(f.key, "flag", e.target.value)}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <input 
                        type="text"
                        className={cn(fieldClass, "py-1.5 px-2 text-[0.75rem]")} 
                        placeholder="Unit"
                        value={val("unit")}
                        onChange={e => updater(f.key, "unit", e.target.value)}
                      />
                      <input 
                        type="text"
                        className={cn(fieldClass, "py-1.5 px-2 text-[0.75rem]")} 
                        placeholder="Ref Range"
                        value={val("ref")}
                        onChange={e => updater(f.key, "ref", e.target.value)}
                      />
                    </div>
                  </Fragment>
                );
              })}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Remarks / Comment</label>
              <textarea 
                value={remarks} 
                onChange={e => setRemarks(e.target.value)} 
                placeholder="Add any additional notes..." 
                rows={2} 
                className={cn(fieldClass, "resize-none")} 
              />
            </div>
          </div>
        ) : (
          <>
            <label className="mb-1 block font-mono text-[0.58rem] tracking-[0.18em] text-ink-3 uppercase">Result *</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} placeholder="Enter lab results…" rows={4} className={cn(fieldClass, "resize-none")} />
          </>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2">Cancel</button>
        <button onClick={handleSave} className="cursor-pointer rounded-lg bg-status-normal px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90">Save Result</button>
      </div>
    </Modal>
  );
}
