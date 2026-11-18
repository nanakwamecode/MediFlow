import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLab, type CreateLabInput } from "@/services/labs.service";

export function useCreateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateLabInput;
    }) => createLab(patientId, data),
    onSuccess: (_result, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      queryClient.invalidateQueries({ queryKey: ["labs", patientId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
