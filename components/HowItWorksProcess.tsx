"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";

// Per Figma node 110:13584 - the /how-it-works page's own 4-step
// walkthrough. Distinct copy from the home page's HowItWorks.tsx summary
// section (that one's STEPS are "Apply for Membership" / "Identity
// Verification" / "Start Investing" / "Track Performance"); this is the
// fuller Explore/Apply/Invest/Track version from the dedicated page design.
const STEPS = [
  {
    number: "01",
    title: "Explore",
    description:
      "Explore AUREX to understand how the platform works and discover available investment opportunities. Review each package, including its interest rate and potential returns, to compare your options. Identify the opportunity that best aligns with your investment goals, then proceed with your application when you're ready to become an AUREX investor.",
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Once you've found an investment opportunity that aligns with your goals, submit your application to become an AUREX investor. Provide the required information and complete the necessary verification steps so our team can review your application.",
  },
  {
    number: "03",
    title: "Invest",
    description:
      "After your application is approved, select the investment opportunity that best suits your objectives and proceed with your investment. AUREX provides a structured process to help you move from an approved application to becoming an active investor.",
  },
  {
    number: "04",
    title: "Track",
    description:
      "Stay informed about your investment through your AUREX dashboard. Monitor your investment activity, revenue, transactions, and statements, giving you greater visibility into your investment journey.",
  },
];

export default function HowItWorksProcess() {
  return (
    <section className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]">
      <SectionBackgroundVector variant="howItWorks" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <motion.h2
          variants={staggerItem}
          className="w-full font-barlow text-3xl font-semibold tracking-tight text-cream sm:text-4xl lg:text-5xl"
        >
          Process
        </motion.h2>

        {/* Grid-line dividers between cards, matching the Figma layout's
            connecting lines. Built via gap-px + a bg-grid-line backdrop
            (the container's own background shows through the 1px gaps as
            the dividing lines) rather than each card drawing its own
            border - a per-card border, even collapsed onto its neighbor
            with a negative margin, produces two overlapping 1px lines at
            every shared edge, and the DOM-order-dependent paint order
            between them meant a hovered row-2 card's gold top edge could
            end up hidden under row-1's plain gray bottom edge. With the
            gap technique there's only ever one line, owned by the
            container, so there's nothing for a card's own hover outline
            to compete with - outline-offset-0 just draws it flush along
            that same 1px seam on all four sides. */}
        <div className="grid w-full grid-cols-1 gap-px border border-grid-line bg-grid-line sm:grid-cols-2">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              {...hoverLift}
              className="flex flex-col items-start gap-6 bg-ink p-6 outline outline-1 outline-transparent transition-colors duration-200 hover:outline-gold sm:gap-8 sm:p-10"
            >
              <div className="flex items-end gap-3 border-b border-grid-line pb-4 sm:gap-4 sm:pb-5">
                <span className="bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text font-barlow text-5xl font-semibold text-transparent sm:text-6xl lg:text-7xl">
                  {step.number}
                </span>
                <span className="bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-1 font-barlow text-xl font-semibold text-transparent sm:text-2xl">
                  {step.title}
                </span>
              </div>
              <p className="font-sans text-sm leading-6 text-cream-dim sm:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
