import { useQuery } from "@tanstack/react-query";
import { getLabs, getAllLabs } from "@/services/labs.service";

export function useAllLabs() {
  return useQuery({
    queryKey: ["labs"],
    queryFn: getAllLabs,
  });
}

export function useLabs(patientId: string | null) {
  return useQuery({
    queryKey: ["labs", patientId],
    queryFn: () => getLabs(patientId!),
    enabled: !!patientId,
  });
}
