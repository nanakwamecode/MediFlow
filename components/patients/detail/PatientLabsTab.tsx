"use client";

import { useLabs } from "@/hooks/queries/useLabs";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LabInvestigation } from "@/types";

interface Props {
  patientId: string;
  onEnterResult: (lab: { labId: number; testName: string }) => void;
  onViewResult: (lab: LabInvestigation) => void;
}

export default function PatientLabsTab({
  patientId,
  onEnterResult,
  onViewResult,
}: Props) {
  const { data: labs = [], isLoading } = useLabs(patientId);

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading lab requests…</div>;
  }

  if (labs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No lab requests yet. Click &quot;+ Lab&quot; to request one.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {labs.map((l) => (
        <div
          key={l.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="font-serif text-lg font-bold text-ink">{l.testName}</div>
              <div
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  l.status === "completed"
                    ? "bg-status-normal-bg text-status-normal border border-status-normal-border"
                    : "bg-status-elevated-bg text-status-elevated border border-amber-200"
                )}
              >
                {l.status}
              </div>
            </div>
            <div className="mb-3 flex flex-col gap-1 text-xs text-ink-3">
              <div>
                <span className="font-bold text-ink-2 mr-1">
                  Requested:
                </span>
                {formatFullDate(l.timeRequested).split(",")[0]}
              </div>
              <div>
                <span className="font-bold text-ink-2 mr-1">
                  Ordered By:
                </span>
                {l.requestedBy}
              </div>
            </div>
            {l.result && (
              <button
                onClick={() => onViewResult(l)}
                className="w-full cursor-pointer rounded-xl border border-blue-200 bg-blue-bg/80 p-3 text-left shadow-sm transition-all hover:bg-blue-bg hover:border-blue-300"
              >
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-blue">
                  Click to View Full Report
                </span>
                <span className="line-clamp-2 text-sm font-medium leading-relaxed text-ink">
                  {l.result.split("\n")[0]}
                </span>
              </button>
            )}
          </div>
          {l.status === "pending" && (
            <button
              onClick={() => onEnterResult({ labId: l.id, testName: l.testName })}
              className="mt-4 w-full cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
            >
              Enter Result
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
