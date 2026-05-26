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
        "group flex w-full items-center gap-3 overflow-hidden rounded-xl border-none",
        "px-3.5 py-3 text-left text-[0.88rem] font-medium whitespace-nowrap",
        "cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] no-underline relative",
        active
          ? "bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-lg shadow-accent/20 scale-[1.02]"
          : "bg-transparent text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-0.5"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-white animate-fade-in" />
      )}
      <span className={cn(
        "flex shrink-0 items-center justify-center transition-all duration-300",
        active ? "scale-105 text-white" : "text-white/60 group-hover:text-white group-hover:scale-105"
      )}>
        <NavIcon name={icon} className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "overflow-hidden transition-all duration-300",
          collapsed ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
