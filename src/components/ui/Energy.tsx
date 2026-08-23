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
 * The AI presence. Not a spinner — a body of light that breathes when idle
 * and accelerates when thinking. State is legible from across a room.
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

  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Outer aura — the field the orb sits in */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: done
            ? "radial-gradient(circle, rgba(212,175,55,0.30), transparent 68%)"
            : "radial-gradient(circle, rgba(16,185,129,0.28), transparent 68%)",
        }}
        animate={reduce ? {} : { scale: thinking ? [1, 1.16, 1] : [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: thinking ? 1.5 : 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbiting ring — only present while thinking. Its rotation is the
          only literal "loading" signal in the product, and it never appears
          alone: it is always paired with named, human-readable progress. */}
      {thinking && !reduce && (
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#orb-arc)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="52 200"
          />
          <defs>
            <linearGradient id="orb-arc" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </motion.svg>
      )}

      {/* Core */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: size * 0.42,
          height: size * 0.42,
          background: done
            ? "radial-gradient(circle at 32% 28%, #f2e3ae, #d4af37 52%, #8a6f1f)"
            : "radial-gradient(circle at 32% 28%, #a7f3d0, #10b981 52%, #05553c)",
          boxShadow: done
            ? "0 0 26px -3px rgba(212,175,55,0.85)"
            : "0 0 26px -3px rgba(16,185,129,0.85)",
        }}
        animate={reduce ? {} : { scale: thinking ? [1, 1.1, 1] : [1, 1.04, 1] }}
        transition={{ duration: thinking ? 1.1 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
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
