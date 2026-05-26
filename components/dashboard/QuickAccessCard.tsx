"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
  gradient: string;
}

export default function QuickAccessCard({
  title,
  description,
  href,
  icon,
  count,
  gradient,
}: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl",
        "border border-border bg-card p-4",
        "shadow-card transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:border-accent hover:shadow-lg"
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0",
          "transition-opacity duration-500 group-hover:opacity-100",
          gradient
        )}
      />

      {/* Icon pill */}
      <div
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center",
          "h-11 w-11 rounded-2xl backdrop-blur-sm",
          "bg-white/80 text-accent shadow-sm",
          "transition-transform duration-500 group-hover:scale-110"
        )}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-sans text-sm font-semibold text-ink">
            {title}
          </span>
          {count !== undefined && (
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-3">{description}</p>
      </div>

      {/* Arrow */}
      <span
        className={cn(
          "relative z-10 translate-x-3 text-ink-4 opacity-0",
          "transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
          "group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
        )}
      >
        →
      </span>
    </Link>
  );
}
