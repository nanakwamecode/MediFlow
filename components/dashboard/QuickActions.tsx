"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function QuickActions() {
  return (
    <div className="mb-8">
      <div className="mb-3 font-mono text-[0.62rem] tracking-[0.2em] text-ink-3 uppercase font-bold">
        Quick Access
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ShortcutCard
          title="Vitals & Triage"
          subtitle="Log patient readings"
          href="/dashboard/vitals"
          color="bg-emerald-500/10 text-emerald-600 hover:border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <ShortcutCard
          title="Consultations"
          subtitle="Diagnose & treat"
          href="/dashboard/consultations"
          color="bg-indigo-500/10 text-indigo-600 hover:border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2v2a5 5 0 0 0 10 0V2" />
              <path d="M16 7v6a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V4" />
              <circle cx="20" cy="18" r="2" />
              <path d="M20 10v6" />
            </svg>
          }
        />
        <ShortcutCard
          title="Laboratory"
          subtitle="Order & enter tests"
          href="/dashboard/labs"
          color="bg-cyan-500/10 text-cyan-600 hover:border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 2h7" />
              <path d="M10 2v7.31L4.85 18A2 2 0 0 0 6.55 21h10.9a2 2 0 0 0 1.7-3L14 9.31V2" />
              <path d="M6.5 14h11" />
            </svg>
          }
        />
        <ShortcutCard
          title="Pharmacy"
          subtitle="Dispense medication"
          href="/dashboard/pharmacy"
          color="bg-amber-500/10 text-amber-600 hover:border-amber-500/30 group-hover:bg-amber-500 group-hover:text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
              <path d="m8.5 8.5 7 7" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

interface ShortcutProps {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

function ShortcutCard({ title, subtitle, href, icon, color }: ShortcutProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center gap-4 no-underline"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className={cn("relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 shadow-inner", color)}>
        {icon}
      </div>
      <div className="relative z-10 min-w-0 flex-1">
        <div className="font-semibold text-ink text-[0.88rem] group-hover:text-accent transition-colors duration-300 leading-snug">
          {title}
        </div>
        <div className="text-[0.7rem] text-ink-3 truncate leading-normal mt-0.5">
          {subtitle}
        </div>
      </div>
      <div className="relative z-10 shrink-0 opacity-0 -translate-x-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0 text-accent">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
