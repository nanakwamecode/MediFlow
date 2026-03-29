"use client";

import { usePatientStore } from "@/store/patientStore";
import { useUiStore } from "@/store/uiStore";
import { useState } from "react";
import { formatFullDate, getInitials } from "@/lib/constants";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function LabPage() {
  const { patients, labInvestigations } = usePatientStore();
  const { viewPatient } = useUiStore();
  const [reqFor, setReqFor] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [detailPatient, setDetailPatient] = useState<string | null>(null);

  const q = search.toLowerCase();

  // Group labs by patient
  const patientLabs = patients
    .map((p) => {
      const labs = labInvestigations[p.id] || [];
      return { patient: p, labs };
    })
    .filter((g) => g.labs.length > 0 || q === "")
    .filter((g) => {
      if (!q) return true;
      return (
        g.patient.name.toLowerCase().includes(q) ||
        g.labs.some((l) => l.testName.toLowerCase().includes(q))
      );
    });

  const allLabs = Object.values(labInvestigations).flat();
  const pendingCount = allLabs.filter((l) => l.status === "pending").length;
  const completedCount = allLabs.filter((l) => l.status === "completed").length;

  // Detail view for a specific patient
  if (detailPatient) {
    return (
      <PatientLabDetail
        patientId={detailPatient}
        onBack={() => setDetailPatient(null)}
        onRequestLab={(id, name) => setReqFor({ id, name })}
      />
    );
  }

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">Laboratory</h1>
          <p className="text-xs text-ink-3">{pendingCount} pending · {completedCount} completed · {allLabs.length} total</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search by patient name or test name…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {patientLabs.length === 0 ? (
        <EmptyState icon="⚗" title="No lab requests" subtitle="Request a lab investigation using the buttons above." />
      ) : (
        <div className="space-y-3">
          {patientLabs.map(({ patient: p, labs }) => {
            const pending = labs.filter((l) => l.status === "pending").length;
            return (
              <div
                key={p.id}
                onClick={() => setDetailPatient(p.id)}
                className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 font-serif text-sm text-accent">
                      {getInitials(p.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{p.name}</div>
                      <div className="font-mono text-[0.6rem] text-ink-3">{labs.length} test{labs.length !== 1 ? "s" : ""} · {pending} pending</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pending > 0 && (
                      <span className="text-[0.65rem] px-2 py-1 rounded-full font-mono uppercase bg-status-elevated-bg text-status-elevated">{pending} pending</span>
                    )}
                    <span className="text-ink-4 text-lg">→</span>
                  </div>
                </div>
                {/* Preview last 3 tests */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {labs.slice(0, 4).map((l) => (
                    <span key={l.id} className={cn(
                      "text-[0.6rem] px-2 py-0.5 rounded-full font-mono",
                      l.status === "completed" ? "bg-status-normal-bg text-status-normal" : "bg-bg-2 text-ink-3"
                    )}>{l.testName.replace(/ *\(.*\) */g, "")}</span>
                  ))}
                  {labs.length > 4 && <span className="text-[0.6rem] text-ink-4">+{labs.length - 4} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reqFor && <RequestLabModal open={!!reqFor} onClose={() => setReqFor(null)} patientId={reqFor.id} patientName={reqFor.name} />}
    </div>
  );
}

// ─── Patient Lab Detail Page ───
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";

function PatientLabDetail({ patientId, onBack, onRequestLab }: { patientId: string; onBack: () => void; onRequestLab: (id: string, name: string) => void }) {
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === patientId));
  const labs = usePatientStore((s) => s.labInvestigations[patientId] || []);
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [reqOpen, setReqOpen] = useState(false);

  if (!patient) return null;

  const pending = labs.filter((l) => l.status === "pending");
  const completed = labs.filter((l) => l.status === "completed");

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2">← Back to Lab</button>
        <button onClick={() => setReqOpen(true)} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover">+ Request Lab</button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-serif text-lg text-accent">{getInitials(patient.name)}</div>
        <div>
          <h1 className="font-serif text-2xl text-ink">{patient.name}</h1>
          <p className="font-mono text-xs text-ink-3">{labs.length} investigation{labs.length !== 1 ? "s" : ""} · {pending.length} pending</p>
        </div>
      </div>

      {/* Pending Labs */}
      {pending.length > 0 && (
        <>
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-status-elevated uppercase">Pending ({pending.length})</div>
          <div className="mb-5 space-y-2">
            {pending.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-status-elevated/20 bg-status-elevated-bg p-3">
                <div>
                  <div className="text-sm font-semibold text-ink">{l.testName}</div>
                  <div className="font-mono text-[0.6rem] text-ink-3">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
                </div>
                <button onClick={() => setResultFor({ labId: l.id, testName: l.testName })} className="cursor-pointer rounded-lg bg-status-normal px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">Enter Result</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completed Labs */}
      {completed.length > 0 && (
        <>
          <div className="mb-2 font-mono text-[0.56rem] tracking-[0.2em] text-status-normal uppercase">Completed ({completed.length})</div>
          <div className="space-y-2">
            {completed.map((l) => (
              <div key={l.id} className="rounded-lg border border-border bg-card p-3 shadow-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold text-ink">{l.testName}</div>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-mono uppercase bg-status-normal-bg text-status-normal">completed</span>
                </div>
                <div className="font-mono text-[0.6rem] text-ink-3 mb-2">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
                {l.result && (
                  <div className="text-xs bg-blue-bg text-blue p-2.5 rounded border border-blue/10">
                    <span className="font-mono text-[0.5rem] uppercase tracking-wider text-blue/60 block mb-0.5">Result</span>
                    {l.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {labs.length === 0 && (
        <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">No lab investigations yet. Click "+ Request Lab" to add one.</div>
      )}

      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {reqOpen && <RequestLabModal open={reqOpen} onClose={() => setReqOpen(false)} patientId={patientId} patientName={patient.name} />}
    </div>
  );
}
