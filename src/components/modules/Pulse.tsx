"use client";

import { motion } from "motion/react";
import { Counter, Delta, Sparkline, Eyebrow } from "@/components/ui/Data";
import { reveal, stagger, pressableCard } from "@/lib/motion";
import { METRICS } from "@/lib/data";

/**
 * THE PULSE
 *
 * One metric is the headline; the rest are context. A four-up grid of
 * equal tiles is the default SaaS move and it tells the user nothing
 * about what matters. Here revenue owns the screen and everything else
 * sits beneath it in a scannable row.
 */
export function Pulse() {
  const [lead, ...rest] = METRICS;

  return (
    <motion.section variants={stagger(0.07)} initial="hidden" animate="show" aria-label="Business pulse">
      {/* ---- Headline metric ---- */}
      <motion.div variants={reveal} className="gutter">
        <div className="flex items-baseline justify-between gap-4">
          <Eyebrow>{lead.label} · 30 days</Eyebrow>
          <Delta value={lead.delta} />
        </div>

        <div className="mt-2.5 flex items-end justify-between gap-5">
          <h2 className="text-[3rem] sm:text-[3.5rem] leading-[0.92] display-tight text-[#f4f6f5]">
            <Counter value={lead.value} prefix="₦" compact duration={1.7} />
          </h2>
        </div>

        {/* The line draws left → right as it comes into view: the eye
            follows the business forward in time. */}
        <Sparkline data={lead.series} accent="gold" className="mt-4 -mx-1 h-[72px] lg:h-[124px]" />

        <p className="mt-3 text-[12px] leading-[1.55] text-[#8b9491]">
          <span className="text-[#a3adaa]">₦1.19M</span> of this came from{" "}
          <span className="text-[#d4af37]">The Ritual</span> campaign, which is still running.
        </p>
      </motion.div>

      {/* ---- Supporting metrics: a snap row on mobile so all three stay
              one thumb-flick away without shrinking to unreadable tiles.
              At ≥768px there is room to lay them out flat. ---- */}
      <motion.ul
        variants={reveal}
        className="snap-row mt-6 gap-3 px-5 md:px-10 xl:px-14 md:grid md:grid-cols-3 md:overflow-visible"
      >
        {rest.map((m) => (
          <motion.li
            key={m.key}
            {...pressableCard}
            className="
              w-[168px] md:w-auto surface rounded-[var(--radius-md)] p-4
              transition-colors duration-300 hover:border-[rgba(16,185,129,0.28)]
            "
          >
            <Eyebrow>{m.label}</Eyebrow>
            <p className="mt-2.5 text-[1.5rem] leading-none display-tight text-[#f4f6f5]">
              <Counter
                value={m.value}
                suffix={m.suffix ?? ""}
                decimals={m.key === "conversion" ? 1 : 0}
                compact={m.key === "leads"}
              />
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <Delta value={m.delta} />
              <Sparkline data={m.series} accent={m.accent} height={22} area={false} className="w-[52px] shrink-0" />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
