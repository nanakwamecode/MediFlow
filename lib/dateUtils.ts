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

export function isDateMatch(
  iso: string | Date | null | undefined,
  filterDate: string
): boolean {
  if (!filterDate || filterDate === "all") return true;
  if (!iso) return false;
  const target = filterDate === "today" ? todayDateString() : filterDate;
  return toLocalDateString(iso) === target;
}

export function formatFilterDateLabel(filterDate: string): string {
  if (!filterDate || filterDate === "all") return "All Dates";
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
