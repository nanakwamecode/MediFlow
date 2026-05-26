"use client";

import { cn } from "@/lib/utils";

interface KpiProps {
  totalPatients: number;
  totalConsultations: number;
  pendingLabs: number;
  pendingPharmacy: number;
}

export default function KpiMetrics({
  totalPatients,
  totalConsultations,
  pendingLabs,
  pendingPharmacy,
}: KpiProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <KpiCard
        label="Registered Patients"
        value={totalPatients}
        subtitle="Total active database"
        trend="+14% this month"
        trendType="up"
        gradient="from-indigo-500/10 to-indigo-500/0 hover:border-indigo-500/30"
        iconBg="bg-indigo-50 text-indigo-600"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      />
      <KpiCard
        label="Consultations"
        value={totalConsultations}
        subtitle="Completed visits"
        trend="8 completed today"
        trendType="neutral"
        gradient="from-emerald-500/10 to-emerald-500/0 hover:border-emerald-500/30"
        iconBg="bg-emerald-50 text-emerald-600"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 2v2a5 5 0 0 0 10 0V2" />
            <path d="M16 7v6a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V4" />
            <circle cx="20" cy="18" r="2" />
            <path d="M20 10v6" />
          </svg>
        }
      />
      <KpiCard
        label="Pending Labs"
        value={pendingLabs}
        subtitle="In-progress tests"
        trend={pendingLabs > 0 ? "Requires action" : "All caught up"}
        trendType={pendingLabs > 0 ? "warning" : "success"}
        gradient="from-cyan-500/10 to-cyan-500/0 hover:border-cyan-500/30"
        iconBg="bg-cyan-50 text-cyan-600"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 2h7" />
            <path d="M10 2v7.31L4.85 18A2 2 0 0 0 6.55 21h10.9a2 2 0 0 0 1.7-3L14 9.31V2" />
            <path d="M6.5 14h11" />
          </svg>
        }
      />
      <KpiCard
        label="Pending Pharmacy"
        value={pendingPharmacy}
        subtitle="Active prescriptions"
        trend={pendingPharmacy > 0 ? `${pendingPharmacy} awaiting dispense` : "Empty queue"}
        trendType={pendingPharmacy > 0 ? "danger" : "success"}
        gradient="from-amber-500/10 to-amber-500/0 hover:border-amber-500/30"
        iconBg="bg-amber-50 text-amber-600"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
            <path d="m8.5 8.5 7 7" />
          </svg>
        }
      />
    </div>
  );
}

interface CardProps {
  label: string;
  value: number | string;
  subtitle: string;
  trend: string;
  trendType: "up" | "neutral" | "warning" | "danger" | "success";
  gradient: string;
  iconBg: string;
  icon: React.ReactNode;
}

function KpiCard({
  label,
  value,
  subtitle,
  trend,
  trendType,
  gradient,
  iconBg,
  icon,
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        "bg-gradient-to-br from-transparent to-transparent",
        gradient
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-ink-3 uppercase block mb-1">
            {label}
          </span>
          <span className="text-3xl font-bold tracking-tight text-ink">{value}</span>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 shadow-sm", iconBg)}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <span className="text-[0.72rem] text-ink-3 font-medium">{subtitle}</span>
        <span
          className={cn(
            "font-mono text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
            trendType === "up" && "bg-emerald-50 text-emerald-600 border border-emerald-100",
            trendType === "neutral" && "bg-slate-50 text-slate-600 border border-slate-100",
            trendType === "success" && "bg-emerald-50 text-emerald-600 border border-emerald-100",
            trendType === "warning" && "bg-amber-50 text-amber-600 border border-amber-100",
            trendType === "danger" && "bg-red-50 text-red-600 border border-red-100"
          )}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
