"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Icon, OgmjMark, type IconName } from "@/components/ui/Icon";
import { springPanel, springTap } from "@/lib/motion";

/**
 * INFORMATION ARCHITECTURE
 *
 * The navigation is the journey, not the org chart of the codebase.
 * Users don't think "I need the CRM module" — they think "I need to sell".
 * So the five destinations are the five verbs of running a business, and
 * the modules live inside the verb they serve.
 *
 *   HOME → what's happening
 *   BUILD → brand, website, design studio        (CREATE + BUILD)
 *   CREATE → the AI command centre               (the centre of gravity)
 *   GROW → content, social, marketing            (LAUNCH + MARKET)
 *   REVENUE → CRM, analytics                     (SELL + GROW)
 *
 * Five is the ceiling for a thumb-reachable bar. A sixth item would push
 * every target below the comfortable width and turn a glance into a squint.
 */
export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Routes that should light this tab. */
  owns: string[];
}

export const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "home", owns: ["/"] },
  { href: "/build", label: "Build", icon: "build", owns: ["/build", "/brand", "/website", "/studio"] },
  { href: "/create", label: "Create", icon: "spark", owns: ["/create"] },
  { href: "/grow", label: "Grow", icon: "grow", owns: ["/grow", "/content", "/social", "/marketing"] },
  { href: "/revenue", label: "Revenue", icon: "revenue", owns: ["/revenue", "/crm", "/analytics"] },
];

function useActive() {
  const path = usePathname();
  return (item: NavItem) =>
    item.owns.some((o) => (o === "/" ? path === "/" : path === o || path.startsWith(o + "/")));
}

/* ================================================================== */
/* MOBILE — bottom bar. The primary navigation of the product.        */
/* ================================================================== */

export function MobileNav() {
  const isActive = useActive();
  const reduce = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className="
        lg:hidden fixed bottom-0 inset-x-0 z-[var(--z-nav)]
        pb-[env(safe-area-inset-bottom)]
        bg-[rgba(6,8,7,0.82)] backdrop-blur-2xl
        border-t border-[var(--color-rule)]
      "
    >
      {/* The energy line across the top of the bar. It is the same light
          that runs through the rest of the product — the bar is part of
          the organism, not a chrome strip bolted underneath it. */}
      <div
        className="absolute -top-px inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent 6%,rgba(16,185,129,0.4) 34%,rgba(212,175,55,0.32) 62%,transparent 94%)",
        }}
      />

      <ul className="flex items-stretch h-[62px]">
        {NAV.map((item) => {
          const on = isActive(item);
          const isCreate = item.href === "/create";

          if (isCreate) {
            /* CREATE is not a peer of the other tabs. It is the product's
               centre of gravity, so it is physically raised out of the bar
               and rendered in emerald light. Reaching it is one thumb move
               from anywhere in OGMJ. */
            return (
              <li key={item.href} className="flex-1 grid place-items-center">
                <motion.div whileTap={reduce ? undefined : { scale: 0.9 }} transition={springTap}>
                  <Link
                    href={item.href}
                    aria-label="AI Command Centre"
                    aria-current={on ? "page" : undefined}
                    className="
                      relative -mt-6 grid place-items-center
                      h-[54px] w-[54px] rounded-[18px]
                      bg-[linear-gradient(160deg,#34d399,#10b981_52%,#0a7f59)]
                      text-[#03150f]
                      shadow-[0_0_0_5px_rgba(6,8,7,0.95),0_10px_30px_-8px_rgba(16,185,129,0.85)]
                    "
                  >
                    {/* Rendered unconditionally and hidden via CSS for
                        reduced-motion users: gating it on the JS preference
                        would change the server/client DOM and break hydration
                        for those users specifically. */}
                    <motion.span
                      className="absolute inset-0 rounded-[18px] bg-[#10b981] motion-reduce:hidden"
                      animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.32, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ zIndex: -1 }}
                    />
                    <Icon name="spark" size={23} strokeWidth={1.7} />
                  </Link>
                </motion.div>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className="relative h-full w-full flex flex-col items-center justify-center gap-[5px] group"
              >
                {/* Active marker: a shared element that slides between tabs,
                    so the eye tracks a single object moving rather than two
                    unrelated things blinking. */}
                {on && (
                  <motion.span
                    layoutId="nav-marker"
                    transition={springPanel}
                    className="absolute top-0 h-[2px] w-7 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                  />
                )}
                <motion.span
                  animate={{ y: on ? -1 : 0, scale: on ? 1.04 : 1 }}
                  transition={springTap}
                  className={on ? "text-[#34d399]" : "text-[#8b9491] group-active:text-[#a3adaa]"}
                >
                  <Icon name={item.icon} size={21} strokeWidth={on ? 1.75 : 1.5} />
                </motion.span>
                <span
                  className={`text-[9.5px] font-medium tracking-[0.03em] transition-colors duration-200 ${
                    on ? "text-[#f4f6f5]" : "text-[#8b9491]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ================================================================== */
/* DESKTOP — a rail, not a port of the mobile bar.                    */
/* Desktop earns persistent labels and a visible journey spine.       */
/* ================================================================== */

export function DesktopRail() {
  const isActive = useActive();

  return (
    <nav
      aria-label="Primary"
      className="
        hidden lg:flex fixed left-0 inset-y-0 z-[var(--z-nav)] w-[212px] xl:w-[236px]
        flex-col border-r border-[var(--color-rule)]
        bg-[rgba(7,9,8,0.6)] backdrop-blur-xl
      "
    >
      <Link href="/" className="flex items-center gap-2.5 h-[68px] px-5 shrink-0 group">
        <OgmjMark size={22} />
        <span className="text-[14px] font-semibold tracking-[-0.02em] text-[#f4f6f5]">OGMJ</span>
        <span className="eyebrow text-[9px] ml-auto opacity-60 group-hover:opacity-100 transition-opacity">
          Brands
        </span>
      </Link>

      <div className="h-px mx-5 bg-[var(--color-rule)]" />

      <ul className="flex-1 py-4 px-3 space-y-0.5 relative">
        {/* The journey spine: one continuous emerald hairline threading
            every destination. Desktop has the vertical room to show that
            these are stages of one flow rather than five separate tools. */}
        <div
          className="absolute left-[27px] top-[26px] bottom-[26px] w-px"
          style={{
            background:
              "linear-gradient(180deg,rgba(16,185,129,0.42),rgba(16,185,129,0.16) 60%,rgba(212,175,55,0.34))",
          }}
          aria-hidden="true"
        />

        {NAV.map((item) => {
          const on = isActive(item);
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`
                  relative flex items-center gap-3 h-[42px] pl-[9px] pr-3 rounded-[10px]
                  transition-colors duration-200
                  ${on ? "text-[#f4f6f5]" : "text-[#8b9491] hover:text-[#f4f6f5]"}
                `}
              >
                {on && (
                  <motion.span
                    layoutId="rail-marker"
                    transition={springPanel}
                    className="absolute inset-0 rounded-[10px] bg-[rgba(16,185,129,0.09)] border border-[rgba(16,185,129,0.22)]"
                  />
                )}
                {/* The node on the spine. Filled when you are here. */}
                <span
                  className={`
                    relative z-10 grid place-items-center h-[18px] w-[18px] rounded-full shrink-0
                    border transition-all duration-300
                    ${
                      on
                        ? "border-[#10b981] bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                        : "border-[rgba(255,255,255,0.18)] bg-[#090a0a]"
                    }
                  `}
                >
                  {on && <span className="h-1 w-1 rounded-full bg-[#03150f]" />}
                </span>
                <Icon name={item.icon} size={17} className="relative z-10 shrink-0" />
                <span className="relative z-10 text-[13px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-3 shrink-0">
        <Link
          href="/services"
          className="
            flex items-center gap-3 h-[42px] px-3 rounded-[10px]
            text-[#8b9491] hover:text-[#d4af37] transition-colors duration-200
            border border-transparent hover:border-[rgba(212,175,55,0.28)]
          "
        >
          <Icon name="services" size={17} />
          <span className="text-[13px] font-medium">Services</span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
        </Link>
      </div>
    </nav>
  );
}
