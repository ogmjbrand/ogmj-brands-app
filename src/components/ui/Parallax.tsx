"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

/**
 * PARALLAX CLUSTER
 *
 * The second technique worth taking from the hospitality reference: within
 * one gallery section, images sit at staggered offsets and travel at
 * *different rates* as the section crosses the viewport. The result is
 * depth — the composition breathes rather than sliding past as one slab.
 *
 * Three things keep it from becoming the cheap version of itself:
 *
 *   1. Small amplitude. Displacement is tens of pixels, not hundreds. Large
 *      parallax makes text unreadable mid-scroll and provokes motion
 *      sickness in people susceptible to it.
 *   2. Spring-smoothed. Binding transform directly to raw scroll position
 *      produces a stuttering, sticky feel on a phone, where scroll events
 *      are coarse. The spring decouples the two.
 *   3. Transform only — no layout property is touched, so nothing here
 *      triggers reflow and the whole effect runs on the compositor.
 *
 * Under reduced motion the element simply does not move. There is no
 * information in a parallax offset, so removing it costs nothing.
 */
export function Parallax({
  children,
  /** Pixels of travel across the full pass. Negative rises, positive sinks. */
  rate = -28,
  className = "",
}: {
  children: React.ReactNode;
  rate?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [-rate, rate]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}
