"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Segmented, Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Counter } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { reveal, stagger, easeOgmj } from "@/lib/motion";
import { CONTENT, BRAND, type ContentPiece } from "@/lib/data";

type Tab = "all" | "ready" | "drafts";

/**
 * CONTENT STUDIO
 *
 * A content library is a list, and lists are where premium products
 * usually give up and ship a table. The two things that keep this from
 * being a table: the voice bar at the top (which explains *why* the copy
 * sounds the way it does, tying every piece back to Brand), and opening
 * a piece into a sheet with the actual text rather than a detail route.
 */
export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState<ContentPiece | null>(null);

  const shown = useMemo(() => {
    if (tab === "ready") return CONTENT.filter((c) => c.ready);
    if (tab === "drafts") return CONTENT.filter((c) => !c.ready);
    return CONTENT;
  }, [tab]);

  const totalWords = CONTENT.reduce((a, c) => a + c.words, 0);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Launch · Content"
          title="Content Studio"
          lede="Posts, scripts, ads, emails and product copy — written in your brand voice, not a generic one."
          back={{ href: "/grow", label: "Grow" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          {/* ---- VOICE BAR: the link back to Brand ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-center gap-3 flex-wrap p-3.5 rounded-[var(--radius-md)] border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.045)]">
              <Eyebrow tone="gold">Writing as</Eyebrow>
              <div className="flex gap-1.5 flex-wrap">
                {BRAND.voice.map((v) => (
                  <span key={v} className="text-[11.5px] text-[#f2e3ae]">
                    {v}
                  </span>
                ))}
              </div>
              <a
                href="/brand"
                className="ml-auto text-[11.5px] text-[#8b9491] hover:text-[#d4af37] transition-colors"
              >
                Edit voice
              </a>
            </div>
          </motion.section>

          {/* ---- COUNTS ---- */}
          <motion.section variants={reveal} className="gutter mt-6 grid grid-cols-3 gap-3">
            {[
              { l: "Pieces", v: CONTENT.length, s: "" },
              { l: "Words", v: totalWords, s: "" },
              { l: "Ready", v: CONTENT.filter((c) => c.ready).length, s: "" },
            ].map((m) => (
              <div key={m.l} className="surface rounded-[var(--radius-md)] p-3.5">
                <Eyebrow>{m.l}</Eyebrow>
                <p className="mt-2 text-[1.375rem] leading-none display-tight text-[#f4f6f5]">
                  <Counter value={m.v} compact={m.v > 999} />
                </p>
              </div>
            ))}
          </motion.section>

          <motion.div variants={reveal} className="gutter mt-7">
            <Segmented
              id="content"
              value={tab}
              onChange={setTab}
              options={[
                { value: "all", label: "Everything" },
                { value: "ready", label: "Ready" },
                { value: "drafts", label: "Drafts" },
              ]}
            />
          </motion.div>

          <motion.section variants={reveal} className="gutter mt-5">
            <AnimatePresence mode="wait">
              {shown.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EmptyState
                    eyebrow="Nothing in drafts"
                    headline="Everything you've written is ready to ship."
                    body="That is a rare position. The fastest way to use it is to turn your strongest piece into a paid campaign while the idea is still warm."
                    action="Open marketing"
                    href="/marketing"
                    icon="marketing"
                  />
                </motion.div>
              ) : (
                <motion.ul
                  key={tab}
                  variants={stagger(0.05)}
                  initial="hidden"
                  animate="show"
                  className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0"
                >
                  {shown.map((c) => (
                    <motion.li key={c.id} variants={reveal}>
                      <button
                        onClick={() => setOpen(c)}
                        className="
                          group w-full text-left flex items-start gap-3.5 min-h-[70px] p-4
                          surface rounded-[var(--radius-md)]
                          transition-colors duration-300 hover:border-[rgba(16,185,129,0.32)]
                        "
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2.5">
                            <span className="eyebrow text-[#34d399]">{c.type}</span>
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                c.ready ? "bg-[#10b981]" : "bg-[#e0a355]"
                              }`}
                            />
                            <span className="eyebrow text-[9px] text-[#7c8683]">
                              {c.ready ? "Ready" : "Draft"}
                            </span>
                          </span>
                          <span className="mt-2 block text-[13.5px] font-medium leading-[1.4] text-[#f4f6f5]">
                            {c.title}
                          </span>
                          <span className="mt-1.5 block eyebrow text-[9px] text-[#7c8683]">
                            {c.words} words
                          </span>
                        </span>
                        <Icon
                          name="chevron"
                          size={15}
                          className="mt-1 text-[#7c8683] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.div variants={reveal} className="gutter mt-7">
            <Button href="/create" size="lg" full icon="spark" iconSide="left">
              Write something new
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <Sheet
        open={!!open}
        onClose={() => setOpen(null)}
        eyebrow={open?.type}
        title={open?.title}
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setOpen(null)}>
              Edit
            </Button>
            <Button size="lg" className="flex-1" icon="send" onClick={() => setOpen(null)}>
              Schedule
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="eyebrow text-[#7c8683]">{open?.words} words</span>
            <div className="flex-1">
              <EnergyRule live={open?.ready} />
            </div>
            <span className={`eyebrow ${open?.ready ? "text-[#34d399]" : "text-[#e0a355]"}`}>
              {open?.ready ? "Ready" : "Draft"}
            </span>
          </div>

          <p className="text-[14px] leading-[1.75] text-[#dfe4e2] text-pretty">
            I read forty skincare labels last month. Thirty-one of them listed an active ingredient
            without listing its concentration.
          </p>
          <p className="text-[14px] leading-[1.75] text-[#a3adaa] text-pretty">
            That is not an oversight. A 0.02% niacinamide serum and a 10% niacinamide serum can carry
            identical front-of-pack claims, and only one of them does anything. The concentration is
            the product. Everything else is packaging.
          </p>
          <p className="text-[14px] leading-[1.75] text-[#a3adaa] text-pretty">
            We publish ours. Not because it is generous — because it is the only honest way to sell
            something you put on your face every morning.
          </p>

          <div className="pt-2">
            <EnergyRule />
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] border border-[rgba(16,185,129,0.16)] bg-[rgba(16,185,129,0.05)]">
            <span className="mt-[2px] text-[#34d399] shrink-0">
              <Icon name="spark" size={15} />
            </span>
            <p className="text-[12px] leading-[1.65] text-[#a3adaa]">
              Scored 94/100 against your brand voice. Reads as precise and unembellished; contains no
              banned words.
            </p>
          </div>
        </div>
      </Sheet>
    </>
  );
}
