"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { reveal, stagger } from "@/lib/motion";

/**
 * Every non-home screen opens the same way: a mono stage label, a large
 * editorial title, and one line that says what this surface is FOR.
 * Repetition of structure is what makes nine modules feel like one product.
 */
export function PageHead({
  eyebrow,
  title,
  lede,
  back,
  action,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  return (
    <motion.header
      variants={stagger(0.06)}
      initial="hidden"
      animate="show"
      className="gutter pt-5 lg:pt-9 pb-6"
    >
      {back && (
        <motion.div variants={reveal} className="mb-4">
          <Link
            href={back.href}
            className="inline-flex items-center gap-1.5 text-[12px] text-[#8b9491] hover:text-[#34d399] transition-colors duration-200 h-9 -ml-1 pl-1 pr-2"
          >
            <Icon name="chevron" size={14} className="rotate-180" />
            {back.label}
          </Link>
        </motion.div>
      )}

      {/* The action is capped into the reading column. Left to a full-width
          flex row it would fly to the far edge of a 1440px screen and read as
          an unrelated floating object rather than part of the title block. */}
      <div className="flex items-start justify-between gap-5 max-w-[860px]">
        <div className="min-w-0">
          <motion.div variants={reveal}>
            <Eyebrow tone="em">{eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1
            variants={reveal}
            className="mt-3 text-[var(--text-h1)] lg:text-[2.25rem] leading-[1.08] display-tight text-[#f4f6f5]"
          >
            {title}
          </motion.h1>
          {lede && (
            <motion.p
              variants={reveal}
              className="mt-2.5 text-[13px] lg:text-[14px] leading-[1.6] text-[#a3adaa] max-w-[46ch]"
            >
              {lede}
            </motion.p>
          )}
        </div>
        {action && (
          <motion.div variants={reveal} className="shrink-0 pt-1">
            {action}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
