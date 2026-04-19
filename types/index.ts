export interface Patient {
  id: string;
  name: string;
  opdNumber?: string;
  age?: string;
  phone?: string;
  town?: string;
  gender?: string;
  dob?: string;
  notes?: string;
}

// Vitals (Replaces Reading)
export interface Vitals {
  id: number;
  time: string;
  sys?: number;
  dia?: number;
  pulse?: number;
  temperature?: number;
  respiratoryRate?: number;
  weight?: number;
  notes?: string;
}

export interface Consultation {
  id: number;
  time: string;
  doctorId: string; // ID or Name
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
}

export type LabStatus = 'pending' | 'completed' | 'cancelled';
export interface LabInvestigation {
  id: number;
  timeRequested: string;
  timeCompleted?: string;
  requestedBy: string;
  testName: string;
  status: LabStatus;
  result?: string;
  notes?: string;
}

export type PrescriptionStatus = 'pending' | 'dispensed' | 'cancelled';
export interface Prescription {
  id: number;
  timePrescribed: string;
  timeDispensed?: string;
  prescribedBy: string;
  medication: string;
  dosage: string;
  instructions: string;
  status: PrescriptionStatus;
}

export type BpCategoryLabel = "Normal" | "Elevated" | "High" | "Crisis";

export interface BpCategory {
  label: BpCategoryLabel;
  cls: "normal" | "elevated" | "high" | "crisis";
}

export interface AuthCredentials {
  id: string;
  username: string;
  displayName: string;
}
