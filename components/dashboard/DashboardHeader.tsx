"use client";

import { useAuthStore } from "@/store/authStore";

interface Props {
  onAddPatient: () => void;
  onLogVitals: () => void;
}

export default function DashboardHeader({ onAddPatient, onLogVitals }: Props) {
  const user = useAuthStore((s) => s.user);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName = user?.displayName ?? "Doctor";

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Greeting & Date */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-status-normal/10 border border-status-normal/20 px-2.5 py-0.5 text-xs font-medium text-status-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-status-normal animate-pulse" />
            Clinic Online · Active Session
          </span>
          <span className="text-xs text-ink-4">·</span>
          <span className="text-xs text-ink-3 font-mono">{today}</span>
        </div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {greeting},{" "}
          <span className="text-accent italic font-normal">{displayName}</span>
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          Here is what is happening across your outpatient clinic today.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onLogVitals}
          className="cursor-pointer flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition-all hover:bg-bg-2 hover:border-border-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-status-normal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Quick Vitals
        </button>
        <button
          onClick={onAddPatient}
          className="group flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          New Patient
        </button>
      </div>
    </div>
  );
}
