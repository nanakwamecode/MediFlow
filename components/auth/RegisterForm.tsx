"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

type Step = "details" | "otp";

export default function RegisterForm() {
  const [step, setStep] = useState<Step>("details");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { register, error: apiError, clearError } = useAuthStore();
  const router = useRouter();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg-2 px-4 py-3",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]",
    "disabled:opacity-50"
  );

  const handleSendOtp = async () => {
    setLocalError("");
    clearError();

    if (!username.trim() || !password || !phone.trim()) {
      setLocalError("Username, phone, and password are required.");
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

    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), type: "register" }),
      });
      const json = await res.json();

      if (!res.ok) {
        setLocalError(json.error || "Failed to send OTP.");
        setSendingOtp(false);
        return;
      }

      if (json.devCode) setDevCode(json.devCode);
      setStep("otp");
      setCooldown(60);
    } catch {
      setLocalError("Network error. Please try again.");
    }
    setSendingOtp(false);
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setSendingOtp(true);
    setLocalError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), type: "register" }),
      });
      const json = await res.json();

      if (!res.ok) {
        setLocalError(json.error || "Failed to resend OTP.");
      } else {
        if (json.devCode) setDevCode(json.devCode);
        setCooldown(60);
      }
    } catch {
      setLocalError("Network error.");
    }
    setSendingOtp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (step === "details") {
      await handleSendOtp();
      return;
    }

    // Step 2: verify OTP and register
    if (!otpCode || otpCode.length !== 6) {
      setLocalError("Please enter the 6-digit OTP code.");
      return;
    }

    setSubmitting(true);
    const success = await register({
      username: username.trim(),
      password,
      displayName: displayName.trim() || undefined,
      phone: phone.trim(),
      otpCode,
    });
    setSubmitting(false);

    if (success) {
      router.push("/dashboard");
    }
  };

  const error = localError || apiError;

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-6 text-center text-sm text-ink-3 leading-relaxed">
        {step === "details"
          ? "Create your account to get started"
          : "Enter the verification code"}
      </p>

      {error && (
        <div className="mb-3.5 rounded-lg border border-status-high-border bg-status-high-bg px-3.5 py-2.5 text-xs text-status-high">
          {error}
        </div>
      )}

      {step === "details" ? (
        <>
          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Dr. Ama Boateng"
              disabled={sendingOtp}
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
              disabled={sendingOtp}
              className={fieldClass}
            />
          </div>

          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0241234567"
              disabled={sendingOtp}
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
              disabled={sendingOtp}
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
              disabled={sendingOtp}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={sendingOtp || !username.trim() || !password || !phone.trim()}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {sendingOtp ? "Sending OTP…" : "Continue"}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-border bg-bg-2 px-4 py-3 text-center">
            <p className="text-xs text-ink-3">
              A 6-digit code was sent to
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-ink">
              {phone}
            </p>
          </div>

          {devCode && (
            <div className="mb-3.5 rounded-lg border border-blue/30 bg-blue-bg/50 px-3.5 py-2.5 text-center">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-blue/70">
                Dev Mode — OTP Code
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-blue">
                {devCode}
              </p>
            </div>
          )}

          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              disabled={submitting}
              className={cn(fieldClass, "text-center text-lg tracking-[0.4em]")}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={submitting || otpCode.length !== 6}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {submitting ? "Creating account…" : "Verify & Create Account"}
          </button>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setOtpCode("");
                setLocalError("");
              }}
              className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || sendingOtp}
              className={cn(
                "cursor-pointer text-xs font-semibold transition-colors",
                cooldown > 0
                  ? "text-ink-4 cursor-default"
                  : "text-accent hover:text-accent-hover"
              )}
            >
              {sendingOtp
                ? "Sending…"
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend Code"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
