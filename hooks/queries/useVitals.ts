import { useQuery } from "@tanstack/react-query";
import { getVitals, getAllVitals } from "@/services/vitals.service";

export function useAllVitals() {
  return useQuery({
    queryKey: ["vitals"],
    queryFn: getAllVitals,
  });
}

export function useVitals(patientId: string | null) {
  return useQuery({
    queryKey: ["vitals", patientId],
    queryFn: () => getVitals(patientId!),
    enabled: !!patientId,
  });
}
