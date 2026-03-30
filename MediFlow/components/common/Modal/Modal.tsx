"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
}: Props) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, handleEsc]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-500 flex items-center justify-center p-5",
        "bg-ink/55 backdrop-blur-sm transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "w-full rounded-2xl bg-card p-6 shadow-lg",
          "max-h-[92vh] overflow-y-auto",
          "transition-transform duration-200",
          open ? "scale-100" : "scale-[0.97]",
          maxWidth
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-3 transition-colors hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
