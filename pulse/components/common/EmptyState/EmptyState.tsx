import { cn } from "@/lib/utils";
import Button from "@/components/common/Button/Button";

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="mb-2 text-3xl opacity-20">{icon}</div>
      <div className="mb-1 text-sm font-semibold text-ink-2">{title}</div>
      <div className="text-xs text-ink-3">{subtitle}</div>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button label={actionLabel} onClick={onAction} />
        </div>
      )}
    </div>
  );
}
