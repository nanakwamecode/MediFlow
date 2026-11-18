import type { Vitals } from "@/types";

export interface VitalsRow extends Vitals {
  patientId: string;
  ptName?: string;
  ptOpd?: string;
}

export type CreateVitalsInput = Omit<Vitals, "id" | "time"> & {
  time?: string;
};

export async function getAllVitals(): Promise<VitalsRow[]> {
  const res = await fetch("/api/vitals");
  if (!res.ok) throw new Error("Failed to fetch all vitals");
  const json = await res.json();
  return json.data;
}

export async function getVitals(patientId: string): Promise<VitalsRow[]> {
  const res = await fetch(`/api/patients/${patientId}/vitals`);
  if (!res.ok) throw new Error("Failed to fetch vitals");
  const json = await res.json();
  return json.data;
}

export async function createVitals(
  patientId: string,
  data: CreateVitalsInput
): Promise<VitalsRow> {
  const res = await fetch(`/api/patients/${patientId}/vitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to create vitals");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteVitals(
  patientId: string,
  vitalId: number
): Promise<void> {
  const res = await fetch(
    `/api/patients/${patientId}/vitals/${vitalId}`,
    { method: "DELETE" }
  );
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to delete vitals");
  }
}
