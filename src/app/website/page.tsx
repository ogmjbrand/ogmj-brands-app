"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { reveal, stagger, easeOgmj, springPanel } from "@/lib/motion";
import { BRAND } from "@/lib/data";

type View = "phone" | "desktop";

const SECTIONS = [
  { id: "s1", name: "Hero", note: "Headline, product shot, primary CTA", words: 34, done: true },
  { id: "s2", name: "The problem", note: "Why prestige skincare stopped working", words: 118, done: true },
  { id: "s3", name: "Formulation", note: "Actives, concentrations, sourcing", words: 240, done: true },
  { id: "s4", name: "Results", note: "Unretouched, 8-week study", words: 96, done: true },
  { id: "s5", name: "Founder", note: "Why Aurelia exists", words: 180, done: true },
  { id: "s6", name: "Buy", note: "Pricing, subscription, guarantee", words: 62, done: false },
];

/**
 * WEBSITE
 *
 * The screen is built around one question — "what does it actually look
 * like?" — so the preview is not a thumbnail in a corner, it is the
 * subject of the page. The device frame is deliberate: previewing a
 * mobile site inside a mobile browser is otherwise indistinguishable
 * from just being on the site.
 *
 * Publishing gets a real completion state. Shipping your website is one
 * of maybe five genuinely significant moments in this product, and a
 * toast that says "Saved" would waste it.
 */
export default function WebsitePage() {
  const [view, setView] = useState<View>("phone");
  const [publishing, setPublishing] = useState<"idle" | "working" | "done">("idle");
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const publish = useCallback(() => {
    setPublishing("working");
    const t = window.setTimeout(() => setPublishing("done"), reduce ? 500 : 2400);
    const t2 = window.setTimeout(() => setPublishing("idle"), reduce ? 2200 : 6200);
    timers.current = [t, t2];
  }, [reduce]);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Build · Website"
          title="Your website"
          lede="Generated from your brand, written in your voice, live on your domain."
          back={{ href: "/build", label: "Build" }}
        />

        <motion.div variants={stagger(0.07)} initial="hidden" animate="show">
          {/* ---- STATUS BAR ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-center gap-3 p-3.5 rounded-[var(--radius-md)] surface">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60 animate-ping motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_9px_rgba(16,185,129,1)]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-[#f4f6f5] truncate">aurelia.co</p>
                <p className="eyebrow text-[9px] mt-1">Live · SSL · 0.9s load</p>
              </div>
              <a
                href="#preview"
                className="h-9 px-3 grid place-items-center rounded-[9px] border border-[var(--color-rule)] text-[11.5px] text-[#a3adaa] hover:text-[#f4f6f5] hover:border-[rgba(16,185,129,0.4)] transition-colors"
              >
                Visit
              </a>
            </div>
          </motion.section>

          {/* ---- PREVIEW ---- */}
          <motion.section variants={reveal} id="preview" className="gutter mt-7">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Eyebrow>Preview</Eyebrow>
              <div className="w-[172px]">
                <Segmented
                  id="view"
                  value={view}
                  onChange={setView}
                  options={[
                    { value: "phone", label: "Phone" },
                    { value: "desktop", label: "Desktop" },
                  ]}
                />
              </div>
            </div>

            <div className="grid place-items-center py-4">
              {/* The frame morphs between the two aspect ratios rather than
                  swapping — the user watches one site reflow, which is what
                  responsive design actually is. */}
              <motion.div
                layout
                transition={springPanel}
                className="relative rounded-[26px] border border-[rgba(255,255,255,0.14)] bg-[#0a0c0b] p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]"
                style={{
                  width: view === "phone" ? 232 : "min(100%, 620px)",
                }}
              >
                <motion.div
                  layout
                  transition={springPanel}
                  className="relative rounded-[19px] overflow-hidden bg-[#EFE9DE]"
                  style={{ aspectRatio: view === "phone" ? "9 / 17" : "16 / 10" }}
                >
                  <SitePreview compact={view === "phone"} />
                </motion.div>

                {view === "phone" && (
                  <div className="absolute top-[13px] left-1/2 -translate-x-1/2 h-[5px] w-[54px] rounded-full bg-[#0a0c0b]" />
                )}
              </motion.div>
            </div>
          </motion.section>

          <div className="gutter my-8">
            <EnergyRule />
          </div>

          {/* ---- SECTIONS ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <Eyebrow>Sections</Eyebrow>
              <span className="eyebrow text-[#7c8683]">5 of 6 written</span>
            </div>

            <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0 xl:grid-cols-3">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    className="
                      group w-full text-left flex items-center gap-3.5 min-h-[62px] px-4 py-3
                      surface rounded-[var(--radius-md)]
                      transition-colors duration-300 hover:border-[rgba(16,185,129,0.32)]
                    "
                  >
                    <span
                      className={`
                        grid place-items-center h-[22px] w-[22px] rounded-[7px] shrink-0 border
                        ${
                          s.done
                            ? "border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.14)] text-[#34d399]"
                            : "border-[rgba(224,163,85,0.45)] bg-[rgba(224,163,85,0.1)] text-[#e0a355]"
                        }
                      `}
                    >
                      <Icon name={s.done ? "check" : "alert"} size={11} strokeWidth={2.2} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-[#f4f6f5] leading-tight">
                        {s.name}
                      </span>
                      <span className="block mt-1 text-[11px] text-[#8b9491] leading-tight truncate">
                        {s.note}
                      </span>
                    </span>

                    <span className="eyebrow text-[9px] text-[#7c8683] shrink-0">{s.words}w</span>
                    <Icon
                      name="chevron"
                      size={14}
                      className="text-[#7c8683] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* ---- PUBLISH ---- */}
          <motion.section variants={reveal} className="gutter mt-8">
            <Button
              onClick={publish}
              disabled={publishing !== "idle"}
              size="lg"
              variant="gold"
              full
              icon={publishing === "idle" ? "arrow" : undefined}
            >
              {publishing === "idle"
                ? "Publish changes"
                : publishing === "working"
                  ? "Publishing…"
                  : "Published"}
            </Button>
            <p className="mt-3 text-[11.5px] text-[#8b9491] text-center">
              Last published 4 days ago · 1 section awaiting copy
            </p>
          </motion.section>
        </motion.div>
      </div>

      {/* ---- COMPLETION MOMENT ----
          Full-screen, gold, and brief. This is the payoff for weeks of
          work and it should feel like one. It dismisses itself, because
          asking someone to close their own celebration is deflating. */}
      <AnimatePresence>
        {publishing === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[var(--z-overlay)] grid place-items-center bg-[rgba(4,5,4,0.9)] backdrop-blur-2xl px-8"
            role="status"
            aria-live="polite"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springPanel, delay: 0.05 }}
                className="mx-auto grid place-items-center h-[76px] w-[76px] rounded-full border border-[rgba(212,175,55,0.5)] bg-[rgba(212,175,55,0.1)] text-[#d4af37]"
              >
                <Icon name="check" size={32} strokeWidth={1.6} />
                {!reduce && (
                  <motion.span
                    className="absolute h-[76px] w-[76px] rounded-full border border-[#d4af37]"
                    animate={{ scale: [1, 2.1], opacity: [0.8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOgmj, delay: 0.25 }}
                className="mt-7 editorial text-[2rem] lg:text-[2.5rem] leading-[1.1] text-[#f2e3ae]"
              >
                {BRAND.name} is live.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-3 text-[13px] text-[#a3adaa]"
              >
                aurelia.co · deployed in 1.8s
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * A miniature of the generated site, drawn in the brand's own palette.
 * Rendering a real (if tiny) layout instead of grey placeholder bars is
 * the difference between "here is a preview" and "here is your website".
 */
function SitePreview({ compact }: { compact: boolean }) {
  return (
    <div className="h-full w-full flex flex-col text-[#0D0F0E] overflow-hidden">
      <div className={`flex items-center justify-between shrink-0 ${compact ? "px-3 py-2.5" : "px-6 py-4"}`}>
        <span
          className="font-medium tracking-[0.16em]"
          style={{ fontSize: compact ? 7 : 11, fontFamily: "var(--font-serif)" }}
        >
          AURELIA
        </span>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="rounded-full bg-[#0D0F0E]/25" style={{ height: 2, width: compact ? 8 : 14 }} />
          ))}
        </span>
      </div>

      <div className={`flex-1 flex flex-col justify-center ${compact ? "px-3" : "px-6"}`}>
        <p
          className="leading-[1.1]"
          style={{ fontSize: compact ? 15 : 30, fontFamily: "var(--font-serif)" }}
        >
          Skin, restored to its own intelligence.
        </p>
        <p className="mt-2 text-[#0D0F0E]/60" style={{ fontSize: compact ? 5.5 : 9, lineHeight: 1.6 }}>
          Clinical actives at published concentrations. Nothing decorative.
        </p>
        <span
          className="mt-3 inline-grid place-items-center rounded-full bg-[#0D0F0E] text-[#EFE9DE] w-fit"
          style={{ fontSize: compact ? 5.5 : 9, padding: compact ? "4px 10px" : "7px 18px" }}
        >
          Shop the ritual
        </span>
      </div>

      <div className={`shrink-0 grid grid-cols-3 gap-1.5 ${compact ? "p-3" : "p-6"}`}>
        {["#0D0F0E", "#10B981", "#D4AF37"].map((c) => (
          <span key={c} className="rounded-[3px]" style={{ background: c, height: compact ? 26 : 52, opacity: 0.9 }} />
        ))}
      </div>
    </div>
  );
}
