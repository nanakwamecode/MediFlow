import type { LabInvestigation } from "@/types";

export interface LabRow extends LabInvestigation {
  patientId: string;
  ptName?: string;
  ptOpd?: string;
}

export type CreateLabInput = Omit<
  LabInvestigation,
  "id" | "status" | "timeCompleted" | "result" | "timeRequested"
> & {
  timeRequested?: string;
};

export async function getAllLabs(): Promise<LabRow[]> {
  const res = await fetch("/api/labs");
  if (!res.ok) throw new Error("Failed to fetch all lab investigations");
  const json = await res.json();
  return json.data;
}

export async function getLabs(patientId: string): Promise<LabRow[]> {
  const res = await fetch(`/api/patients/${patientId}/labs`);
  if (!res.ok) throw new Error("Failed to fetch lab investigations");
  const json = await res.json();
  return json.data;
}

export async function createLab(
  patientId: string,
  data: CreateLabInput
): Promise<LabRow> {
  const res = await fetch(`/api/patients/${patientId}/labs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to create lab investigation");
  }
  const json = await res.json();
  return json.data;
}

export async function updateLabResult(
  patientId: string,
  labId: number,
  data: { result?: string; status?: "completed" | "cancelled" }
): Promise<LabRow> {
  const res = await fetch(`/api/patients/${patientId}/labs/${labId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to update lab result");
  }
  const json = await res.json();
  return json.data;
}
