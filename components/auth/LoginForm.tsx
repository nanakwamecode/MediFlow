"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password) return;

    setSubmitting(true);
    const success = await login({ username: username.trim(), password });
    setSubmitting(false);

    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-status-high-border bg-status-high-bg/60 px-4 py-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-status-high" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-xs font-medium text-status-high">{error}</span>
        </div>
      )}

      {/* Username */}
      <div className="group">
        <label className="mb-2 flex items-center gap-1.5 font-mono text-[0.6rem] font-medium tracking-[0.18em] text-ink-3 uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-ink-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          autoComplete="username"
          disabled={submitting}
          className={cn(
            "w-full rounded-xl border-[1.5px] border-border bg-white/80 px-4 py-3.5",
            "text-sm text-ink outline-none backdrop-blur-sm",
            "transition-all duration-200",
            "placeholder:text-ink-4/60",
            "focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(200,57,43,0.08),0_1px_3px_rgba(0,0,0,0.05)]",
            "hover:border-border-2 hover:bg-white",
            "disabled:opacity-50"
          )}
        />
      </div>

      {/* Password */}
      <div className="group">
        <label className="mb-2 flex items-center gap-1.5 font-mono text-[0.6rem] font-medium tracking-[0.18em] text-ink-3 uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-ink-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={submitting}
            className={cn(
              "w-full rounded-xl border-[1.5px] border-border bg-white/80 px-4 py-3.5 pr-11",
              "text-sm text-ink outline-none backdrop-blur-sm",
              "transition-all duration-200",
              "placeholder:text-ink-4/60",
              "focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(200,57,43,0.08),0_1px_3px_rgba(0,0,0,0.05)]",
              "hover:border-border-2 hover:bg-white",
              "disabled:opacity-50"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5 text-ink-4 transition-colors hover:text-ink-2"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-accent no-underline transition-all hover:text-accent-hover hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !username.trim() || !password}
        className={cn(
          "relative w-full cursor-pointer overflow-hidden rounded-xl bg-accent px-4 py-3.5",
          "text-sm font-semibold text-white",
          "transition-all duration-200",
          "hover:-translate-y-px hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20",
          "active:translate-y-0 active:shadow-none",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        {/* Button shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        <span className="relative flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  );
}
