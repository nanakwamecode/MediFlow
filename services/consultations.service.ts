import type { Consultation } from "@/types";

export interface ConsultationRow extends Consultation {
  patientId: string;
  ptName?: string;
  ptOpd?: string;
}

export type CreateConsultationInput = Omit<Consultation, "id" | "time"> & {
  time?: string;
};

export async function getAllConsultations(): Promise<ConsultationRow[]> {
  const res = await fetch("/api/consultations");
  if (!res.ok) throw new Error("Failed to fetch all consultations");
  const json = await res.json();
  return json.data;
}

export async function getConsultations(
  patientId: string
): Promise<ConsultationRow[]> {
  const res = await fetch(`/api/patients/${patientId}/consultations`);
  if (!res.ok) throw new Error("Failed to fetch consultations");
  const json = await res.json();
  return json.data;
}

export async function createConsultation(
  patientId: string,
  data: CreateConsultationInput
): Promise<ConsultationRow> {
  const res = await fetch(`/api/patients/${patientId}/consultations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to create consultation");
  }
  const json = await res.json();
  return json.data;
}

export async function updateConsultation(
  patientId: string,
  consultId: number,
  data: Partial<Consultation>
): Promise<ConsultationRow> {
  const res = await fetch(
    `/api/patients/${patientId}/consultations/${consultId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to update consultation");
  }
  const json = await res.json();
  return json.data;
}
