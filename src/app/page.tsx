"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { FirstRunGate } from "@/components/shell/FirstRunGate";
import { Pulse } from "@/components/modules/Pulse";
import { Insights } from "@/components/modules/Insights";
import { Journey } from "@/components/modules/Journey";
import { Eyebrow } from "@/components/ui/Data";
import { Icon } from "@/components/ui/Icon";
import { EnergyRule } from "@/components/ui/Energy";
import { Marquee, RailItem } from "@/components/ui/Marquee";
import { reveal, stagger } from "@/lib/motion";
import { greeting, BRAND, CONNECTED } from "@/lib/data";

/**
 * HOME — the command centre.
 *
 * Order of the screen is the order of a founder's actual questions on
 * opening their phone in the morning:
 *
 *   1. Am I okay?          → the greeting verdict, in one sentence
 *   2. What are the numbers?→ the pulse
 *   3. What should I do?   → insights, each with a real destination
 *   4. Where is everything?→ the journey map
 *
 * There is no sidebar-and-cards layout here because that layout answers
 * none of those questions — it just displays inventory.
 */
export default function Home() {
  /**
   * The greeting is read from the *viewer's* clock, not the server's.
   *
   * This page is statically prerendered, so calling `new Date()` during
   * render would bake the build machine's timestamp into the HTML — every
   * visitor would be told "Good morning" forever, and the date line would
   * age silently. Resolving it after mount also keeps the server and client
   * markup identical, which is what hydration requires.
   *
   * There is no flash: the greeting block animates up from opacity 0 on
   * mount, so the clock lands before the text is ever visible.
   */
  const [clock, setClock] = useState<{ greet: string; date: string } | null>(null);

  useEffect(() => {
    const n = new Date();
    setClock({
      greet: greeting(n),
      date: n.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    });
  }, []);

  return (
    <FirstRunGate>
      <TopBar />

      <div className="pb-nav">
        {/* ---------------- GREETING ---------------- */}
        <motion.section
          variants={stagger(0.08)}
          initial="hidden"
          animate="show"
          className="gutter pt-6 lg:pt-12 pb-8"
        >
          <motion.div variants={reveal} className="flex items-center gap-3">
            <Eyebrow>{clock?.date ?? "\u00A0"}</Eyebrow>
            <div className="flex-1 max-w-[80px]">
              <EnergyRule live />
            </div>
          </motion.div>

          <motion.h1
            variants={reveal}
            className="mt-4 text-[var(--text-h1)] lg:text-[2.5rem] leading-[1.05] display-tight text-[#f4f6f5]"
          >
            {clock ? `${clock.greet}, Milly.` : "\u00A0"}
          </motion.h1>

          {/* The verdict. A serif line, used maybe six times in the whole
              product — which is exactly why it lands. It is also the only
              place OGMJ speaks in the first person about the business. */}
          <motion.p
            variants={reveal}
            className="mt-2.5 editorial text-[1.5rem] lg:text-[2rem] leading-[1.15] text-gradient-em max-w-[18ch]"
          >
            {BRAND.name} is accelerating.
          </motion.p>

          <motion.p variants={reveal} className="mt-3.5 text-[13px] leading-[1.6] text-[#a3adaa] max-w-[42ch]">
            Revenue is up 32.8% on last month and your best campaign still has 11 days to run. Three
            things need you today.
          </motion.p>
        </motion.section>

        {/* ---------------- PULSE ---------------- */}
        <Pulse />

        <div className="gutter my-10 lg:my-14">
          <EnergyRule />
        </div>

        {/* ---------------- INSIGHTS ---------------- */}
        <Insights />

        <div className="gutter my-10 lg:my-14">
          <EnergyRule />
        </div>

        {/* ---------------- JOURNEY ---------------- */}
        <Journey />

        {/* ---------------- CONNECTED ----------------
            A drifting rail of everything wired into the business. It is the
            only place in OGMJ where content moves of its own accord, and it
            earns that because nothing in it is interactive and nothing in it
            needs to be read in particular — the message IS the breadth,
            which is exactly the claim the product makes. Pauses on hover,
            holds still under reduced motion. */}
        <motion.section
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 lg:mt-16"
          aria-label="Connected services"
        >
          <motion.div variants={reveal} className="gutter flex items-baseline justify-between gap-4 mb-4">
            <Eyebrow>Connected</Eyebrow>
            <span className="eyebrow text-[#7c8683]">{CONNECTED.length} live</span>
          </motion.div>

          <motion.div variants={reveal}>
            <Marquee
              label="Services connected to your business"
              seconds={46}
              items={CONNECTED.map((c) => (
                <RailItem key={c.name} accent={c.accent}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {c.name}
                </RailItem>
              ))}
            />
          </motion.div>

          <motion.p variants={reveal} className="gutter mt-4 text-[12px] leading-[1.6] text-[#8b9491] max-w-[46ch]">
            Every lead, sale and post above flows through these. Nothing needs exporting between them.
          </motion.p>
        </motion.section>

        {/* ---------------- ASK ----------------
            The command centre is never more than one tap away, but this
            closing prompt is here because the end of a scroll is exactly
            where a founder has finished reading and formed an intention. */}
        <motion.section
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="gutter mt-12 lg:mt-16"
        >
          <motion.div variants={reveal}>
            <Link
              href="/create"
              className="
                group relative block overflow-hidden rounded-[var(--radius-lg)] p-5 lg:p-7
                border border-[rgba(16,185,129,0.22)]
                bg-[linear-gradient(150deg,rgba(16,185,129,0.11),rgba(212,175,55,0.05)_58%,rgba(255,255,255,0.015))]
              "
            >
              <div className="absolute inset-x-0 top-0">
                <EnergyRule live speed={3.4} />
              </div>

              <Eyebrow tone="em">AI Command Centre</Eyebrow>
              <p className="mt-3 text-[1.25rem] lg:text-[1.5rem] leading-[1.2] display-tight text-[#f4f6f5] max-w-[20ch]">
                What are we building today?
              </p>
              <p className="mt-2.5 text-[12.5px] leading-[1.6] text-[#a3adaa] max-w-[40ch]">
                Describe it in a sentence. OGMJ turns it into a working part of your business.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-[#34d399]">
                Open command centre
                <Icon
                  name="arrow"
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </span>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </FirstRunGate>
  );
}
