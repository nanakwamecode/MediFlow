"use client";

import Link from "next/link";
import { useUiStore } from "@/store/uiStore";
import { getInitials } from "@/lib/constants";
import type { Patient, Consultation } from "@/types";

interface Props {
  patients: Patient[];
  consultations: Record<string, Consultation[]>;
}

export default function RecentPatients({ patients, consultations }: Props) {
  const { viewPatient } = useUiStore();

  if (patients.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">
          Recent Patients
        </div>
        <Link
          href="/dashboard/patients"
          className="flex items-center gap-1 font-mono text-[0.56rem] tracking-[0.15em] text-accent no-underline uppercase transition-colors hover:text-accent-hover"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Patient cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.slice(0, 3).map((p, i) => {
          const ptConsults = consultations[p.id] || [];
          const lastConsult = ptConsults[0];
          const meta = [p.age ? `Age ${p.age}` : "", p.gender, p.town]
            .filter(Boolean)
            .join(" · ");

          return (
            <Link
              key={p.id}
              href="/dashboard/patients"
              onClick={() => viewPatient(p.id)}
              className="animate-card-enter group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-lg"
              style={{ animationDelay: `${610 + i * 70}ms` }}
            >
              {/* Top row: avatar + name */}
              <div className="mb-3.5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 font-serif text-sm font-semibold text-accent ring-1 ring-accent/10 transition-all duration-300 group-hover:ring-accent/30 group-hover:shadow-md group-hover:shadow-accent/10">
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                    {p.name}
                  </div>
                  <div className="truncate font-mono text-[0.6rem] text-ink-3">
                    {meta || "—"}
                  </div>
                </div>
                {/* Status dot */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-2 transition-colors group-hover:bg-accent/10">
                  <div className="h-2 w-2 rounded-full bg-status-normal" />
                </div>
              </div>

              {/* Last consultation */}
              <div className="rounded-lg bg-bg/60 p-3">
                {lastConsult ? (
                  <>
                    <div className="font-mono text-[0.5rem] tracking-[0.18em] text-ink-4 uppercase">
                      Last Consultation
                    </div>
                    <div className="mt-1 truncate text-[0.72rem] font-medium text-ink-2">
                      {lastConsult.diagnosis || "No diagnosis"}
                    </div>
                  </>
                ) : (
                  <div className="font-mono text-[0.6rem] text-ink-4">
                    No consultations yet
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
