import type { Patient } from "@/types";

interface PatientRow extends Patient {
  createdAt?: string;
}

export async function getPatients(search?: string): Promise<PatientRow[]> {
  const url = search
    ? `/api/patients?search=${encodeURIComponent(search)}`
    : "/api/patients";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch patients");
  const json = await res.json();
  return json.data;
}

export async function getPatient(id: string): Promise<PatientRow> {
  const res = await fetch(`/api/patients/${id}`);
  if (!res.ok) throw new Error("Failed to fetch patient");
  const json = await res.json();
  return json.data;
}

export async function createPatient(
  data: Omit<Patient, "id">
): Promise<PatientRow> {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to create patient");
  }
  const json = await res.json();
  return json.data;
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>
): Promise<PatientRow> {
  const res = await fetch(`/api/patients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to update patient");
  }
  const json = await res.json();
  return json.data;
}

export async function deletePatient(id: string): Promise<void> {
  const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to delete patient");
  }
}
