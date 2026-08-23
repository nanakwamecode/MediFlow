"use client";

import { useState } from "react";
import { useAllLabs } from "@/hooks/queries/useLabs";
import { useAllPrescriptions } from "@/hooks/queries/usePrescriptions";
import { useUiStore } from "@/store/uiStore";
import { formatFullDate, getInitials } from "@/lib/constants";
import { cn } from "@/lib/utils";
import EnterLabResultModal from "@/components/laboratory/EnterLabResultModal";

export default function ClinicalActionQueue() {
  const { data: allLabs = [] } = useAllLabs();
  const { data: allRx = [] } = useAllPrescriptions();
  const { viewPatient } = useUiStore();

  const [activeTab, setActiveTab] = useState<"labs" | "pharmacy">("labs");
  const [resultFor, setResultFor] = useState<{ patientId: string; labId: number; testName: string } | null>(null);

  const pendingLabs = allLabs.filter((l) => l.status === "pending").slice(0, 5);
  const pendingRx = allRx.filter((r) => r.status === "pending").slice(0, 5);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-border/70 bg-bg/40 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-ink">Clinical Action Queue</h2>
          <p className="text-xs font-medium text-ink-3">Tasks requiring clinical attention & review</p>
        </div>
        <div className="flex rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setActiveTab("labs")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              activeTab === "labs" ? "bg-accent text-white shadow-sm" : "text-ink-3 hover:text-ink"
            )}
          >
            <span>Lab Queue</span>
            {pendingLabs.length > 0 && (
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-mono font-bold", activeTab === "labs" ? "bg-white/20 text-white" : "bg-accent/15 text-accent")}>
                {pendingLabs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("pharmacy")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              activeTab === "pharmacy" ? "bg-status-normal text-white shadow-sm" : "text-ink-3 hover:text-ink"
            )}
          >
            <span>Pharmacy Queue</span>
            {pendingRx.length > 0 && (
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-mono font-bold", activeTab === "pharmacy" ? "bg-white/20 text-white" : "bg-status-normal/15 text-status-normal")}>
                {pendingRx.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === "labs" ? (
          pendingLabs.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-status-normal-bg text-status-normal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-sm font-bold text-ink">Lab queue is clear</p>
              <p className="mt-0.5 text-xs font-medium text-ink-3">No pending lab orders awaiting results</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {pendingLabs.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3 transition-colors hover:bg-bg/40 rounded-xl px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-xs font-bold text-accent">
                      {getInitials(l.ptName || "")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => viewPatient(l.patientId)} className="cursor-pointer text-sm font-bold text-ink hover:text-accent hover:underline text-left">
                          {l.ptName}
                        </button>
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                          {l.testName}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink-3">Ordered by {l.requestedBy} · {formatFullDate(l.timeRequested)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => viewPatient(l.patientId)} className="cursor-pointer rounded-xl border border-border px-3.5 py-1.5 text-xs font-bold text-ink-2 hover:bg-bg-2">View Chart</button>
                    <button onClick={() => setResultFor({ patientId: l.patientId, labId: l.id, testName: l.testName })} className="cursor-pointer rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover">Enter Result</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : pendingRx.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-status-normal-bg text-status-normal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-sm font-bold text-ink">Dispensary queue is clear</p>
            <p className="mt-0.5 text-xs font-medium text-ink-3">All prescribed medications have been dispensed</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {pendingRx.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 transition-colors hover:bg-bg/40 rounded-xl px-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-normal-bg font-serif text-xs font-bold text-status-normal">
                    {getInitials(r.ptName || "")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => viewPatient(r.patientId)} className="cursor-pointer text-sm font-bold text-ink hover:text-accent hover:underline text-left">
                        {r.ptName}
                      </button>
                      <span className="font-bold text-sm text-ink">{r.medication}</span>
                      <span className="rounded bg-bg-2 px-2 py-0.5 text-xs font-semibold text-ink-2 border border-border">{r.dosage}</span>
                    </div>
                    <p className="text-xs font-medium text-ink-3 italic">&quot;{r.instructions}&quot; · by {r.prescribedBy}</p>
                  </div>
                </div>
                <button onClick={() => viewPatient(r.patientId)} className="cursor-pointer rounded-xl bg-status-normal px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90">Dispense</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {resultFor && (
        <EnterLabResultModal open={!!resultFor} onClose={() => setResultFor(null)} patientId={resultFor.patientId} labId={resultFor.labId} testName={resultFor.testName} />
      )}
    </div>
  );
}
