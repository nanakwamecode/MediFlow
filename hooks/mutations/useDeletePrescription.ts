import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrescription } from "@/services/prescriptions.service";

export function useDeletePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      prescriptionId,
    }: {
      patientId: string;
      prescriptionId: number;
    }) => deletePrescription(patientId, prescriptionId),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions", patientId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
