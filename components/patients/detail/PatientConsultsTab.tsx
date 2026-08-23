"use client";

import { useConsultations } from "@/hooks/queries/useConsultations";
import { formatFullDate } from "@/lib/constants";

interface Props {
  patientId: string;
}

export default function PatientConsultsTab({ patientId }: Props) {
  const { data: consults = [], isLoading } = useConsultations(patientId);

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading consultations…</div>;
  }

  if (consults.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No consultations yet. Click &quot;+ Consult&quot; to add one.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {consults.map((c) => (
        <div
          key={c.id}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-blue opacity-80" />
          <div className="mb-3 flex items-start justify-between">
            <div className="font-serif text-lg font-semibold text-ink">
              {c.diagnosis || "No Diagnosis Specified"}
            </div>
            <div className="rounded-full bg-bg-2 px-3 py-1 font-mono text-xs font-semibold text-ink-3 border border-border">
              {formatFullDate(c.time).split(",")[0]}
            </div>
          </div>
          <div className="mb-2 flex items-start gap-2 text-sm text-ink-2">
            <span className="rounded bg-ink/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink-3">
              Symptoms
            </span>
            <span className="flex-1 font-medium">{c.symptoms || "—"}</span>
          </div>
          <div className="mb-3 flex items-center gap-2 text-sm text-ink-2">
            <span className="rounded bg-ink/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink-3">
              Doctor
            </span>
            <span className="font-bold text-ink">{c.doctorId}</span>
          </div>
          {c.notes && (
            <div className="rounded-xl bg-amber-50/70 p-3.5 text-xs text-ink-2 border border-amber-200 leading-relaxed font-medium">
              <span className="block font-bold text-amber-900 mb-1">Clinical Notes:</span>
              {c.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
