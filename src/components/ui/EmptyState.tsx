"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "./Button";
import { Eyebrow } from "./Data";
import { type IconName } from "./Icon";
import { reveal, stagger } from "@/lib/motion";

/**
 * EMPTY STATES
 *
 * "No projects yet" is a dead end dressed as information. An empty state
 * is the highest-intent moment in a product — the user is here, looking
 * at the exact surface, with nothing in the way. It should read as an
 * opening, not an apology.
 *
 * The composition is deliberately the same as a real piece of content:
 * an eyebrow, a large line, a sentence, an action. The screen never
 * looks broken or unfinished — it looks like it is waiting for you.
 */
export function EmptyState({
  eyebrow,
  headline,
  body,
  action,
  href,
  icon = "spark",
  onAction,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  action: string;
  href?: string;
  icon?: IconName;
  onAction?: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] px-6 py-11 lg:py-16 text-center"
    >
      {/* A latent field of energy — the surface is charged, not empty. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 108%, rgba(16,185,129,0.16), transparent 68%)",
        }}
        animate={reduce ? {} : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[34ch] mx-auto">
        <motion.div variants={reveal}>
          <Eyebrow tone="em">{eyebrow}</Eyebrow>
        </motion.div>

        <motion.h3
          variants={reveal}
          className="mt-4 editorial text-[1.625rem] lg:text-[2.125rem] leading-[1.14] text-[#f4f6f5] text-balance"
        >
          {headline}
        </motion.h3>

        <motion.p variants={reveal} className="mt-3.5 text-[12.5px] leading-[1.65] text-[#a3adaa]">
          {body}
        </motion.p>

        <motion.div variants={reveal} className="mt-7 flex justify-center">
          <Button href={href} onClick={onAction} size="lg" icon={icon} iconSide="left">
            {action}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
