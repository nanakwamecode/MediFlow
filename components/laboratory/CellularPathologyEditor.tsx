"use client";

import { cn } from "@/lib/utils";

interface Props {
  testType: "pap" | "pbf" | "biopsy" | "electrophoresis" | "g6pd" | "coombs";
  state: Record<string, string>;
  onChange: (state: Record<string, string>) => void;
}

export default function CellularPathologyEditor({ testType, state, onChange }: Props) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";
  const labelClass = "mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3";
  const update = (k: string, v: string) => onChange({ ...state, [k]: v });

  if (testType === "electrophoresis") {
    return (
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Haemoglobin Pattern *</label>
          <select className={fieldClass} value={state.pattern || ""} onChange={(e) => update("pattern", e.target.value)}>
            <option value="">Select pattern...</option>
            <option value="AA (Normal Adult Hb)">AA (Normal Adult Hb)</option>
            <option value="AS (Sickle Cell Trait)">AS (Sickle Cell Trait)</option>
            <option value="SS (Sickle Cell Anemia)">SS (Sickle Cell Anemia)</option>
            <option value="SC (Hb SC Disease)">SC (Hb SC Disease)</option>
            <option value="AC (Hb C Trait)">AC (Hb C Trait)</option>
            <option value="CC (Hb C Disease)">CC (Hb C Disease)</option>
            <option value="AF (Elevated Fetal Hb)">AF (Elevated Fetal Hb)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fractions / Densitometry (%)</label>
          <input type="text" className={fieldClass} placeholder="e.g. HbA: 62.5%, HbS: 36.0%, HbF: 1.5%" value={state.fractions || ""} onChange={(e) => update("fractions", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Clinical Interpretation</label>
          <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="e.g. Compatible with Sickle Cell Trait." value={state.comment || ""} onChange={(e) => update("comment", e.target.value)} />
        </div>
      </div>
    );
  }

  if (testType === "g6pd") {
    return (
      <div className="space-y-3">
        <div>
          <label className={labelClass}>G6PD Status *</label>
          <select className={fieldClass} value={state.status || ""} onChange={(e) => update("status", e.target.value)}>
            <option value="">Select status...</option>
            <option value="NO ENZYME DEFICIENCY (FULL ACTIVITY)">NO ENZYME DEFICIENCY (FULL ACTIVITY)</option>
            <option value="PARTIAL DEFICIENCY">PARTIAL DEFICIENCY</option>
            <option value="TOTAL DEFICIENCY (G6PD DEFICIENT)">TOTAL DEFICIENCY (G6PD DEFICIENT)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Clinical Notes</label>
          <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="Add clinical guidance regarding oxidant drugs..." value={state.comment || ""} onChange={(e) => update("comment", e.target.value)} />
        </div>
      </div>
    );
  }

  if (testType === "coombs") {
    return (
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Agglutination / Reaction *</label>
          <select className={fieldClass} value={state.result || ""} onChange={(e) => update("result", e.target.value)}>
            <option value="">Select reaction...</option>
            <option value="NEGATIVE">NEGATIVE</option>
            <option value="POSITIVE (1+)">POSITIVE (1+)</option>
            <option value="POSITIVE (2+)">POSITIVE (2+)</option>
            <option value="POSITIVE (3+)">POSITIVE (3+)</option>
            <option value="POSITIVE (4+)">POSITIVE (4+)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Remarks / Antibody Profile</label>
          <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="e.g. Direct Antiglobulin Test (DAT) negative at 37°C..." value={state.comment || ""} onChange={(e) => update("comment", e.target.value)} />
        </div>
      </div>
    );
  }

  if (testType === "pap") {
    return (
      <div className="space-y-3 max-h-[360px] overflow-y-auto p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Specimen Adequacy</label>
            <select className={fieldClass} value={state.adequacy || "Satisfactory for evaluation"} onChange={(e) => update("adequacy", e.target.value)}>
              <option value="Satisfactory for evaluation">Satisfactory for evaluation</option>
              <option value="Satisfactory with absence of endocervical cells">Satisfactory (No endocervical cells)</option>
              <option value="Unsatisfactory for evaluation">Unsatisfactory for evaluation</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>General Categorization</label>
            <select className={fieldClass} value={state.category || "NILM"} onChange={(e) => update("category", e.target.value)}>
              <option value="NILM">Negative for Intraepithelial Lesion (NILM)</option>
              <option value="Epithelial Cell Abnormality">Epithelial Cell Abnormality</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Bethesda Interpretation *</label>
          <select className={fieldClass} value={state.interpretation || ""} onChange={(e) => update("interpretation", e.target.value)}>
            <option value="">Select diagnosis...</option>
            <option value="NILM (Negative for Intraepithelial Lesion or Malignancy)">NILM (Negative for Malignancy)</option>
            <option value="ASC-US (Atypical Squamous Cells of Undetermined Significance)">ASC-US (Atypical Squamous Cells)</option>
            <option value="LSIL (Low-grade Squamous Intraepithelial Lesion / HPV / CIN 1)">LSIL (Low-grade SIL / CIN 1)</option>
            <option value="HSIL (High-grade Squamous Intraepithelial Lesion / CIN 2/3)">HSIL (High-grade SIL / CIN 2/3)</option>
            <option value="ASC-H (Cannot exclude HSIL)">ASC-H (Cannot exclude HSIL)</option>
            <option value="AGC (Atypical Glandular Cells)">AGC (Atypical Glandular Cells)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Cytological Findings / Description</label>
          <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="e.g. Superficial and intermediate squamous cells seen..." value={state.findings || ""} onChange={(e) => update("findings", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Recommendation</label>
          <input type="text" className={fieldClass} placeholder="e.g. Routine cytology screening in 3 years." value={state.recommendation || ""} onChange={(e) => update("recommendation", e.target.value)} />
        </div>
      </div>
    );
  }

  if (testType === "pbf") {
    return (
      <div className="space-y-3 max-h-[360px] overflow-y-auto p-1">
        <div>
          <label className={labelClass}>RBC Morphology</label>
          <input type="text" className={fieldClass} placeholder="e.g. Normocytic, normochromic. No target cells or sickling seen." value={state.rbc || "Normocytic, normochromic. No poikilocytosis."} onChange={(e) => update("rbc", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>WBC Series</label>
          <input type="text" className={fieldClass} placeholder="e.g. Normal count and maturation. No immature granulocytes or blasts." value={state.wbc || "Normal count and morphology. No blast cells seen."} onChange={(e) => update("wbc", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Platelets</label>
          <input type="text" className={fieldClass} placeholder="e.g. Adequate on smear, normal distribution." value={state.platelets || "Adequate on smear. Normal distribution."} onChange={(e) => update("platelets", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Haemoparasites</label>
          <input type="text" className={fieldClass} placeholder="e.g. No malaria parasites or trypanosomes seen." value={state.parasites || "No haemoparasites seen."} onChange={(e) => update("parasites", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Overall Diagnostic Impression *</label>
          <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="e.g. Normal peripheral blood smear findings." value={state.impression || "Normal peripheral blood smear."} onChange={(e) => update("impression", e.target.value)} />
        </div>
      </div>
    );
  }

  // Biopsy, FNAC, Bone Marrow
  return (
    <div className="space-y-3 max-h-[360px] overflow-y-auto p-1">
      <div>
        <label className={labelClass}>Specimen Site / Type</label>
        <input type="text" className={fieldClass} placeholder="e.g. Punch biopsy, Right breast core biopsy, Cervical punch..." value={state.specimen || ""} onChange={(e) => update("specimen", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Gross Description</label>
        <textarea rows={2} className={cn(fieldClass, "resize-none")} placeholder="e.g. Received two pieces of grey-white tissue measuring 1.2 x 0.8 cm..." value={state.gross || ""} onChange={(e) => update("gross", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Microscopic Examination</label>
        <textarea rows={3} className={cn(fieldClass, "resize-none")} placeholder="Histopathological findings, architectural and cytological features..." value={state.micro || ""} onChange={(e) => update("micro", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Pathological Impression / Diagnosis *</label>
        <textarea rows={2} className={cn(fieldClass, "resize-none font-bold text-accent")} placeholder="Final histopathological diagnosis..." value={state.diagnosis || ""} onChange={(e) => update("diagnosis", e.target.value)} />
      </div>
    </div>
  );
}
