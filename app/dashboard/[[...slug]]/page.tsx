"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useUiStore } from "@/store/uiStore";
import DashboardContent from "@/components/dashboard/DashboardContent";
import PatientDetailPage from "@/components/patients/PatientDetailPage";
import PatientsPage from "@/components/patients/PatientsPage";
import VitalsPage from "@/components/vitals/VitalsPage";
import ConsultationsPage from "@/components/consultations/ConsultationsPage";
import LabPage from "@/components/laboratory/LabPage";
import PharmacyPage from "@/components/pharmacy/PharmacyPage";
import RecordsPage from "@/components/records/RecordsPage";

export default function DashboardPage() {
  const pathname = usePathname();
  const activeTab = pathname.split("/").filter(Boolean)[1] || "dashboard";
  const viewingPatientId = useUiStore((s) => s.viewingPatientId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch while loading persisted state
  }

  // If viewing a specific patient, show their detail page
  if (viewingPatientId) {
    return <PatientDetailPage patientId={viewingPatientId} />;
  }

  switch (activeTab) {
    case "patients":
      return <PatientsPage />;
    case "vitals":
      return <VitalsPage />;
    case "consultations":
      return <ConsultationsPage />;
    case "labs":
      return <LabPage />;
    case "pharmacy":
      return <PharmacyPage />;
    case "records":
      return <RecordsPage />;
    default:
      return <DashboardContent />;
  }
}
