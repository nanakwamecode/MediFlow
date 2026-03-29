"use client";

import { ToastProvider } from "@/components/common/Toast/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
