"use client";

import { useMemo } from "react";
import { usePatientStore } from "@/store/patientStore";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ActivityKind = "consult" | "lab" | "prescription";

interface Activity {
  id: string;
  kind: ActivityKind;
  label: string;
  patientName: string;
  time: string;
}

const DOT_COLORS: Record<ActivityKind, string> = {
  consult: "bg-status-normal",
  lab: "bg-status-elevated",
  prescription: "bg-blue",
};

const PULSE_RING: Record<ActivityKind, string> = {
  consult: "ring-status-normal/30",
  lab: "ring-status-elevated/30",
  prescription: "ring-blue/30",
};

function buildActivities(
  patients: ReturnType<typeof usePatientStore>["patients"],
  consultations: ReturnType<typeof usePatientStore>["consultations"],
  labInvestigations: ReturnType<typeof usePatientStore>["labInvestigations"],
  prescriptions: ReturnType<typeof usePatientStore>["prescriptions"],
): Activity[] {
  const nameMap = new Map(patients.map((p) => [p.id, p.name]));
  const items: Activity[] = [];

  for (const [pid, list] of Object.entries(consultations)) {
    for (const c of list) {
      items.push({
        id: `c-${c.id}`,
        kind: "consult",
        label: `Consultation with ${c.doctorId}`,
        patientName: nameMap.get(pid) ?? "Unknown",
        time: c.time,
      });
    }
  }

  for (const [pid, list] of Object.entries(labInvestigations)) {
    for (const l of list) {
      items.push({
        id: `l-${l.id}`,
        kind: "lab",
        label: `${l.testName} ${l.status === "completed" ? "completed" : "requested"}`,
        patientName: nameMap.get(pid) ?? "Unknown",
        time: l.timeRequested,
      });
    }
  }

  for (const [pid, list] of Object.entries(prescriptions)) {
    for (const p of list) {
      items.push({
        id: `p-${p.id}`,
        kind: "prescription",
        label: `${p.medication} ${p.status === "dispensed" ? "dispensed" : "prescribed"}`,
        patientName: nameMap.get(pid) ?? "Unknown",
        time: p.timePrescribed,
      });
    }
  }

  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return items.slice(0, 5);
}

export default function ActivityFeed() {
  const { patients, consultations, labInvestigations, prescriptions } =
    usePatientStore();

  const activities = useMemo(
    () => buildActivities(patients, consultations, labInvestigations, prescriptions),
    [patients, consultations, labInvestigations, prescriptions],
  );

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-mono text-xs text-ink-4">No recent activity</p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-5 pl-5">
      {activities.map((a, i) => (
        <li
          key={a.id}
          className="relative animate-slide-up opacity-0"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* timeline line */}
          {i < activities.length - 1 && (
            <span className="absolute -left-5 top-3.5 h-full w-px border-l border-dashed border-border" />
          )}

          {/* dot */}
          <span
            className={cn(
              "absolute -left-[23px] top-1 size-2.5 rounded-full",
              DOT_COLORS[a.kind],
              i === 0 && `ring-4 ${PULSE_RING[a.kind]} animate-blink`,
            )}
          />

          {/* content */}
          <p className="text-[0.8rem] leading-snug text-ink-2">{a.label}</p>
          <p className="mt-0.5 text-xs">
            <span className="font-medium text-accent">{a.patientName}</span>
          </p>
          <time className="mt-0.5 block font-mono text-[0.55rem] text-ink-4">
            {formatFullDate(a.time)}
          </time>
        </li>
      ))}
    </ol>
  );
}
