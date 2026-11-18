"use client";

import { useEffect, useState } from "react";
import PatientsPage from "@/components/patients/PatientsPage";
import PatientDetailPage from "@/components/patients/PatientDetailPage";
import { useUiStore } from "@/store/uiStore";
import { useSearchParamState } from "@/hooks/useSearchParamState";

export default function PatientsPageClient() {
  const storePatientId = useUiStore((s) => s.viewingPatientId);
  const viewPatient = useUiStore((s) => s.viewPatient);
  const clearViewingPatient = useUiStore((s) => s.clearViewingPatient);
  const [paramPatientId, setParamPatientId, clearParamPatientId] = useSearchParamState("patientId");
  const [, , clearTabParam] = useSearchParamState("tab");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (paramPatientId && !storePatientId) {
      viewPatient(paramPatientId);
    }
  }, [paramPatientId, storePatientId, viewPatient]);

  const activePatientId = paramPatientId || storePatientId;

  // Sync to URL param when opened via list click
  useEffect(() => {
    if (storePatientId && storePatientId !== paramPatientId) {
      setParamPatientId(storePatientId);
    }
  }, [storePatientId, paramPatientId, setParamPatientId]);

  const handleBack = () => {
    clearViewingPatient();
    clearParamPatientId();
    clearTabParam();
  };

  if (!mounted) return null;

  if (activePatientId) {
    return <PatientDetailPage patientId={activePatientId} onBack={handleBack} />;
  }

  return <PatientsPage />;
}
