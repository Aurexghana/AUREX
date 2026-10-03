"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { ChevronDownIcon } from "@/components/icons";

// Card copy: a short one-line summary shown by default, and the full
// description (shown when "View Details" is expanded). Ventures' return
// is explicitly tied to whichever business an investor backs rather than
// a rate AUREX sets, so - unlike Core - it doesn't get a fixed APY figure.
const PACKAGES = [
  {
    name: "AUREX Core",
    rate: "8.0%",
    rateLabel: "APY",
    description:
      "Invest directly into AUREX and let us do the work. Your funds join AUREX's own investment pool for steady, predictable growth.",
    details:
      "Invest directly into AUREX and let us do the work. When you invest in Core, your funds go into AUREX's own investment pool, so you're not tied to any single business or outcome. AUREX manages where and how that pool is deployed, and your return is set by AUREX and paid out on a defined schedule. You don't need to track individual businesses, follow performance updates, or make ongoing decisions: Core is built for investors who want steady, predictable growth without the extra layer of choosing what to back. It's the simplest way to become part of the AUREX investment club.",
    cta: { style: "solid" as const },
    glow: true,
  },
  {
    name: "AUREX Ventures",
    rate: "Varies by Business",
    rateLabel: "Return",
    description:
      "Invest directly into a specific business on AUREX and choose exactly where your money goes.",
    details:
      "Invest directly into a specific business registered on AUREX. Every business on the Ventures track has applied and been approved through AUREX's own review process, and each one raises funds for its own purpose: expansion, working capital, a new product, and so on. As a Ventures investor, you choose which business you want to back, and your return is tied to how that specific business performs, not to a rate AUREX sets on your behalf. It's a more hands-on option, suited to investors who want visibility into exactly where their money is going and are comfortable with outcomes that vary by business rather than a fixed, guaranteed return.",
    cta: { style: "outline" as const },
    glow: false,
  },
];

export default function InvestmentPackages() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="packages"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="packages" />
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
          Investment Packages
        </motion.h2>

        <div className="grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {PACKAGES.map((pkg, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={pkg.name}
                layout
                variants={staggerItem}
                {...(!isOpen ? hoverLift : {})}
                // Expanding a card spans both columns from md up, so it
                // actually takes over the row's full width while its
                // details are open - not just a taller box in place.
                className={`relative flex flex-col items-start gap-6 overflow-hidden border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8 ${
                  isOpen ? "md:col-span-2" : ""
                }`}
              >
                {pkg.glow && (
                  <div className="absolute -right-16 -top-16 size-32 rounded-full bg-gold-bright/10 blur-[20px]" />
                )}

                <h3 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
                  {pkg.name}
                </h3>

                <p className="flex items-baseline gap-2">
                  <span className="font-jakarta text-3xl font-bold text-gold-bright sm:text-4xl">
                    {pkg.rate}
                  </span>
                  <span className="font-jakarta text-base text-cream-dim sm:text-lg">
                    {pkg.rateLabel}
                  </span>
                </p>

                <p className="font-jakarta text-sm text-cream-dim sm:text-base">
                  {pkg.description}
                </p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full overflow-hidden"
                    >
                      <p className="border-t border-gold/20 pt-6 font-jakarta text-sm leading-6 text-cream-dim sm:text-base">
                        {pkg.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={
                    pkg.cta.style === "solid"
                      ? "mt-2 flex w-full items-center justify-center gap-2 bg-gold-bright py-3 font-jakarta text-sm uppercase text-gold-brown shadow-[0_10px_15px_-3px_rgba(242,202,80,0.2),0_4px_6px_-4px_rgba(242,202,80,0.2)] transition-transform"
                      : "mt-2 flex w-full items-center justify-center gap-2 border border-gold-bright/50 py-3 font-jakarta text-sm uppercase text-gold-bright transition-colors hover:bg-gold-bright/10"
                  }
                >
                  {isOpen ? "Hide Details" : "View Details"}
                  <ChevronDownIcon
                    className={`size-3 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
