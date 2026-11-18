"use client";

import { cn } from "@/lib/utils";

export interface MedEntry {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
}

interface Props {
  entry: MedEntry;
  index: number;
  total: number;
  onUpdate: (id: string, field: keyof MedEntry, value: string) => void;
  onRemove: (id: string) => void;
}

export default function MedEntryRow({ entry, index, total, onUpdate, onRemove }: Props) {
  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-card px-3 py-2",
    "text-sm font-medium text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
  );
  const labelClass = "mb-1 block text-xs font-bold text-ink-2 tracking-wide";

  return (
    <div className="rounded-xl border border-border bg-bg/60 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
          Medication #{index + 1}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="cursor-pointer text-xs font-bold text-status-high hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      <div className="mb-2.5 grid grid-cols-2 gap-2.5">
        <div>
          <label className={labelClass}>Medication Name *</label>
          <input
            type="text"
            value={entry.medication}
            onChange={(e) => onUpdate(entry.id, "medication", e.target.value)}
            placeholder="e.g. Paracetamol"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Dosage *</label>
          <input
            type="text"
            value={entry.dosage}
            onChange={(e) => onUpdate(entry.id, "dosage", e.target.value)}
            placeholder="e.g. 500mg TDS"
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Instructions</label>
        <input
          type="text"
          value={entry.instructions}
          onChange={(e) => onUpdate(entry.id, "instructions", e.target.value)}
          placeholder="e.g. Twice daily after meals for 5 days"
          className={fieldClass}
        />
      </div>
    </div>
  );
}
