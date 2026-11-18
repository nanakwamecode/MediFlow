import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient } from "@/services/patients.service";
import type { Patient } from "@/types";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) =>
      updatePatient(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", id] });
    },
  });
}
