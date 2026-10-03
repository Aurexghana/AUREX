"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollReveal } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import { FacebookIcon, TwitterIcon, LinkedInIcon, EmailIcon, PhoneIcon } from "@/components/icons";
import { getSiteContact, type SiteContact } from "@/lib/siteContact";

// Per Figma node 37:2210 (updated): "Services"/"Process"/"About" have been
// replaced with "How it Works", "Privacy Policy", and "Terms and
// Conditions". "How it Works" points at the standalone /how-it-works page
// (see components/PageBanner.tsx + HowItWorksProcess.tsx), "Contact" at
// the standalone /contact page (components/ContactSection.tsx), and
// "Privacy Policy"/"Terms and Conditions" at /privacy and /terms (see
// app/privacy/page.tsx, app/terms/page.tsx - both public, no auth gate,
// same as every other page here) rather than coming-soon.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms and Conditions", href: "/terms" },
];

export default function Footer() {
  const [contact, setContact] = useState<SiteContact | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSiteContact().then((data) => {
      if (!cancelled) setContact(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const socialLinks = [
    contact?.facebookUrl && { Icon: FacebookIcon, label: "Facebook", href: contact.facebookUrl },
    contact?.twitterUrl && { Icon: TwitterIcon, label: "Twitter", href: contact.twitterUrl },
    contact?.linkedinUrl && { Icon: LinkedInIcon, label: "LinkedIn", href: contact.linkedinUrl },
  ].filter((s): s is { Icon: typeof FacebookIcon; label: string; href: string } => Boolean(s));

  return (
    <footer id="contact" className="w-full border-t border-grid-line px-6 py-10 sm:px-10 md:px-20 md:py-10">
      {/* Capped to the same max-w-[1280px] content column every page body
          uses, same reasoning as Navbar's inner row: the footer bar/border
          itself stays full-bleed by design, but without this cap its
          logo/nav/"Stay Connected" row would spread edge-to-edge on wide/
          ultrawide desktop viewports instead of lining up with the
          centered content column above it. */}
      <motion.div {...scrollReveal} className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-2">
            <BrandMark variant="footer" />
            <span className="font-jakarta text-base font-medium text-white light:text-[#1a1a1a]">Aurex</span>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-3 font-barlow text-sm text-neutral-200 light:text-[#262626] sm:gap-5 sm:text-base md:justify-self-center"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="transition-colors hover:text-gold">
                {label}
              </a>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex w-full items-center justify-between gap-4 border border-grid-line py-2 pl-4 pr-2 sm:gap-5 sm:py-2.5 sm:pl-5 sm:pr-2.5 md:w-fit md:justify-self-end">
              <p className="whitespace-nowrap font-barlow text-sm text-neutral-200 light:text-[#262626] sm:text-base">Stay Connected</p>
              <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 shrink-0 items-center justify-center border border-[#2e2e2e] bg-gradient-to-b from-[#242424] to-[#242424]/0 light:from-white text-gold-muted transition-colors hover:border-gold/40 sm:size-11"
                  >
                    <Icon className="size-4 sm:size-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="my-8 h-px w-full bg-grid-line" />

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {contact?.contactEmail && (
              <a
                href={`mailto:${contact.contactEmail}`}
                className="flex items-center gap-1.5 border-b border-grid-line pb-3 font-barlow text-sm text-neutral-200 light:text-[#262626] transition-colors hover:text-gold sm:text-base"
              >
                <EmailIcon className="size-4 shrink-0 sm:size-5" />
                {contact.contactEmail}
              </a>
            )}
            {contact?.whatsappNumber && (
              <a
                href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border-b border-grid-line pb-3 font-barlow text-sm text-neutral-200 light:text-[#262626] transition-colors hover:text-gold sm:text-base"
              >
                <PhoneIcon className="size-4 shrink-0 sm:size-5" />
                {contact.whatsappNumber}
              </a>
            )}
          </div>

          <p className="font-barlow text-sm text-neutral-500 light:text-[#98989a]">
            © 2026 Aurex Investment. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
