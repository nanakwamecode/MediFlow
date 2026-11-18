import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVitals } from "@/services/vitals.service";

export function useDeleteVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      vitalId,
    }: {
      patientId: string;
      vitalId: number;
    }) => deleteVitals(patientId, vitalId),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
      queryClient.invalidateQueries({ queryKey: ["vitals", patientId] });
    },
  });
}
