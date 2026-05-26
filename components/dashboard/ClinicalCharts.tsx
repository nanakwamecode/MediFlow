"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { Patient, Vitals, Consultation, LabInvestigation, Prescription } from "@/types";

interface ChartsProps {
  activePatient: Patient | null;
  patientVitals: Vitals[];
  consultations: Record<string, Consultation[]>;
  labInvestigations: Record<string, LabInvestigation[]>;
  prescriptions: Record<string, Prescription[]>;
}

export default function ClinicalCharts({
  activePatient,
  patientVitals,
  consultations,
  labInvestigations,
  prescriptions,
}: ChartsProps) {
  const [chartMode, setChartMode] = useState<"clinic" | "patient">("clinic");

  // 1. Generate Clinic Activity Data (Last 7 Days)
  const getClinicData = () => {
    const data = [];
    const days = 7;
    const allConsults = Object.values(consultations).flat();
    const allLabs = Object.values(labInvestigations).flat();
    const allPrescriptions = Object.values(prescriptions).flat();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const shortLabel = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

      const consultsCount = allConsults.filter(
        (c) => new Date(c.time).toDateString() === dateString
      ).length;

      const labsCount = allLabs.filter(
        (l) => new Date(l.timeRequested).toDateString() === dateString
      ).length;

      const rxCount = allPrescriptions.filter(
        (p) => new Date(p.timePrescribed).toDateString() === dateString
      ).length;

      data.push({
        name: shortLabel,
        Consultations: consultsCount,
        Laboratory: labsCount,
        Pharmacy: rxCount,
      });
    }
    return data;
  };

  // 2. Generate Patient Vitals Data (Last 6 entries)
  const getPatientData = () => {
    return [...patientVitals]
      .slice(0, 6)
      .reverse()
      .map((v) => {
        const d = new Date(v.time);
        return {
          name: `${d.getDate()}/${d.getMonth() + 1}`,
          Systolic: v.sys ?? 0,
          Diastolic: v.dia ?? 0,
          Pulse: v.pulse ?? 0,
        };
      });
  };

  const clinicData = getClinicData();
  const patientData = getPatientData();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-6 flex flex-col h-[320px]">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-border/60">
        <div>
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-ink-3 uppercase block mb-1">
            Clinical Analytics
          </span>
          <h3 className="text-sm font-bold text-ink tracking-tight">
            {chartMode === "clinic" ? "Weekly Activity Breakdown" : `${activePatient?.name || "Patient"} Vitals Trend`}
          </h3>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 p-0.5 rounded-xl">
          <button
            onClick={() => setChartMode("clinic")}
            className={`cursor-pointer px-3 py-1 text-[0.68rem] font-bold rounded-lg transition-all duration-300 ${
              chartMode === "clinic" ? "bg-white text-accent shadow-sm" : "text-ink-3 hover:text-ink"
            }`}
          >
            Clinic Activity
          </button>
          <button
            disabled={!activePatient}
            onClick={() => setChartMode("patient")}
            className={`cursor-pointer px-3 py-1 text-[0.68rem] font-bold rounded-lg transition-all duration-300 ${
              !activePatient ? "opacity-50 cursor-not-allowed" : ""
            } ${
              chartMode === "patient" ? "bg-white text-accent shadow-sm" : "text-ink-3 hover:text-ink"
            }`}
          >
            Vitals History
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        {chartMode === "clinic" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clinicData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConsults" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLabs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Consultations" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsults)" />
              <Area type="monotone" dataKey="Laboratory" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLabs)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : patientData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[40, "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Systolic" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Diastolic" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Pulse" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs text-ink-3">Select a patient with recorded vitals to view chart history.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Glassmorphic Tooltip
interface TooltipPayload {
  name: string;
  value: number;
  stroke?: string;
  color?: string;
  dataKey?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl shadow-lg font-sans text-xs">
        <p className="font-mono text-[0.62rem] font-bold text-ink-3 uppercase tracking-wider mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stroke || item.color }} />
              <span className="text-ink-2 font-medium">{item.dataKey || item.name}:</span>
              <span className="font-bold text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
