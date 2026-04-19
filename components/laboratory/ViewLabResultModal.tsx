import Modal from "@/components/common/Modal/Modal";
import { formatFullDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  testName: string;
  result: string;
  timeCompleted?: string;
  requestedBy?: string;
}

export default function ViewLabResultModal({ open, onClose, testName, result, timeCompleted, requestedBy }: Props) {
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
      <div className="flex justify-end mt-4">
         <button onClick={onClose} className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover hover:shadow-md">
           Close
         </button>
      </div>
    </Modal>
  );
}
