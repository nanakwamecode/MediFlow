"use client";

import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { getInitials } from "@/lib/constants";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import React, { useState } from "react";

export default function DashboardContent() {
  const { patients, consultations, labInvestigations, prescriptions } = usePatientStore();
  const { setActivePage, viewPatient } = useUiStore();
  const [ptModalOpen, setPtModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate metrics
  const totalPatients = patients.length;
  const recentConsultations = Object.values(consultations).flat().sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const pendingLabs = Object.values(labInvestigations).flat().filter(l => l.status === 'pending');
  const pendingPrescriptions = Object.values(prescriptions).flat().filter(p => p.status === 'pending');

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
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">
            Clinic Overview
          </h1>
          <p className="text-xs text-ink-3">{today}</p>
        </div>
        <button
          onClick={() => setPtModalOpen(true)}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-md"
        >
          + New Patient
        </button>
      </div>

      {/* Global KPIs */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Registered Patients" value={totalPatients} unit="Total" />
        <KpiCard label="Consultations" value={recentConsultations.length} unit="Completed" />
        <KpiCard label="Pending Labs" value={pendingLabs.length} unit="Requests" />
        <KpiCard label="Pending Pharmacy" value={pendingPrescriptions.length} unit="Prescriptions" />
      </div>

      {/* Modules shortcuts */}
      <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">
        Quick Access
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 mt-3">
        <ShortcutCard 
          title="Vitals & Triage" 
          onClick={() => setActivePage("vitals")} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-[1.2rem] h-[1.2rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} 
        />
        <ShortcutCard 
          title="Consultations" 
          onClick={() => setActivePage("consultations")} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-[1.2rem] h-[1.2rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>} 
        />
        <ShortcutCard 
          title="Laboratory" 
          onClick={() => setActivePage("labs")} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-[1.2rem] h-[1.2rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>} 
        />
        <ShortcutCard 
          title="Pharmacy" 
          onClick={() => setActivePage("pharmacy")} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-[1.2rem] h-[1.2rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>} 
        />
      </div>

      {/* Patient List Shortcut */}
      <div className="mb-2 mt-8 flex items-center justify-between font-mono text-[0.56rem] tracking-[0.2em] text-ink-3 uppercase">
        <span>Recent Patients</span>
        <button onClick={() => setActivePage("patients")} className="text-accent underline-offset-4 hover:underline">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patients.slice(0, 3).map((p) => {
          const ptConsults = consultations[p.id] || [];
          const lastConsult = ptConsults[0];
          const meta = [p.age ? `Age ${p.age}` : "", p.gender, p.town].filter(Boolean).join(" · ");

          return (
            <div
              key={p.id}
              onClick={() => viewPatient(p.id)}
              className="group cursor-pointer rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-serif text-sm text-accent">
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink group-hover:text-accent">
                    {p.name}
                  </div>
                  <div className="truncate font-mono text-[0.6rem] text-ink-3">
                    {meta || "—"}
                  </div>
                </div>
              </div>

              {lastConsult ? (
                <div className="text-left">
                  <div className="font-mono text-[0.55rem] tracking-[0.18em] text-ink-4 uppercase">
                    Last Consult
                  </div>
                  <div className="truncate text-[0.7rem] text-ink-2 font-medium">
                    {lastConsult.diagnosis || "No diagnosis"}
                  </div>
                </div>
              ) : (
                <div className="text-left font-mono text-[0.65rem] text-ink-4 pt-4">
                  No consultations yet
                </div>
              )}
            </div>
          );
        })}
      </div>
      <PatientModal
        open={ptModalOpen}
        onClose={() => setPtModalOpen(false)}
        editPatient={null}
      />
    </div>
  );
}

function KpiCard({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="mb-1.5 font-mono text-[0.56rem] tracking-[0.18em] text-ink-3 uppercase">
        {label}
      </div>
      <div className="font-serif text-3xl leading-none text-ink">{value}</div>
      <div className="mt-0.5 font-mono text-[0.6rem] text-ink-4">{unit}</div>
    </div>
  );
}

function ShortcutCard({ title, icon, onClick }: { title: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/40 flex items-center gap-3.5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bg-accent group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 shadow-inner">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
          {icon}
        </div>
      </div>
      <div className="relative z-10 font-semibold text-ink text-[0.82rem] transition-all duration-500 group-hover:text-accent group-hover:translate-x-1 leading-tight">
        {title}
      </div>
      <div className="absolute right-4 opacity-0 -translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0 text-accent">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
