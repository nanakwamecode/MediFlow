"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    login({ username: username.trim(), displayName: username.trim() });
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-6 text-center text-sm text-ink-3 leading-relaxed">
        Sign in to access patient records
      </p>

      {error && (
        <div className="mb-3.5 rounded-lg border border-status-high-border bg-status-high-bg px-3.5 py-2.5 text-xs text-status-high">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-bg-2 px-4 py-3",
            "font-mono text-sm text-ink outline-none",
            "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
          )}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          className={cn(
            "w-full rounded-lg border-[1.5px] border-border bg-bg-2 px-4 py-3",
            "font-mono text-sm text-ink outline-none",
            "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]"
          )}
        />
      </div>

      <button
        type="submit"
        className={cn(
          "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
          "font-sans text-sm font-semibold text-white",
          "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
        )}
      >
        Sign In
      </button>
    </form>
  );
}
