"use client";

import { useVitals } from "@/hooks/queries/useVitals";
import { useDeleteVitals } from "@/hooks/mutations/useDeleteVitals";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { formatDateOnly } from "@/lib/constants";
import { isDateMatch } from "@/lib/dateUtils";
import Skeleton from "@/components/common/Skeleton/Skeleton";

interface Props {
  patientId: string;
  filterDate?: string;
}

export default function PatientVitalsTab({ patientId, filterDate = "today" }: Props) {
  const { data: vitals = [], isLoading } = useVitals(patientId);
  const deleteVitalsMut = useDeleteVitals();
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
        <div className="flex gap-4 p-2 bg-bg-2/70 rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-md" />
          ))}
        </div>
        {[1, 2, 3].map((r) => (
          <div key={r} className="flex gap-4 p-2">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <Skeleton key={c} className="h-4 flex-1 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const filteredVitals = vitals.filter((v) => isDateMatch(v.time, filterDate));

  if (filteredVitals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-2 bg-white/50 p-10 text-center text-sm font-semibold text-ink-3">
        No vitals logged for the selected date. Click &quot;+ Vitals&quot; to log one or adjust date filter.
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
          {filteredVitals.map((v) => {
            const htNote = !v.height && v.notes ? v.notes.match(/Ht\s*([0-9.]+)\s*cm/i) : null;
            const effectiveHt = v.height || (htNote ? parseFloat(htNote[1]) : vitals.find((vt) => vt.height && vt.height > 0)?.height);
            const bmiNote = !v.bmi && v.notes ? v.notes.match(/BMI\s*([0-9.]+)/i) : null;
            const bmiCalc = v.weight && effectiveHt ? +(v.weight / ((effectiveHt / 100) ** 2)).toFixed(1) : null;
            const effectiveBmi = v.bmi ?? (bmiNote ? parseFloat(bmiNote[1]) : (bmiCalc ?? "-"));

            return (
              <tr key={v.id} className="transition-colors hover:bg-bg/60">
                <td className="px-4 py-3 text-xs font-semibold text-ink-2 whitespace-nowrap">
                  {formatDateOnly(v.time)}
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
                  {effectiveHt ? `${effectiveHt}cm` : "-"}
                </td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-ink">{effectiveBmi}</td>
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
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
