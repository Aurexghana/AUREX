"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A soft gold glow that follows the mouse cursor across the whole app.
 * Not part of the Figma design - a custom interactive touch requested on
 * top of it. Position is written directly to the DOM on every pointer
 * move (no React state) so it stays smooth without re-rendering the tree.
 *
 * Skipped entirely for touch input (no persistent cursor to follow) and
 * for prefers-reduced-motion, consistent with the rest of the app's motion.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
      });
    };

    const handleLeave = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    document.addEventListener("pointerdown", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("pointerdown", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 size-[560px] rounded-full opacity-0 transition-opacity duration-300 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.07) 40%, rgba(212,175,55,0) 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
