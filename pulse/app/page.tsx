"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    router.replace(isLoggedIn ? "/dashboard" : "/login");
  }, [isLoggedIn, router]);

  return null;
}
