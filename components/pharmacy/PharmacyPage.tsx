"use client";

import { useState } from "react";
import { useAllPrescriptions } from "@/hooks/queries/usePrescriptions";
import { getInitials } from "@/lib/constants";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import PatientPharmacyDetail from "@/components/pharmacy/PatientPharmacyDetail";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function PharmacyPage() {
  const { data: allRx = [], isLoading } = useAllPrescriptions();
  const [rxFor, setRxFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailPatient, setDetailPatient] = useState<string | null>(null);

  const q = search.toLowerCase();

  // Group prescriptions by patient
  const patientMap = new Map<string, { patientId: string; ptName: string; ptOpd?: string; meds: typeof allRx }>();
  allRx.forEach((m) => {
    if (!patientMap.has(m.patientId)) {
      patientMap.set(m.patientId, {
        patientId: m.patientId,
        ptName: m.ptName || "Unknown Patient",
        ptOpd: m.ptOpd,
        meds: [],
      });
    }
    patientMap.get(m.patientId)!.meds.push(m);
  });

  const patientRx = Array.from(patientMap.values()).filter((g) => {
    if (!q) return true;
    return (
      g.ptName.toLowerCase().includes(q) ||
      (g.ptOpd || "").toLowerCase().includes(q) ||
      g.meds.some((m) => m.medication.toLowerCase().includes(q))
    );
  });

  const pendingCount = allRx.filter((r) => r.status === "pending").length;
  const dispensedCount = allRx.filter((r) => r.status === "dispensed").length;

  if (detailPatient) {
    return (
      <PatientPharmacyDetail
        patientId={detailPatient}
        onBack={() => setDetailPatient(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium text-ink-3">Loading prescriptions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 sm:p-8 pb-20 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Pharmacy & Dispensary</h1>
          <p className="text-sm font-medium text-ink-3">
            {pendingCount} pending · {dispensedCount} dispensed · {allRx.length} total
          </p>
        </div>
        <button
          onClick={() => setRxFor({ id: "", name: "" })}
          className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
        >
          + Prescribe
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, OPD number, or medication…"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-2.5",
            "text-sm font-medium text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {patientRx.length === 0 ? (
        <EmptyState
          icon="pill"
          title="No prescriptions"
          subtitle="Add a prescription using the button above."
        />
      ) : (
        <div className="space-y-3">
          {patientRx.map(({ patientId, ptName, meds }) => {
            const pending = meds.filter((m) => m.status === "pending").length;
            return (
              <div
                key={patientId}
                onClick={() => setDetailPatient(patientId)}
                className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-bold text-accent">
                      {getInitials(ptName)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-ink">{ptName}</div>
                      <div className="text-xs font-semibold text-ink-3">
                        {meds.length} medication{meds.length !== 1 ? "s" : ""} · {pending} pending
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pending > 0 && (
                      <span className="rounded-full bg-status-crisis/10 border border-status-crisis/20 px-3 py-1 text-xs font-bold uppercase text-status-crisis">
                        {pending} to dispense
                      </span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
                {/* Medication Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {meds.slice(0, 4).map((m) => (
                    <span
                      key={m.id}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold border",
                        m.status === "dispensed"
                          ? "bg-status-normal-bg text-status-normal border-status-normal-border"
                          : "bg-status-crisis/10 text-status-crisis border-status-crisis/20"
                      )}
                    >
                      {m.medication} ({m.dosage})
                    </span>
                  ))}
                  {meds.length > 4 && (
                    <span className="text-xs font-bold text-ink-3 self-center">+{meds.length - 4} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rxFor && (
        <AddPrescriptionModal
          open={!!rxFor}
          onClose={() => setRxFor(null)}
          patientId={rxFor.id}
          patientName={rxFor.name}
        />
      )}
    </div>
  );
}
