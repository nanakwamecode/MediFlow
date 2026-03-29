import { cn } from "@/lib/utils";

interface ToastData {
  message: string;
  icon: string;
}

interface Props {
  data: ToastData | null;
}

export function Toast({ data }: Props) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9998] flex items-center gap-2",
        "rounded-lg bg-ink px-4 py-2.5 font-medium text-white shadow-lg",
        "text-xs transition-all duration-200",
        data
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      <span>{data?.icon}</span>
      <span>{data?.message}</span>
    </div>
  );
}
