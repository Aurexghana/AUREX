"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { ArrowUpRightIcon } from "@/components/icons";

/**
 * The actual animated 404 content - split out from app/not-found.tsx
 * because that file needs to stay a Server Component to export metadata
 * (a client component can't export `metadata`), while this needs "use
 * client" for the motion/stagger entrance, same split used nowhere else
 * on this site only because no other page needed both at once.
 *
 * Structurally a sibling of the /coming-soon page (same centered-hero-
 * card shape, BrandMark, SectionBackgroundVector, gradient heading, "Back
 * to Home" pill) but with its own copy and a staggered entrance - 404 is
 * reached by mistake/typo far more often than /coming-soon is reached
 * deliberately, so it gets a "Contact Support" fallback link too.
 */
export default function NotFoundContent() {
  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center sm:py-24">
      <SectionBackgroundVector variant="notFound" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-8"
      >
        <motion.div variants={staggerItem}>
          <BrandMark variant="large" />
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col items-center gap-2">
          <span className="bg-gradient-to-r from-gold-bright via-gold-deep via-50% to-gold-bright bg-clip-text font-jakarta text-7xl font-bold tracking-tight text-transparent sm:text-8xl md:text-9xl">
            404
          </span>
        </motion.div>

        <motion.div variants={staggerItem} className="flex max-w-2xl flex-col items-center gap-4">
          <h1 className="font-jakarta text-3xl font-semibold tracking-tight text-cream sm:text-4xl md:text-5xl md:tracking-[-0.02em]">
            Page Not Found
          </h1>
          <p className="max-w-md font-jakarta text-base leading-7 text-cream-dim sm:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved. Let&apos;s get you back on track.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6"
        >
          <motion.div {...hoverScale}>
            <Link
              href="/"
              className="flex h-[52px] items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-8 font-jakarta text-base text-amainblack"
            >
              Back to Home
              <ArrowUpRightIcon className="size-[15px]" />
            </Link>
          </motion.div>
          <Link
            href="/contact"
            className="font-jakarta text-sm font-medium text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
