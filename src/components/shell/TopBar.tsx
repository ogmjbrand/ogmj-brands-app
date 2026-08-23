"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { OgmjMark, Icon } from "@/components/ui/Icon";
import { BRAND } from "@/lib/data";

/**
 * The mobile top bar carries identity, not navigation — navigation lives
 * at the bottom where the thumb is. It condenses on scroll so that the
 * content, not the chrome, owns the screen.
 */
export function TopBar() {
  const { scrollY } = useScroll();
  const border = useTransform(scrollY, [0, 40], ["rgba(255,255,255,0)", "rgba(255,255,255,0.07)"]);
  const bg = useTransform(scrollY, [0, 40], ["rgba(5,5,5,0)", "rgba(6,8,7,0.85)"]);
  const blur = useTransform(scrollY, [0, 40], ["blur(0px)", "blur(18px)"]);

  return (
    <motion.header
      style={{ backgroundColor: bg, borderBottomColor: border, backdropFilter: blur }}
      className="
        lg:hidden sticky top-0 z-50 border-b
        pt-[max(10px,env(safe-area-inset-top))] pb-2.5
      "
    >
      <div className="gutter flex items-center gap-3">
        <OgmjMark size={22} />

        {/* The active brand. Tapping it is how you switch businesses —
            a person running three brands should never hunt for a menu. */}
        <Link
          href="/brand"
          className="flex items-center gap-2 h-9 pl-2.5 pr-3 rounded-full border border-[var(--color-rule)] bg-[rgba(255,255,255,0.035)] min-w-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_7px_rgba(212,175,55,0.9)] shrink-0" />
          <span className="text-[12px] font-medium text-[#f4f6f5] truncate">{BRAND.name}</span>
          <Icon name="chevron" size={12} className="text-[#8b9491] rotate-90 shrink-0" />
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/services"
            aria-label="Services"
            className="grid place-items-center h-11 w-11 rounded-[10px] text-[#8b9491] active:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <Icon name="services" size={19} />
          </Link>
          <button
            aria-label="Your account"
            className="grid place-items-center h-11 w-11 rounded-full"
          >
            {/* The visual disc stays 36px for balance in the bar; the hit
                area around it is a full 44px. Optical size and touch size
                are different problems and should not be solved with one
                number. */}
            <span className="grid place-items-center h-9 w-9 rounded-full border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(140deg,#131615,#0a0c0b)] text-[11px] font-semibold text-[#a3adaa]">
              MO
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
