"use client";

import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useDispensePrescription } from "@/hooks/mutations/useDispensePrescription";
import { useDeletePrescription } from "@/hooks/mutations/useDeletePrescription";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatDateOnly } from "@/lib/constants";
import { isDateMatch } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/common/Skeleton/Skeleton";

interface Props {
  patientId: string;
  filterDate?: string;
}

export default function PatientPharmacyTab({ patientId, filterDate = "today" }: Props) {
  const { data: meds = [], isLoading } = usePrescriptions(patientId);
  const dispensePrescriptionMut = useDispensePrescription();
  const deletePrescriptionMut = useDeletePrescription();
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

  const filteredMeds = meds.filter((m) => isDateMatch(m.timePrescribed, filterDate));

  if (filteredMeds.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No prescriptions found for the selected date. Click &quot;+ Rx&quot; to add one or adjust date filter.
      </div>
    );
  }

  const handleDelete = async (prescriptionId: number, medication: string) => {
    if (confirm(`Delete prescription for "${medication}"?`)) {
      try {
        await deletePrescriptionMut.mutateAsync({ patientId, prescriptionId });
        showToast("Prescription deleted", "✓");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to delete prescription", "⚠");
      }
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredMeds.map((m) => (
        <div
          key={m.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="font-serif text-lg font-bold text-ink">{m.medication}</div>
                <span className="mt-1 inline-block rounded-md bg-bg-2 px-2 py-0.5 text-xs font-semibold text-ink-2 border border-border">
                  {m.dosage}
                </span>
              </div>
              <div
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  m.status === "dispensed"
                    ? "bg-status-normal-bg text-status-normal border border-status-normal-border"
                    : "bg-status-crisis/10 text-status-crisis border border-status-crisis/20"
                )}
              >
                {m.status}
              </div>
            </div>
            <div className="mb-3 rounded-xl bg-bg/80 p-3 text-xs italic text-ink-2 border border-border/50">
              &quot;{m.instructions}&quot;
            </div>
            <div className="mb-3 flex flex-col gap-1 text-xs text-ink-3">
              <div>
                <span className="font-bold text-ink-2 mr-1">Prescribed:</span>
                {formatDateOnly(m.timePrescribed)} by {m.prescribedBy}
              </div>
              {m.timeDispensed && (
                <div>
                  <span className="font-bold text-ink-2 mr-1">Dispensed:</span>
                  {formatDateOnly(m.timeDispensed)}
                </div>
              )}
            </div>
          </div>
          {m.status === "pending" && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={async () => {
                  if (confirm(`Dispense ${m.medication} ${m.dosage}?`)) {
                    await dispensePrescriptionMut.mutateAsync({
                      patientId,
                      prescriptionId: m.id,
                    });
                    showToast("Dispensed", "✓");
                  }
                }}
                className="flex-1 cursor-pointer rounded-xl bg-status-normal px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Mark as Dispensed
              </button>
              <button
                type="button"
                onClick={() => handleDelete(m.id, m.medication)}
                disabled={deletePrescriptionMut.isPending}
                className="cursor-pointer rounded-xl border border-border px-3 py-2 text-xs font-bold text-ink-3 hover:text-status-high hover:border-status-high-border hover:bg-status-high-bg transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
