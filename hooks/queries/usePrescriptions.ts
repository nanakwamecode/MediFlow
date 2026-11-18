import { useQuery } from "@tanstack/react-query";
import { getPrescriptions, getAllPrescriptions } from "@/services/prescriptions.service";

export function useAllPrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: getAllPrescriptions,
  });
}

export function usePrescriptions(patientId: string | null) {
  return useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: () => getPrescriptions(patientId!),
    enabled: !!patientId,
  });
}
