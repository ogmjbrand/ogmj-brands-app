"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ring } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { PageHead } from "@/components/shell/PageHead";
import { TopBar } from "@/components/shell/TopBar";
import { reveal, stagger, pressableCard } from "@/lib/motion";
import { MODULES, type ModuleKey } from "@/lib/data";

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

/**
 * A STAGE HUB
 *
 * Hubs exist so the bottom bar can hold five thumb-sized targets instead
 * of nine cramped ones. But a hub that is only a menu wastes a screen —
 * so each module here arrives with its live state attached. The user can
 * answer "is my website fine?" without opening the website.
 */
export function Hub({
  eyebrow,
  title,
  lede,
  modules,
  handoff,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  modules: ModuleKey[];
  /** The sentence explaining what feeds this stage and what it feeds. */
  handoff: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead eyebrow={eyebrow} title={title} lede={lede} />

        <motion.section
          variants={stagger(0.07)}
          initial="hidden"
          animate="show"
          className="gutter"
        >
          <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0 xl:grid-cols-3">
            {modules.map((k) => {
              const m = MODULES[k];
              const gold = m.accent === "gold";
              return (
                <motion.li key={k} variants={reveal} {...pressableCard}>
                  <Link
                    href={m.href}
                    className={`
                      group relative block h-full overflow-hidden
                      surface rounded-[var(--radius-lg)] p-5
                      transition-all duration-300
                      ${gold ? "hover:border-[rgba(212,175,55,0.4)]" : "hover:border-[rgba(16,185,129,0.4)]"}
                    `}
                  >
                    <div className="absolute inset-x-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <EnergyRule live speed={2.2} />
                    </div>

                    <div className="flex items-start gap-4">
                      <span
                        className={`
                          grid place-items-center h-11 w-11 rounded-[12px] shrink-0 border
                          transition-shadow duration-300
                          ${
                            gold
                              ? "border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)] text-[#d4af37] group-hover:shadow-[0_0_26px_-6px_rgba(212,175,55,0.7)]"
                              : "border-[rgba(16,185,129,0.26)] bg-[rgba(16,185,129,0.07)] text-[#34d399] group-hover:shadow-[0_0_26px_-6px_rgba(16,185,129,0.7)]"
                          }
                        `}
                      >
                        <Icon name={ICONS[k]} size={20} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-[16px] font-semibold text-[#f4f6f5] leading-tight">{m.name}</h2>
                        <p className={`mt-1.5 text-[11.5px] ${gold ? "text-[#d4af37]" : "text-[#34d399]"}`}>
                          {m.status}
                        </p>
                      </div>

                      <Ring value={m.health} size={42} accent={m.accent} label={`${m.name} health`} />
                    </div>

                    <p className="mt-4 text-[12.5px] leading-[1.6] text-[#a3adaa]">{m.promise}</p>

                    <span className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-[#8b9491] group-hover:text-[#f4f6f5] transition-colors">
                      Open {m.name}
                      <Icon
                        name="arrow"
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* The handoff note. This is the connective tissue that stops
              OGMJ reading as nine apps behind one login. */}
          <motion.div
            variants={reveal}
            className="mt-8 flex items-start gap-3.5 p-4 rounded-[var(--radius-md)] border border-[rgba(16,185,129,0.16)] bg-[rgba(16,185,129,0.045)]"
          >
            <span className="mt-[3px] shrink-0 text-[#34d399]">
              <Icon name="spark" size={16} />
            </span>
            <p className="text-[12.5px] leading-[1.65] text-[#a3adaa]">{handoff}</p>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}
