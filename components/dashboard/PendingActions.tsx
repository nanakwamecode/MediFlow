"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LabInvestigation, Prescription } from "@/types";
import { formatShortDate } from "@/lib/constants";

interface PendingActionsProps {
  pendingLabs: (LabInvestigation & { ptId: string; ptName: string })[];
  pendingPrescriptions: (Prescription & { ptId: string; ptName: string })[];
  onDispense: (patientId: string, prescriptionId: number) => void;
  onEnterLab: (patientId: string, labId: number, testName: string) => void;
}

export default function PendingActions({
  pendingLabs,
  pendingPrescriptions,
  onDispense,
  onEnterLab,
}: PendingActionsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-ink-3 uppercase block mb-3">
          Clinic Tasks Queue
        </span>

        {/* Labs Section */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              Pending Lab Requests ({pendingLabs.length})
            </span>
            <Link href="/dashboard/labs" className="text-[0.68rem] font-bold text-accent hover:underline no-underline">
              Manage Labs
            </Link>
          </div>

          {pendingLabs.length === 0 ? (
            <div className="text-[0.72rem] text-ink-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              No pending laboratory requests.
            </div>
          ) : (
            <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
              {pendingLabs.slice(0, 3).map((lab) => (
                <div
                  key={lab.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-cyan-500/20 transition-all duration-300"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="font-mono text-[0.58rem] text-ink-3 block">
                      {lab.ptName} · {formatShortDate(lab.timeRequested)}
                    </span>
                    <span className="text-[0.75rem] font-bold text-ink block truncate mt-0.5">
                      {lab.testName}
                    </span>
                  </div>
                  <button
                    onClick={() => onEnterLab(lab.ptId, lab.id, lab.testName)}
                    className="cursor-pointer text-[0.62rem] font-bold text-cyan-700 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-lg hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors"
                  >
                    Enter Result
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pharmacy Section */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Prescriptions to Dispense ({pendingPrescriptions.length})
            </span>
            <Link href="/dashboard/pharmacy" className="text-[0.68rem] font-bold text-accent hover:underline no-underline">
              Manage Pharmacy
            </Link>
          </div>

          {pendingPrescriptions.length === 0 ? (
            <div className="text-[0.72rem] text-ink-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              No pending pharmacy prescriptions.
            </div>
          ) : (
            <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
              {pendingPrescriptions.slice(0, 3).map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="font-mono text-[0.58rem] text-ink-3 block">
                      {prescription.ptName} · {formatShortDate(prescription.timePrescribed)}
                    </span>
                    <span className="text-[0.75rem] font-bold text-ink block truncate mt-0.5">
                      {prescription.medication} ({prescription.dosage})
                    </span>
                  </div>
                  <button
                    onClick={() => onDispense(prescription.ptId, prescription.id)}
                    className="cursor-pointer text-[0.62rem] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors"
                  >
                    Dispense
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
