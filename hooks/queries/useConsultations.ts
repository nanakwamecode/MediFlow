import { useQuery } from "@tanstack/react-query";
import { getConsultations, getAllConsultations } from "@/services/consultations.service";

export function useAllConsultations() {
  return useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });
}

export function useConsultations(patientId: string | null) {
  return useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => getConsultations(patientId!),
    enabled: !!patientId,
  });
}
