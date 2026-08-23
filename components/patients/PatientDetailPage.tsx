"use client";

import { useState } from "react";
import { usePatient } from "@/hooks/queries/usePatients";
import { useVitals } from "@/hooks/queries/useVitals";
import { useConsultations } from "@/hooks/queries/useConsultations";
import { useLabs } from "@/hooks/queries/useLabs";
import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useUiStore } from "@/store/uiStore";
import PatientDetailHeader from "./PatientDetailHeader";
import PatientVitalsTab from "./detail/PatientVitalsTab";
import PatientConsultsTab from "./detail/PatientConsultsTab";
import PatientLabsTab from "./detail/PatientLabsTab";
import PatientPharmacyTab from "./detail/PatientPharmacyTab";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import AddConsultationModal from "@/components/consultations/AddConsultationModal";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";
import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";
import PatientModal from "@/components/patients/PatientModal";
import { cn } from "@/lib/utils";
import type { LabInvestigation } from "@/types";

interface Props {
  patientId: string;
}

export default function PatientDetailPage({ patientId }: Props) {
  const { data: patient, isLoading } = usePatient(patientId);
  const { data: vitals = [] } = useVitals(patientId);
  const { data: consults = [] } = useConsultations(patientId);
  const { data: labs = [] } = useLabs(patientId);
  const { data: meds = [] } = usePrescriptions(patientId);

  const clearViewingPatient = useUiStore((s) => s.clearViewingPatient);

  const [logOpen, setLogOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [editPatientOpen, setEditPatientOpen] = useState(false);
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [viewingResult, setViewingResult] = useState<LabInvestigation | null>(null);
  const [activeTab, setActiveTab] = useState<"vitals" | "consults" | "labs" | "meds">("vitals");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Loading patient record…</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-3xl opacity-20">?</div>
          <div className="text-sm font-bold text-ink-2">Patient not found</div>
          <button onClick={clearViewingPatient} className="mt-3 cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white flex items-center gap-1.5 mx-auto shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={clearViewingPatient} className="group flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 shadow-sm transition-all hover:border-border-2 hover:bg-bg-2">
          <span className="transition-transform group-hover:-translate-x-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </span> Back
        </button>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <button onClick={() => setLogOpen(true)} className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-95">+ Vitals</button>
          <button onClick={() => setConsultOpen(true)} className="cursor-pointer rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">+ Consult</button>
          <button onClick={() => setLabOpen(true)} className="cursor-pointer rounded-xl bg-bg-2 px-4 py-2 text-xs font-bold text-ink hover:bg-border active:scale-95 transition-all">+ Lab</button>
          <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-xl bg-bg-2 px-4 py-2 text-xs font-bold text-ink hover:bg-border active:scale-95 transition-all">+ Rx</button>
        </div>
      </div>

      <PatientDetailHeader patient={patient} onEdit={() => setEditPatientOpen(true)} />

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(["vitals", "consults", "labs", "meds"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
              activeTab === tab 
                ? "bg-accent text-white shadow-md ring-1 ring-accent/20" 
                : "bg-card text-ink-3 hover:bg-bg-2 hover:text-ink ring-1 ring-border shadow-sm"
            )}
          >
            {tab === "meds" ? `Pharmacy (${meds.length})` : tab === "consults" ? `Consults (${consults.length})` : tab === "labs" ? `Labs (${labs.length})` : `Vitals (${vitals.length})`}
          </button>
        ))}
      </div>

      {activeTab === "vitals" && <PatientVitalsTab patientId={patientId} />}
      {activeTab === "consults" && <PatientConsultsTab patientId={patientId} />}
      {activeTab === "labs" && (
        <PatientLabsTab
          patientId={patientId}
          onEnterResult={(l) => setResultFor(l)}
          onViewResult={(l) => setViewingResult(l)}
        />
      )}
      {activeTab === "meds" && <PatientPharmacyTab patientId={patientId} />}

      {/* Modals */}
      <LogVitalsModal open={logOpen} onClose={() => setLogOpen(false)} patientId={patientId} patientName={patient.name} />
      <AddConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} patientId={patientId} patientName={patient.name} />
      <RequestLabModal open={labOpen} onClose={() => setLabOpen(false)} patientId={patientId} patientName={patient.name} />
      <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} patientId={patientId} patientName={patient.name} />
      {editPatientOpen && <PatientModal open={editPatientOpen} onClose={() => setEditPatientOpen(false)} editPatient={patient} />}
      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {viewingResult && <ViewLabResultModal open={!!viewingResult} onClose={() => setViewingResult(null)} testName={viewingResult.testName} result={viewingResult.result || ""} timeCompleted={viewingResult.timeCompleted} requestedBy={viewingResult.requestedBy} />}
    </div>
  );
}
