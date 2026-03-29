import { create } from "zustand";
import type { Patient, Vitals, Consultation, LabInvestigation, Prescription } from "@/types";
import { genId } from "@/lib/constants";

interface ClinicState {
  patients: Patient[];
  activePatientId: string | null;

  vitals: Record<string, Vitals[]>;
  consultations: Record<string, Consultation[]>;
  labInvestigations: Record<string, LabInvestigation[]>;
  prescriptions: Record<string, Prescription[]>;

  setActivePatient: (id: string | null) => void;
  addPatient: (patient: Omit<Patient, "id">) => string;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  addVitals: (patientId: string, vitals: Omit<Vitals, "id">) => void;
  deleteVitals: (patientId: string, vitalsId: number) => void;

  addConsultation: (patientId: string, consultation: Omit<Consultation, "id">) => void;
  updateConsultation: (patientId: string, consultId: number, data: Partial<Consultation>) => void;

  addLabInvestigation: (patientId: string, lab: Omit<LabInvestigation, "id">) => void;
  updateLabResult: (patientId: string, labId: number, result: string) => void;

  addPrescription: (patientId: string, prescription: Omit<Prescription, "id">) => void;
  dispensePrescription: (patientId: string, prescriptionId: number) => void;

  getActivePatient: () => Patient | null;
  getVitals: (patientId: string) => Vitals[];
  getActiveVitals: () => Vitals[];
}

// Mock data for demo
const MOCK_PATIENTS: Patient[] = [
  {
    id: "demo1",
    name: "Kwame Mensah",
    opdNumber: "OPD-0001",
    age: "54",
    phone: "+233 20 123 4567",
    town: "Accra",
    gender: "Male",
    notes: "Diabetic, on Amlodipine 5mg",
  },
  {
    id: "demo2",
    name: "Ama Boateng",
    opdNumber: "OPD-0002",
    age: "45",
    phone: "+233 24 987 6543",
    town: "Kumasi",
    gender: "Female",
    notes: "Family history of hypertension",
  },
  {
    id: "demo3",
    name: "Kofi Asante",
    opdNumber: "OPD-0003",
    age: "62",
    phone: "+233 27 555 0123",
    town: "Takoradi",
    gender: "Male",
  },
];

function daysAgo(days: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

const MOCK_VITALS: Record<string, Vitals[]> = {
  demo1: [
    { id: 1, sys: 138, dia: 88, pulse: 76, temperature: 37.1, weight: 82, time: daysAgo(0, 8), notes: "Routine check" },
    { id: 2, sys: 142, dia: 92, pulse: 80, time: daysAgo(1, 19), notes: "Evening check" },
    { id: 3, sys: 135, dia: 85, pulse: 74, time: daysAgo(2, 9) },
    { id: 4, sys: 128, dia: 82, pulse: 72, time: daysAgo(3, 10), notes: "Post exercise" },
  ],
  demo2: [
    { id: 11, sys: 122, dia: 78, pulse: 70, time: daysAgo(0, 7) },
  ],
  demo3: [
    { id: 16, sys: 155, dia: 98, pulse: 88, time: daysAgo(1, 9), notes: "Headache" },
  ],
};

const MOCK_CONSULTATIONS: Record<string, Consultation[]> = {
  demo1: [
    { id: 1, time: daysAgo(5, 10), doctorId: "Dr. Smith", symptoms: "Headache, mild dizziness", diagnosis: "Tension headache secondary to stress", notes: "Advised rest and hydration" },
  ]
};

const MOCK_LABS: Record<string, LabInvestigation[]> = {
  demo1: [
    { id: 1, timeRequested: daysAgo(5, 10), requestedBy: "Dr. Smith", testName: "Complete Blood Count", status: 'completed', result: "Normal except slightly elevated WBC", notes: "Check again in 3 months" }
  ]
};

const MOCK_PRESCRIPTIONS: Record<string, Prescription[]> = {
  demo1: [
    { id: 1, timePrescribed: daysAgo(5, 10), prescribedBy: "Dr. Smith", medication: "Paracetamol", dosage: "500mg", instructions: "Twice daily after meals", status: 'dispensed', timeDispensed: daysAgo(5, 11) }
  ]
};

export const usePatientStore = create<ClinicState>((set, get) => ({
  patients: MOCK_PATIENTS,
  activePatientId: "demo1",
  vitals: MOCK_VITALS,
  consultations: MOCK_CONSULTATIONS,
  labInvestigations: MOCK_LABS,
  prescriptions: MOCK_PRESCRIPTIONS,

  setActivePatient: (id) => set({ activePatientId: id }),

  addPatient: (data) => {
    const id = genId();
    set((s) => ({
      patients: [...s.patients, { ...data, id }],
      vitals: { ...s.vitals, [id]: [] },
      consultations: { ...s.consultations, [id]: [] },
      labInvestigations: { ...s.labInvestigations, [id]: [] },
      prescriptions: { ...s.prescriptions, [id]: [] },
      activePatientId: s.activePatientId ?? id,
    }));
    return id;
  },

  updatePatient: (id, data) =>
    set((s) => ({
      patients: s.patients.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),

  deletePatient: (id) =>
    set((s) => {
      const { [id]: _v, ...restVitals } = s.vitals;
      const { [id]: _c, ...restConsults } = s.consultations;
      const { [id]: _l, ...restLabs } = s.labInvestigations;
      const { [id]: _p, ...restPrescripts } = s.prescriptions;
      return {
        patients: s.patients.filter((p) => p.id !== id),
        vitals: restVitals,
        consultations: restConsults,
        labInvestigations: restLabs,
        prescriptions: restPrescripts,
        activePatientId:
          s.activePatientId === id ? null : s.activePatientId,
      };
    }),

  addVitals: (patientId, v) =>
    set((s) => ({
      vitals: {
        ...s.vitals,
        [patientId]: [
          { ...v, id: Date.now() },
          ...(s.vitals[patientId] || []),
        ],
      },
    })),

  deleteVitals: (patientId, vId) =>
    set((s) => ({
      vitals: {
        ...s.vitals,
        [patientId]: (s.vitals[patientId] || []).filter(
          (r) => r.id !== vId
        ),
      },
    })),

  addConsultation: (patientId, c) =>
    set((s) => ({
      consultations: {
        ...s.consultations,
        [patientId]: [
          { ...c, id: Date.now() },
          ...(s.consultations[patientId] || []),
        ],
      },
    })),

  updateConsultation: (patientId, consultId, data) =>
    set((s) => ({
      consultations: {
        ...s.consultations,
        [patientId]: (s.consultations[patientId] || []).map(c =>
          c.id === consultId ? { ...c, ...data } : c
        ),
      },
    })),

  addLabInvestigation: (patientId, l) =>
    set((s) => ({
      labInvestigations: {
        ...s.labInvestigations,
        [patientId]: [
          { ...l, id: Date.now() },
          ...(s.labInvestigations[patientId] || []),
        ],
      },
    })),

  updateLabResult: (patientId, labId, result) =>
    set((s) => ({
      labInvestigations: {
        ...s.labInvestigations,
        [patientId]: (s.labInvestigations[patientId] || []).map(l =>
          l.id === labId ? { ...l, result, status: 'completed', timeCompleted: new Date().toISOString() } : l
        )
      }
    })),

  addPrescription: (patientId, p) =>
    set((s) => ({
      prescriptions: {
        ...s.prescriptions,
        [patientId]: [
          { ...p, id: Date.now() },
          ...(s.prescriptions[patientId] || []),
        ],
      },
    })),

  dispensePrescription: (patientId, pId) =>
    set((s) => ({
      prescriptions: {
        ...s.prescriptions,
        [patientId]: (s.prescriptions[patientId] || []).map(p =>
          p.id === pId ? { ...p, status: 'dispensed', timeDispensed: new Date().toISOString() } : p
        )
      }
    })),

  getActivePatient: () => {
    const { patients, activePatientId } = get();
    return patients.find((p) => p.id === activePatientId) ?? null;
  },

  getVitals: (patientId) => get().vitals[patientId] || [],

  getActiveVitals: () => {
    const { activePatientId, vitals } = get();
    if (!activePatientId) return [];
    return vitals[activePatientId] || [];
  },
}));
