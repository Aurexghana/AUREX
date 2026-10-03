import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LoginFlow from "@/components/LoginFlow";

export const metadata: Metadata = {
  title: "Log In | AUREX",
  description: "Log in to your AUREX account as an Investor or a Business Owner.",
};

/**
 * Reached from the navbar's "Login" link (see Navbar.tsx). There's no real
 * account system yet, so this doesn't check credentials - entering
 * anything and submitting takes you straight to the dashboard matching
 * whichever role you picked (see LoginFlow), the only place logging in
 * currently needs to lead.
 *
 * Same minimal chrome as the application flows and ApplicationStatusScreen
 * (logo + centered card, no site Navbar/Footer) - this is a focused,
 * single-purpose screen, not a marketing page.
 */
export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <LoginFlow />
      </div>
    </main>
  );
}
