import { cn } from "@/lib/utils";

interface Props {
  label: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  children?: React.ReactNode;
}

export default function Button({
  label,
  variant = "primary",
  size = "sm",
  className,
  disabled,
  onClick,
  type = "button",
  children,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg",
        "font-sans font-semibold whitespace-nowrap transition-all duration-150",
        "cursor-pointer disabled:cursor-default disabled:opacity-40",
        size === "sm" && "px-3.5 py-1.5 text-xs",
        size === "md" && "px-5 py-2.5 text-sm",
        variant === "primary" &&
          "bg-accent text-white hover:bg-accent-hover hover:-translate-y-px hover:shadow-md active:translate-y-0",
        variant === "outline" &&
          "border-[1.5px] border-border-2 bg-transparent text-ink-2 hover:border-ink-3 hover:bg-bg-2",
        variant === "ghost" &&
          "bg-transparent text-ink-3 hover:bg-bg-2 hover:text-ink-2",
        className
      )}
    >
      {children ?? label}
    </button>
  );
}
