"use client";

import { cn } from "@/lib/utils";

export interface WidalFields {
  igm: string;
  igg: string;
  comment: string;
}

export const EMPTY_WIDAL: WidalFields = {
  igm: "",
  igg: "",
  comment: "",
};

export function generateWidalInterpretation(igm: string, igg: string): string {
  if (igm === "POSITIVE" && igg === "NEGATIVE") {
    return "ACUTE TYPHOID FEVER (EARLY / PRIMARY INFECTION)";
  }
  if (igm === "POSITIVE" && igg === "POSITIVE") {
    return "ACTIVE TYPHOID INFECTION (SECONDARY / RE-INFECTION)";
  }
  if (igm === "NEGATIVE" && igg === "POSITIVE") {
    return "PAST TYPHOID INFECTION / IMMUNITY";
  }
  if (igm === "NEGATIVE" && igg === "NEGATIVE") {
    return "NEGATIVE FOR SALMONELLA TYPHI (NO EVIDENCE OF TYPHOID FEVER)";
  }
  return "";
}

interface Props {
  fields: WidalFields;
  onChange: (fields: WidalFields) => void;
}

export default function WidalTestEditor({ fields, onChange }: Props) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";

  const handleSelect = (marker: "igm" | "igg", val: string) => {
    const next = { ...fields, [marker]: val };
    const autoComment = generateWidalInterpretation(next.igm, next.igg);
    onChange({
      ...next,
      comment: autoComment || next.comment,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-ink-3">
        <span>Investigation</span>
        <span className="w-1/2">Result</span>
      </div>

      {/* IgM Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-sm text-ink block">IgM (Salmonella typhi)</span>
          <span className="text-xs font-medium text-ink-3">Acute / Recent marker</span>
        </div>
        <select
          className={cn(fieldClass, "w-1/2 font-bold", fields.igm === "POSITIVE" ? "text-status-high" : fields.igm === "NEGATIVE" ? "text-status-normal" : "")}
          value={fields.igm}
          onChange={(e) => handleSelect("igm", e.target.value)}
        >
          <option value="">Select...</option>
          <option value="POSITIVE">POSITIVE</option>
          <option value="NEGATIVE">NEGATIVE</option>
        </select>
      </div>

      {/* IgG Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-sm text-ink block">IgG (Salmonella typhi)</span>
          <span className="text-xs font-medium text-ink-3">Past infection / Immunity</span>
        </div>
        <select
          className={cn(fieldClass, "w-1/2 font-bold", fields.igg === "POSITIVE" ? "text-status-high" : fields.igg === "NEGATIVE" ? "text-status-normal" : "")}
          value={fields.igg}
          onChange={(e) => handleSelect("igg", e.target.value)}
        >
          <option value="">Select...</option>
          <option value="POSITIVE">POSITIVE</option>
          <option value="NEGATIVE">NEGATIVE</option>
        </select>
      </div>

      {/* Clinical Interpretation / Comment */}
      <div className="mt-4 border-t border-border pt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-3">Comment</label>
          <span className="text-[10px] font-bold text-accent tracking-wide uppercase">Auto-Generated</span>
        </div>
        <textarea
          value={fields.comment}
          onChange={(e) => onChange({ ...fields, comment: e.target.value })}
          placeholder="E.G. ACUTE TYPHOID FEVER"
          rows={2}
          className={cn(fieldClass, "resize-none uppercase text-xs font-semibold")}
        />
      </div>
    </div>
  );
}
