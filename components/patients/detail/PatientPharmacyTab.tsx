"use client";

import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useDispensePrescription } from "@/hooks/mutations/useDispensePrescription";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  patientId: string;
}

export default function PatientPharmacyTab({ patientId }: Props) {
  const { data: meds = [], isLoading } = usePrescriptions(patientId);
  const dispensePrescriptionMut = useDispensePrescription();
  const { showToast } = useToast();

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading prescriptions…</div>;
  }

  if (meds.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No prescriptions yet. Click &quot;+ Rx&quot; to add one.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {meds.map((m) => (
        <div
          key={m.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-lg"
        >
          <div>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="font-serif text-lg font-bold text-ink">
                  {m.medication}
                </div>
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
                <span className="font-bold text-ink-2 mr-1">
                  Prescribed:
                </span>
                {formatFullDate(m.timePrescribed).split(",")[0]} by {m.prescribedBy}
              </div>
              {m.timeDispensed && (
                <div>
                  <span className="font-bold text-ink-2 mr-1">
                    Dispensed:
                  </span>
                  {formatFullDate(m.timeDispensed).split(",")[0]}
                </div>
              )}
            </div>
          </div>
          {m.status === "pending" && (
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
              className="mt-3 cursor-pointer rounded-xl bg-status-normal px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Mark as Dispensed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
