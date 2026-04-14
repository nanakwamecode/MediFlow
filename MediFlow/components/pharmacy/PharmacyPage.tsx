"use client";

import { usePatientStore } from "@/store/patientStore";

import { useToast } from "@/components/common/Toast/ToastProvider";
import { useState } from "react";
import { formatFullDate, getInitials } from "@/lib/constants";
import AddPrescriptionModal from "@/components/pharmacy/AddPrescriptionModal";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function PharmacyPage() {
  const { patients, prescriptions } = usePatientStore();
  const [rxFor, setRxFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailPatient, setDetailPatient] = useState<string | null>(null);

  const q = search.toLowerCase();

  const patientRx = patients
    .map((p) => ({ patient: p, meds: prescriptions[p.id] || [] }))
    .filter((g) => g.meds.length > 0 || q === "")
    .filter((g) => {
      if (!q) return true;
      return (
        g.patient.name.toLowerCase().includes(q) ||
        g.meds.some((m) => m.medication.toLowerCase().includes(q))
      );
    });

  const allRx = Object.values(prescriptions).flat();
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

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Pharmacy & Dispensary</h1>
          <p className="text-xs text-ink-3">{pendingCount} pending · {dispensedCount} dispensed · {allRx.length} total</p>
        </div>
        <button
          onClick={() => setRxFor({ id: "", name: "" })}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
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
          placeholder="🔍  Search by patient name or medication…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {patientRx.length === 0 ? (
        <EmptyState icon="💊" title="No prescriptions" subtitle="Add a prescription using the buttons above." />
      ) : (
        <div className="space-y-3">
          {patientRx.map(({ patient: p, meds }) => {
            const pending = meds.filter((m) => m.status === "pending").length;
            return (
              <div
                key={p.id}
                onClick={() => setDetailPatient(p.id)}
                className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-serif text-sm text-accent">{getInitials(p.name)}</div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{p.name}</div>
                      <div className="font-mono text-[0.6rem] text-ink-3">{meds.length} medication{meds.length !== 1 ? "s" : ""} · {pending} pending</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pending > 0 && <span className="text-[0.65rem] px-2 py-1 rounded-full font-mono uppercase bg-status-crisis-bg text-status-crisis">{pending} to dispense</span>}
                    <span className="text-ink-4 text-lg">→</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meds.slice(0, 4).map((m) => (
                    <span key={m.id} className={cn(
                      "text-[0.6rem] px-2 py-0.5 rounded-full font-mono",
                      m.status === "dispensed" ? "bg-status-normal-bg text-status-normal" : "bg-status-crisis-bg text-status-crisis"
                    )}>{m.medication} {m.dosage}</span>
                  ))}
                  {meds.length > 4 && <span className="text-[0.6rem] text-ink-4">+{meds.length - 4} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rxFor && <AddPrescriptionModal open={!!rxFor} onClose={() => setRxFor(null)} patientId={rxFor.id} patientName={rxFor.name} />}
    </div>
  );
}

// ─── Patient Pharmacy Detail ───
function PatientPharmacyDetail({ patientId, onBack }: { patientId: string; onBack: () => void }) {
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === patientId));
  const meds = usePatientStore((s) => s.prescriptions[patientId]) || [];
  const dispensePrescription = usePatientStore((s) => s.dispensePrescription);
  const { showToast } = useToast();
  const [rxOpen, setRxOpen] = useState(false);

  if (!patient) return null;

  const pending = meds.filter((m) => m.status === "pending");
  const dispensed = meds.filter((m) => m.status === "dispensed");

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2">← Back to Pharmacy</button>
        <button onClick={() => setRxOpen(true)} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover">+ Prescribe</button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-serif text-lg text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-2xl text-ink">{patient.name}</h1>
          <p className="font-mono text-xs text-ink-3">{meds.length} medication{meds.length !== 1 ? "s" : ""} · {pending.length} pending</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <>
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-status-crisis uppercase">Pending Dispensing ({pending.length})</div>
          <div className="mb-5 space-y-2">
            {pending.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-status-crisis/20 bg-status-crisis-bg p-3">
                <div>
                  <div className="text-sm font-bold text-ink">{m.medication} <span className="font-normal text-ink-3 ml-1">{m.dosage}</span></div>
                  <div className="text-xs text-ink-2 mt-0.5">{m.instructions}</div>
                  <div className="font-mono text-[0.6rem] text-ink-3 mt-1">Prescribed: {formatFullDate(m.timePrescribed)} · By {m.prescribedBy}</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Dispense ${m.medication} ${m.dosage}?`)) {
                      dispensePrescription(patientId, m.id);
                      showToast("Dispensed", "✓");
                    }
                  }}
                  className="cursor-pointer rounded-lg bg-status-normal px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 shrink-0 ml-3"
                >
                  Dispense
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dispensed */}
      {dispensed.length > 0 && (
        <>
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-status-normal uppercase">Dispensed ({dispensed.length})</div>
          <div className="space-y-2">
            {dispensed.map((m) => (
              <div key={m.id} className="rounded-lg border border-border bg-card p-3 shadow-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-bold text-ink">{m.medication} <span className="font-normal text-ink-3 ml-1">{m.dosage}</span></div>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono uppercase bg-status-normal-bg text-status-normal">dispensed</span>
                </div>
                <div className="text-xs text-ink-2">{m.instructions}</div>
                <div className="font-mono text-[0.6rem] text-ink-3 mt-1 flex gap-4">
                  <span>Prescribed: {formatFullDate(m.timePrescribed)} by {m.prescribedBy}</span>
                  {m.timeDispensed && <span>Dispensed: {formatFullDate(m.timeDispensed)}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {meds.length === 0 && (
        <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">
          No prescriptions yet. Click &quot;+ Prescribe&quot; to add one.
        </div>
      )}

      {rxOpen && <AddPrescriptionModal open={rxOpen} onClose={() => setRxOpen(false)} patientId={patientId} patientName={patient.name} />}
    </div>
  );
}
