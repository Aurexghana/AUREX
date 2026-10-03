"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerItem, hoverLift } from "@/lib/motion";
import { EmailIcon, PhoneIcon, FacebookIcon, TwitterIcon, LinkedInIcon } from "@/components/icons";
import { getSiteContact, type SiteContact } from "@/lib/siteContact";

export default function ContactInfo() {
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

  const contactMethods = [
    contact?.contactEmail && {
      Icon: EmailIcon,
      label: "Email",
      value: contact.contactEmail,
      href: `mailto:${contact.contactEmail}`,
    },
    contact?.whatsappNumber && {
      Icon: PhoneIcon,
      label: "WhatsApp",
      value: contact.whatsappNumber,
      href: `https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`,
    },
  ].filter((m): m is { Icon: typeof EmailIcon; label: string; value: string; href: string } => Boolean(m));

  const socialLinks = [
    contact?.facebookUrl && { Icon: FacebookIcon, label: "Facebook", href: contact.facebookUrl },
    contact?.twitterUrl && { Icon: TwitterIcon, label: "Twitter", href: contact.twitterUrl },
    contact?.linkedinUrl && { Icon: LinkedInIcon, label: "LinkedIn", href: contact.linkedinUrl },
  ].filter((s): s is { Icon: typeof FacebookIcon; label: string; href: string } => Boolean(s));

  return (
    <motion.div variants={staggerItem} className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
          Contact Information
        </h3>
        <p className="font-sans text-sm leading-6 text-cream-dim sm:text-base">
          Prefer to reach us directly? Our wealth management team typically
          responds within one business day.
        </p>
      </div>

      {contactMethods.length > 0 && (
        <div className="flex flex-col gap-4">
          {contactMethods.map(({ Icon, label, value, href }) => (
            <motion.a
              key={label}
              {...hoverLift}
              href={href}
              target={label === "WhatsApp" ? "_blank" : undefined}
              rel={label === "WhatsApp" ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 border border-gold/20 bg-panel/40 p-5 backdrop-blur-2xl"
            >
              <span className="flex size-11 shrink-0 items-center justify-center border border-gold/20 bg-ink-light/50 text-gold-muted light:bg-[#fdfaf2]/50">
                <Icon className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
                  {label}
                </span>
                <span className="font-jakarta text-base font-medium text-cream sm:text-lg">
                  {value}
                </span>
              </span>
            </motion.a>
          ))}
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="flex items-center gap-4 border border-grid-line bg-ink-light/20 p-5">
          <span className="font-sans text-sm text-neutral-200 light:text-[#1a1a1a]">Follow us</span>
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 shrink-0 items-center justify-center border border-[#2e2e2e] bg-gradient-to-b from-[#242424] to-[#242424]/0 light:from-white text-gold-muted transition-colors hover:border-gold/40"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
