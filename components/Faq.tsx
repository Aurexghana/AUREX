"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { ChevronDownIcon } from "@/components/icons";

// Per Figma node 85:11651 - new section added between Client Perspectives
// and the closing CTA. The source design only shows each question in its
// collapsed state (no expanded-answer content to reproduce), so the
// answers below are original copy written to match AUREX's tone rather
// than pulled from the design.
const FAQS = [
  {
    question: "How do I become a member of AUREX?",
    answer:
      "Submit an application through our membership form. Our wealth management team reviews every request and reaches out directly to guide qualifying applicants through onboarding.",
  },
  {
    question: "What are the minimum investment requirements?",
    answer:
      "Minimums vary by package and are shared during your onboarding conversation, once our team has a clear picture of your goals and eligibility.",
  },
  {
    question: "How is my data and capital secured?",
    answer:
      "Every account is protected by institutional-grade encryption and secure vault technology, with capital held under strict custodial and compliance controls.",
  },
  {
    question: "What is the typical timeline for application approval?",
    answer:
      "Most applications are reviewed and decisioned within a few business days after identity verification is complete.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="faq" />
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
          Frequently Asked Questions
        </motion.h2>

        <motion.div variants={staggerItem} className="flex w-full flex-col">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question} className="border-b border-gold/20">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-sans text-lg font-medium text-cream">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`size-3 shrink-0 text-gold-bright transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-sans text-base leading-6 text-cream-dim">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
