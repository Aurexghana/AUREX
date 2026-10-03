import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import ResetPasswordFlow from "@/components/ResetPasswordFlow";

export const metadata: Metadata = {
  title: "Reset Password | AUREX",
  description: "Choose a new password for your AUREX account.",
};

/**
 * The screen a "reset your password" email would link to (?token=...).
 * Same minimal chrome as /login and /forgot-password. ResetPasswordFlow
 * reads the token/email via useSearchParams, which Next.js requires a
 * Suspense boundary for on static builds - see that component's own
 * comment.
 */
export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <Suspense fallback={null}>
          <ResetPasswordFlow />
        </Suspense>
      </div>
    </main>
  );
}
