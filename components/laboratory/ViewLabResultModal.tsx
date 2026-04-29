import Modal from "@/components/common/Modal/Modal";
import { formatFullDate } from "@/lib/constants";
import { exportSingleLabResultPdf } from "@/components/laboratory/LabResultPrintView";

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

  return (
    <Modal open={open} onClose={onClose} title={`Result — ${testName}`} maxWidth="max-w-2xl">
      <div className="mb-4">
        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.65rem] font-mono tracking-wider text-ink-3">
          {timeCompleted && <div><span className="opacity-70 uppercase">Completed:</span> {formatFullDate(timeCompleted)}</div>}
          {requestedBy && <div><span className="opacity-70 uppercase">Doctor:</span> {requestedBy}</div>}
        </div>
        <div className="rounded-xl border border-border-2 bg-bg p-5 overflow-x-auto shadow-inner">
          <pre className="font-mono text-[0.8rem] text-ink whitespace-pre-wrap leading-relaxed">{result}</pre>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleExportPdf}
          className="cursor-pointer rounded-lg border-[1.5px] border-border-2 bg-transparent px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:bg-bg-2 flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button onClick={onClose} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover hover:shadow-md">
          Close
        </button>
      </div>
    </Modal>
  );
}
