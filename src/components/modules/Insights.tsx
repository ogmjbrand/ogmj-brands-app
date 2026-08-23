"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { reveal, stagger, springPanel, easeOgmj } from "@/lib/motion";
import { INSIGHTS, type Insight } from "@/lib/data";

/**
 * ACTIONABLE INTELLIGENCE
 *
 * A number on a dashboard is trivia. This surface answers three questions
 * in order, and refuses to show one without the others:
 *
 *   WHAT HAPPENED?   the headline — always visible
 *   WHY?             the reasoning — one tap away (progressive disclosure,
 *                    because six paragraphs of analysis stacked on a phone
 *                    is how dashboards get abandoned)
 *   WHAT NOW?        a real destination, pre-loaded with the work
 *
 * The impact figure is what turns a notification into a decision.
 */

const TONE: Record<Insight["kind"], { label: string; dot: string; text: string; ring: string }> = {
  opportunity: {
    label: "Opportunity",
    dot: "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)]",
    text: "text-[#34d399]",
    ring: "hover:border-[rgba(16,185,129,0.3)]",
  },
  risk: {
    label: "Needs attention",
    dot: "bg-[#e0a355] shadow-[0_0_8px_rgba(224,163,85,0.9)]",
    text: "text-[#e0a355]",
    ring: "hover:border-[rgba(224,163,85,0.3)]",
  },
  win: {
    label: "Win",
    dot: "bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.9)]",
    text: "text-[#d4af37]",
    ring: "hover:border-[rgba(212,175,55,0.3)]",
  },
};

function InsightRow({ item, index }: { item: Insight; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const t = TONE[item.kind];

  return (
    <motion.li variants={reveal} className={`surface rounded-[var(--radius-md)] overflow-hidden transition-colors duration-300 ${t.ring}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-4 py-4 flex gap-3.5 items-start min-h-[56px]"
      >
        <span className={`mt-[7px] h-1.5 w-1.5 rounded-full shrink-0 ${t.dot}`} />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2.5 flex-wrap">
            <span className={`eyebrow ${t.text}`}>{t.label}</span>
            <span className="eyebrow text-[#7c8683]">{item.impact}</span>
          </span>
          <span className="mt-2 block text-[14px] leading-[1.45] font-medium text-[#f4f6f5] text-balance">
            {item.headline}
          </span>
        </span>

        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={springPanel}
          className="mt-1 shrink-0 text-[#8b9491]"
        >
          <Icon name="chevron" size={15} />
        </motion.span>
      </button>

      {/* Height animation on a grid row rather than max-height: it lands
          on the exact content height, so there is no dead space and no
          rubber-banding when the reason is short. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ gridTemplateRows: "0fr", opacity: 0 }}
            animate={{ gridTemplateRows: "1fr", opacity: 1 }}
            exit={{ gridTemplateRows: "0fr", opacity: 0 }}
            transition={{ duration: 0.36, ease: easeOgmj }}
            className="grid"
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4 pl-[30px]">
                <p className="text-[12.5px] leading-[1.65] text-[#a3adaa] text-pretty">{item.because}</p>
                <Link
                  href={item.href}
                  className="
                    mt-3.5 inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-[9px]
                    text-[12px] font-semibold text-[#03150f]
                    bg-[linear-gradient(180deg,#34d399,#10b981)]
                    group/act
                  "
                >
                  {item.action}
                  <Icon
                    name="arrow"
                    size={14}
                    className="transition-transform duration-200 group-hover/act:translate-x-[3px]"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function Insights() {
  return (
    <motion.section
      variants={stagger(0.07, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="gutter"
      aria-label="What to do next"
    >
      <motion.div variants={reveal} className="flex items-baseline justify-between gap-4 mb-4">
        <Eyebrow>What to do next</Eyebrow>
        <span className="eyebrow text-[#7c8683]">3 signals</span>
      </motion.div>

      <ul className="space-y-2.5 md:grid md:grid-cols-2 md:gap-2.5 md:space-y-0 xl:grid-cols-3">
        {INSIGHTS.map((i, idx) => (
          <InsightRow key={i.id} item={i} index={idx} />
        ))}
      </ul>
    </motion.section>
  );
}
