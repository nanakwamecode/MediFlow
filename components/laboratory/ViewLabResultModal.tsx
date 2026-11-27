"use client";

import Modal from "@/components/common/Modal/Modal";
import { formatFullDate } from "@/lib/constants";
import { exportSingleLabResultPdf } from "@/components/laboratory/LabResultPrintView";
import LabResultFormattedView from "./LabResultFormattedView";

interface Props {
  open: boolean;
  onClose: () => void;
  labId?: number;
  testName: string;
  result: string;
  timeCompleted?: string;
  timeRequested?: string;
  requestedBy?: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  patientOpdNumber?: string;
}

export default function ViewLabResultModal({
  open,
  onClose,
  labId,
  testName,
  result,
  timeCompleted,
  timeRequested,
  requestedBy,
  patientName,
  patientAge,
  patientGender,
  patientOpdNumber,
}: Props) {
  const handleExportPdf = () => {
    exportSingleLabResultPdf({
      patientName: patientName || "Unknown Patient",
      patientAge,
      patientGender,
      patientOpdNumber,
      lab: {
        id: labId,
        testName,
        result,
        timeRequested: timeRequested || "",
        timeCompleted,
        requestedBy: requestedBy || "",
        status: "completed",
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Lab Report — ${testName}`} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Patient & Doctor Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border bg-bg/60 px-4 py-2.5 text-xs font-semibold text-ink-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {timeCompleted && (
              <div>
                <span className="font-bold text-ink-2 uppercase tracking-wide mr-1">Completed:</span>
                <span className="text-ink font-bold">{formatFullDate(timeCompleted)}</span>
              </div>
            )}
            {requestedBy && (
              <div>
                <span className="font-bold text-ink-2 uppercase tracking-wide mr-1">Doctor:</span>
                <span className="text-ink font-bold">{requestedBy}</span>
              </div>
            )}
          </div>
          <span className="rounded-full bg-status-normal-bg border border-status-normal-border px-2.5 py-0.5 text-xs font-bold text-status-normal uppercase tracking-wider">
            Verified Result
          </span>
        </div>

        {/* Structured Smart Result View */}
        <div className="rounded-2xl border border-border bg-card p-5 max-h-[440px] overflow-y-auto shadow-sm">
          <LabResultFormattedView result={result} />
        </div>
      </div>

      <div className="flex justify-end gap-2.5 mt-5">
        <button
          onClick={handleExportPdf}
          className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button onClick={onClose} className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-md transition-colors">
          Close
        </button>
      </div>
    </Modal>
  );
}
