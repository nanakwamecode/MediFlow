import type { BpCategory } from "@/types";

export function classify(sys: number, dia: number): BpCategory {
  if (sys >= 180 || dia >= 120)
    return { label: "Crisis", cls: "crisis" };
  if (sys >= 130 || dia >= 80)
    return { label: "High", cls: "high" };
  if (sys >= 120)
    return { label: "Elevated", cls: "elevated" };
  return { label: "Normal", cls: "normal" };
}

export function avg(arr: number[]): number | null {
  if (!arr.length) return null;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

export function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function getInitials(name: string): string {
  return (
    (name || "?")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function genId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}

export function nowLocalISO(): string {
  const n = new Date();
  n.setMinutes(n.getMinutes() - n.getTimezoneOffset());
  return n.toISOString().slice(0, 16);
}

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { key: "patients", label: "Patients", icon: "users" },
  { key: "vitals", label: "Vitals", icon: "activity" },
  { key: "consultations", label: "Consults", icon: "stethoscope" },
  { key: "labs", label: "Laboratory", icon: "flask" },
  { key: "pharmacy", label: "Pharmacy", icon: "pill" },
  { key: "records", label: "Records", icon: "clipboard" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const PER_PAGE = 20;
