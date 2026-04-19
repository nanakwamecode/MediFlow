import { cn } from "@/lib/utils";
import { NavIcon } from "./NavIcon";

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
          ? "bg-accent text-white font-semibold shadow-md"
          : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className={cn(
        "flex shrink-0 items-center justify-center transition-transform",
        active ? "scale-110" : ""
      )}>
        <NavIcon name={icon} className="h-6 w-6" />
      </span>
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
