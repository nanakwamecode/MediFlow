import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your MediFlow Clinic System account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-ink">
      {/* Left — Branding Panel (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between overflow-hidden sticky top-0 h-screen">
        {/* Warm burgundy gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1a15] via-[#3d2418] to-[#1a0f0a]" />

        {/* Warm tint overlay */}
        <div className="absolute inset-0 bg-accent/[0.04]" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Dynamic ambient glow orbs */}
        <div className="absolute -left-20 -top-20 h-[600px] w-[600px] rounded-full bg-accent/[0.18] blur-[140px] animate-orb-1" />
        <div className="absolute -bottom-32 -right-12 h-[500px] w-[500px] rounded-full bg-accent/[0.14] blur-[120px] animate-orb-2" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-accent/[0.10] blur-[100px] animate-orb-1" />

        {/* Top branding */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 backdrop-blur-sm ring-1 ring-accent/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-4xl text-white/90 tracking-wide">MediFlow</h2>
              <p className="font-mono text-[0.65rem] tracking-[0.3em] text-accent/80 uppercase">Clinic System</p>
            </div>
          </div>
        </div>

        {/* Center hero content */}
        <div className="relative z-10 px-12 pb-12 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h1 className="mb-6 font-serif text-[3.2rem] leading-[1.1] tracking-tight text-white/95">
            Clinical
            <br />
            <span className="italic text-accent inline-block animate-float">Intelligence,</span>
            <br />
            Simplified.
          </h1>
          <p className="max-w-[380px] text-[0.95rem] leading-relaxed text-white/40">
            Streamline patient care with a unified platform for vitals, consultations, labs, and prescriptions.
          </p>
        </div>
      </div>

      {/* Right — Login Form Panel (scrollable) */}
      <div className="relative flex w-full flex-col lg:w-[45%] min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f1] to-[#f0ece6]" />

        {/* Decorative corner accents */}
        <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-accent/5 to-transparent" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-accent/3 to-transparent" />

        {/* Scrollable content — centered vertically */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 animate-slide-left" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {/* Mobile branding (only shown on mobile) */}
          <div className="mb-10 lg:hidden text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl text-ink italic">MediFlow</h1>
            <p className="mt-1 font-mono text-[0.65rem] tracking-[0.22em] text-ink-3 uppercase">
              Clinic Management System
            </p>
          </div>

          {/* Form card */}
          <div className="w-full max-w-[420px]">
            {/* Welcome heading */}
            <div className="mb-10">
              <h2 className="font-serif text-[2.2rem] tracking-tight text-ink leading-tight">
                Welcome back
              </h2>
              <p className="mt-3 text-base text-ink-3 leading-relaxed">
                Sign in to continue managing your clinic
              </p>
            </div>

            <LoginForm />

            {/* Divider */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-wide text-ink-4">
                New to MediFlow?
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Register link */}
            <Link
              href="/register"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-border bg-white/60 px-5 py-3.5 text-base font-semibold text-ink-2 no-underline transition-all hover:-translate-y-px hover:border-accent/30 hover:text-accent hover:shadow-md active:translate-y-0"
            >
              Create an Account
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
