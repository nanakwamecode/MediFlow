export function todayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toLocalDateString(iso: string | Date | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** All recognised range-based filter keys */
export type DateRangeKey = "1w" | "2w" | "1m" | "3m" | "6m" | "1y" | "lastyear";

const RANGE_KEYS = new Set<string>(["1w", "2w", "1m", "3m", "6m", "1y", "lastyear"]);

/** Returns the start-of-day Date for a given range key relative to today. */
function rangeStartDate(key: DateRangeKey): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  switch (key) {
    case "1w":
      now.setDate(now.getDate() - 7);
      return now;
    case "2w":
      now.setDate(now.getDate() - 14);
      return now;
    case "1m":
      now.setMonth(now.getMonth() - 1);
      return now;
    case "3m":
      now.setMonth(now.getMonth() - 3);
      return now;
    case "6m":
      now.setMonth(now.getMonth() - 6);
      return now;
    case "1y":
      now.setFullYear(now.getFullYear() - 1);
      return now;
    case "lastyear": {
      const year = new Date().getFullYear() - 1;
      return new Date(year, 0, 1);
    }
  }
}

function rangeEndDate(key: DateRangeKey): Date {
  if (key === "lastyear") {
    const year = new Date().getFullYear() - 1;
    return new Date(year, 11, 31, 23, 59, 59, 999);
  }
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isDateMatch(
  iso: string | Date | null | undefined,
  filterDate: string
): boolean {
  if (!filterDate || filterDate === "all") return true;
  if (!iso) return false;

  // Range-based filters
  if (RANGE_KEYS.has(filterDate)) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return false;
    const start = rangeStartDate(filterDate as DateRangeKey);
    const end = rangeEndDate(filterDate as DateRangeKey);
    return d >= start && d <= end;
  }

  // Single-day match (today or specific YYYY-MM-DD)
  const target = filterDate === "today" ? todayDateString() : filterDate;
  return toLocalDateString(iso) === target;
}

/** Human label for each filter option */
export const DATE_FILTER_OPTIONS: { key: string; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "1w", label: "Last Week" },
  { key: "2w", label: "2 Weeks" },
  { key: "1m", label: "1 Month" },
  { key: "3m", label: "3 Months" },
  { key: "6m", label: "6 Months" },
  { key: "1y", label: "1 Year" },
  { key: "lastyear", label: "Last Year" },
  { key: "all", label: "All Time" },
];

export function formatFilterDateLabel(filterDate: string): string {
  if (!filterDate || filterDate === "all") return "All Time";

  // Check range-based labels
  const option = DATE_FILTER_OPTIONS.find((o) => o.key === filterDate);
  if (option) return option.label;

  // Specific date
  const target = filterDate === "today" ? todayDateString() : filterDate;
  const today = todayDateString();
  const [y, m, d] = target.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formatted = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (target === today) return `Today (${formatted})`;
  return formatted;
}
