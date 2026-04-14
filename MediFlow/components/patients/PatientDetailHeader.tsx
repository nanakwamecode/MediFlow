import { getInitials } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types";
import React from "react";

interface Props {
  patient: Patient;
}

const ICONS: Record<string, React.ReactNode> = {
  OPD: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="8" cy="16" r="6"/><path d="M9.5 17.5 8 16.25V14"/></svg>,
  Age: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>,
  Gender: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  Phone: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Location: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  DOB: <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
};

export default function PatientDetailHeader({ patient }: Props) {
  const fields = [
    patient.opdNumber && { label: "OPD", value: patient.opdNumber },
    patient.age && { label: "Age", value: `${patient.age} yrs` },
    patient.gender && { label: "Gender", value: patient.gender },
    patient.phone && { label: "Phone", value: patient.phone },
    patient.town && { label: "Location", value: patient.town },
    patient.dob && { label: "DOB", value: patient.dob },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink-2 text-white shadow-xl ring-1 ring-ink/5">
      <div className="relative p-7 sm:p-8">
        {/* Decorative background element */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white opacity-[0.03] blur-3xl"></div>
        
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-b from-accent to-accent-hover font-serif text-3xl text-white",
              "shadow-[0_0_0_4px_rgba(255,255,255,0.1)] ring-1 ring-white/20"
            )}
          >
            {getInitials(patient.name)}
          </div>
          
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-4xl font-normal tracking-tight text-white drop-shadow-md">
              {patient.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {fields.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="text-white/50">{ICONS[f.label]}</span>
                  <span className="font-mono text-[0.68rem] font-medium tracking-wide text-white/90">
                    <span className="opacity-50 mr-1">{f.label}:</span>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {patient.notes && (
          <div className="mt-7 rounded-xl bg-black/20 p-4 ring-1 ring-white/10 backdrop-blur-md">
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.25em] text-white/40 uppercase">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/80"></span>
              Medical Notes
            </div>
            <div className="text-[0.8rem] leading-relaxed text-white/80 font-light">
              {patient.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
