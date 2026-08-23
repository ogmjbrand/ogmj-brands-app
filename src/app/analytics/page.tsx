"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Segmented } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Counter, Delta, Bars, Sparkline, Ring } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { Icon } from "@/components/ui/Icon";
import { reveal, stagger, easeOgmj } from "@/lib/motion";
import { METRICS } from "@/lib/data";

type Range = "7d" | "30d" | "90d";

const REVENUE = {
  "7d": [22, 31, 27, 44, 38, 52, 61],
  "30d": [18, 22, 19, 28, 34, 31, 45, 52, 48, 63, 71, 88],
  "90d": [12, 15, 14, 21, 19, 26, 31, 29, 38, 44, 41, 55, 62, 58, 71, 88],
};

/* Labels sit under the MIDDLE bar of each group, so a 12-bar month reads as
   four weeks of three and a 16-bar quarter as four months of four. The
   earlier 30d array put its markers on the wrong bars and skipped W3
   entirely, which made the "step change in week three" reading unverifiable
   against the chart it sat beneath. */
const LABELS: Record<Range, string[]> = {
  "7d": ["M", "T", "W", "T", "F", "S", "S"],
  "30d": ["", "W1", "", "", "W2", "", "", "W3", "", "", "W4", ""],
  "90d": ["", "Jun", "", "", "", "Jul", "", "", "", "Aug", "", "", "", "Sep", "", ""],
};

const CHANNELS = [
  { name: "Instagram", value: 1840000, pct: 38, accent: "em" as const },
  { name: "TikTok", value: 1420000, pct: 29, accent: "em" as const },
  { name: "Email", value: 920000, pct: 19, accent: "gold" as const },
  { name: "Direct", value: 640000, pct: 14, accent: "em" as const },
];

/**
 * ANALYTICS
 *
 * The rule for this screen: no chart ships without a sentence next to it
 * saying what it means. A chart alone transfers the analytical work to the
 * user, which is precisely the work they came here to avoid.
 *
 * So every block below is a pairing — the measurement, then the reading.
 */
export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Grow · Analytics"
          title="What happened, and why"
          lede="Revenue, traffic, leads and conversion — each with the reason behind the number."
          back={{ href: "/revenue", label: "Revenue" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          <motion.div variants={reveal} className="gutter">
            <Segmented
              id="range"
              value={range}
              onChange={setRange}
              options={[
                { value: "7d", label: "7 days" },
                { value: "30d", label: "30 days" },
                { value: "90d", label: "90 days" },
              ]}
            />
          </motion.div>

          {/* ---- REVENUE ---- */}
          <motion.section variants={reveal} className="gutter mt-7">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Revenue</Eyebrow>
              <Delta value={32.8} />
            </div>
            <p className="mt-2.5 text-[2.75rem] leading-[0.94] display-tight text-[#f4f6f5]">
              <Counter value={4820000} prefix="₦" compact duration={1.6} />
            </p>

            <div className="mt-6">
              <Bars
                key={range}
                data={REVENUE[range]}
                labels={LABELS[range].length ? LABELS[range] : undefined}
                accent="gold"
                height={132}
              />
            </div>

            <p className="mt-5 text-[12.5px] leading-[1.7] text-[#a3adaa] text-pretty">
              The step change begins in week three, when The Ritual campaign went live. Revenue per
              visitor rose from <span className="text-[#f4f6f5] numeral">₦412</span> to{" "}
              <span className="text-[#d4af37] numeral">₦1,180</span> — the traffic did not triple, the
              conversion did.
            </p>
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- CHANNELS ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>Where revenue came from</Eyebrow>
            <ul className="mt-5 space-y-4">
              {CHANNELS.map((c, i) => (
                <li key={c.name}>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="text-[13px] text-[#f4f6f5]">{c.name}</span>
                    <span className="numeral text-[12.5px] text-[#a3adaa]">
                      ₦{(c.value / 1_000_000).toFixed(2)}M
                      <span className="text-[#7c8683] ml-2">{c.pct}%</span>
                    </span>
                  </div>
                  <div className="h-[6px] rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full origin-left"
                      style={{
                        background:
                          c.accent === "gold"
                            ? "linear-gradient(90deg,#b4922a,#f2e3ae)"
                            : "linear-gradient(90deg,#0a7f59,#34d399)",
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: c.pct / 100 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.85, ease: easeOgmj, delay: i * 0.08 }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[12.5px] leading-[1.7] text-[#a3adaa] text-pretty">
              Email is 19% of revenue from 4% of your traffic. It is by far your most efficient
              channel and it is the one you have automated least.
            </p>
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- SECONDARY METRICS ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>Everything else</Eyebrow>
            <ul className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <li key={m.key} className="surface rounded-[var(--radius-md)] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Eyebrow>{m.label}</Eyebrow>
                    {m.key === "health" && <Ring value={m.value} size={34} accent="gold" />}
                  </div>
                  {m.key !== "health" && (
                    <p className="mt-2.5 text-[1.5rem] leading-none display-tight text-[#f4f6f5]">
                      <Counter
                        value={m.value}
                        prefix={m.prefix ?? ""}
                        suffix={m.suffix ?? ""}
                        decimals={m.key === "conversion" ? 1 : 0}
                        compact={m.key !== "conversion"}
                      />
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Delta value={m.delta} />
                    <Sparkline data={m.series} accent={m.accent} height={20} area={false} className="w-[46px]" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* ---- THE READING ---- */}
          <motion.section variants={reveal} className="gutter mt-8">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(16,185,129,0.2)] bg-[linear-gradient(150deg,rgba(16,185,129,0.09),rgba(212,175,55,0.04))] p-5 lg:p-7">
              <div className="absolute inset-x-0 top-0">
                <EnergyRule live speed={3.4} />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#34d399]">
                  <Icon name="spark" size={16} />
                </span>
                <Eyebrow tone="em">The reading</Eyebrow>
              </div>
              <p className="mt-4 editorial text-[1.25rem] lg:text-[1.625rem] leading-[1.3] text-[#f4f6f5] max-w-[30ch]">
                You have a conversion business, not a traffic business.
              </p>
              <p className="mt-3.5 text-[12.5px] leading-[1.7] text-[#a3adaa] max-w-[54ch] text-pretty">
                Your traffic grew 11% while revenue grew 32.8%. Chasing reach is the expensive way to
                grow from here — the cheap way is the 83% of engaged people who never reach your site,
                and the email list you have barely used.
              </p>
              <Button href="/create" size="md" variant="outline" icon="arrow" className="mt-5">
                Build the fix
              </Button>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </>
  );
}
