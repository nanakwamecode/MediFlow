"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  delay: number;
}

function StatCard({ label, value, subtitle, icon, accentColor, delay }: StatCardProps) {
  return (
    <div
      className="animate-card-enter group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Left accent strip */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-[3px] rounded-l-2xl",
          accentColor
        )}
      />

      {/* Shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 animate-shimmer rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="mb-2 font-mono text-[0.56rem] tracking-[0.18em] text-ink-3 uppercase">
            {label}
          </p>
          <div
            className="animate-number-pop font-serif text-[2.2rem] leading-none text-ink"
            style={{ animationDelay: `${delay + 150}ms` }}
          >
            {value}
          </div>
          <p className="mt-1.5 font-mono text-[0.6rem] text-ink-4">{subtitle}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
            accentColor.replace("bg-", "bg-").replace(/\/\d+/, "/10"),
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface Props {
  totalPatients: number;
  totalConsultations: number;
  pendingLabs: number;
  pendingPrescriptions: number;
}

export default function StatCards({
  totalPatients,
  totalConsultations,
  pendingLabs,
  pendingPrescriptions,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Patients"
        value={totalPatients}
        subtitle="Registered"
        delay={50}
        accentColor="bg-accent"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      />
      <StatCard
        label="Consultations"
        value={totalConsultations}
        subtitle="Completed"
        delay={120}
        accentColor="bg-blue"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
          </svg>
        }
      />
      <StatCard
        label="Pending Labs"
        value={pendingLabs}
        subtitle="Awaiting results"
        delay={190}
        accentColor="bg-status-elevated"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-elevated" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />
          </svg>
        }
      />
      <StatCard
        label="Pharmacy"
        value={pendingPrescriptions}
        subtitle="Pending dispense"
        delay={260}
        accentColor="bg-status-normal"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-normal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
          </svg>
        }
      />
    </div>
  );
}
