"use client";

import { useLabs } from "@/hooks/queries/useLabs";
import { useDeleteLab } from "@/hooks/mutations/useDeleteLab";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatDateOnly } from "@/lib/constants";
import { isDateMatch } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/common/Skeleton/Skeleton";
import { exportLabResultsPdf } from "@/components/laboratory/LabResultPrintView";
import type { LabInvestigation, Patient } from "@/types";

interface Props {
  patientId: string;
  patient?: Patient;
  filterDate?: string;
  onEnterResult: (lab: { labId: number; testName: string }) => void;
  onViewResult: (lab: LabInvestigation) => void;
}

export default function PatientLabsTab({
  patientId,
  patient,
  filterDate = "today",
  onEnterResult,
  onViewResult,
}: Props) {
  const { data: labs = [], isLoading } = useLabs(patientId);
  const deleteLabMut = useDeleteLab();
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  const filteredLabs = labs.filter((l) => isDateMatch(l.timeRequested, filterDate));

  if (filteredLabs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No lab requests found for the selected date. Click &quot;+ Lab&quot; to order one or adjust date filter.
      </div>
    );
  }

  const handleDelete = async (labId: number, testName: string) => {
    if (confirm(`Delete requested test "${testName}"?`)) {
      try {
        await deleteLabMut.mutateAsync({ patientId, labId });
        showToast("Requested test deleted", "✓");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to delete test", "⚠");
      }
    }
  };

  const completedLabs = filteredLabs.filter((l) => l.status === "completed" && l.result);

  const handleExportCombined = () => {
    exportLabResultsPdf({
      patientName: patient?.name || "Unknown Patient",
      patientAge: patient?.age,
      patientGender: patient?.gender,
      patientOpdNumber: patient?.opdNumber,
      labs: completedLabs.map((l) => ({
        id: l.id,
        testName: l.testName,
        result: l.result || "",
        timeRequested: l.timeRequested,
        timeCompleted: l.timeCompleted,
        requestedBy: l.requestedBy,
        status: l.status,
      })),
    });
  };

  return (
    <div className="space-y-4">
      {completedLabs.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExportCombined}
            className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink transition-all hover:bg-bg-2 hover:text-accent flex items-center gap-1.5 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            {completedLabs.length > 1 ? `Export Combined PDF (${completedLabs.length})` : "Export PDF"}
          </button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredLabs.map((l) => (
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
                <span className="font-bold text-ink-2 mr-1">Requested:</span>
                {formatDateOnly(l.timeRequested)}
              </div>
              <div>
                <span className="font-bold text-ink-2 mr-1">Ordered By:</span>
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
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onEnterResult({ labId: l.id, testName: l.testName })}
                className="flex-1 cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
              >
                Enter Result
              </button>
              <button
                type="button"
                onClick={() => handleDelete(l.id, l.testName)}
                disabled={deleteLabMut.isPending}
                className="cursor-pointer rounded-xl border border-border px-3 py-2 text-xs font-bold text-ink-3 hover:text-status-high hover:border-status-high-border hover:bg-status-high-bg transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
