"use client";

import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { Marquee, RailItem } from "@/components/ui/Marquee";
import { reveal, stagger, pressableCard } from "@/lib/motion";
import { SERVICES, CAPABILITIES_CREATIVE, CAPABILITIES_BUILD } from "@/lib/data";

/**
 * SERVICES
 *
 * The one surface in OGMJ where gold is the dominant colour rather than
 * an accent — this is where the product stops being software and becomes
 * people. The shift in palette is the signal, and it works precisely
 * because gold is rationed everywhere else.
 */
export default function ServicesPage() {
  const active = SERVICES.find((s) => s.active);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Grow · Services"
          title="Done with you, or done for you"
          lede="When you'd rather hand it to people who do this every day, the OGMJ team picks it up from exactly where your workspace left off."
        />

        <motion.div variants={stagger(0.07)} initial="hidden" animate="show">
          {/* ---- ACTIVE ENGAGEMENT ---- */}
          {active && (
            <motion.section variants={reveal} className="gutter">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(150deg,rgba(212,175,55,0.11),rgba(212,175,55,0.03))] p-5">
                <div className="absolute inset-x-0 top-0">
                  <EnergyRule live speed={3} />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_9px_rgba(212,175,55,1)]" />
                  <Eyebrow tone="gold">In progress</Eyebrow>
                </div>
                <p className="mt-3.5 text-[1.25rem] leading-tight display-tight text-[#f4f6f5]">
                  {active.name}
                </p>
                <p className="mt-2 text-[12.5px] leading-[1.65] text-[#a3adaa] max-w-[44ch]">
                  Week 2 of 4 · Design review scheduled Thursday. Everything lands directly in your
                  Website module — there is no handover file.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 h-[3px] rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#b4922a,#f2e3ae)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0.5 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    />
                  </div>
                  <span className="numeral text-[11.5px] text-[#f2e3ae]">50%</span>
                </div>
              </div>
            </motion.section>
          )}

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- CAPABILITIES RAIL ----
              Twelve disciplines is a breadth claim, and reading twelve pills
              one by one is not how anyone consumes a breadth claim. So they
              drift. The tappable catalogue directly below is where the real
              choices live — nothing in the rail is a target. */}
          <motion.section variants={reveal} aria-label="Capabilities">
            <div className="gutter mb-4">
              <Eyebrow tone="gold">Disciplines in-house</Eyebrow>
            </div>
            <Marquee
              label="Creative disciplines the OGMJ team covers"
              seconds={52}
              items={CAPABILITIES_CREATIVE.map((c) => (
                <RailItem key={c} accent="gold">
                  {c}
                </RailItem>
              ))}
            />
            <Marquee
              label="Build and growth disciplines the OGMJ team covers"
              seconds={64}
              direction="right"
              className="mt-2.5"
              items={CAPABILITIES_BUILD.map((c) => (
                <RailItem key={c} accent="quiet">
                  {c}
                </RailItem>
              ))}
            />
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- CATALOGUE ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>What we do</Eyebrow>
            <ul className="mt-4 space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:space-y-0 xl:grid-cols-3">
              {SERVICES.filter((s) => !s.active).map((s) => (
                <motion.li key={s.id} variants={reveal} {...pressableCard}>
                  <button className="group w-full text-left surface rounded-[var(--radius-md)] p-4 transition-colors duration-300 hover:border-[rgba(212,175,55,0.35)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#f4f6f5] leading-tight">
                          {s.name}
                        </p>
                        <p className="mt-1.5 eyebrow text-[9px] text-[#7c8683]">{s.turnaround}</p>
                      </div>
                      <p className="numeral text-[12.5px] text-[#d4af37] shrink-0">{s.price}</p>
                    </div>
                    <span className="mt-4 flex items-center gap-1.5 text-[11.5px] font-medium text-[#8b9491] group-hover:text-[#d4af37] transition-colors">
                      Request
                      <Icon
                        name="arrow"
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <motion.section variants={reveal} className="gutter mt-9">
            <Button size="lg" variant="gold" full icon="send">
              Talk to the OGMJ team
            </Button>
            <p className="mt-3 text-[11.5px] text-[#8b9491] text-center">
              Typically replies within 4 working hours
            </p>
          </motion.section>
        </motion.div>
      </div>
    </>
  );
}
