"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStats } from "@/hooks/queries/useDashboardStats";
import ProfileModal from "@/components/auth/ProfileModal";
import NavItem from "./NavItem";

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const { data: stats } = useDashboardStats();
  const patientCount = stats?.totalPatients ?? 0;
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm("Sign out?")) {
      await logout();
      router.push("/login");
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-100 flex h-screen flex-col overflow-hidden bg-card border-r border-border",
          "transition-[width] duration-250 ease-[cubic-bezier(.4,0,.2,1)]",
          sidebarCollapsed ? "w-[52px]" : "w-[224px]"
        )}
      >
        {/* Brand */}
        <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-border/60">
          <div
            className={cn(
              "flex items-center gap-2.5 overflow-hidden pl-4 whitespace-nowrap transition-opacity duration-150",
              sidebarCollapsed && "pointer-events-none opacity-0"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-[1.4rem] font-bold text-ink tracking-wide leading-none mt-0.5">
                MediFlow
              </h1>
              <p className="mt-0.5 text-xs font-bold text-accent tracking-wider uppercase">
                Clinic System
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg mr-3 text-ink-3 hover:text-ink hover:bg-bg/60 transition-colors"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-hidden p-3 px-2">
          {NAV_ITEMS.map((item) => {
            const segments = pathname.split("/").filter(Boolean);
            const currentTab = segments.length > 1 ? segments[1] : "dashboard";
            return (
              <NavItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={currentTab === item.key}
                collapsed={sidebarCollapsed}
                href={item.key === "dashboard" ? "/mediflow" : `/mediflow/${item.key}`}
                onClick={() => {
                  useUiStore.getState().clearViewingPatient();
                }}
              />
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn("shrink-0 overflow-hidden border-t border-border/60 transition-all", sidebarCollapsed ? "p-2" : "p-3 px-3")}>
          <button
            onClick={() => setProfileOpen(true)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-bg/50 text-left transition-all hover:bg-bg hover:border-border",
              sidebarCollapsed ? "justify-center p-0 h-[36px] w-[36px]" : "p-2.5 mb-1.5"
            )}
            title="View Profile"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-xs font-bold text-accent ring-1 ring-accent/20">
              {user?.displayName ? user.displayName.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "DR"}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-xs font-bold text-ink">
                  {user?.displayName ?? "Doctor"}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-status-normal animate-pulse" />
                  Active · {patientCount} pt{patientCount !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "w-full rounded-lg bg-transparent text-center text-xs font-bold tracking-wide uppercase",
              "cursor-pointer text-ink-3 transition-all",
              "hover:bg-status-crisis/10 hover:text-status-crisis",
              sidebarCollapsed ? "hidden" : "py-2 mt-0.5"
            )}
          >
            Sign Out
          </button>
        </div>
      </aside>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
