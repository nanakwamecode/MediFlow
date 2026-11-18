import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrescription, type CreatePrescriptionInput } from "@/services/prescriptions.service";

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreatePrescriptionInput;
    }) => createPrescription(patientId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["prescriptions", patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
