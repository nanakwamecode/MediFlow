"use client";

import { cn } from "@/lib/utils";
import { CULTURE_ANTIBIOTICS, COMMON_ORGANISMS, COLONY_COUNT_OPTIONS } from "./labTestDefinitions";

export interface CultureFields {
  organisms: string;
  colonyCount: string;
  cultureIsolate: string;
  antibiogram: Record<string, "S" | "R" | "">;
  remarks: string;
}

export const EMPTY_CULTURE: CultureFields = {
  organisms: "",
  colonyCount: "",
  cultureIsolate: "",
  antibiogram: Object.fromEntries(CULTURE_ANTIBIOTICS.map((a) => [a, "" as const])),
  remarks: "",
};

interface Props {
  fields: CultureFields;
  onChange: (fields: CultureFields) => void;
}

export default function CultureSensitivityEditor({ fields, onChange }: Props) {
  const fieldClass = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent";

  const updateField = (key: keyof CultureFields, val: string) => {
    onChange({ ...fields, [key]: val });
  };

  const updateAntibiogram = (antibiotic: string, val: "S" | "R" | "") => {
    onChange({ ...fields, antibiogram: { ...fields.antibiogram, [antibiotic]: val } });
  };

  const susceptible = Object.entries(fields.antibiogram).filter(([, v]) => v === "S");
  const resistant = Object.entries(fields.antibiogram).filter(([, v]) => v === "R");

  return (
    <div className="space-y-4">
      {/* Culture Report Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-accent border-b border-dashed border-border pb-1">
          Final Culture Test Report
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-4">
            <label className="w-2/5 text-xs font-bold text-ink">Number of Organism(s)</label>
            <input
              type="text"
              className={cn(fieldClass, "w-3/5")}
              placeholder="e.g. One (1)"
              value={fields.organisms}
              onChange={(e) => updateField("organisms", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-2/5 text-xs font-bold text-ink">Total Colony Count</label>
            <select
              className={cn(fieldClass, "w-3/5")}
              value={fields.colonyCount}
              onChange={(e) => updateField("colonyCount", e.target.value)}
            >
              <option value="">Select...</option>
              {COLONY_COUNT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-2/5 text-xs font-bold text-ink">Culture Isolate</label>
            <div className="w-3/5 flex gap-2">
              <select
                className={fieldClass}
                value={COMMON_ORGANISMS.includes(fields.cultureIsolate as typeof COMMON_ORGANISMS[number]) ? fields.cultureIsolate : "_custom"}
                onChange={(e) => {
                  if (e.target.value !== "_custom") updateField("cultureIsolate", e.target.value);
                }}
              >
                <option value="">Select organism...</option>
                {COMMON_ORGANISMS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
                <option value="_custom">Other (type below)</option>
              </select>
              {!COMMON_ORGANISMS.includes(fields.cultureIsolate as typeof COMMON_ORGANISMS[number]) && fields.cultureIsolate !== "" && (
                <input
                  type="text"
                  className={cn(fieldClass, "w-1/2")}
                  placeholder="Organism..."
                  value={fields.cultureIsolate}
                  onChange={(e) => updateField("cultureIsolate", e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Antibiogram Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-accent border-b border-dashed border-border pb-1">
          Antibiogram Report {fields.cultureIsolate ? `(${fields.cultureIsolate})` : ""}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 max-h-[220px] overflow-y-auto pr-1">
          {CULTURE_ANTIBIOTICS.map((ab) => (
            <div key={ab} className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
              <span className="text-xs font-bold text-ink flex-1">{ab}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updateAntibiogram(ab, fields.antibiogram[ab] === "S" ? "" : "S")}
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-bold cursor-pointer transition-colors border",
                    fields.antibiogram[ab] === "S"
                      ? "bg-status-normal text-white border-status-normal"
                      : "bg-bg border-border text-ink-3 hover:bg-bg-2"
                  )}
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() => updateAntibiogram(ab, fields.antibiogram[ab] === "R" ? "" : "R")}
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-bold cursor-pointer transition-colors border",
                    fields.antibiogram[ab] === "R"
                      ? "bg-accent text-white border-accent"
                      : "bg-bg border-border text-ink-3 hover:bg-bg-2"
                  )}
                >
                  R
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary badges */}
      {(susceptible.length > 0 || resistant.length > 0) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {susceptible.length > 0 && (
            <span className="rounded-full bg-status-normal-bg border border-status-normal-border px-2.5 py-0.5 font-bold text-status-normal">
              S: {susceptible.length}
            </span>
          )}
          {resistant.length > 0 && (
            <span className="rounded-full bg-status-high-bg border border-status-high-border px-2.5 py-0.5 font-bold text-status-high">
              R: {resistant.length}
            </span>
          )}
        </div>
      )}

      {/* Remarks */}
      <div className="border-t border-border pt-3">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-3">Remarks</label>
        <textarea
          value={fields.remarks}
          onChange={(e) => updateField("remarks", e.target.value)}
          placeholder="Add clinical notes or limitations..."
          rows={2}
          className={cn(fieldClass, "resize-none")}
        />
      </div>
    </div>
  );
}
