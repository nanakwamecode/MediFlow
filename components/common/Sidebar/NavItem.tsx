import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavIcon } from "./NavIcon";

interface Props {
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  href: string;
  onClick?: () => void;
}

export default function NavItem({
  icon,
  label,
  active,
  collapsed,
  href,
  onClick,
}: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl no-underline",
        "cursor-pointer transition-all duration-200",
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-accent text-white shadow-md shadow-accent/20 font-bold"
          : "bg-transparent text-ink-2 hover:bg-bg-2 hover:text-ink"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center transition-transform duration-200",
          active && "scale-110"
        )}
      >
        <NavIcon name={icon} className="h-[18px] w-[18px]" />
      </span>

      <span
        className={cn(
          "text-sm font-semibold whitespace-nowrap transition-all duration-200",
          collapsed
            ? "w-0 opacity-0 overflow-hidden"
            : "w-auto opacity-100"
        )}
      >
        {label}
      </span>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <span
          className={cn(
            "pointer-events-none absolute left-full ml-2.5 z-50",
            "rounded-lg bg-ink px-2.5 py-1.5 text-xs font-bold text-white",
            "opacity-0 shadow-lg transition-opacity duration-150",
            "group-hover:opacity-100"
          )}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
