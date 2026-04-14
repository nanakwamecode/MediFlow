import { cn } from "@/lib/utils";

interface Props {
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export default function NavItem({
  icon,
  label,
  active,
  collapsed,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 overflow-hidden rounded-lg border-none",
        "px-3 py-3 text-left text-[0.9rem] font-medium whitespace-nowrap",
        "cursor-pointer transition-all duration-150",
        active
          ? "bg-accent/20 text-red-300"
          : "bg-transparent text-white/45 hover:bg-white/7 hover:text-white/80"
      )}
    >
      <span className="w-6 shrink-0 text-center text-[1.1rem]">{icon}</span>
      <span
        className={cn(
          "overflow-hidden transition-opacity duration-150",
          collapsed && "opacity-0"
        )}
      >
        {label}
      </span>
    </button>
  );
}
