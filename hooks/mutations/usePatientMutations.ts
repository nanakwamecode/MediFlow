import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createPatient, 
  updatePatient, 
  deletePatient,
  createVitals,
  deleteVital,
  createConsultation,
  createLab,
  enterLabResult,
  createPrescription,
  dispensePrescription
} from "@/services/patients.service";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", variables.id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useAddVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVitals,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "vitals"] });
      queryClient.invalidateQueries({ queryKey: ["vitals"] }); // if we use a global vitals query
    },
  });
}

export function useDeleteVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVital,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "vitals"] });
      queryClient.invalidateQueries({ queryKey: ["vitals"] });
    },
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConsultation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "consultations"] });
    },
  });
}

export function useCreateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLab,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "labs"] });
    },
  });
}

export function useEnterLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enterLabResult,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "labs"] });
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrescription,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "prescriptions"] });
    },
  });
}

export function useDispensePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dispensePrescription,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients", variables.patientId, "prescriptions"] });
    },
  });
}
