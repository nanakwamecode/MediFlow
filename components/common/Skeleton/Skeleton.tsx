import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "rounded";
}

export default function Skeleton({ className, variant = "rounded" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-border/60 via-border/30 to-border/60 bg-[length:200%_100%]",
        variant === "circular" && "rounded-full",
        variant === "rounded" && "rounded-xl",
        variant === "rectangular" && "rounded-none",
        className
      )}
    />
  );
}
