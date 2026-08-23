"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/queries/usePatients";
import { useDashboardStats } from "@/hooks/queries/useDashboardStats";
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Initializing clinic dashboard…</p>
        </div>
      </div>
    );
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
      {/* Header */}
      <DashboardHeader
        onAddPatient={() => setPtModalOpen(true)}
        onLogVitals={() => setGenericLogOpen(true)}
      />

      {/* Top Clinical Stats */}
      <StatCards
        totalPatients={stats?.totalPatients ?? 0}
        totalConsultations={stats?.totalConsultations ?? 0}
        pendingLabs={stats?.pendingLabs ?? 0}
        pendingPrescriptions={stats?.pendingPrescriptions ?? 0}
      />

      {/* Action Center / Doctor's Queue */}
      <ClinicalActionQueue />

      {/* Workflow Navigation */}
      <QuickAccessGrid />

      {/* Recent Outpatient Charts */}
      <RecentPatients
        patients={patients}
        onLogVitalsFor={(p) => setLogForPatient(p)}
      />

      {/* Modals */}
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
