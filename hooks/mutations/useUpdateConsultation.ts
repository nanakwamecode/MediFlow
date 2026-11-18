import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConsultation } from "@/services/consultations.service";
import type { Consultation } from "@/types";

export function useUpdateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      consultId,
      data,
    }: {
      patientId: string;
      consultId: number;
      data: Partial<Consultation>;
    }) => updateConsultation(patientId, consultId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({
        queryKey: ["consultations", patientId],
      });
    },
  });
}
