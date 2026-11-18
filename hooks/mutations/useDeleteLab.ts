import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLab } from "@/services/labs.service";

export function useDeleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      labId,
    }: {
      patientId: string;
      labId: number;
    }) => deleteLab(patientId, labId),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      queryClient.invalidateQueries({ queryKey: ["labs", patientId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
