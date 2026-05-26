"use client";

import { useEffect, useState } from "react";
import PatientsPage from "@/components/patients/PatientsPage";
import PatientDetailPage from "@/components/patients/PatientDetailPage";
import { useUiStore } from "@/store/uiStore";

export default function PatientsIndexPage() {
  const viewingPatientId = useUiStore((s) => s.viewingPatientId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (viewingPatientId) {
    return <PatientDetailPage patientId={viewingPatientId} />;
  }

  return <PatientsPage />;
}
