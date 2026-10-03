import type { Metadata } from "next";
import { LegalPageShell, AccordionSection, Paragraph, BulletList } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | AUREX",
  description: "How AUREX collects, uses, and protects your information.",
};

// TODO: Replace with the real Privacy Policy markdown once it's provided
// - everything below this line is placeholder legal content standing in
// for it, per the brief ("treat it as placeholder legal content pending
// legal review, not final copy"). Update LAST_UPDATED alongside the real
// content when that swap happens.
const LAST_UPDATED = "27 August 2026";

/**
 * Standalone /privacy page - reached from the site footer's "Privacy
 * Policy" link (see Footer.tsx), same public-no-auth-required treatment
 * as /terms.
 *
 * Shell/typography shared with /terms via
 * components/legal/LegalDocument.tsx - this file only owns which
 * sections go here and in what order.
 */
export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      crossLink={{ label: "Terms and Conditions", href: "/terms" }}
    >
      <AccordionSection title="1. Introduction" defaultOpen>
        <Paragraph>
          This Privacy Policy explains how AUREX collects, uses, and protects information when you use our website,
          application flows, and member dashboards (together, the &quot;Platform&quot;). It should be read alongside
          our Terms and Conditions.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="2. Information We Collect">
        <Paragraph>We collect information you provide directly, including:</Paragraph>
        <BulletList
          items={[
            "Identity information: your full legal name, email address, phone number, and country of residence or business operation, provided during an Investor or Business Owner application.",
            "Verification documents: a government-issued ID and, for Business Owners, a business registration document, uploaded during the application flow.",
            "Public display information: the nickname you choose, and for Business Owners, your business name, description, and funding purpose.",
            "Application details: optional details like intended investment range, source of funds, or how you heard about AUREX.",
          ]}
        />
      </AccordionSection>

      <AccordionSection title="3. How We Use Your Information">
        <Paragraph>We use the information we collect to:</Paragraph>
        <BulletList
          items={[
            "Review and process Investor and Business Owner applications.",
            "Verify your identity and, where applicable, your business's registration.",
            "Administer your membership and, once approved, your dashboard and any recorded investments or listings.",
            "Contact you about your application or account, including via WhatsApp using the phone number you provide.",
          ]}
        />
      </AccordionSection>

      <AccordionSection title="4. How We Share Your Information">
        <Paragraph>
          Identity information and verification documents are visible only to AUREX Admin and are never shown to
          other members or the public. Information you&apos;ve explicitly chosen to make public (your nickname, and
          for Business Owners, your business name, description, and funding purpose) may be shown to other members,
          for example on the leaderboard or an open investment slot, or to prospective investors browsing listed
          businesses. AUREX does not sell your information to third parties.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="5. Data Retention">
        <Paragraph>
          We retain application information for as long as your membership is active, and for a reasonable period
          afterward as needed to meet legal, regulatory, or record-keeping obligations. If your application is not
          approved, we retain what you submitted for a limited period in case you reapply.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="6. Data Security">
        <Paragraph>
          We take reasonable technical and organizational measures to protect your information from unauthorized
          access, loss, or misuse. No method of storage or transmission is completely secure, so we can&apos;t
          guarantee absolute security.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="7. Your Rights">
        <Paragraph>
          You can ask us to access, correct, or delete the personal information we hold about you by contacting us
          at the email address below. We may need to verify your identity before acting on this kind of request.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="8. Cookies and Local Storage">
        <Paragraph>
          The Platform uses your browser&apos;s local storage to remember your light/dark theme preference and, if
          you use &quot;Save &amp; Exit&quot; partway through an application, your in-progress answers on that
          device. We don&apos;t use this to track you across other sites.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="9. Children's Privacy">
        <Paragraph>
          The Platform is not directed at anyone under 18, and we don&apos;t knowingly collect information from
          children.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="10. Changes to This Policy">
        <Paragraph>
          We may update this Privacy Policy from time to time. Material changes will be reflected in the &quot;Last
          updated&quot; date above.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="11. Contact">
        <Paragraph>
          Questions about this Privacy Policy, or requests about your information, can be sent to{" "}
          <a href="mailto:hello@aurexgh.com" className="text-gold-bright underline-offset-4 hover:underline">
            hello@aurexgh.com
          </a>
          .
        </Paragraph>
      </AccordionSection>
    </LegalPageShell>
  );
}
