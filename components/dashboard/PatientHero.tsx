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
            <span className="font-mono text-[0.62rem] text-white/40 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="text-white/70">{patient.phone}</span>
            </span>
          )}
          {patient.town && (
            <span className="font-mono text-[0.62rem] text-white/40 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="text-white/70">{patient.town}</span>
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
