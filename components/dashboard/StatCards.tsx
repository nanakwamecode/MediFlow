"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  href: string;
  badge?: string;
  badgeType?: "default" | "alert" | "success";
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({
  label,
  value,
  subtitle,
  href,
  badge,
  badgeType = "default",
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg no-underline flex flex-col justify-between"
    >
      {/* Top row: Label + Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-3 group-hover:text-ink transition-colors">
          {label}
        </span>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            iconBg
          )}
        >
          {icon}
        </div>
      </div>

      {/* Metric value */}
      <div className="mt-4">
        <div className="font-serif text-3xl font-medium tracking-tight text-ink group-hover:text-accent transition-colors">
          {value}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-ink-4">{subtitle}</span>
          {badge && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.65rem] font-mono font-medium",
                badgeType === "alert"
                  ? "bg-status-crisis/10 text-status-crisis border border-status-crisis/20"
                  : badgeType === "success"
                  ? "bg-status-normal/10 text-status-normal border border-status-normal/20"
                  : "bg-bg-2 text-ink-3"
              )}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </Link>
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
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Registered Patients"
        value={totalPatients}
        subtitle="Total patient records"
        href="/mediflow/patients"
        iconBg="bg-accent/10 text-accent"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      />
      <StatCard
        label="Consultations"
        value={totalConsultations}
        subtitle="Clinical encounters logged"
        href="/mediflow/consultations"
        iconBg="bg-blue-bg text-blue"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
          </svg>
        }
      />
      <StatCard
        label="Pending Labs"
        value={pendingLabs}
        subtitle="Awaiting lab results"
        href="/mediflow/labs"
        badge={pendingLabs > 0 ? "Action Needed" : "All Clear"}
        badgeType={pendingLabs > 0 ? "alert" : "success"}
        iconBg="bg-amber-50 text-amber-600"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />
          </svg>
        }
      />
      <StatCard
        label="Pharmacy Queue"
        value={pendingPrescriptions}
        subtitle="Awaiting dispensing"
        href="/mediflow/pharmacy"
        badge={pendingPrescriptions > 0 ? "Dispense" : "Completed"}
        badgeType={pendingPrescriptions > 0 ? "alert" : "success"}
        iconBg="bg-status-normal/10 text-status-normal"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
          </svg>
        }
      />
    </div>
  );
}
