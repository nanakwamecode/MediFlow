"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp" | "reset";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

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
    setError("");
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), type: "reset" }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to send OTP.");
        setSubmitting(false);
        return;
      }

      if (json.devCode) setDevCode(json.devCode);
      setStep("otp");
      setCooldown(60);
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    // Just move to reset step — actual verification happens with reset
    setStep("reset");
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword) {
      setError("New password is required.");
      return;
    }
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: otpCode,
          newPassword,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to reset password.");
        setSubmitting(false);
        return;
      }

      setSuccess("Password reset successfully! Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), type: "reset" }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to resend.");
      } else {
        if (json.devCode) setDevCode(json.devCode);
        setCooldown(60);
      }
    } catch {
      setError("Network error.");
    }
    setSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "phone") handleSendOtp();
    else if (step === "otp") handleVerifyOtp();
    else handleResetPassword();
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-6 text-center text-sm text-ink-3 leading-relaxed">
        {step === "phone" && "Enter your phone number to recover your account"}
        {step === "otp" && "Enter the verification code"}
        {step === "reset" && "Set your new password"}
      </p>

      {error && (
        <div className="mb-3.5 rounded-lg border border-status-high-border bg-status-high-bg px-3.5 py-2.5 text-xs text-status-high">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3.5 rounded-lg border border-status-normal/30 bg-status-normal-bg px-3.5 py-2.5 text-xs text-status-normal">
          {success}
        </div>
      )}

      {step === "phone" && (
        <>
          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your registered phone number"
              disabled={submitting}
              className={fieldClass}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !phone.trim()}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {submitting ? "Sending OTP…" : "Send Verification Code"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="mb-4 rounded-lg border border-border bg-bg-2 px-4 py-3 text-center">
            <p className="text-xs text-ink-3">A 6-digit code was sent to</p>
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
            disabled={otpCode.length !== 6}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Verify Code
          </button>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtpCode("");
                setError("");
              }}
              className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || submitting}
              className={cn(
                "cursor-pointer text-xs font-semibold transition-colors",
                cooldown > 0
                  ? "text-ink-4 cursor-default"
                  : "text-accent hover:text-accent-hover"
              )}
            >
              {submitting
                ? "Sending…"
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend Code"}
            </button>
          </div>
        </>
      )}

      {step === "reset" && (
        <>
          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 4 characters"
              disabled={submitting}
              className={fieldClass}
              autoFocus
            />
          </div>

          <div className="mb-3.5">
            <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              disabled={submitting}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !newPassword}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-lg bg-accent px-4 py-3",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {submitting ? "Resetting…" : "Reset Password"}
          </button>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setStep("otp");
                setError("");
              }}
              className="cursor-pointer text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </form>
  );
}
