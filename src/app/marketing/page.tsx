"use client";

import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Counter, Delta } from "@/components/ui/Data";
import { EnergyRule, EnergyLink } from "@/components/ui/Energy";
import { reveal, stagger, easeOgmj } from "@/lib/motion";
import { CAMPAIGNS, formatMoney } from "@/lib/data";

const FUNNEL = [
  { stage: "Reached", n: 128400, pct: 100 },
  { stage: "Engaged", n: 21800, pct: 17 },
  { stage: "Visited", n: 9240, pct: 7.2 },
  { stage: "Leads", n: 1284, pct: 1 },
  { stage: "Customers", n: 312, pct: 0.24 },
];

/**
 * MARKETING
 *
 * Campaigns are judged on one number — what came back for what went in —
 * so return is the primary figure and spend is the secondary. Most tools
 * invert this and lead with spend, which is the one number a founder
 * cannot act on.
 *
 * The funnel is drawn as tapering bars rather than the traditional
 * trapezoid: at 390px a trapezoid's bottom segments become slivers you
 * cannot label, and the label is the whole point.
 */
export default function MarketingPage() {
  const live = CAMPAIGNS.filter((c) => c.status === "live");
  const spend = CAMPAIGNS.reduce((a, c) => a + c.spend, 0);
  const back = CAMPAIGNS.reduce((a, c) => a + c.returned, 0);
  const roas = back / spend;

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Market · Marketing"
          title="Campaigns"
          lede="Every naira in, traced to every naira out — across channels, creative and audience."
          back={{ href: "/grow", label: "Grow" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          {/* ---- RETURN ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Returned · all campaigns</Eyebrow>
              <Delta value={62.4} />
            </div>
            <p className="mt-2.5 text-[3rem] leading-[0.92] display-tight text-[#f4f6f5]">
              <Counter value={back} prefix="₦" compact duration={1.7} />
            </p>

            <div className="mt-4 flex items-center gap-4">
              <p className="text-[12px] text-[#8b9491]">
                on <span className="text-[#a3adaa] numeral">{formatMoney(spend)}</span> spent
              </p>
              <div className="flex-1">
                <EnergyRule live />
              </div>
              <p className="numeral text-[15px] font-semibold text-[#d4af37]">{roas.toFixed(1)}×</p>
            </div>
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- CAMPAIGNS ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <Eyebrow>Campaigns</Eyebrow>
              <span className="eyebrow text-[#7c8683]">{live.length} live</span>
            </div>

            <ul className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:space-y-0">
              {CAMPAIGNS.map((c) => {
                const r = c.spend ? c.returned / c.spend : 0;
                const isLive = c.status === "live";
                return (
                  <motion.li key={c.id} variants={reveal}>
                    <button
                      className={`
                        group relative w-full text-left overflow-hidden surface rounded-[var(--radius-md)] p-4
                        transition-colors duration-300
                        ${isLive ? "hover:border-[rgba(16,185,129,0.35)]" : "hover:border-[rgba(255,255,255,0.16)]"}
                      `}
                    >
                      {isLive && (
                        <div className="absolute inset-x-0 top-0">
                          <EnergyLink />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                isLive
                                  ? "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                                  : c.status === "scheduled"
                                    ? "bg-[#e0a355]"
                                    : "bg-[#7c8683]"
                              }`}
                            />
                            <span className="eyebrow text-[9px] text-[#8b9491]">{c.status}</span>
                          </div>
                          <p className="mt-2 text-[15px] font-semibold text-[#f4f6f5] leading-tight">
                            {c.name}
                          </p>
                          <p className="mt-1.5 text-[11.5px] text-[#8b9491]">{c.channel}</p>
                        </div>

                        {c.spend > 0 && (
                          <div className="text-right shrink-0">
                            <p className="numeral text-[17px] font-semibold text-[#d4af37] leading-none">
                              {r.toFixed(1)}×
                            </p>
                            <p className="mt-1.5 eyebrow text-[9px] text-[#7c8683]">return</p>
                          </div>
                        )}
                      </div>

                      {c.spend > 0 && (
                        <div className="mt-4 flex items-center gap-3">
                          <span className="numeral text-[11.5px] text-[#8b9491]">
                            {formatMoney(c.spend)} in
                          </span>
                          <div className="flex-1 h-[3px] rounded-full bg-[rgba(255,255,255,0.07)] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: "linear-gradient(90deg,#10b981,#d4af37)",
                              }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min(c.progress, 100)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease: easeOgmj }}
                            />
                          </div>
                          <span className="numeral text-[11.5px] text-[#f2e3ae]">
                            {formatMoney(c.returned)} out
                          </span>
                        </div>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- FUNNEL ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>Funnel · 30 days</Eyebrow>
            <ul className="mt-5 space-y-3">
              {FUNNEL.map((f, i) => (
                <li key={f.stage}>
                  <div className="flex items-baseline justify-between gap-4 mb-1.5">
                    <span className="text-[12.5px] text-[#a3adaa]">{f.stage}</span>
                    <span className="numeral text-[12.5px] text-[#f4f6f5]">
                      {f.n.toLocaleString()}
                      <span className="text-[#7c8683] ml-2">{f.pct}%</span>
                    </span>
                  </div>
                  <div className="h-[26px] rounded-[6px] bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-[6px]"
                      style={{
                        background: `linear-gradient(90deg, rgba(16,185,129,${0.85 - i * 0.13}), rgba(212,175,55,${0.5 - i * 0.08}))`,
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: Math.max(f.pct / 100, 0.035) }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.85, ease: easeOgmj, delay: i * 0.09 }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3.5 p-4 rounded-[var(--radius-md)] border border-[rgba(224,163,85,0.2)] bg-[rgba(224,163,85,0.05)]">
              <span className="mt-[2px] text-[#e0a355] shrink-0">
                <Icon name="alert" size={16} />
              </span>
              <p className="text-[12.5px] leading-[1.65] text-[#a3adaa]">
                Your biggest drop is engaged → visited: 83% of people who interact never reach the
                site. The link is in your bio, not in the post.
              </p>
            </div>
          </motion.section>

          <motion.div variants={reveal} className="gutter mt-7">
            <Button href="/create" size="lg" full icon="spark" iconSide="left">
              Build a new campaign
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
