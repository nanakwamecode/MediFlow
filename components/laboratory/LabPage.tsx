"use client";

import { usePatientStore } from "@/store/patientStore";

import { useState } from "react";
import { formatFullDate, getInitials } from "@/lib/constants";
import RequestLabModal from "@/components/laboratory/RequestLabModal";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils";

export default function LabPage() {
  const { patients, labInvestigations } = usePatientStore();

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
        <button
          onClick={() => setReqFor({ id: "", name: "" })}
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          + Request Lab
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name or test name…"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-card px-3.5 py-2",
            "font-mono text-sm text-ink outline-none transition-colors",
            "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]"
          )}
        />
      </div>

      {patientLabs.length === 0 ? (
        <EmptyState icon="flask" title="No lab requests" subtitle="Request a lab investigation using the buttons above." />
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ink-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
import ViewLabResultModal from "@/components/laboratory/ViewLabResultModal";
import { exportLabResultsPdf } from "@/components/laboratory/LabResultPrintView";

function PatientLabDetail({ patientId, onBack }: { patientId: string; onBack: () => void }) {
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === patientId));
  const labs = usePatientStore((s) => s.labInvestigations[patientId]) || [];
  const [resultFor, setResultFor] = useState<{ labId: number; testName: string } | null>(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<typeof labs[0] | null>(null);

  if (!patient) return null;

  const pending = labs.filter((l) => l.status === "pending");
  const completed = labs.filter((l) => l.status === "completed");

  const handleExportAll = () => {
    exportLabResultsPdf({
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientOpdNumber: patient.opdNumber,
      labs: labs.map((l) => ({
        testName: l.testName,
        result: l.result || "",
        timeRequested: l.timeRequested,
        timeCompleted: l.timeCompleted,
        requestedBy: l.requestedBy,
        status: l.status,
      })),
    });
  };

  return (
    <div className="animate-fade-in p-7 pb-20">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Lab</button>
        <div className="flex items-center gap-2">
          {completed.length > 0 && (
            <button
              onClick={handleExportAll}
              className="cursor-pointer rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink-2 transition-all hover:bg-bg-2 hover:text-accent flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export All PDF
            </button>
          )}
          <button onClick={() => setReqOpen(true)} className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover">+ Request Lab</button>
        </div>
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
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-3">
                <div>
                  <div className="text-sm font-semibold text-ink">{l.testName}</div>
                  <div className="font-mono text-[0.6rem] text-ink-3">Requested: {formatFullDate(l.timeRequested)} · By {l.requestedBy}</div>
                </div>
                <button onClick={() => setResultFor({ labId: l.id, testName: l.testName })} className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover shadow-sm">Enter Result</button>
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
                  <button 
                    onClick={() => setViewingResult(l)} 
                    className="mt-2 w-full opacity-90 cursor-pointer rounded border border-blue/20 bg-blue-bg/40 p-2 text-left transition-colors hover:bg-blue-bg hover:border-blue/30"
                  >
                    <span className="font-mono text-[0.55rem] uppercase tracking-wider text-blue/70 block mb-0.5">Click to view Result</span>
                    <span className="text-xs text-blue font-medium line-clamp-1">{l.result.split('\n')[0]}...</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {labs.length === 0 && (
        <div className="p-8 text-center text-sm text-ink-3 border rounded-lg border-dashed border-border-2">
          No lab investigations yet. Click &quot;+ Request Lab&quot; to add one.
        </div>
      )}

      {resultFor && <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={patientId} labId={resultFor.labId} testName={resultFor.testName} />}
      {reqOpen && <RequestLabModal open={reqOpen} onClose={() => setReqOpen(false)} patientId={patientId} patientName={patient.name} />}
      {viewingResult && (
        <ViewLabResultModal
          open={!!viewingResult}
          onClose={() => setViewingResult(null)}
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
