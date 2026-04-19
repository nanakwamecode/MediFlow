"use client";

import { useState } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { getInitials } from "@/lib/constants";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import PatientModal from "@/components/patients/PatientModal";
import LogVitalsModal from "@/components/vitals/LogVitalsModal";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const { patients, vitals, deletePatient } = usePatientStore();
  const { viewPatient } = useUiStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [ptModalOpen, setPtModalOpen] = useState(false);
  const [editPt, setEditPt] = useState<Patient | null>(null);
  const [logFor, setLogFor] = useState<Patient | null>(null);

  const q = search.toLowerCase();
  const filtered = q
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.phone ?? "").toLowerCase().includes(q) ||
          (p.town ?? "").toLowerCase().includes(q)
      )
    : patients;

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Patients</h1>
          <p className="text-xs text-ink-3">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => { setEditPt(null); setPtModalOpen(true); }}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-md"
        >
          + New Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-3 flex items-center gap-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search by name, phone, town…"
          className={cn(
            "flex-1 rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
        {q && (
          <span className="font-mono text-[0.65rem] text-ink-3 whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {filtered.length === 0 ? (
          <EmptyState
            icon={q ? "🔍" : "♟"}
            title={q ? "No matches found" : "No patients yet"}
            subtitle={q ? "Try different search terms" : 'Click "+ New Patient" to add one'}
          />
        ) : (
          filtered.map((p) => {
            const rd = vitals[p.id] || [];
            const meta = [p.age ? `Age ${p.age}` : "", p.gender, p.town]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={p.id}
                onClick={() => viewPatient(p.id)}
                className="flex cursor-pointer items-center gap-4 border-b border-border/50 px-5 py-3 transition-all last:border-b-0 hover:bg-bg/50 group hover:pl-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bg-2 to-border font-serif text-[0.8rem] text-ink-2 shadow-sm ring-1 ring-border/50 group-hover:from-accent/10 group-hover:to-accent/5 group-hover:text-accent transition-all">
                  {getInitials(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-accent">
                    {p.name}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[0.68rem] text-ink-3">
                    {meta || "—"}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 font-mono text-[0.62rem] text-ink-4">
                  <span className="rounded-full bg-card px-2 py-0.5 border border-border">{rd.length} log{rd.length !== 1 ? "s" : ""}</span>
                </div>
                <div
                  className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setLogFor(p)}
                    className="cursor-pointer rounded-lg px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold text-status-normal transition-colors hover:bg-status-normal-bg"
                  >
                    + Log Vitals
                  </button>
                  <span className="text-[0.65rem] text-border-2">·</span>
                  <button
                    onClick={() => { setEditPt(p); setPtModalOpen(true); }}
                    className="cursor-pointer rounded-lg px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold text-blue transition-colors hover:bg-blue-bg"
                  >
                    Edit
                  </button>
                  <span className="text-[0.65rem] text-border-2">·</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}" and all records?`)) {
                        deletePatient(p.id);
                        showToast("Patient deleted", "✕");
                      }
                    }}
                    className="cursor-pointer rounded-lg px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold text-status-high transition-colors hover:bg-status-high-bg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PatientModal
        open={ptModalOpen}
        onClose={() => { setPtModalOpen(false); setEditPt(null); }}
        editPatient={editPt}
      />
      {logFor && (
        <LogVitalsModal
          open={!!logFor}
          onClose={() => setLogFor(null)}
          patientId={logFor.id}
          patientName={logFor.name}
        />
      )}
    </div>
  );
}
