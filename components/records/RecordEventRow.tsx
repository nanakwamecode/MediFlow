import { formatFullDate, getInitials } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface RecordEvent {
  type: string;
  time: string;
  ptId: string;
  ptName: string;
  detail: string;
  detail2?: string;
}

const TYPE_COLORS: Record<string, string> = {
  Vitals: "bg-status-high-bg text-status-high border border-status-high-border",
  Consultation: "bg-blue-bg text-blue border border-blue/20",
  Lab: "bg-status-elevated-bg text-status-elevated border border-amber-200",
  Prescription: "bg-status-normal-bg text-status-normal border border-status-normal-border",
};

export default function RecordEventRow({ event }: { event: RecordEvent }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-md">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-xs font-bold text-accent">
          {getInitials(event.ptName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base font-bold text-ink truncate">{event.ptName}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider shrink-0",
                TYPE_COLORS[event.type] || "bg-bg-2 text-ink-3"
              )}
            >
              {event.type}
            </span>
          </div>
          <div className="text-sm font-semibold text-ink-2 truncate">{event.detail}</div>
          {event.detail2 && <div className="text-xs font-medium text-ink-3 mt-0.5 truncate">{event.detail2}</div>}
        </div>
      </div>
      <div className="whitespace-nowrap font-mono text-xs font-semibold text-ink-3 shrink-0">
        {formatFullDate(event.time)}
      </div>
    </div>
  );
}
