"use client";

import { useState } from "react";
import { usePatientStore } from "@/store/patientStore";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import DashboardHeader from "./DashboardHeader";
import StatCards from "./StatCards";
import QuickAccessGrid from "./QuickAccessGrid";
import RecentPatients from "./RecentPatients";

export default function DashboardContent() {
  const { patients, consultations, labInvestigations, prescriptions } =
    usePatientStore();
  const [ptModalOpen, setPtModalOpen] = useState(false);

  // Calculate metrics
  const totalPatients = patients.length;
  const totalConsultations = Object.values(consultations).flat().length;
  const pendingLabs = Object.values(labInvestigations)
    .flat()
    .filter((l) => l.status === "pending").length;
  const pendingPrescriptions = Object.values(prescriptions)
    .flat()
    .filter((p) => p.status === "pending").length;

  if (patients.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon="heart"
          title="Welcome to MediFlow"
          subtitle="Add your first patient to start using the clinic system."
          actionLabel="+ Add New Patient"
          onAction={() => setPtModalOpen(true)}
        />
        <PatientModal
          open={ptModalOpen}
          onClose={() => setPtModalOpen(false)}
          editPatient={null}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-7 pb-20">
      <DashboardHeader onAddPatient={() => setPtModalOpen(true)} />

      <StatCards
        totalPatients={totalPatients}
        totalConsultations={totalConsultations}
        pendingLabs={pendingLabs}
        pendingPrescriptions={pendingPrescriptions}
      />

      <QuickAccessGrid />

      <RecentPatients patients={patients} consultations={consultations} />

      <PatientModal
        open={ptModalOpen}
        onClose={() => setPtModalOpen(false)}
        editPatient={null}
      />
    </div>
  );
}
