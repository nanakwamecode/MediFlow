"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getInitials, classify } from "@/lib/constants";
import { useUiStore } from "@/store/uiStore";
import type { Patient, Consultation, Vitals } from "@/types";

interface PatientPreviewCardProps {
  patient: Patient;
  lastConsultation?: Consultation;
  latestVitals?: Vitals;
}

const STATUS_DOT: Record<string, string> = {
  normal: "bg-status-normal",
  elevated: "bg-status-elevated",
  high: "bg-status-high",
  crisis: "bg-status-crisis",
};

function daysAgo(iso: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 86_400_000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export default function PatientPreviewCard({
  patient,
  lastConsultation,
  latestVitals,
}: PatientPreviewCardProps) {
  const { viewPatient } = useUiStore();

  const meta = [patient.age, patient.gender, patient.town]
    .filter(Boolean)
    .join(" · ");

  const bp =
    latestVitals?.sys && latestVitals?.dia
      ? classify(latestVitals.sys, latestVitals.dia)
      : null;

  const lastSeen = lastConsultation?.time ?? latestVitals?.time;

  return (
    <Link
      href="/mediflow/patients"
      onClick={() => viewPatient(patient.id)}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl bg-card p-4",
        "ring-1 ring-border transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:ring-accent/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center",
            "rounded-full bg-gradient-to-br from-accent/20 to-accent/5"
          )}
        >
          <span className="font-serif text-sm font-bold text-accent">
            {getInitials(patient.name)}
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-ink transition-colors group-hover:text-accent">
            {patient.name}
          </p>
          {meta && (
            <p className="font-mono text-[0.6rem] uppercase tracking-wide text-ink-3">
              {meta}
            </p>
          )}
        </div>
      </div>

      {/* Vitals strip */}
      {latestVitals && (
        <div className="flex items-center gap-3 font-mono text-[0.65rem] text-ink-3">
          {bp && (
            <span className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[bp.cls])} />
              {latestVitals.sys}/{latestVitals.dia}
            </span>
          )}
          {latestVitals.pulse && <span>P {latestVitals.pulse}</span>}
          {latestVitals.temperature && <span>T {latestVitals.temperature}°</span>}
        </div>
      )}

      {/* Diagnosis */}
      {lastConsultation?.diagnosis && (
        <p className="truncate text-xs text-ink-2">
          {lastConsultation.diagnosis}
        </p>
      )}

      {/* Last seen */}
      {lastSeen && (
        <p className="mt-auto border-t border-border pt-2 font-mono text-[0.6rem] text-ink-4">
          Last seen: {daysAgo(lastSeen)}
        </p>
      )}
    </Link>
  );
}
