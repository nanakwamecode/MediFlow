import { cn } from "@/lib/utils";
import type { BpCategoryLabel } from "@/types";

interface Props {
  label: BpCategoryLabel;
  size?: "sm" | "md";
}

const PILL_STYLES: Record<BpCategoryLabel, string> = {
  Normal:
    "bg-status-normal-bg text-status-normal border-status-normal-border",
  Elevated: "bg-status-elevated-bg text-status-elevated border-transparent",
  High: "bg-status-high-bg text-status-high border-status-high-border",
  Crisis: "bg-status-crisis-bg text-status-crisis border-status-high-border",
};

export default function StatusPill({ label, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wider",
        size === "sm" && "px-1.5 py-0.5 text-[0.5rem]",
        size === "md" && "px-2 py-0.5 text-[0.57rem]",
        PILL_STYLES[label]
      )}
    >
      {label}
    </span>
  );
}
