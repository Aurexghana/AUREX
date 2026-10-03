"use client";

import Link from "next/link";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

/**
 * Reached from the Earnings tab's "Transaction History" link. Lives under
 * /dashboard so it inherits the dashboard shell (header, welcome banner,
 * auth guard) — it just isn't one of the four tabs itself.
 */
export default function DashboardTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/earnings"
        className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
      >
        ← Back to Earnings
      </Link>

      <TransactionHistory />
    </div>
  );
}
