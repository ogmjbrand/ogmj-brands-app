"use client";

import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

/**
 * OGMJ ENERGY
 *
 * The product's one recurring visual metaphor: a thin line of emerald light,
 * warming to gold, that travels along a path. It means *momentum moving
 * through the business*.
 *
 * It is used in exactly four situations, and nowhere else:
 *   1. Connecting stages of the journey (Brand → Website → … → Revenue)
 *   2. Indicating live/active state on a surface
 *   3. Showing the system thinking (generation)
 *   4. Marking the completion of something significant (gold-weighted)
 *
 * Used everywhere it would become wallpaper. Restraint is what makes it read.
 */

/** A hairline rule that carries travelling light when live. */
export function EnergyRule({
  live = false,
  className = "",
  speed = 2.6,
}: {
  live?: boolean;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`relative h-px w-full overflow-hidden bg-[var(--color-rule)] ${className}`}>
      {live && (
        <div
          className="energy-flow"
          style={{ animationDuration: `${speed}s` }}
        />
      )}
    </div>
  );
}

/**
 * The vertical spine. Light descends as the user scrolls, physically
 * connecting the stages of the business beneath it. This is the reason
 * the dashboard reads as one organism rather than a list of tools.
 */
export function EnergySpine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progress = useSpring(raw, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <div ref={ref} className={`absolute inset-y-0 w-px ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--color-rule)]" />
      <motion.div
        className="absolute inset-x-0 top-0 origin-top"
        style={{
          scaleY: reduce ? 1 : progress,
          height: "100%",
          background:
"linear-gradient(180deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.85) 12%, rgba(16,185,129,0.5) 60%, rgba(212,175,55,0.7) 100%)",
        }}
      />
    </div>
  );
}

/**
 * THE AI PRESENCE
 *
 * This was a glowing emerald sphere with a pulsing aura and an orbiting arc.
 * It was also, honestly, the most generated-looking object in the product —
 * a neon blob breathing on black is the house style of every AI interface
 * shipped in the last two years.
 *
 * What replaces it is the OGMJ mark itself, drawn rather than lit: a thin
 * rotated square whose four edges STROKE THEMSELVES IN while the system
 * thinks, with a single small aperture at the centre. The information is the
 * same — idle, working, finished — but it is carried by line, geometry and
 * drawing speed instead of by brightness.
 *
 * Drawing is also more honest about what is happening: a path completing
 * reads as work being done, where a pulse reads as a thing merely existing.
 */
export function EnergyOrb({
  size = 88,
  state = "idle",
  className = "",
}: {
  size?: number;
  state?: "idle" | "thinking" | "done";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const thinking = state === "thinking";
  const done = state === "done";
  const stroke = done ? "#d4af37" : "#10b981";

  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
        {/* The unlit figure: always present, so the mark has a body rather
            than materialising out of nothing. */}
        <path
          d="M32 6 58 32 32 58 6 32 32 6Z"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* The lit figure, drawn by stroke-dash. While thinking it draws and
            erases continuously; at rest it simply sits complete. */}
        <motion.path
          d="M32 6 58 32 32 58 6 32 32 6Z"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={false}
          animate={
            reduce
              ? { pathLength: thinking ? 0.6 : 1, opacity: 1 }
              : thinking
                ? { pathLength: [0, 1, 1], opacity: [1, 1, 0.15] }
                : { pathLength: 1, opacity: 1 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : thinking
                ? { duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1], times: [0, 0.7, 1] }
                : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }
        />

        {/* Tick marks on the four axes — the mark's own detail, at a weight
            that only resolves up close. */}
        <path
          d="M32 14v5M32 45v5M14 32h5M45 32h5"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          opacity={done ? 0.9 : 0.45}
        />

        {/* The aperture. Solid when finished, hollow while working. */}
        <circle
          cx="32"
          cy="32"
          r="3.2"
          fill={done ? stroke : "none"}
          stroke={stroke}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/**
 * Connector used inside the journey map: a short energy segment linking
 * two module nodes, lit when the upstream node has produced something the
 * downstream node consumes.
 */
export function EnergyLink({ live = true, vertical = false }: { live?: boolean; vertical?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`relative overflow-hidden ${vertical ? "w-px h-full" : "h-px w-full"} bg-[var(--color-rule)]`}
      aria-hidden="true"
    >
      {live && (
        <motion.div
          className="absolute"
          style={
            vertical
              ? {
                  inset: "0 0 auto 0",
                  height: "42%",
                  background:
"linear-gradient(180deg, transparent, rgba(16,185,129,0.95), rgba(212,175,55,0.7), transparent)",
                }
              : {
                  inset: "0 auto 0 0",
                  width: "42%",
                  background:
"linear-gradient(90deg, transparent, rgba(16,185,129,0.95), rgba(212,175,55,0.7), transparent)",
                }
          }
          animate={
            reduce
              ? { opacity: 0.6 }
              : vertical
                ? { y: ["-100%", "340%"] }
                : { x: ["-100%", "340%"] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </div>
  );
}
