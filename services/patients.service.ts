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

export async function getConsultations(patientId: string): Promise<any[]> {
  const res = await fetch(`/api/patients/${patientId}/consultations`);
  if (!res.ok) throw new Error("Failed to fetch consultations");
  const json = await res.json();
  return json.data;
}

export async function createConsultation({ patientId, data }: { patientId: string; data: any }): Promise<any> {
  const res = await fetch(`/api/patients/${patientId}/consultations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create consultation");
  const json = await res.json();
  return json.data;
}

export async function getLabs(patientId: string): Promise<any[]> {
  const res = await fetch(`/api/patients/${patientId}/labs`);
  if (!res.ok) throw new Error("Failed to fetch labs");
  const json = await res.json();
  return json.data;
}

export async function createLab({ patientId, data }: { patientId: string; data: any }): Promise<any> {
  const res = await fetch(`/api/patients/${patientId}/labs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to request lab");
  const json = await res.json();
  return json.data;
}

export async function enterLabResult({ patientId, labId, result }: { patientId: string; labId: number; result: string }): Promise<any> {
  const res = await fetch(`/api/patients/${patientId}/labs/${labId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ result }),
  });
  if (!res.ok) throw new Error("Failed to enter lab result");
  const json = await res.json();
  return json.data;
}

export async function getPrescriptions(patientId: string): Promise<any[]> {
  const res = await fetch(`/api/patients/${patientId}/prescriptions`);
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  const json = await res.json();
  return json.data;
}

export async function createPrescription({ patientId, data }: { patientId: string; data: any }): Promise<any> {
  const res = await fetch(`/api/patients/${patientId}/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create prescription");
  const json = await res.json();
  return json.data;
}

export async function dispensePrescription({ patientId, rxId }: { patientId: string; rxId: number }): Promise<any> {
  const res = await fetch(`/api/patients/${patientId}/prescriptions/${rxId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to dispense prescription");
  const json = await res.json();
  return json.data;
}
