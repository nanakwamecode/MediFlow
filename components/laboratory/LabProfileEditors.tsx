"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { URINE_FIELDS } from "./labTestDefinitions";

interface HepProps {
  fields: { HBsAg: string; HBsAb: string; HBeAg: string; HBeAb: string; HBcAb: string; Comment: string };
  onChange: (fields: { HBsAg: string; HBsAb: string; HBeAg: string; HBeAb: string; HBcAb: string; Comment: string }) => void;
}

export function HepProfileEditor({ fields, onChange }: HepProps) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";
  return (
    <div className="space-y-3">
      <div className="border-b border-border pb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-ink-3">
        <span>Investigation</span>
        <span className="w-1/2">Result</span>
      </div>
      {(["HBsAg", "HBsAb", "HBeAg", "HBeAb", "HBcAb"] as const).map((k) => (
        <div key={k} className="flex items-center justify-between gap-4">
          <span className="font-bold text-sm text-ink">{k}</span>
          <select
            className={cn(fieldClass, "w-1/2")}
            value={fields[k]}
            onChange={(e) => onChange({ ...fields, [k]: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="POSITIVE">POSITIVE</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
      ))}
      <div className="mt-4 border-t border-border pt-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Comment</label>
        <textarea
          value={fields.Comment}
          onChange={(e) => onChange({ ...fields, Comment: e.target.value })}
          placeholder="E.g., CHRONIC INACTIVE VIRAL HEPATITIS B INFECTION"
          rows={2}
          className={cn(fieldClass, "resize-none uppercase")}
        />
      </div>
    </div>
  );
}

interface UrineProps {
  fields: Record<string, string>;
  onChange: (fields: Record<string, string>) => void;
}

export function UrineProfileEditor({ fields, onChange }: UrineProps) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm font-medium text-ink outline-none focus:border-accent";
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 max-h-[300px] overflow-y-auto p-1">
        {URINE_FIELDS.map((k) => (
          <div key={k} className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5">
            <span className="font-bold text-xs text-ink">{k}</span>
            <input
              type="text"
              className={cn(fieldClass, "w-[55%]")}
              placeholder="Result..."
              value={fields[k] || ""}
              onChange={(e) => onChange({ ...fields, [k]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Comment</label>
        <textarea
          value={fields.Comment || ""}
          onChange={(e) => onChange({ ...fields, Comment: e.target.value })}
          placeholder="Add comments..."
          rows={2}
          className={cn(fieldClass, "resize-none")}
        />
      </div>
    </div>
  );
}

interface PanelProps {
  fields: readonly { key: string; label: string; defUnit: string; defRef: string; group?: string }[];
  state: Record<string, unknown>;
  onUpdate: (key: string, prop: string, val: string) => void;
  remarks: string;
  onRemarksChange: (val: string) => void;
}

export function QuantitativePanelEditor({ fields, state, onUpdate, remarks, onRemarksChange }: PanelProps) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-accent";
  return (
    <div className="space-y-3">
      <div className="hidden sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-3 border-b border-border pb-2 text-xs font-bold uppercase tracking-wider text-ink-3">
        <span>Test</span>
        <span>Result</span>
        <span>Flag</span>
        <span>Unit</span>
        <span>Ref Range</span>
      </div>
      <div className="flex flex-col gap-y-2 max-h-[340px] overflow-y-auto pr-1">
        {fields.map((f, i) => {
          const fieldGroup = f.group;
          const isGroupStart = fieldGroup && (i === 0 || fieldGroup !== fields[i - 1]?.group);
          const stateRow = (state[f.key] as Record<string, string>) || {};
          const result = stateRow.result ?? "";
          const flag = stateRow.flag ?? "Normal";
          const unit = stateRow.unit ?? f.defUnit;
          const ref = stateRow.ref ?? f.defRef;

          return (
            <Fragment key={f.key}>
              {fieldGroup && isGroupStart && (
                <div className="text-xs font-bold uppercase tracking-wider text-accent mt-2 border-b border-dashed border-border pb-1">
                  {fieldGroup}
                </div>
              )}
              <div className="flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_1fr] gap-1.5 sm:gap-2.5 sm:items-center pb-2 border-b border-border/50 sm:border-0">
                <span className="font-bold text-xs text-ink">{f.label}</span>
                <input type="text" className={fieldClass} placeholder="Result..." value={result} onChange={(e) => onUpdate(f.key, "result", e.target.value)} />
                <select className={fieldClass} value={flag} onChange={(e) => onUpdate(f.key, "flag", e.target.value)}>
                  <option value="Normal">Normal</option><option value="Low">Low</option><option value="High">High</option><option value="Critical">Critical</option>
                </select>
                <input type="text" className={fieldClass} value={unit} onChange={(e) => onUpdate(f.key, "unit", e.target.value)} />
                <input type="text" className={fieldClass} value={ref} onChange={(e) => onUpdate(f.key, "ref", e.target.value)} />
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="border-t border-border pt-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Remarks / Comment</label>
        <textarea value={remarks} onChange={(e) => onRemarksChange(e.target.value)} placeholder="Add remarks..." rows={2} className={cn(fieldClass, "resize-none")} />
      </div>
    </div>
  );
}
