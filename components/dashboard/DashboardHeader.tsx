"use client";

import { useAuthStore } from "@/store/authStore";

interface Props {
  onAddPatient: () => void;
}

export default function DashboardHeader({ onAddPatient }: Props) {
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
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-[2rem] tracking-tight text-ink leading-tight">
          {greeting},{" "}
          <span className="text-accent">{displayName}</span>
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-ink-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          {today}
        </p>
      </div>

      {/* Add patient button */}
      <button
        onClick={onAddPatient}
        className="group flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:translate-y-0"
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
  );
}
