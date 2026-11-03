import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import HowItWorks from "@/components/HowItWorks";
import WhyAurex from "@/components/WhyAurex";
import InvestmentPackages from "@/components/InvestmentPackages";
import Leaderboard from "@/components/Leaderboard";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/logo-mark.png`,
      description: SITE_DESCRIPTION,
      email: "hello@aurexgh.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <Hero />
          <Leaderboard />
          <AboutSection />
          <HowItWorks />
          <WhyAurex />
          <InvestmentPackages />
          <Testimonials />
          <Faq />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
