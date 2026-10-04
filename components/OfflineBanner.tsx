"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * Sitewide connectivity banner, mounted once in the root layout so it covers
 * both the public site and the dashboards. Drops in from the top while the
 * browser reports no connection, then flips to a short green "back online"
 * notice before dismissing itself.
 */
export default function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  const [showRestored, setShowRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    const show = setTimeout(() => setShowRestored(true), 0);
    const hide = setTimeout(() => setShowRestored(false), 3000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [online]);

  const visible = !online || showRestored;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={online ? "online" : "offline"}
          role="status"
          aria-live="polite"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed inset-x-0 top-0 z-[200] flex items-center justify-center gap-2 px-4 py-2.5 text-center font-jakarta text-sm font-medium text-white shadow-lg ${
            online ? "bg-[#16a34a]" : "bg-[#dc2626]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden="true">
            {online ? (
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            ) : (
              <>
                <path d="M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8a15 15 0 0 0-8.3-3.7M5 12.9a10 10 0 0 1 5.2-2.7M19 12.9a10 10 0 0 0-2.7-2.1M8.5 16.4a5 5 0 0 1 7 0" />
                <path d="M12 20h.01M2 2l20 20" />
              </>
            )}
          </svg>
          {online ? "You're back online." : "No internet connection. Check your network and try again."}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
