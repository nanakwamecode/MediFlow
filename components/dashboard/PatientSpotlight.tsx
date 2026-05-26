"use client";

import { cn } from "@/lib/utils";
import type { Patient, Vitals } from "@/types";
import { formatFullDate, classify } from "@/lib/constants";

interface SpotlightProps {
  patient: Patient;
  patientVitals: Vitals[];
  onLogVitals: () => void;
}

export default function PatientSpotlight({
  patient,
  patientVitals,
  onLogVitals,
}: SpotlightProps) {
  const latestVitals = patientVitals[0]; // Vitals are pre-sorted in reverse chronological order
  const bpStatus = latestVitals?.sys && latestVitals?.dia ? classify(latestVitals.sys, latestVitals.dia) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm relative overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-border/60">
        <div>
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-ink-3 uppercase block mb-1">
            Active Patient Spotlight
          </span>
          <h3 className="text-lg font-bold text-ink tracking-tight">
            {patient.name}
          </h3>
        </div>
        <button
          onClick={onLogVitals}
          className="cursor-pointer text-[0.72rem] font-bold text-accent bg-accent/5 border border-accent/15 px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-sm"
        >
          + Log Vitals
        </button>
      </div>

      {/* Info Grid */}
      {latestVitals ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <VitalGauge
              label="Blood Pressure"
              value={`${latestVitals.sys}/${latestVitals.dia}`}
              unit="mmHg"
              status={bpStatus?.label}
              statusClass={
                bpStatus?.cls === "normal"
                  ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                  : bpStatus?.cls === "elevated"
                  ? "text-amber-600 bg-amber-50 border-amber-100"
                  : bpStatus?.cls === "high"
                  ? "text-red-600 bg-red-50 border-red-100"
                  : "text-red-800 bg-red-100 border-red-200"
              }
            />
            <VitalGauge
              label="Pulse Rate"
              value={latestVitals.pulse}
              unit="bpm"
              status={latestVitals.pulse ? (latestVitals.pulse > 100 || latestVitals.pulse < 60 ? "Abnormal" : "Normal") : undefined}
              statusClass={
                latestVitals.pulse
                  ? latestVitals.pulse > 100 || latestVitals.pulse < 60
                    ? "text-amber-600 bg-amber-50 border-amber-100"
                    : "text-emerald-600 bg-emerald-50 border-emerald-100"
                  : ""
              }
            />
            <VitalGauge
              label="Temperature"
              value={latestVitals.temperature ? `${latestVitals.temperature}°C` : undefined}
              unit="Celsius"
              status={latestVitals.temperature ? (latestVitals.temperature >= 37.8 || latestVitals.temperature < 35.5 ? "Fever" : "Normal") : undefined}
              statusClass={
                latestVitals.temperature
                  ? latestVitals.temperature >= 37.8 || latestVitals.temperature < 35.5
                    ? "text-red-600 bg-red-50 border-red-100"
                    : "text-emerald-600 bg-emerald-50 border-emerald-100"
                  : ""
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4">
            <div>
              <span className="block text-[0.68rem] text-ink-3 font-medium">Height & Weight</span>
              <span className="text-xs font-semibold text-ink mt-0.5 block">
                {latestVitals.height ? `${latestVitals.height} cm` : "—"} / {latestVitals.weight ? `${latestVitals.weight} kg` : "—"}
              </span>
            </div>
            <div>
              <span className="block text-[0.68rem] text-ink-3 font-medium">Body Mass Index (BMI)</span>
              <span className="text-xs font-semibold text-ink mt-0.5 block">
                {latestVitals.bmi ? `${latestVitals.bmi} kg/m²` : "—"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[0.65rem] text-ink-3 mb-1.5 font-medium">
              <span>Clinical Snapshot Notes</span>
              <span className="font-mono text-[0.58rem]">{formatFullDate(latestVitals.time)}</span>
            </div>
            <div className="text-xs text-ink-2 bg-slate-50 border border-slate-100 p-3 rounded-xl min-h-[50px] leading-relaxed">
              {latestVitals.notes || "No additional logs noted for this record."}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-ink-4 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="text-xs font-bold text-ink">No Vitals Recorded</span>
          <p className="text-[0.7rem] text-ink-3 max-w-[200px] mt-1">
            There are no triage vitals recorded yet for {patient.name}.
          </p>
        </div>
      )}
    </div>
  );
}

interface GaugeProps {
  label: string;
  value?: string | number;
  unit: string;
  status?: string;
  statusClass?: string;
}

function VitalGauge({ label, value, unit, status, statusClass }: GaugeProps) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
      <div>
        <span className="block text-[0.58rem] font-bold text-ink-3 uppercase tracking-wider mb-1.5">
          {label}
        </span>
        <span className="text-base font-bold text-ink tracking-tight block">
          {value || "—"}
        </span>
      </div>
      <div className="mt-2.5">
        {status ? (
          <span className={cn("inline-block font-mono text-[0.58rem] font-bold px-2 py-0.5 rounded-full border", statusClass)}>
            {status}
          </span>
        ) : (
          <span className="text-[0.62rem] text-ink-4 font-medium">{unit}</span>
        )}
      </div>
    </div>
  );
}
