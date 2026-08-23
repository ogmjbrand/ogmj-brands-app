"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { EnergySpine } from "@/components/ui/Energy";
import { reveal, stagger, pressableCard } from "@/lib/motion";
import { JOURNEY, MODULES, type ModuleKey } from "@/lib/data";

/**
 * YOUR BUSINESS
 *
 * The thesis of OGMJ made visible. These are not nine tools in a grid —
 * they are six stages of one continuous flow, and a single line of
 * emerald light runs through all of them.
 *
 * The light descends as you scroll, so the connection isn't asserted in
 * a caption, it is *demonstrated*: brand feeds website feeds content
 * feeds campaigns feeds customers feeds revenue. When a user scrolls this
 * section they are watching their own business flow downhill.
 *
 * On mobile the flow is vertical, because a phone scrolls vertically.
 * At ≥1024px it recomposes into a horizontal chain — the same idea told
 * in the axis the screen actually offers. It is not the mobile layout
 * stretched wide.
 */

const ICONS: Record<ModuleKey, IconName> = {
  brand: "brand",
  website: "website",
  studio: "studio",
  social: "social",
  marketing: "marketing",
  crm: "crm",
  content: "content",
  analytics: "analytics",
  services: "services",
};

function ModuleNode({ k }: { k: ModuleKey }) {
  const m = MODULES[k];
  const gold = m.accent === "gold";

  return (
    <motion.div variants={reveal} {...pressableCard}>
      <Link
        href={m.href}
        className={`
          group block surface rounded-[var(--radius-md)] p-3.5
          transition-all duration-300
          ${gold ? "hover:border-[rgba(212,175,55,0.35)]" : "hover:border-[rgba(16,185,129,0.35)]"}
        `}
      >
        <div className="flex items-center gap-3">
          <span
            className={`
              grid place-items-center h-9 w-9 rounded-[10px] shrink-0
              border transition-all duration-300
              ${
                gold
                  ? "border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] text-[#d4af37] group-hover:shadow-[0_0_18px_-4px_rgba(212,175,55,0.6)]"
                  : "border-[rgba(16,185,129,0.24)] bg-[rgba(16,185,129,0.07)] text-[#34d399] group-hover:shadow-[0_0_18px_-4px_rgba(16,185,129,0.6)]"
              }
            `}
          >
            <Icon name={ICONS[k]} size={17} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-semibold text-[#f4f6f5] leading-tight">{m.name}</span>
            <span className={`block mt-1 text-[11px] leading-tight ${gold ? "text-[#d4af37]" : "text-[#8b9491]"}`}>
              {m.status}
            </span>
          </span>

          <Icon
            name="chevron"
            size={14}
            className="text-[#7c8683] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#a3adaa]"
          />
        </div>

        <p className="mt-3 text-[11.5px] leading-[1.5] text-[#8b9491] lg:hidden xl:block">{m.promise}</p>
      </Link>
    </motion.div>
  );
}

export function Journey() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      variants={stagger(0.05, 0.06)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="gutter"
      aria-label="Your business"
    >
      <motion.div variants={reveal} className="flex items-baseline justify-between gap-4 mb-1">
        <Eyebrow>Your business</Eyebrow>
        <span className="eyebrow text-[#7c8683]">Everything connected</span>
      </motion.div>

      <motion.p
        variants={reveal}
        className="editorial text-[1.375rem] lg:text-[1.75rem] leading-[1.15] text-[#f4f6f5] mb-7 max-w-[22ch] lg:max-w-none"
      >
        One brand, flowing all the way to revenue.
      </motion.p>

      {/* ---------------- MOBILE / TABLET: vertical flow ---------------- */}
      <div className="relative lg:hidden pl-[26px]">
        <EnergySpine className="left-[7px]" />

        <div className="space-y-7">
          {JOURNEY.map((s) => (
            <div key={s.stage} className="relative">
              {/* The stage node sits ON the spine */}
              <span
                className="absolute -left-[26px] top-[3px] grid place-items-center h-[15px] w-[15px] rounded-full border border-[rgba(16,185,129,0.45)] bg-[#080a09]"
                aria-hidden="true"
              >
                <motion.span
                  className="h-[5px] w-[5px] rounded-full bg-[#10b981]"
                  animate={reduce ? {} : { opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>

              <motion.div variants={reveal}>
                <Eyebrow tone="em">{s.label}</Eyebrow>
              </motion.div>

              <div className="mt-3 space-y-2.5">
                {s.modules.map((k) => (
                  <ModuleNode key={k} k={k} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- DESKTOP: horizontal chain ----------------
          Recomposed, not resized. The stages become columns under a
          single horizontal energy rail, which is the shape a wide
          screen actually wants. */}
      <div className="hidden lg:block">
        <div className="relative mb-7 h-px overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-rule)]" />
          <motion.div
            className="absolute inset-y-0 left-0 w-[30%]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(16,185,129,0.9),rgba(212,175,55,0.7),transparent)",
            }}
            animate={reduce ? { opacity: 0.5 } : { x: ["-30%", "330%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-6 gap-4 xl:gap-5">
          {JOURNEY.map((s) => (
            <div key={s.stage} className="relative">
              <span
                className="absolute -top-[33px] left-0 grid place-items-center h-[13px] w-[13px] rounded-full border border-[rgba(16,185,129,0.5)] bg-[#080a09]"
                aria-hidden="true"
              >
                <span className="h-[4px] w-[4px] rounded-full bg-[#10b981]" />
              </span>
              <motion.div variants={reveal} className="mb-3">
                <Eyebrow tone="em">{s.label}</Eyebrow>
              </motion.div>
              <div className="space-y-2.5">
                {s.modules.map((k) => (
                  <ModuleNode key={k} k={k} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
