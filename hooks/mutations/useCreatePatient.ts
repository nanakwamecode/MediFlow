import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/services/patients.service";
import type { Patient } from "@/types";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Patient, "id">) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
