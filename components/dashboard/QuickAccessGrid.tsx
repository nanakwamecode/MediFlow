"use client";

import Link from "next/link";
import React from "react";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
}

function QuickAction({ title, description, href, icon, tag }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-card no-underline transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-2 text-ink-2 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
            {icon}
          </div>
          <span className="rounded-full bg-bg-2 px-2 py-0.5 text-[0.65rem] font-mono text-ink-4 group-hover:text-ink-3">
            {tag}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-ink transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-1 text-xs text-ink-3 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
        <span>Open Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function QuickAccessGrid() {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Clinical Workflows</h2>
        <span className="text-xs text-ink-4">Direct departmental access</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          title="Triage & Vitals"
          description="Log blood pressure, pulse, temp, weight and BMI metrics"
          href="/mediflow/vitals"
          tag="Triage"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <QuickAction
          title="Doctor Consultations"
          description="Record clinical impressions, differential diagnoses & notes"
          href="/mediflow/consultations"
          tag="OPD"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
            </svg>
          }
        />
        <QuickAction
          title="Laboratory"
          description="Order diagnostic blood, urine, or organ function panels"
          href="/mediflow/labs"
          tag="Diagnostic"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" />
            </svg>
          }
        />
        <QuickAction
          title="Pharmacy"
          description="Manage drug dispensing and prescription fulfillment"
          href="/mediflow/pharmacy"
          tag="Dispensary"
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
