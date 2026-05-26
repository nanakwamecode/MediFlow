"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default function PinGate({ children }: Props) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check session storage on mount
    const verified = sessionStorage.getItem("mediflow_pin_verified");
    setIsVerified(verified === "true");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.trim() === "MDF0011") {
      sessionStorage.setItem("mediflow_pin_verified", "true");
      setIsVerified(true);
    } else {
      setError("Invalid security PIN. Access denied.");
    }
  };

  // Prevent flash during mount / hydration check
  if (isVerified === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="animate-fade-in flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Security Icon */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent ring-4 ring-accent/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="font-serif text-2xl font-semibold text-ink">
            Access Restricted
          </h2>
          <p className="mt-2 text-xs text-ink-3">
            This module contains protected medical information. Please enter the security PIN to verify access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="ENTER PIN"
              value={pin}
              onChange={(e) => {
                setError(null);
                setPin(e.target.value.toUpperCase());
              }}
              className={cn(
                "w-full rounded-xl border-[1.5px] border-border bg-bg px-4 py-3.5 text-center font-mono text-lg tracking-widest text-ink outline-none transition-all",
                "placeholder:text-ink-4/50 focus:border-accent focus:shadow-[0_0_0_4px_rgba(200,57,43,0.08)]",
                error && "border-status-high focus:border-status-high focus:shadow-[0_0_0_4px_rgba(200,57,43,0.12)]"
              )}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-status-high-border bg-status-high-bg/60 p-3 text-xs text-status-high animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-status-high"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!pin.trim()}
            className={cn(
              "w-full cursor-pointer rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all",
              "hover:-translate-y-px hover:bg-accent-hover hover:shadow-md active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Verify Pin
          </button>
        </form>
      </div>
    </div>
  );
}
