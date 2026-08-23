"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Counter, Delta } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { reveal, stagger, springPanel, easeOgmj } from "@/lib/motion";
import { POSTS } from "@/lib/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const CHANNEL_TONE: Record<string, string> = {
  Instagram: "text-[#e0a355] border-[rgba(224,163,85,0.3)] bg-[rgba(224,163,85,0.08)]",
  TikTok: "text-[#34d399] border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)]",
  LinkedIn: "text-[#a3adaa] border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)]",
  X: "text-[#f2e3ae] border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)]",
};

/**
 * SOCIAL
 *
 * A month grid is the reflex answer for a content calendar and it is the
 * wrong one on a 390px screen: thirty-one cells means each is ~48px wide
 * and holds no information. So the calendar is a week strip — seven large
 * targets, each showing how loaded that day is — and the day's posts are
 * listed underneath at full width where they can actually be read.
 *
 * Thursday is empty on purpose. It is the exact gap the dashboard flagged
 * as a 3.1× conversion opportunity, and selecting it turns the calendar
 * into the pitch to fill it.
 */
export default function SocialPage() {
  const [day, setDay] = useState<(typeof DAYS)[number]>("Wed");

  const byDay = useMemo(() => POSTS.filter((p) => p.day === day), [day]);
  const counts = useMemo(
    () => Object.fromEntries(DAYS.map((d) => [d, POSTS.filter((p) => p.day === d).length])),
    [],
  );
  const totalReach = POSTS.reduce((a, p) => a + (p.reach ?? 0), 0);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Market · Social"
          title="Content calendar"
          lede="What goes out, where, and when — scheduled around the hours your audience actually converts."
          back={{ href: "/grow", label: "Grow" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          {/* ---- REACH ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Reach · 7 days</Eyebrow>
              <Delta value={41.2} />
            </div>
            <p className="mt-2 text-[2.5rem] leading-none display-tight text-[#f4f6f5]">
              <Counter value={totalReach} compact duration={1.6} />
            </p>
          </motion.section>

          {/* ---- WEEK STRIP ---- */}
          <motion.section variants={reveal} className="mt-8">
            <div className="gutter mb-3">
              <Eyebrow>This week</Eyebrow>
            </div>

            <div className="snap-row gap-2 px-5 md:px-10 xl:px-14">
              {DAYS.map((d) => {
                const n = counts[d] as number;
                const on = d === day;
                return (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    aria-pressed={on}
                    className={`
                      relative w-[62px] h-[84px] rounded-[var(--radius-md)] border
                      flex flex-col items-center justify-center gap-2
                      transition-colors duration-300
                      ${
                        on
                          ? "border-[rgba(16,185,129,0.5)] bg-[rgba(16,185,129,0.1)]"
                          : "border-[var(--color-rule)] bg-[rgba(255,255,255,0.028)]"
                      }
                    `}
                  >
                    {on && (
                      <motion.span
                        layoutId="day-marker"
                        transition={springPanel}
                        className="absolute inset-0 rounded-[var(--radius-md)] border border-[rgba(16,185,129,0.6)] shadow-[0_0_24px_-8px_rgba(16,185,129,0.9)]"
                      />
                    )}
                    <span
                      className={`relative eyebrow text-[9px] ${on ? "text-[#34d399]" : "text-[#8b9491]"}`}
                    >
                      {d}
                    </span>

                    {/* Load indicator: three dots, filled by post count.
                        Readable at a glance without a number to parse. */}
                    <span className="relative flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                            i < n
                              ? on
                                ? "bg-[#10b981]"
                                : "bg-[#0a7f59]"
                              : "bg-[rgba(255,255,255,0.11)]"
                          }`}
                        />
                      ))}
                    </span>

                    <span className={`relative text-[10px] ${n ? "text-[#a3adaa]" : "text-[#7c8683]"}`}>
                      {n ? `${n} post${n > 1 ? "s" : ""}` : "Empty"}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <div className="gutter my-7">
            <EnergyRule />
          </div>

          {/* ---- DAY DETAIL ---- */}
          <section className="gutter">
            <AnimatePresence mode="wait">
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: easeOgmj }}
              >
                {byDay.length === 0 ? (
                  /* The pitch is specific to the day. Thursday carries a real
                     measured opportunity, so it gets the number; any other
                     empty day gets an honest, general prompt rather than
                     borrowed statistics that would not be true of it. */
                  <EmptyState
                    eyebrow={`${day} is open`}
                    headline={
                      day === "Thu"
                        ? "Your best-converting day has nothing on it."
                        : "Nothing goes out on this day."
                    }
                    body={
                      day === "Thu"
                        ? "Six of your last eight highest-converting sessions started with a Thursday evening post. This slot is worth roughly ₦340,000 a month."
                        : "A quiet day is fine if it's deliberate. If it isn't, OGMJ can draft a week of posts in your brand voice and place them where your audience is already active."
                    }
                    action={day === "Thu" ? "Fill this day" : "Plan this day"}
                    href="/create"
                  />
                ) : (
                  <motion.ul variants={stagger(0.06)} initial="hidden" animate="show" className="space-y-2.5">
                    {byDay.map((p) => (
                      <motion.li key={p.id} variants={reveal}>
                        <button className="group w-full text-left surface rounded-[var(--radius-md)] p-4 transition-colors duration-300 hover:border-[rgba(16,185,129,0.32)]">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`h-7 px-2.5 grid place-items-center rounded-full border text-[10.5px] font-medium ${CHANNEL_TONE[p.channel]}`}
                            >
                              {p.channel}
                            </span>
                            <span className="eyebrow text-[9px] text-[#7c8683]">{p.time}</span>
                            <span
                              className={`ml-auto eyebrow text-[9px] ${
                                p.status === "published"
                                  ? "text-[#34d399]"
                                  : p.status === "scheduled"
                                    ? "text-[#a3adaa]"
                                    : "text-[#e0a355]"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          <p className="mt-3 text-[14px] leading-[1.45] font-medium text-[#f4f6f5] text-pretty">
                            {p.hook}
                          </p>

                          {p.reach !== undefined && (
                            <p className="mt-3 flex items-center gap-2 eyebrow text-[9px] text-[#7c8683]">
                              <Icon name="grow" size={12} className="text-[#34d399]" />
                              {p.reach.toLocaleString()} reached
                            </p>
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          <motion.div variants={reveal} className="gutter mt-7">
            <Button href="/create" size="lg" full icon="spark" iconSide="left">
              Plan a week of content
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
