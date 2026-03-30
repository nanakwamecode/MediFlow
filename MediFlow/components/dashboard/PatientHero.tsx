"use client";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/constants";
import type { Patient } from "@/types";

interface Props {
  patient: Patient;
  onSwitchPatient: () => void;
}

export default function PatientHero({ patient, onSwitchPatient }: Props) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-3.5 rounded-lg bg-ink p-5 text-white shadow-lg"
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/30 font-serif text-xl text-red-300">
        {getInitials(patient.name)}
      </div>
      <div className="flex-1">
        <div className="font-serif text-xl text-white">{patient.name}</div>
        <div className="mt-1 flex flex-wrap gap-3">
          {patient.age && (
            <span className="font-mono text-[0.62rem] text-white/40">
              Age <span className="text-white/70">{patient.age}</span>
            </span>
          )}
          {patient.phone && (
            <span className="font-mono text-[0.62rem] text-white/40">
              📞 <span className="text-white/70">{patient.phone}</span>
            </span>
          )}
          {patient.town && (
            <span className="font-mono text-[0.62rem] text-white/40">
              📍 <span className="text-white/70">{patient.town}</span>
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onSwitchPatient}
        className={cn(
          "cursor-pointer rounded-lg border border-white/15 bg-white/8 px-3.5 py-1.5",
          "font-sans text-[0.7rem] font-semibold text-white/60",
          "transition-colors hover:bg-white/12 hover:text-white/80"
        )}
      >
        Switch Patient
      </button>
    </div>
  );
}
