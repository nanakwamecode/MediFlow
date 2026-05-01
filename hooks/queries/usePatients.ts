import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatient, getVitals } from "@/services/patients.service";

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
