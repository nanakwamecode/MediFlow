"use client";

import Modal from "@/components/common/Modal/Modal";
import { formatFullDate } from "@/lib/constants";
import { exportSingleLabResultPdf } from "@/components/laboratory/LabResultPrintView";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
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
        testName,
        result,
        timeRequested: timeRequested || "",
        timeCompleted,
        requestedBy: requestedBy || "",
        status: "completed",
      },
    });
  };

  // Render lines with highlighted flags
  const renderFormattedLine = (line: string, idx: number) => {
    if (line.includes("(") && line.includes(")") && line.includes("[Ref:")) {
      const isHigh = line.includes("(High)");
      const isCritical = line.includes("(Critical)");
      const isLow = line.includes("(Low)");
      const isNormal = line.includes("(Normal)");

      return (
        <div
          key={idx}
          className={cn(
            "my-1 rounded-lg p-2 font-mono text-xs transition-colors",
            isCritical ? "bg-status-crisis/15 border border-status-crisis text-status-crisis font-bold" :
            isHigh ? "bg-status-high-bg border border-status-high-border text-status-high font-bold" :
            isLow ? "bg-blue-bg border border-blue/30 text-blue font-bold" :
            isNormal ? "bg-status-normal-bg/60 border border-status-normal-border/60 text-ink" :
            "text-ink"
          )}
        >
          {line}
        </div>
      );
    }
    return <div key={idx} className="font-mono text-xs text-ink py-0.5 leading-relaxed">{line}</div>;
  };

  return (
    <Modal open={open} onClose={onClose} title={`Lab Report — ${testName}`} maxWidth="max-w-2xl">
      <div className="mb-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-ink-3">
          {timeCompleted && <div><span className="font-bold text-ink-2 uppercase">Completed:</span> {formatFullDate(timeCompleted)}</div>}
          {requestedBy && <div><span className="font-bold text-ink-2 uppercase">Doctor:</span> {requestedBy}</div>}
        </div>
        <div className="rounded-2xl border border-border bg-bg/60 p-4 max-h-[380px] overflow-y-auto">
          {result.split("\n").map((line, i) => renderFormattedLine(line, i))}
        </div>
      </div>
      <div className="flex justify-end gap-2.5 mt-5">
        <button
          onClick={handleExportPdf}
          className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-ink-2 hover:bg-bg-2 flex items-center gap-1.5 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button onClick={onClose} className="cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white hover:bg-accent-hover shadow-md">
          Close
        </button>
      </div>
    </Modal>
  );
}
