"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/queries/usePatients";
import { useDashboardStats } from "@/hooks/queries/useDashboardStats";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import DashboardHeader from "./DashboardHeader";
import StatCards from "./StatCards";
import ClinicalActionQueue from "./ClinicalActionQueue";
import QuickAccessGrid from "./QuickAccessGrid";
import RecentPatients from "./RecentPatients";
import type { Patient } from "@/types";

export default function DashboardContent() {
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const [ptModalOpen, setPtModalOpen] = useState(false);
  const [genericLogOpen, setGenericLogOpen] = useState(false);
  const [logForPatient, setLogForPatient] = useState<Patient | null>(null);

  const isLoading = patientsLoading || statsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (patients.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon="heart"
          title="Welcome to MediFlow"
          subtitle="Your clinic database is connected and ready. Register your first patient to begin."
          actionLabel="+ Register First Patient"
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
    <div className="animate-fade-in p-6 sm:p-8 pb-24 max-w-7xl mx-auto">
      <DashboardHeader
        onAddPatient={() => setPtModalOpen(true)}
        onLogVitals={() => setGenericLogOpen(true)}
      />

      <StatCards
        totalPatients={stats?.totalPatients ?? 0}
        totalConsultations={stats?.totalConsultations ?? 0}
        pendingLabs={stats?.pendingLabs ?? 0}
        pendingPrescriptions={stats?.pendingPrescriptions ?? 0}
      />

      <ClinicalActionQueue />

      <QuickAccessGrid />

      <RecentPatients
        patients={patients}
        onLogVitalsFor={(p) => setLogForPatient(p)}
      />

      <PatientModal
        open={ptModalOpen}
        onClose={() => setPtModalOpen(false)}
        editPatient={null}
      />

      {genericLogOpen && (
        <LogVitalsModal
          open={genericLogOpen}
          onClose={() => setGenericLogOpen(false)}
        />
      )}

      {logForPatient && (
        <LogVitalsModal
          open={!!logForPatient}
          onClose={() => setLogForPatient(null)}
          patientId={logForPatient.id}
          patientName={logForPatient.name}
        />
      )}
    </div>
  );
}
