"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, error: apiError, clearError } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!username.trim() || !password) {
      setLocalError("Username and password are required.");
      return;
    }
    if (password.length < 4) {
      setLocalError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const success = await register({
      username: username.trim(),
      password,
      displayName: displayName.trim() || undefined,
    });
    setSubmitting(false);

    if (success) router.push("/mediflow");
  };

  const error = localError || apiError;

  const inputClass = cn(
    "w-full rounded-xl border border-border bg-white px-4 py-3",
    "text-sm font-medium text-ink outline-none transition-all",
    "placeholder:text-ink-4 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.08)]",
    "disabled:opacity-50"
  );
  const labelClass = "mb-1.5 flex items-center gap-1.5 text-xs font-bold text-ink-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-status-high-border bg-status-high-bg px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-status-high" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-xs font-bold text-status-high">{error}</span>
        </div>
      )}

      <div>
        <label className={labelClass}>Display Name</label>
        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Dr. Ama Boateng" disabled={submitting} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Username *</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" disabled={submitting} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Password *</label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 4 characters" disabled={submitting} className={cn(inputClass, "pr-11")} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-ink-3 hover:text-ink" tabIndex={-1}>
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className={labelClass}>Confirm Password *</label>
        <input type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" disabled={submitting} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={submitting || !username.trim() || !password}
        className="w-full cursor-pointer rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
