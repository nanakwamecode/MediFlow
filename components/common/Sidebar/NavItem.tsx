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
      className={cn(
        "flex w-full items-center gap-3 overflow-hidden rounded-xl border-none",
        "px-3.5 py-2.5 text-left text-sm font-semibold whitespace-nowrap",
        "cursor-pointer transition-all duration-150 no-underline",
        active
          ? "bg-accent text-white shadow-md shadow-accent/20 font-bold"
          : "bg-transparent text-ink-2 hover:bg-bg-2 hover:text-ink"
      )}
    >
      <span className={cn(
        "flex shrink-0 items-center justify-center transition-transform",
        active ? "scale-105" : ""
      )}>
        <NavIcon name={icon} className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "overflow-hidden transition-opacity duration-150",
          collapsed && "opacity-0"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
