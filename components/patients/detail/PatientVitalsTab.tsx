"use client";

import { useVitals } from "@/hooks/queries/useVitals";
import { useDeleteVitals } from "@/hooks/mutations/useDeleteVitals";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatFullDate } from "@/lib/constants";

interface Props {
  patientId: string;
}

export default function PatientVitalsTab({ patientId }: Props) {
  const { data: vitals = [], isLoading } = useVitals(patientId);
  const deleteVitalsMut = useDeleteVitals();
  const { showToast } = useToast();

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-medium text-ink-3">Loading vitals…</div>;
  }

  if (vitals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No vitals logged yet. Click &quot;+ Vitals&quot; to log one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/80 bg-bg-2/70">
            {["Date", "BP", "Pulse", "Temp", "Wt", "Ht", "BMI", "RR", "Notes", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-ink-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {vitals.map((v) => (
            <tr key={v.id} className="transition-colors hover:bg-bg/60">
              <td className="px-4 py-3 text-xs font-semibold text-ink-2 whitespace-nowrap">
                {formatFullDate(v.time).split(",")[0]}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-ink">
                {v.sys ?? "-"}/{v.dia ?? "-"}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-2">{v.pulse ?? "-"}</td>
              <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-2">
                {v.temperature ? `${v.temperature}°C` : "-"}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-2">
                {v.weight ? `${v.weight}kg` : "-"}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-2">
                {v.height ? `${v.height}cm` : "-"}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-bold text-ink">{v.bmi ?? "-"}</td>
              <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-2">{v.respiratoryRate ?? "-"}</td>
              <td className="px-4 py-3 text-xs font-medium text-ink-3">{v.notes || "-"}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={async () => {
                    if (confirm("Delete vitals?")) {
                      await deleteVitalsMut.mutateAsync({ patientId, vitalId: v.id });
                      showToast("Deleted", "—");
                    }
                  }}
                  className="cursor-pointer rounded-lg bg-status-high-bg px-2.5 py-1 text-xs font-bold text-status-high transition-colors hover:bg-status-high hover:text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
