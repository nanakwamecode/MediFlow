"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    // Always start fresh when hitting the root URL
    logout().then(() => {
      router.replace("/login");
    });
  }, [logout, router]);

  return null;
}
