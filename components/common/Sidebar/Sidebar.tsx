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
        "fixed top-0 left-0 z-100 flex h-screen flex-col overflow-hidden bg-ink",
        "transition-[width] duration-250 ease-[cubic-bezier(.4,0,.2,1)]",
        sidebarCollapsed ? "w-[52px]" : "w-[224px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-white/8">
        <div
          className={cn(
            "flex items-center gap-2.5 overflow-hidden pl-4 whitespace-nowrap transition-opacity duration-150",
            sidebarCollapsed && "pointer-events-none opacity-0"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-[1.45rem] font-medium text-white tracking-wide leading-none mt-0.5">
              MediFlow
            </h1>
            <p className="mt-0.5 font-mono text-[0.58rem] tracking-[0.22em] text-accent uppercase font-bold">
              Clinic System
            </p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="flex h-[62px] shrink-0 cursor-pointer items-center justify-center px-4 text-white/40 transition-colors hover:text-white/80"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-hidden p-3 px-2">
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
      <div className={cn("shrink-0 overflow-hidden border-t border-white/8 transition-all", sidebarCollapsed ? "p-2" : "p-3 px-3")}>
        <button
          onClick={() => setProfileOpen(true)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-white/10",
            sidebarCollapsed ? "justify-center p-0 h-[36px] w-[36px]" : "p-2 mb-1.5"
          )}
          title="View Profile"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 font-serif text-[0.8rem] font-bold text-accent shadow-inner">
            {user?.displayName ? user.displayName.replace('Dr. ', '').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : "DR"}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-[0.8rem] font-semibold text-white/90 tracking-wide">
                {user?.displayName ?? "Doctor"}
              </div>
              <div className="flex items-center gap-1.5 text-[0.6rem] font-mono text-white/40">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-normal shadow-[0_0_5px_rgba(74,222,128,0.5)] animate-pulse" />
                Active · {patientCount} pt{patientCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full rounded-md bg-transparent text-center font-mono text-[0.65rem] tracking-[0.1em] uppercase",
            "cursor-pointer text-white/30 transition-all",
            "hover:bg-status-crisis/15 hover:text-status-crisis",
            sidebarCollapsed ? "hidden" : "py-1.5 mt-0.5"
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
