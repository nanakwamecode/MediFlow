"use client";

import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { getInitials } from "@/lib/constants";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import React from "react";

export default function DashboardContent() {
  const { patients, consultations, labInvestigations, prescriptions } = usePatientStore();
  const { setActivePage, viewPatient } = useUiStore();

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
          icon="♥"
          title="Welcome to MediFlow"
          subtitle="Add your first patient to start using the clinic system."
          actionLabel="Go to Patients →"
          onAction={() => setActivePage("patients")}
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
          onClick={() => setActivePage("patients")}
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
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ShortcutCard title="Vitals & Triage" icon="♥" onClick={() => setActivePage("vitals")} />
        <ShortcutCard title="Consultations" icon="✎" onClick={() => setActivePage("consultations")} />
        <ShortcutCard title="Laboratory" icon="⚗" onClick={() => setActivePage("labs")} />
        <ShortcutCard title="Pharmacy" icon="💊" onClick={() => setActivePage("pharmacy")} />
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

function ShortcutCard({ title, icon, onClick }: { title: string; icon: string; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card p-4 shadow-card hover:bg-bg-2 transition-colors flex items-center gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl text-accent">
        {icon}
      </div>
      <div className="font-semibold text-ink text-sm group-hover:text-accent transition-colors">
        {title}
      </div>
    </div>
  );
}
