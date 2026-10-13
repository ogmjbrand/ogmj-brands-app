"use client";

import { motion } from "motion/react";
import { Counter, Delta, Sparkline, Eyebrow } from "@/components/ui/Data";
import { reveal, stagger } from "@/lib/motion";
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
          <h2 className="text-[4.25rem] sm:text-[5.5rem] lg:text-[6rem] leading-[0.82] display-tight text-[#f4f6f5] -ml-[0.04em]">
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
      {/* One recessed panel divided by hairlines, not three floating cards.
          These are three readings off the same instrument; three identical
          bordered boxes said they were three unrelated things. */}
      <motion.ul
        variants={reveal}
        className="mt-7 mx-5 md:mx-10 xl:mx-14 plane-inset rounded-[var(--radius-md)] grid grid-cols-3 divide-x divide-[rgba(255,255,255,0.055)] overflow-hidden"
      >
        {rest.map((m) => (
          <li key={m.key} className="px-3.5 py-4 min-w-0">
            {/* Truncated rather than wrapped: a two-line label in one cell
                pushes its figure out of alignment with its neighbours, and
                three figures on three different baselines is the detail that
                makes a panel look assembled rather than designed. */}
            <Eyebrow className="truncate block">{m.short ?? m.label}</Eyebrow>
            <p className="mt-3 text-[1.625rem] lg:text-[2rem] leading-none display-tight text-[#f4f6f5] truncate">
              <Counter
                value={m.value}
                suffix={m.suffix ?? ""}
                decimals={m.key === "conversion" ? 1 : 0}
                compact={m.key === "leads"}
              />
            </p>
            <div className="mt-3">
              <Delta value={m.delta} />
            </div>
          </li>
        ))}
      </motion.ul>

    </motion.section>
  );
}
