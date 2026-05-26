"use client";

import React, { useState } from "react";
import { usePatientStore } from "@/store/patientStore";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";
import KpiMetrics from "./KpiMetrics";
import QuickActions from "./QuickActions";
import ClinicalCharts from "./ClinicalCharts";
import PatientSpotlight from "./PatientSpotlight";
import PendingActions from "./PendingActions";

export default function DashboardContent() {
  const {
    patients,
    consultations,
    labInvestigations,
    prescriptions,
    vitals,
    activePatientId,
    dispensePrescription,
  } = usePatientStore();

  const [ptModalOpen, setPtModalOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [labResultFor, setLabResultFor] = useState<{
    labId: number;
    testName: string;
    patientId: string;
  } | null>(null);

  const activePatient = patients.find((p) => p.id === activePatientId) || null;
  const patientVitals = activePatient ? vitals[activePatient.id] || [] : [];

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (patients.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-7">
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

  // Aggregate metrics
  const totalPatients = patients.length;
  const recentConsultations = Object.values(consultations).flat();

  // Pending labs across all patients
  const pendingLabs = patients.flatMap((p) =>
    (labInvestigations[p.id] || [])
      .filter((l) => l.status === "pending")
      .map((l) => ({ ...l, ptId: p.id, ptName: p.name }))
  );

  // Pending prescriptions across all patients
  const pendingPrescriptions = patients.flatMap((p) =>
    (prescriptions[p.id] || [])
      .filter((pr) => pr.status === "pending")
      .map((pr) => ({ ...pr, ptId: p.id, ptName: p.name }))
  );

  const handleDispense = (patientId: string, prescriptionId: number) => {
    if (confirm("Dispense this prescription?")) {
      dispensePrescription(patientId, prescriptionId);
    }
  };

  const handleEnterLab = (patientId: string, labId: number, testName: string) => {
    setLabResultFor({ patientId, labId, testName });
  };

  return (
    <div className="animate-fade-in p-7 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Clinic Workspace
          </h1>
          <p className="text-xs text-ink-3 mt-1 font-mono">{today}</p>
        </div>
        <button
          onClick={() => setPtModalOpen(true)}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-accent to-accent-hover px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          + New Patient
        </button>
      </div>

      {/* Global KPIs */}
      <KpiMetrics
        totalPatients={totalPatients}
        totalConsultations={recentConsultations.length}
        pendingLabs={pendingLabs.length}
        pendingPharmacy={pendingPrescriptions.length}
      />

      {/* Quick shortcuts */}
      <QuickActions />

      {/* Analytics & Tasks Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Span - Charts & Active Patient Profile */}
        <div className="lg:col-span-2 space-y-6">
          <ClinicalCharts
            activePatient={activePatient}
            patientVitals={patientVitals}
            consultations={consultations}
            labInvestigations={labInvestigations}
            prescriptions={prescriptions}
          />
          {activePatient && (
            <PatientSpotlight
              patient={activePatient}
              patientVitals={patientVitals}
              onLogVitals={() => setVitalsModalOpen(true)}
            />
          )}
        </div>

        {/* Right Span - Active Task Feed */}
        <div className="lg:col-span-1">
          <PendingActions
            pendingLabs={pendingLabs}
            pendingPrescriptions={pendingPrescriptions}
            onDispense={handleDispense}
            onEnterLab={handleEnterLab}
          />
        </div>
      </div>

      {/* Shared Modals */}
      <PatientModal
        open={ptModalOpen}
        onClose={() => setPtModalOpen(false)}
        editPatient={null}
      />
      {vitalsModalOpen && activePatient && (
        <LogVitalsModal
          open={vitalsModalOpen}
          onClose={() => setVitalsModalOpen(false)}
          patientId={activePatient.id}
          patientName={activePatient.name}
        />
      )}
      {labResultFor && (
        <EnterLabResultModal
          open={!!labResultFor}
          onClose={() => setLabResultFor(null)}
          patientId={labResultFor.patientId}
          labId={labResultFor.labId}
          testName={labResultFor.testName}
        />
      )}
    </div>
  );
}
