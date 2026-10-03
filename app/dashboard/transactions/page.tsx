"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyTransactions, type Transaction } from "@/lib/transactions";

/**
 * Reached from the Earnings tab's "Transaction History" link. Lives under
 * /dashboard so it inherits the dashboard shell (header, welcome banner,
 * auth guard) — it just isn't one of the four tabs itself.
 */
export default function DashboardTransactionsPage() {
  const { user, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const userId = user?.id;

  useEffect(() => {
    if (isLoading || !userId) return;
    let cancelled = false;
    getMyTransactions(userId)
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoading, userId, attempt]);

  const retry = useCallback(() => {
    setError(false);
    setTransactions(null);
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/earnings"
        className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
      >
        ← Back to Earnings
      </Link>

      {error ? (
        <div className="flex flex-col items-center gap-3 border border-[#f87171]/30 bg-[#f87171]/5 py-12 text-center">
          <p role="alert" className="font-sans text-sm text-[#f87171]">
            Something went wrong loading your transactions.
          </p>
          <button
            type="button"
            onClick={retry}
            className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : transactions === null ? (
        <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
}
