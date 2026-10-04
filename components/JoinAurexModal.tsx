"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { easing, hoverLift } from "@/lib/motion";
import { ArrowUpRightIcon } from "@/components/icons";

// Both options route into their own real application flows - see
// app/apply/investor/page.tsx / app/apply-business/page.tsx and
// components/apply/.
//
// Images: public/brand/modal-invest.jpg (a sprout growing from a pile of
// coins) and modal-business.jpg (a team meeting in a bright brick-walled
// office), both bright, modern Unsplash photos (free to use under the
// Unsplash License, no attribution required) replacing the earlier dated
// stock shots. Shown in their own colors, with no tint over them.
const OPTIONS = [
  {
    title: "Invest with AUREX",
    description: "Grow your money through AUREX Core or AUREX Ventures.",
    href: "/apply/investor",
    image: "/brand/modal-invest.jpg",
  },
  {
    title: "List Your Business",
    description: "Raise funding from AUREX investors.",
    href: "/apply-business",
    image: "/brand/modal-business.jpg",
  },
];

/**
 * Opened from the navbar's "Join Aurex" button (see Navbar.tsx). Splits
 * the single old "Invest With Us" CTA into the site's two real audiences -
 * investors and business owners raising capital - so each is routed
 * toward its own (not-yet-built) application instead of one generic link.
 *
 * The two options sit side by side (a "horizontal" pair) from sm and stack
 * into a single vertical column below it, per request - the same
 * grid-cols-1/sm:grid-cols-2 pattern InvestmentPackages and
 * HowItWorksProcess already use for their own 2-up cards, not a new
 * one-off breakpoint choice.
 *
 * Backdrop click and Escape both close it; body scroll is locked while
 * open, standard modal behavior. Entrance/exit reuses the exact
 * opacity+scale treatment already used for AboutVisualPanel's center-state
 * swap and ContactForm's success-state swap (same duration, same
 * `easing.smooth` token) rather than inventing a new one.
 */
export default function JoinAurexModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-aurex-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-amainblack/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.35, ease: easing.smooth }}
            className="relative flex w-full max-w-lg flex-col gap-6 border border-gold/20 bg-panel/95 p-6 backdrop-blur-2xl sm:max-w-2xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 flex size-8 items-center justify-center text-cream-dim transition-colors hover:text-gold-bright"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex flex-col gap-2 pr-8">
              <h2 id="join-aurex-title" className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
                Join Aurex
              </h2>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                Choose how you&apos;d like to get started.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {OPTIONS.map((option) => (
                <motion.div key={option.title} {...hoverLift} className="h-full">
                  <Link
                    href={option.href}
                    onClick={onClose}
                    className="group flex h-full flex-col overflow-hidden border border-gold/20 bg-ink-light/20 transition-colors hover:border-gold light:bg-white/50"
                  >
                    <div className="relative h-36 w-full shrink-0 overflow-hidden sm:h-40">
                      {/* Decorative - the card's own heading/description
                          right below already say what this option is, so
                          the image doesn't need its own (redundant) alt
                          text, same convention as AboutVisualPanel's
                          background photo layers. */}
                      <Image
                        src={option.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 340px, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 items-center justify-between gap-3 p-5">
                      <span className="flex flex-col gap-1">
                        <span className="font-jakarta text-base font-semibold text-cream sm:text-lg">
                          {option.title}
                        </span>
                        <span className="font-sans text-sm text-cream-dim">{option.description}</span>
                      </span>
                      <ArrowUpRightIcon className="size-4 shrink-0 text-gold-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
