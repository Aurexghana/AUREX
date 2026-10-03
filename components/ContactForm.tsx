"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerItem, hoverScale, easing } from "@/lib/motion";

// Purely client-side - there's no backend/API route in this project (see
// how /coming-soon exists precisely because most of the site is UI-only
// with no real submission endpoints yet). Submitting just validates the
// required fields via the browser's own HTML5 validation, then swaps to a
// confirmation state; nothing is actually sent anywhere.
const FIELDS = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Osman Zakaria", full: false },
  { name: "email", label: "Email Address", type: "email", placeholder: "osman.zakaria@aurexgh.com", full: false },
  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?", full: true },
] as const;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-1 flex-col gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8"
    >
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: easing.smooth }}
            className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-gold-bright/15 text-gold-bright">
              <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-jakarta text-xl font-semibold text-cream">Message Sent</h3>
            <p className="max-w-sm font-sans text-sm leading-6 text-cream-dim">
              Thanks for reaching out. Our team reviews every message and
              will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <h3 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
              Send Us a Message
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={`flex flex-col gap-2 ${field.full ? "sm:col-span-2" : ""}`}>
                  <label
                    htmlFor={field.name}
                    className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    className="border border-grid-line bg-ink-light/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim/60 outline-none transition-colors focus:border-gold light:bg-white/60"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us a bit about what you're looking for..."
                  className="resize-none border border-grid-line bg-ink-light/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim/60 outline-none transition-colors focus:border-gold light:bg-white/60"
                />
              </div>
            </div>

            <motion.button
              {...hoverScale}
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack sm:self-start sm:px-8"
            >
              Send Message
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
