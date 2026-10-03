import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import ForgotPasswordFlow from "@/components/ForgotPasswordFlow";

export const metadata: Metadata = {
  title: "Forgot Password | AUREX",
  description: "Reset the password on your AUREX account.",
};

/**
 * Reached from LoginForm's "Forgot password?" link. Same minimal chrome as
 * /login and the application flows (logo + centered card, no site Navbar/
 * Footer) - a focused, single-purpose screen.
 */
export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <ForgotPasswordFlow />
      </div>
    </main>
  );
}
