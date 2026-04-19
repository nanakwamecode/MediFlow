import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account | MediFlow",
  description: "Create your MediFlow Clinic System account.",
};

export default function RegisterPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ink p-6">
      <div className="w-full max-w-[420px] rounded-2xl bg-bg p-11 shadow-lg">
        <div className="mb-9 text-center">
          <h1 className="font-serif text-4xl text-ink italic">MediFlow</h1>
          <p className="mt-1 font-mono text-[0.62rem] tracking-[0.22em] text-ink-3 uppercase">
            Clinic Management System
          </p>
        </div>

        <RegisterForm />

        <div className="mt-4 text-center text-xs text-ink-3">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
