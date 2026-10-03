"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLiftStrong } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";

// Per Figma node 89:11886 - new section added between About and Why Aurex
// walking a prospective member through the actual onboarding flow.
const STEPS = [
  {
    number: "01",
    title: "Apply for Membership",
    description:
      "Submit your initial application for review by our wealth management team.",
  },
  {
    number: "02",
    title: "Identity Verification",
    description:
      "Complete our secure digital KYC process to confirm your eligibility.",
  },
  {
    number: "03",
    title: "Start Investing",
    description:
      "Gain access to private wealth opportunities and start growing your portfolio.",
  },
  {
    number: "04",
    title: "Track Performance",
    description:
      "Monitor your growth with real-time reporting and dedicated insights.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="howItWorks" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <motion.h2
          variants={staggerItem}
          className="text-center font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
        >
          How it Works
        </motion.h2>

        {/* 4-up in one row from lg, matching Figma - but the section's own
            lg:px-[100px] stacks on top of <main>'s lg:px-20, so right at the
            lg breakpoint there's much less width per column than at, say,
            1440px. The card padding stays lean (p-6, not the usual sm:p-8
            bump) until xl once there's room to spare, and the gap/title
            size are trimmed slightly too, so words like "Membership" /
            "Verification" / "Performance" fit at every width in between
            instead of only at the wide end. */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2 xl:gap-6">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              {...hoverLiftStrong}
              className="flex flex-col items-start gap-6 border border-gold/20 bg-panel/40 p-5 backdrop-blur-[15px] lg:p-4 xl:p-8"
            >
              <span className="font-jakarta text-2xl font-semibold text-cream">
                {step.number}
              </span>
              <h3 className="break-words font-jakarta text-lg font-semibold text-cream xl:text-2xl">
                {step.title}
              </h3>
              <p className="break-words font-sans text-base leading-6 text-cream-dim">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
