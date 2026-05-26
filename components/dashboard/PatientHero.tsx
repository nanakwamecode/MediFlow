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
        "mb-6 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden"
      )}
    >
      {/* Neon glow element */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-accent-hover font-bold text-lg text-white shadow-lg shadow-accent/20">
          {getInitials(patient.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
            {patient.name}
            <span className="font-mono text-[0.62rem] bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-medium">
              {patient.opdNumber}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center">
            {patient.gender && (
              <span className="font-mono text-[0.68rem] text-white/50 flex items-center gap-1">
                Gender: <span className="text-white/80 font-semibold">{patient.gender}</span>
              </span>
            )}
            {patient.age && (
              <span className="font-mono text-[0.68rem] text-white/50 flex items-center gap-1">
                Age: <span className="text-white/80 font-semibold">{patient.age}</span>
              </span>
            )}
            {patient.phone && (
              <span className="font-mono text-[0.68rem] text-white/50 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="text-white/80 font-semibold">{patient.phone}</span>
              </span>
            )}
            {patient.town && (
              <span className="font-mono text-[0.68rem] text-white/50 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-white/80 font-semibold">{patient.town}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onSwitchPatient}
        className={cn(
          "relative z-10 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/10 px-4 py-2.5",
          "font-sans text-[0.75rem] font-bold text-white/90 shadow-md",
          "transition-all duration-300 hover:bg-white/20 hover:border-white/20 hover:scale-[1.03] active:scale-[0.98]"
        )}
      >
        Switch Patient
      </button>
    </div>
  );
}
