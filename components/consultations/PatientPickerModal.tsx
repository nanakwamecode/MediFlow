"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { usePatients } from "@/hooks/queries/usePatients";
import { getInitials } from "@/lib/constants";

interface Props {
  onSelect: (id: string, name: string) => void;
  onClose: () => void;
}

export default function PatientPickerModal({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const { data: patients = [], isLoading } = usePatients(search || undefined);

  return (
    <Modal open={true} onClose={onClose} title="Select Patient" maxWidth="max-w-md">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients by name or OPD number…"
        className="mb-3.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
      />
      <div className="max-h-[320px] space-y-1.5 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-xs font-semibold text-ink-3">Loading patients…</div>
        ) : patients.length === 0 ? (
          <div className="p-4 text-center text-xs font-semibold text-ink-3">No patients found</div>
        ) : (
          patients.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id, p.name)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-bg-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                {getInitials(p.name)}
              </div>
              <div>
                <div className="text-sm font-bold text-ink">{p.name}</div>
                <div className="font-mono text-xs font-medium text-ink-3">
                  {[p.age ? `Age ${p.age}` : "", p.gender, p.opdNumber ? `(${p.opdNumber})` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
