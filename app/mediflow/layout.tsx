"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { Sidebar } from "@/components/common/Sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen min-w-0 flex-1 overflow-y-auto",
          "transition-[margin-left] duration-250 ease-[cubic-bezier(.4,0,.2,1)]",
          sidebarCollapsed ? "ml-[52px]" : "ml-[224px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
