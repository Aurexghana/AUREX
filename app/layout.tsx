import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, DM_Sans, Inter, Manrope, Barlow } from "next/font/google";
import { MotionConfig } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import PageTransition from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";
import OfflineBanner from "@/components/OfflineBanner";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AUREX",
  description: "Invest with purpose. Grow with confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme-init script below sets `data-theme` on this exact element
      // before hydration, based on localStorage - a real, expected attribute
      // mismatch between the server-rendered markup (which has no idea what
      // was in localStorage) and the client's first paint. That's precisely
      // what suppressHydrationWarning exists for; without it React logs a
      // hydration-mismatch error for an attribute we're intentionally
      // setting outside of React's render.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${dmSans.variable} ${inter.variable} ${manrope.variable} ${barlow.variable} h-full antialiased`}
    >
      <head>
        {/* Applies a stored light-mode preference to <html data-theme>
            before first paint, so there's no flash of the default dark
            theme for a returning visitor. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="relative min-h-full flex flex-col bg-ink">
        {/* reducedMotion="user" makes every motion.* element in the app honor
            prefers-reduced-motion automatically, in addition to the manual
            checks already inside AnimatedBackground. Single source of truth
            for motion-safety, kept here so no page has to opt in itself.

            The sitewide cursor glow (components/CursorGlow.tsx) is turned
            off for now per request - the hero's Looper vector has its own
            scoped hover-glow instead (see HeroLooperVector). The component
            file is kept in place in case it's wanted again later. */}
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <OfflineBanner />
            <AnimatedBackground />
            <PageTransition>{children}</PageTransition>
            {/* Fixed to the viewport (not the navbar) so it stays put at the
                same screen corner as the page scrolls, per request. */}
            <ThemeToggle />
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
