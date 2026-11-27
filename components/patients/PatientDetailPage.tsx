"use client";

import { useState } from "react";
import { usePatient } from "@/hooks/queries/usePatients";
import { useVitals } from "@/hooks/queries/useVitals";
import { useConsultations } from "@/hooks/queries/useConsultations";
import { useLabs } from "@/hooks/queries/useLabs";
import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useUiStore } from "@/store/uiStore";
import { useSearchParamState } from "@/hooks/useSearchParamState";
import { PatientDetailSkeleton } from "@/components/common/Skeleton";
import DateFilterBar from "@/components/common/DateFilter/DateFilterBar";
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
import { isDateMatch } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

interface Props {
  patientId: string;
  onBack?: () => void;
}

export default function PatientDetailPage({ patientId, onBack }: Props) {
  const { data: patient, isLoading } = usePatient(patientId);
  const { data: vitals = [] } = useVitals(patientId);
  const { data: consults = [] } = useConsultations(patientId);
  const { data: labs = [] } = useLabs(patientId);
  const { data: meds = [] } = usePrescriptions(patientId);

  const clearViewingPatient = useUiStore((s) => s.clearViewingPatient);
  const handleBack = () => {
    if (onBack) onBack();
    else clearViewingPatient();
  };

  const [filterDate, setFilterDate] = useState("today");
  const [modalParam, setModalParam, clearModalParam] = useSearchParamState("modal");
  const [resultLabParam, setResultLabParam, clearResultLabParam] = useSearchParamState("resultLab");
  const [viewLabParam, setViewLabParam, clearViewLabParam] = useSearchParamState("viewLab");
  const [activeTabParam, setActiveTabParam] = useSearchParamState("tab");

  const activeTab = (activeTabParam as "vitals" | "consults" | "labs" | "meds") || "vitals";
  const setActiveTab = (tab: "vitals" | "consults" | "labs" | "meds") => setActiveTabParam(tab);

  const logOpen = modalParam === "vitals";
  const consultOpen = modalParam === "consult";
  const labOpen = modalParam === "lab";
  const rxOpen = modalParam === "rx";
  const editPatientOpen = modalParam === "edit";

  const resultLabItem = resultLabParam ? labs.find((l) => String(l.id) === resultLabParam) : null;
  const resultFor = resultLabItem ? { labId: resultLabItem.id, testName: resultLabItem.testName } : null;
  const viewingResult = viewLabParam ? labs.find((l) => String(l.id) === viewLabParam) || null : null;

  if (isLoading) return <PatientDetailSkeleton />;

  if (!patient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-3xl opacity-20">?</div>
          <div className="text-sm font-bold text-ink-2">Patient not found</div>
          <button onClick={handleBack} className="mt-3 cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white flex items-center gap-1.5 mx-auto shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back
          </button>
        </div>
      </div>
    );
  }

  const fVitals = vitals.filter((v) => isDateMatch(v.time, filterDate));
  const fConsults = consults.filter((c) => isDateMatch(c.time, filterDate));
  const fLabs = labs.filter((l) => isDateMatch(l.timeRequested, filterDate));
  const fMeds = meds.filter((m) => isDateMatch(m.timePrescribed, filterDate));

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={handleBack} className="group flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 shadow-sm transition-all hover:border-border-2 hover:bg-bg-2">
          <span className="transition-transform group-hover:-translate-x-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </span> Back
        </button>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <button onClick={() => setModalParam("vitals")} className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-95">+ Vitals</button>
          <button onClick={() => setModalParam("consult")} className="cursor-pointer rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">+ Consult</button>
          <button onClick={() => setModalParam("lab")} className="cursor-pointer rounded-xl bg-bg-2 px-4 py-2 text-xs font-bold text-ink hover:bg-border active:scale-95 transition-all">+ Lab</button>
          <button onClick={() => setModalParam("rx")} className="cursor-pointer rounded-xl bg-bg-2 px-4 py-2 text-xs font-bold text-ink hover:bg-border active:scale-95 transition-all">+ Rx</button>
        </div>
      </div>

      <PatientDetailHeader patient={patient} onEdit={() => setModalParam("edit")} />

      <DateFilterBar
        selectedDate={filterDate}
        onDateChange={setFilterDate}
        badgeText={`${fLabs.filter((l) => l.status === "pending").length} pending labs · ${fMeds.filter((m) => m.status === "pending").length} pending rx`}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
            {tab === "meds" ? `Pharmacy (${fMeds.length})` : tab === "consults" ? `Consults (${fConsults.length})` : tab === "labs" ? `Labs (${fLabs.length})` : `Vitals (${fVitals.length})`}
          </button>
        ))}
      </div>

      {activeTab === "vitals" && <PatientVitalsTab patientId={patientId} filterDate={filterDate} />}
      {activeTab === "consults" && <PatientConsultsTab patientId={patientId} filterDate={filterDate} />}
      {activeTab === "labs" && (
        <PatientLabsTab
          patientId={patientId}
          patient={patient}
          filterDate={filterDate}
          onEnterResult={(l) => setResultLabParam(String(l.labId))}
          onViewResult={(l) => setViewLabParam(String(l.id))}
        />
      )}
      {activeTab === "meds" && <PatientPharmacyTab patientId={patientId} filterDate={filterDate} />}

      <LogVitalsModal open={logOpen} onClose={clearModalParam} patientId={patientId} patientName={patient.name} />
      <AddConsultationModal open={consultOpen} onClose={clearModalParam} patientId={patientId} patientName={patient.name} />
      <RequestLabModal open={labOpen} onClose={clearModalParam} patientId={patientId} patientName={patient.name} />
      <AddPrescriptionModal open={rxOpen} onClose={clearModalParam} patientId={patientId} patientName={patient.name} />
      {editPatientOpen && <PatientModal open={editPatientOpen} onClose={clearModalParam} editPatient={patient} />}
      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={clearResultLabParam} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {viewingResult && (
        <ViewLabResultModal
          open={!!viewingResult}
          onClose={clearViewLabParam}
          labId={viewingResult.id}
          testName={viewingResult.testName}
          result={viewingResult.result || ""}
          timeCompleted={viewingResult.timeCompleted}
          timeRequested={viewingResult.timeRequested}
          requestedBy={viewingResult.requestedBy}
          patientName={patient.name}
          patientAge={patient.age}
          patientGender={patient.gender}
          patientOpdNumber={patient.opdNumber}
        />
      )}
    </div>
  );
}
