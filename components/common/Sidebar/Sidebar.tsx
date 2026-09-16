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

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "h-4 w-4 transition-transform duration-300",
        collapsed && "rotate-180"
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </svg>
  );
}

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

  const userInitials = user?.displayName
    ? user.displayName
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          !sidebarCollapsed
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-dvh flex-col bg-card border-r border-border",
          "transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
          /* Desktop */
          "lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[68px]" : "lg:w-[232px]",
          /* Mobile: slides in/out */
          !sidebarCollapsed
            ? "w-[260px] translate-x-0"
            : "w-[260px] -translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Brand ── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border/60",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2.5 overflow-hidden transition-all duration-300",
              sidebarCollapsed && "lg:hidden"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-xl font-bold text-ink tracking-wide leading-none">
                MediFlow
              </h1>
              <p className="mt-0.5 text-[10px] font-bold text-accent tracking-widest uppercase">
                Clinic System
              </p>
            </div>
          </div>

          {/* Collapsed brand — icon only */}
          <div
            className={cn(
              "hidden items-center justify-center",
              sidebarCollapsed && "lg:flex"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>

          {/* Collapse button — desktop only */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center",
              "rounded-lg text-ink-3 hover:text-ink hover:bg-bg-2 transition-colors"
            )}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar"
          >
            <CollapseIcon collapsed={sidebarCollapsed} />
          </button>

          {/* Close button — mobile only */}
          <button
            onClick={toggleSidebar}
            className="flex lg:hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-3 hover:text-ink hover:bg-bg-2 transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav
          className={cn(
            "flex flex-1 flex-col gap-1 overflow-y-auto py-4",
            sidebarCollapsed ? "px-2" : "px-3"
          )}
        >
          {NAV_ITEMS.map((item) => {
            const segments = pathname.split("/").filter(Boolean);
            const currentTab =
              segments.length > 1 ? segments[1] : "dashboard";
            return (
              <NavItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={currentTab === item.key}
                collapsed={sidebarCollapsed}
                href={
                  item.key === "dashboard"
                    ? "/mediflow"
                    : `/mediflow/${item.key}`
                }
                onClick={() => {
                  useUiStore.getState().clearViewingPatient();
                  /* Auto-close sidebar on mobile after nav */
                  if (window.innerWidth < 1024 && !sidebarCollapsed) {
                    toggleSidebar();
                  }
                }}
              />
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div
          className={cn(
            "mt-auto shrink-0 border-t border-border/60 transition-all duration-300",
            sidebarCollapsed ? "p-2" : "p-3"
          )}
        >
          {/* Profile button */}
          <button
            onClick={() => setProfileOpen(true)}
            className={cn(
              "group flex w-full cursor-pointer items-center overflow-hidden",
              "rounded-xl border border-border/60 bg-bg/40 text-left",
              "transition-all duration-200 hover:bg-bg hover:border-border",
              sidebarCollapsed
                ? "justify-center p-2"
                : "gap-3 p-2.5"
            )}
            title="View Profile"
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full",
                "bg-accent/15 font-serif text-xs font-bold text-accent",
                "ring-1 ring-accent/20",
                sidebarCollapsed ? "h-8 w-8" : "h-9 w-9"
              )}
            >
              {userInitials}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden min-w-0">
                <div className="truncate text-xs font-bold text-ink">
                  {user?.displayName ?? "Doctor"}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-normal animate-pulse" />
                  Active · {patientCount} pt
                  {patientCount !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </button>

          {/* Sign out */}
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "mt-1.5 w-full rounded-lg bg-transparent py-2 text-center",
                "text-[11px] font-bold tracking-wide uppercase",
                "cursor-pointer text-ink-3 transition-all",
                "hover:bg-status-crisis/10 hover:text-status-crisis"
              )}
            >
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile hamburger trigger */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 left-4 z-30 flex lg:hidden h-10 w-10",
          "cursor-pointer items-center justify-center rounded-xl",
          "bg-card border border-border shadow-card",
          "text-ink-2 hover:text-ink transition-colors",
          !sidebarCollapsed && "opacity-0 pointer-events-none"
        )}
        aria-label="Open navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
