import type { Prescription } from "@/types";

export interface PrescriptionRow extends Prescription {
  patientId: string;
  ptName?: string;
  ptOpd?: string;
}

export type CreatePrescriptionInput = Omit<
  Prescription,
  "id" | "status" | "timeDispensed" | "timePrescribed"
> & {
  timePrescribed?: string;
};

export async function getAllPrescriptions(): Promise<PrescriptionRow[]> {
  const res = await fetch("/api/prescriptions");
  if (!res.ok) throw new Error("Failed to fetch all prescriptions");
  const json = await res.json();
  return json.data;
}

export async function getPrescriptions(
  patientId: string
): Promise<PrescriptionRow[]> {
  const res = await fetch(`/api/patients/${patientId}/prescriptions`);
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  const json = await res.json();
  return json.data;
}

export async function createPrescription(
  patientId: string,
  data: CreatePrescriptionInput
): Promise<PrescriptionRow> {
  const res = await fetch(`/api/patients/${patientId}/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to create prescription");
  }
  const json = await res.json();
  return json.data;
}

export async function dispensePrescription(
  patientId: string,
  prescriptionId: number
): Promise<PrescriptionRow> {
  const res = await fetch(
    `/api/patients/${patientId}/prescriptions/${prescriptionId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "dispensed" }),
    }
  );
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to dispense prescription");
  }
  const json = await res.json();
  return json.data;
}
