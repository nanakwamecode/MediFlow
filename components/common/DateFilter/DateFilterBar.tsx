"use client";

import { cn } from "@/lib/utils";
import { todayDateString, formatFilterDateLabel } from "@/lib/dateUtils";

interface Props {
  selectedDate: string; // "today" | "all" | "YYYY-MM-DD"
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
  const isToday = selectedDate === "today" || selectedDate === todayDateString();
  const isAll = selectedDate === "all";
  const activeDateValue = selectedDate === "today" || selectedDate === "all" ? todayDateString() : selectedDate;

  const handlePrevDay = () => {
    const current = selectedDate === "all" || selectedDate === "today" ? todayDateString() : selectedDate;
    const [y, m, d] = current.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d - 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const current = selectedDate === "all" || selectedDate === "today" ? todayDateString() : selectedDate;
    const [y, m, d] = current.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d + 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    onDateChange(`${year}-${month}-${day}`);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-border bg-card p-2 sm:p-2.5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-bg/60 p-1">
          <button
            type="button"
            onClick={() => onDateChange("today")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              isToday
                ? "bg-accent text-white shadow-sm"
                : "text-ink-3 hover:text-ink hover:bg-card"
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onDateChange("all")}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              isAll
                ? "bg-accent text-white shadow-sm"
                : "text-ink-3 hover:text-ink hover:bg-card"
            )}
          >
            All Dates
          </button>
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
        <span className="text-xs font-semibold text-ink-3">
          Filter: <strong className="text-ink">{formatFilterDateLabel(selectedDate)}</strong>
        </span>
        {badgeText && (
          <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent font-mono">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
