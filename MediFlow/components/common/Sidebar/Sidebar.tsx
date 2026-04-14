"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const { sidebarCollapsed, toggleSidebar, activePage, setActivePage } =
    useUiStore();
  const { user, logout } = useAuthStore();
  const patientCount = usePatientStore((s) => s.patients.length);
  const router = useRouter();

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
            "flex flex-col overflow-hidden pl-[18px] whitespace-nowrap transition-opacity duration-150",
            sidebarCollapsed && "pointer-events-none opacity-0"
          )}
        >
          <h1 className="font-serif text-[1.35rem] font-medium text-white tracking-wide leading-none">
            MediFlow
          </h1>
          <p className="mt-0.5 font-mono text-[0.55rem] tracking-[0.2em] text-accent uppercase font-bold">
            Clinic System
          </p>
        </div>
        <button
          onClick={toggleSidebar}
          className="flex h-[62px] shrink-0 cursor-pointer items-center justify-center px-4 text-white/40 transition-colors hover:text-white/80"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-hidden p-3 px-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activePage === item.key}
            collapsed={sidebarCollapsed}
            onClick={() => setActivePage(item.key as NavKey)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 overflow-hidden border-t border-white/8 p-3 px-2">
        <div className="flex items-center gap-2 overflow-hidden px-2.5 py-1.5">
          <div className="h-1.5 w-1.5 shrink-0 animate-blink rounded-full bg-green-400" />
          <span
            className={cn(
              "flex-1 overflow-hidden font-mono text-[0.65rem] text-white/35 whitespace-nowrap transition-opacity",
              sidebarCollapsed && "opacity-0"
            )}
          >
            {user?.displayName ?? "—"} · {patientCount} pt
            {patientCount !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className={cn(
            "w-full rounded-md bg-transparent px-2.5 py-1.5 text-left font-mono text-[0.68rem]",
            "cursor-pointer text-white/70 whitespace-nowrap transition-all",
            "hover:bg-white/10 hover:text-white",
            sidebarCollapsed &&
              "pointer-events-auto flex justify-center py-2 text-base opacity-100"
          )}
          title="Profile"
          aria-label="Open profile settings"
        >
          {sidebarCollapsed ? "⚙" : "Profile"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full rounded-md bg-transparent px-2.5 py-1.5 text-left font-mono text-[0.68rem]",
            "cursor-pointer text-white/60 whitespace-nowrap transition-all",
            "hover:bg-white/10 hover:text-red-300",
            sidebarCollapsed && "pointer-events-none opacity-0"
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
