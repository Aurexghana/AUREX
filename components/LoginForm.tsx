"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { FormField, fieldClassName, PasswordInput } from "@/components/apply/FormField";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import type { LoginRole } from "@/components/LoginFlow";

function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const DASHBOARD_HREF: Record<string, string> = {
  investor: "/dashboard",
  business: "/business-dashboard",
};

export default function LoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await login(email, password, role);
      router.push(DASHBOARD_HREF[role]);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 p-5">
        <FormField label="Email Address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldClassName(false)}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          action={
            <Link
              href="/forgot-password"
              className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="password" name="password" required value={password} onChange={setPassword} />
        </FormField>
      </div>

      {submitError && (
        <div className="mx-5 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
          <p role="alert" className="font-sans text-xs text-[#f87171]">
            {submitError}
          </p>
        </div>
      )}

      <div className="p-5">
        <motion.button
          {...(submitting ? {} : hoverScale)}
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <SpinnerIcon className="size-4 animate-spin" /> : "Log In"}
        </motion.button>
      </div>

      <p className="text-center font-sans text-sm text-cream-dim">
        Don&apos;t have an account?{" "}
        <Link href="/apply/investor" className="font-medium text-gold-bright underline-offset-4 hover:underline">
          Apply as an Investor
        </Link>{" "}
        <span className="text-cream-dim/60">·</span>{" "}
        <Link href="/apply-business" className="font-medium text-gold-bright underline-offset-4 hover:underline">
          List Your Business
        </Link>
      </p>
    </form>
  );
}
