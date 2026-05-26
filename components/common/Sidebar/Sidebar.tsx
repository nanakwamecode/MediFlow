"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import type { NavKey } from "@/lib/constants";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { usePatientStore } from "@/store/patientStore";
import ProfileModal from "@/components/auth/ProfileModal";
import NavItem from "./NavItem";

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const patientCount = usePatientStore((s) => s.patients.length);
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
        "fixed top-0 left-0 z-100 flex h-screen flex-col overflow-hidden bg-slate-950 border-r border-slate-900",
        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        sidebarCollapsed ? "w-[52px]" : "w-[224px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/5 px-3">
        <div
          className={cn(
            "flex items-center gap-2.5 overflow-hidden pl-1 whitespace-nowrap transition-all duration-300",
            sidebarCollapsed && "pointer-events-none opacity-0 translate-x-2"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover ring-1 ring-white/10 shadow-lg shadow-accent/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[1.2rem] font-bold text-white tracking-tight leading-none mt-0.5">
              MediFlow
            </h1>
            <p className="mt-0.5 font-mono text-[0.52rem] tracking-[0.25em] text-accent uppercase font-bold">
              Clinic Platform
            </p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="flex h-[64px] shrink-0 cursor-pointer items-center justify-center px-2 text-white/40 transition-colors hover:text-white/80"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-hidden p-3 px-2">
        {NAV_ITEMS.map((item) => {
          const segments = pathname.split('/').filter(Boolean);
          const currentTab = segments.length > 1 ? segments[1] : "dashboard";
          return (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={currentTab === item.key}
            collapsed={sidebarCollapsed}
            href={item.key === "dashboard" ? "/dashboard" : `/dashboard/${item.key}`}
            onClick={() => {
              useUiStore.getState().clearViewingPatient();
            }}
          />
        )})}
      </nav>

      {/* Footer */}
      <div className={cn("shrink-0 overflow-hidden border-t border-white/5 transition-all duration-300", sidebarCollapsed ? "p-2" : "p-3 px-3")}>
        <button
          onClick={() => setProfileOpen(true)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/5 text-left transition-all duration-300 hover:bg-white/10 hover:border-white/10 hover:scale-[1.01]",
            sidebarCollapsed ? "justify-center p-0 h-[36px] w-[36px]" : "p-2.5 mb-1.5"
          )}
          title="View Profile"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent/30 to-accent/10 font-bold text-[0.8rem] text-accent border border-accent/20 shadow-inner">
            {user?.displayName ? user.displayName.replace('Dr. ', '').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : "DR"}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-[0.8rem] font-semibold text-white/90 tracking-wide">
                {user?.displayName ?? "Doctor"}
              </div>
              <div className="flex items-center gap-1.5 text-[0.6rem] font-mono text-white/40">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                Active · {patientCount} pt{patientCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full rounded-xl bg-transparent text-center font-mono text-[0.65rem] tracking-[0.12em] uppercase py-2",
            "cursor-pointer text-white/30 transition-all duration-300",
            "hover:bg-red-500/10 hover:text-red-400",
            sidebarCollapsed ? "hidden" : "mt-1"
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
