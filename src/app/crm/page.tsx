"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Counter } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { reveal, stagger, easeOgmj } from "@/lib/motion";
import { LEADS, PIPELINE_STAGES, formatMoney, type Lead } from "@/lib/data";

/**
 * CRM
 *
 * A kanban board is the right mental model for a pipeline and the wrong
 * layout for a phone — four columns at 390px gives each 90px, which fits
 * neither a name nor a number.
 *
 * So the board becomes a swipe: one stage fills the screen with the next
 * one peeking at the edge, which is both the native gesture and an honest
 * signal that there is more to the right. At ≥1024px it becomes the four
 * columns it always wanted to be. Same model, two layouts, neither one a
 * compromise of the other.
 */
export default function CrmPage() {
  const [open, setOpen] = useState<Lead | null>(null);

  const byStage = useMemo(
    () =>
      PIPELINE_STAGES.map((s) => ({
        stage: s,
        leads: LEADS.filter((l) => l.stage === s),
        value: LEADS.filter((l) => l.stage === s).reduce((a, l) => a + l.value, 0),
      })),
    [],
  );

  const pipelineValue = LEADS.reduce((a, l) => a + l.value, 0);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Sell · CRM"
          title="Pipeline"
          lede="Every lead, where it came from, and what it's worth — swipe through the stages."
          back={{ href: "/revenue", label: "Revenue" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Open pipeline</Eyebrow>
              <span className="eyebrow text-[#7c8683]">{LEADS.length} leads</span>
            </div>
            <p className="mt-2.5 text-[2.75rem] leading-[0.94] display-tight text-[#f4f6f5]">
              <Counter value={pipelineValue} prefix="₦" compact duration={1.6} />
            </p>
          </motion.section>

          <div className="gutter my-7">
            <EnergyRule />
          </div>

          {/* ---- BOARD ---- */}
          <motion.section variants={reveal} aria-label="Pipeline stages">
            <div
              className="
                snap-row gap-3 px-5 md:px-10 xl:px-14
                lg:grid lg:grid-cols-4 lg:overflow-visible
              "
            >
              {byStage.map((col, ci) => (
                <div
                  key={col.stage}
                  className="w-[84vw] max-w-[340px] lg:w-auto lg:max-w-none flex flex-col"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-3 px-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          col.stage === "Won"
                            ? "bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                            : "bg-[#10b981]"
                        }`}
                      />
                      <Eyebrow tone={col.stage === "Won" ? "gold" : "low"}>{col.stage}</Eyebrow>
                    </div>
                    <span className="numeral text-[11px] text-[#8b9491]">
                      {formatMoney(col.value)}
                    </span>
                  </div>

                  {/* Column energy: the stage's fill relative to the whole
                      pipeline, so the shape of the funnel is visible
                      without leaving the board. */}
                  <div className="h-[2px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden mb-3">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          col.stage === "Won"
                            ? "linear-gradient(90deg,#d4af37,#f2e3ae)"
                            : "linear-gradient(90deg,#0a7f59,#34d399)",
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: col.value / pipelineValue }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: easeOgmj, delay: ci * 0.08 }}
                    />
                  </div>

                  <ul className="space-y-2">
                    {col.leads.map((l) => (
                      <li key={l.id}>
                        <button
                          onClick={() => setOpen(l)}
                          className={`
                            group w-full text-left p-3.5 rounded-[var(--radius-md)] surface
                            transition-colors duration-300
                            ${
                              l.stage === "Won"
                                ? "hover:border-[rgba(212,175,55,0.4)]"
                                : "hover:border-[rgba(16,185,129,0.35)]"
                            }
                          `}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-semibold text-[#f4f6f5] leading-tight truncate">
                                {l.name}
                              </p>
                              <p className="mt-1 text-[11.5px] text-[#8b9491] truncate">{l.company}</p>
                            </div>
                            <p
                              className={`numeral text-[13px] font-semibold shrink-0 ${
                                l.stage === "Won" ? "text-[#d4af37]" : "text-[#f4f6f5]"
                              }`}
                            >
                              {formatMoney(l.value)}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="eyebrow text-[9px] text-[#7c8683] truncate">
                              {l.source}
                            </span>
                            <span className="ml-auto eyebrow text-[9px] text-[#7c8683] shrink-0">
                              {l.days === 0 ? "today" : `${l.days}d`}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}

                    {col.leads.length === 0 && (
                      <li className="h-[92px] rounded-[var(--radius-md)] border border-dashed border-[var(--color-rule)] grid place-items-center">
                        <p className="text-[11.5px] text-[#7c8683]">Nothing here yet</p>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <p className="gutter mt-4 eyebrow text-[9px] text-[#7c8683] lg:hidden">
              Swipe to move through stages
            </p>
          </motion.section>

          {/* ---- THE STALLED LEADS: the risk the dashboard flagged ---- */}
          <motion.section variants={reveal} className="gutter mt-9">
            <div className="flex items-start gap-3.5 p-4 rounded-[var(--radius-md)] border border-[rgba(224,163,85,0.22)] bg-[rgba(224,163,85,0.05)]">
              <span className="mt-[2px] text-[#e0a355] shrink-0">
                <Icon name="alert" size={16} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-[#f4f6f5]">
                  412 leads have gone 14 days without contact
                </p>
                <p className="mt-1.5 text-[12px] leading-[1.65] text-[#a3adaa]">
                  They convert at 0.4% from here. Leads that reach a human convert at 7.1%.
                </p>
                <Button href="/marketing" size="sm" variant="outline" icon="arrow" className="mt-3.5">
                  Build the follow-up
                </Button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <Sheet
        open={!!open}
        onClose={() => setOpen(null)}
        eyebrow={open?.company}
        title={open?.name}
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setOpen(null)}>
              Log a note
            </Button>
            <Button size="lg" className="flex-1" icon="send" onClick={() => setOpen(null)}>
              Follow up
            </Button>
          </div>
        }
      >
        {open && (
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <Eyebrow>Deal value</Eyebrow>
                <p className="mt-2 text-[2rem] leading-none display-tight text-[#f4f6f5]">
                  <Counter value={open.value} prefix="₦" compact />
                </p>
              </div>
              <span
                className={`h-8 px-3 grid place-items-center rounded-full border text-[11.5px] ${
                  open.stage === "Won"
                    ? "border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.08)] text-[#f2e3ae]"
                    : "border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.08)] text-[#34d399]"
                }`}
              >
                {open.stage}
              </span>
            </div>

            <EnergyRule live={open.stage !== "Won"} />

            {/* Attribution — the single most valuable thing a connected
                system can tell you, and impossible in a standalone CRM. */}
            <div>
              <Eyebrow>Where this came from</Eyebrow>
              <ol className="mt-4 space-y-0">
                {[
                  { t: `Saw "${open.source}"`, d: `${open.days + 9} days ago` },
                  { t: "Read the formulation page", d: `${open.days + 6} days ago` },
                  { t: "Joined the email list", d: `${open.days + 4} days ago` },
                  { t: "Requested pricing", d: open.days === 0 ? "today" : `${open.days} days ago` },
                ].map((e, i, arr) => (
                  <li key={e.t} className="relative flex gap-3.5 pb-5 last:pb-0">
                    {i < arr.length - 1 && (
                      <span className="absolute left-[5px] top-3 bottom-0 w-px bg-[rgba(16,185,129,0.28)]" />
                    )}
                    <span className="relative z-10 mt-[5px] h-[11px] w-[11px] rounded-full border border-[rgba(16,185,129,0.6)] bg-[#0b0d0c] shrink-0">
                      {i === arr.length - 1 && (
                        <span className="absolute inset-[2px] rounded-full bg-[#10b981]" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#f4f6f5] leading-tight">{e.t}</p>
                      <p className="mt-1 eyebrow text-[9px] text-[#7c8683]">{e.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
