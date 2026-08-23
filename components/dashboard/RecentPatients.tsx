"use client";

import Link from "next/link";
import { useUiStore } from "@/store/uiStore";
import { getInitials } from "@/lib/constants";
import type { Patient } from "@/types";

interface Props {
  patients: Patient[];
  onLogVitalsFor: (patient: Patient) => void;
}

export default function RecentPatients({ patients, onLogVitalsFor }: Props) {
  const { viewPatient } = useUiStore();

  if (patients.length === 0) return null;

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Recent Patients</h2>
          <p className="text-xs text-ink-3">Quick access to registered outpatient charts</p>
        </div>
        <Link
          href="/mediflow/patients"
          className="flex items-center gap-1.5 text-xs font-semibold text-accent no-underline hover:text-accent-hover transition-colors"
        >
          <span>View All Patients ({patients.length})</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.slice(0, 6).map((p) => {
          const meta = [p.age ? `Age ${p.age}` : "", p.gender, p.town]
            .filter(Boolean)
            .join(" · ");

          return (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
            >
              <div>
                {/* Top row: Avatar + Name + OPD */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-accent/5 font-serif text-sm font-semibold text-accent ring-1 ring-accent/15">
                    {getInitials(p.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => viewPatient(p.id)}
                      className="cursor-pointer truncate text-sm font-semibold text-ink hover:text-accent transition-colors block text-left"
                    >
                      {p.name}
                    </button>
                    <p className="truncate text-xs text-ink-3 mt-0.5">
                      {meta || "General Patient"}
                    </p>
                  </div>
                </div>

                {/* Details Pill */}
                <div className="rounded-xl bg-bg/70 px-3 py-2 text-xs flex items-center justify-between border border-border/50">
                  <span className="font-mono text-[0.7rem] text-ink-3">
                    {p.opdNumber ? `OPD: ${p.opdNumber}` : "No OPD assigned"}
                  </span>
                  {p.phone && (
                    <span className="font-mono text-[0.7rem] text-ink-4">
                      {p.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/50">
                <button
                  onClick={() => viewPatient(p.id)}
                  className="flex-1 cursor-pointer rounded-lg bg-bg-2 py-1.5 text-center text-xs font-semibold text-ink-2 hover:bg-border transition-colors"
                >
                  View Chart
                </button>
                <button
                  onClick={() => onLogVitalsFor(p)}
                  className="flex-1 cursor-pointer rounded-lg bg-accent/10 py-1.5 text-center text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all"
                >
                  + Vitals
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
