import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLabResult } from "@/services/labs.service";

export function useUpdateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      labId,
      data,
    }: {
      patientId: string;
      labId: number;
      data: { result?: string; status?: "completed" | "cancelled" };
    }) => updateLabResult(patientId, labId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      queryClient.invalidateQueries({ queryKey: ["labs", patientId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
