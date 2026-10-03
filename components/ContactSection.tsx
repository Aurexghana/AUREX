"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";

/**
 * The /contact page's main content: a message form beside contact-method
 * cards, in the same two-column-on-md pattern AboutSection already uses
 * for its heading + visual panel. No Figma design exists for a Contact
 * page (the file only has "Contact" as a nav-link label, same situation
 * How It Works was in before its own page existed) - built from scratch
 * following the site's established section conventions instead.
 */
export default function ContactSection() {
  return (
    <section className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]">
      <SectionBackgroundVector variant="contact" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:gap-12 lg:gap-[100px]"
      >
        <ContactForm />
        <ContactInfo />
      </motion.div>
    </section>
  );
}
