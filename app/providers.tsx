"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ToastProvider } from "@/components/common/Toast/ToastProvider";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthHydrator>{children}</AuthHydrator>
    </ToastProvider>
  );
}
