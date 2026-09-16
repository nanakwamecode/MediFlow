"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    const mainGroup = [
      "/mediflow",
      "/mediflow/consultations",
      "/mediflow/labs",
      "/mediflow/pharmacy",
    ];

    if (!mainGroup.includes(pathname)) {
      // Lock them immediately
      mainGroup.forEach((route) => {
        sessionStorage.removeItem(`mediflow_pin_verified_${route}`);
      });
    }
  }, [pathname]);

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen min-w-0 flex-1 overflow-y-auto",
          "transition-[margin-left] duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
          /* Mobile: no margin, leave room for hamburger */
          "ml-0 pt-16 lg:pt-0",
          /* Desktop: match sidebar width */
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[232px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
