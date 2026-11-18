import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVitals, type CreateVitalsInput } from "@/services/vitals.service";

export function useCreateVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateVitalsInput;
    }) => createVitals(patientId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
      queryClient.invalidateQueries({ queryKey: ["vitals", patientId] });
    },
  });
}
