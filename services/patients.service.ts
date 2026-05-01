import type { Patient, Vitals } from "@/types";

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patients");
  if (!res.ok) throw new Error("Failed to fetch patients");
  const json = await res.json();
  return json.data;
}

export async function getPatient(id: string): Promise<Patient> {
  const res = await fetch(`/api/patients/${id}`);
  if (!res.ok) throw new Error("Failed to fetch patient");
  const json = await res.json();
  return json.data;
}

export async function createPatient(data: Omit<Patient, "id" | "createdAt">): Promise<Patient> {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  const json = await res.json();
  return json.data;
}

export async function updatePatient({ id, data }: { id: string; data: Partial<Patient> }): Promise<Patient> {
  const res = await fetch(`/api/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update patient");
  const json = await res.json();
  return json.data;
}

export async function deletePatient(id: string): Promise<void> {
  const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete patient");
}

export async function getVitals(patientId: string): Promise<Vitals[]> {
  const res = await fetch(`/api/patients/${patientId}/vitals`);
  if (!res.ok) throw new Error("Failed to fetch vitals");
  const json = await res.json();
  return json.data;
}

export async function getAllVitals(): Promise<(Vitals & { ptName: string; ptOpd: string | null })[]> {
  const res = await fetch("/api/vitals");
  if (!res.ok) throw new Error("Failed to fetch all vitals");
  const json = await res.json();
  return json.data;
}

export async function createVitals({ patientId, data }: { patientId: string; data: Omit<Vitals, "id" | "time"> & { time?: string } }): Promise<Vitals> {
  const res = await fetch(`/api/patients/${patientId}/vitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create vitals");
  const json = await res.json();
  return json.data;
}

export async function deleteVital({ patientId, vitalId }: { patientId: string; vitalId: number }): Promise<void> {
  const res = await fetch(`/api/patients/${patientId}/vitals/${vitalId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vital");
}
