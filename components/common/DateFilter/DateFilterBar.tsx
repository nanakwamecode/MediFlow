"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  todayDateString,
  formatFilterDateLabel,
  DATE_FILTER_OPTIONS,
} from "@/lib/dateUtils";

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
  className?: string;
  badgeText?: string;
}

export default function DateFilterBar({
  selectedDate,
  onDateChange,
  className,
  badgeText,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isSpecificDate =
    selectedDate !== "today" &&
    selectedDate !== "all" &&
    !DATE_FILTER_OPTIONS.some((o) => o.key === selectedDate);

  const activeDateValue =
    selectedDate === "today" || selectedDate === "all"
      ? todayDateString()
      : isSpecificDate
        ? selectedDate
        : todayDateString();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePrevDay = () => {
    const current = isSpecificDate ? selectedDate : todayDateString();
    const [y, m, d] = current.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d - 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const current = isSpecificDate ? selectedDate : todayDateString();
    const [y, m, d] = current.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d + 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
  };

  const activeLabel = formatFilterDateLabel(selectedDate);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-border bg-card p-2 sm:p-2.5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Compact dropdown trigger */}
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-xl border border-border",
              "bg-bg/60 px-3 py-1.5 text-xs font-bold transition-all",
              "hover:bg-card hover:border-accent/30",
              open && "border-accent/40 bg-card shadow-sm"
            )}
          >
            <span className="text-accent">{activeLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "h-3 w-3 text-ink-3 transition-transform",
                open && "rotate-180"
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-border bg-card p-1 shadow-lg animate-fade-in">
              {DATE_FILTER_OPTIONS.map((opt) => {
                const isActive = selectedDate === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onDateChange(opt.key);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-xs font-bold transition-all",
                      isActive
                        ? "bg-accent text-white"
                        : "text-ink-2 hover:bg-bg-2 hover:text-ink"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date picker with prev/next */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1">
          <button
            type="button"
            onClick={handlePrevDay}
            title="Previous Day"
            className="cursor-pointer rounded p-1 text-ink-3 hover:bg-bg-2 hover:text-ink transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <input
            type="date"
            value={activeDateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="cursor-pointer border-0 bg-transparent text-xs font-bold text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleNextDay}
            title="Next Day"
            className="cursor-pointer rounded p-1 text-ink-3 hover:bg-bg-2 hover:text-ink transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {badgeText && (
          <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent font-mono">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
