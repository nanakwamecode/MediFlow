import { useQuery } from "@tanstack/react-query";
import { getPatients, getPatient } from "@/services/patients.service";

export function usePatients(search?: string) {
  return useQuery({
    queryKey: ["patients", search ?? ""],
    queryFn: () => getPatients(search),
  });
}

export function usePatient(id: string | null) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => getPatient(id!),
    enabled: !!id,
  });
}
