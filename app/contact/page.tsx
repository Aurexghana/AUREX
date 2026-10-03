import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import PageBanner from "@/components/PageBanner";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact | AUREX",
  description:
    "Get in touch with the AUREX team by sending a message or reaching out directly by email or phone.",
};

/**
 * Standalone /contact page, replacing the earlier placeholder that routed
 * "Contact" straight to /coming-soon (see Navbar.tsx / Footer.tsx, both
 * updated to point here instead). No Figma design exists for this page -
 * built at my own discretion, following the same structure as
 * /how-it-works: a shared PageBanner title band, this page's own content
 * (ContactSection: a message form beside contact-method cards), then the
 * same reused Faq/CTASection/Footer every other page shares.
 */
export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center pb-16 pt-[72px] sm:pt-[84px]">
        <PageBanner
          title="Get in Touch"
          description="Have a question about membership, an investment package, or your account? Send us a message and our wealth management team will get back to you directly."
        />
        <div className="flex w-full max-w-[1280px] flex-col px-4 sm:px-6 lg:px-20">
          <ContactSection />
          <Faq />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
