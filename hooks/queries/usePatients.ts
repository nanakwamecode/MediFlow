import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatient, getVitals, getAllVitals, getConsultations, getLabs, getPrescriptions, getAllConsultations, getAllLabs, getAllPrescriptions } from "@/services/patients.service";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => getPatient(id),
    enabled: !!id,
  });
}

export function useVitals(patientId: string) {
  return useQuery({
    queryKey: ["patients", patientId, "vitals"],
    queryFn: () => getVitals(patientId),
    enabled: !!patientId,
  });
}

export function useAllVitals() {
  return useQuery({
    queryKey: ["vitals"],
    queryFn: getAllVitals,
  });
}

export function useConsultations(patientId: string) {
  return useQuery({
    queryKey: ["patients", patientId, "consultations"],
    queryFn: () => getConsultations(patientId),
    enabled: !!patientId,
  });
}

export function useLabs(patientId: string) {
  return useQuery({
    queryKey: ["patients", patientId, "labs"],
    queryFn: () => getLabs(patientId),
    enabled: !!patientId,
  });
}

export function usePrescriptions(patientId: string) {
  return useQuery({
    queryKey: ["patients", patientId, "prescriptions"],
    queryFn: () => getPrescriptions(patientId),
    enabled: !!patientId,
  });
}

export function useAllConsultations() {
  return useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });
}

export function useAllLabs() {
  return useQuery({
    queryKey: ["labs"],
    queryFn: getAllLabs,
  });
}

export function useAllPrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: getAllPrescriptions,
  });
}
