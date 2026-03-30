"use client";

import { useUiStore } from "@/store/uiStore";
import DashboardContent from "@/components/dashboard/DashboardContent";
import PatientDetailPage from "@/components/patients/PatientDetailPage";
import PatientsPage from "./patients/page";
import VitalsPage from "@/components/vitals/VitalsPage";
import ConsultationsPage from "@/components/consultations/ConsultationsPage";
import LabPage from "@/components/laboratory/LabPage";
import PharmacyPage from "@/components/pharmacy/PharmacyPage";
import RecordsPage from "@/components/records/RecordsPage";

export default function DashboardPage() {
  const activePage = useUiStore((s) => s.activePage);
  const viewingPatientId = useUiStore((s) => s.viewingPatientId);

  // If viewing a specific patient, show their detail page
  if (viewingPatientId) {
    return <PatientDetailPage patientId={viewingPatientId} />;
  }

  switch (activePage) {
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
