import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsultation, type CreateConsultationInput } from "@/services/consultations.service";

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateConsultationInput;
    }) => createConsultation(patientId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({
        queryKey: ["consultations", patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
