"use client";

import Link from "next/link";
import React from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}

function ModuleCard({
  title,
  description,
  href,
  icon,
  gradientFrom,
  gradientTo,
  delay,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="animate-card-enter group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card no-underline transition-all duration-400 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/8"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/[0.04] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

      {/* Icon */}
      <div
        className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-1 text-[0.72rem] leading-relaxed text-ink-3">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute right-4 top-5 translate-x-2 text-ink-4 opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function QuickAccessGrid() {
  return (
    <div className="mb-8">
      <div className="mb-3 font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">
        Quick Access
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ModuleCard
          title="Vitals & Triage"
          description="Record BP, pulse, temperature and vitals"
          href="/mediflow/vitals"
          delay={330}
          gradientFrom="#c8392b"
          gradientTo="#e05545"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <ModuleCard
          title="Consultations"
          description="Diagnoses, symptoms & clinical notes"
          href="/mediflow/consultations"
          delay={400}
          gradientFrom="#2a5c8a"
          gradientTo="#3d7ab8"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
            </svg>
          }
        />
        <ModuleCard
          title="Laboratory"
          description="Request tests & review results"
          href="/mediflow/labs"
          delay={470}
          gradientFrom="#d4692a"
          gradientTo="#e88b4d"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />
            </svg>
          }
        />
        <ModuleCard
          title="Pharmacy"
          description="Prescriptions & dispense tracking"
          href="/mediflow/pharmacy"
          delay={540}
          gradientFrom="#2a7d4f"
          gradientTo="#3da86a"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
