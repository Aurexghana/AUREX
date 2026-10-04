"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * The dashboard header's Log out button, shared by the investor and business
 * shells. Clicking it opens a confirmation modal instead of signing out
 * straight away, so a stray click doesn't end the session.
 */
export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, busy]);

  const confirm = async () => {
    setBusy(true);
    await logout();
    router.push("/");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-[#f87171]/40 px-4 py-2 font-jakarta text-sm font-medium text-[#f87171] transition-colors hover:border-[#f87171] hover:bg-[#f87171]/10"
      >
        <LogoutIcon className="size-4" />
        Log out
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-5 border border-gold/20 bg-ink p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              <h2 id="logout-title" className="font-jakarta text-lg font-semibold text-cream">
                Log out?
              </h2>
              <p className="font-sans text-sm text-cream-dim">Are you sure you want to log out of your account?</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="border border-grid-line px-4 py-2 font-jakarta text-sm font-medium text-cream transition-colors hover:border-gold/40 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={busy}
                className="flex items-center gap-2 border border-[#f87171] bg-[#f87171]/10 px-4 py-2 font-jakarta text-sm font-medium text-[#f87171] transition-colors hover:bg-[#f87171]/20 disabled:opacity-60"
              >
                <LogoutIcon className="size-4" />
                {busy ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
