import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispensePrescription } from "@/services/prescriptions.service";

export function useDispensePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      prescriptionId,
    }: {
      patientId: string;
      prescriptionId: number;
    }) => dispensePrescription(patientId, prescriptionId),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["prescriptions", patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
