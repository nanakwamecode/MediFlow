import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account | MediFlow",
  description: "Create your MediFlow Clinic System account.",
};

export default function RegisterPage() {
  return (
    <div className="fixed inset-0 flex bg-ink overflow-hidden">
      {/* Left — Branding Panel (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1612] via-[#2a1f18] to-[#0d0a08]" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Accent glow orbs */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute -bottom-40 right-10 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-accent/4 blur-[80px]" />

        {/* Top branding */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 backdrop-blur-sm ring-1 ring-accent/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-xl text-white/90 tracking-wide">MediFlow</h2>
              <p className="font-mono text-[0.5rem] tracking-[0.25em] text-accent/80 uppercase">Clinic System</p>
            </div>
          </div>
        </div>

        {/* Center hero content */}
        <div className="relative z-10 px-12 pb-12">
          <h1 className="mb-6 font-serif text-[3.2rem] leading-[1.1] tracking-tight text-white/95">
            Join the
            <br />
            <span className="italic text-accent">Future</span> of
            <br />
            Healthcare.
          </h1>
          <p className="max-w-[380px] text-[0.95rem] leading-relaxed text-white/40">
            Create your account and start managing patients, vitals, and prescriptions in seconds.
          </p>
        </div>
      </div>

      {/* Right — Register Form Panel (scrollable) */}
      <div className="relative flex w-full flex-col lg:w-[45%]">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f1] to-[#f0ece6]" />

        {/* Decorative corner accents */}
        <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-accent/5 to-transparent" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-accent/3 to-transparent" />

        {/* Scrollable content */}
        <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto px-6 py-12">
          {/* Mobile branding (only shown on mobile) */}
          <div className="mb-10 lg:hidden text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-ink italic">MediFlow</h1>
            <p className="mt-1 font-mono text-[0.55rem] tracking-[0.22em] text-ink-3 uppercase">
              Clinic Management System
            </p>
          </div>

          {/* Form card */}
          <div className="w-full max-w-[400px]">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="font-serif text-[1.8rem] tracking-tight text-ink leading-tight">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-ink-3 leading-relaxed">
                Get started in less than a minute
              </p>
            </div>

            <RegisterForm />

            {/* Divider */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[0.55rem] tracking-[0.15em] text-ink-4 uppercase">
                Already registered?
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Sign in link */}
            <Link
              href="/login"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-border bg-white/60 px-4 py-3 text-sm font-semibold text-ink-2 no-underline transition-all hover:-translate-y-px hover:border-accent/30 hover:text-accent hover:shadow-md active:translate-y-0"
            >
              Sign In Instead
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Footer spacer for scroll */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
