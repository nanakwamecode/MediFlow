"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, error: apiError, clearError } = useAuthStore();
  const router = useRouter();

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

    if (success) {
      router.push("/dashboard");
    }
  };

  const error = localError || apiError;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg-2 px-4 py-3",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]",
    "disabled:opacity-50"
  );

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-6 text-center text-sm text-ink-3 leading-relaxed">
        Create your account to get started
      </p>

      {error && (
        <div className="mb-3.5 rounded-lg border border-status-high-border bg-status-high-bg px-3.5 py-2.5 text-xs text-status-high">
          {error}
        </div>
      )}

      <div className="mb-3.5">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Dr. Ama Boateng"
          disabled={submitting}
          className={fieldClass}
        />
      </div>

      <div className="mb-3.5">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          disabled={submitting}
          className={fieldClass}
        />
      </div>

      <div className="mb-3.5">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 4 characters"
          disabled={submitting}
          className={fieldClass}
        />
      </div>

      <div className="mb-3.5">
        <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password"
          disabled={submitting}
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !username.trim() || !password}
        className={cn(
          "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
          "font-sans text-sm font-semibold text-white",
          "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
