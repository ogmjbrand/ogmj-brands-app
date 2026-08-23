"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { EnergyOrb, EnergyRule, EnergyLink } from "@/components/ui/Energy";
import { Button } from "@/components/ui/Button";
import { reveal, stagger, materialize, easeOgmj, springPanel } from "@/lib/motion";
import { GEN_PHASES, GEN_OUTPUTS, SUGGESTIONS, MODULES } from "@/lib/data";

type Mode = "idle" | "thinking" | "done";

/**
 * THE AI COMMAND CENTRE
 *
 * This is the defining experience of OGMJ, so it gets the whole screen.
 *
 * The central design problem: an AI that takes 11 seconds to respond will
 * be abandoned if those 11 seconds are a spinner. So the wait is not
 * hidden — it is *staged*. The user watches six named phases of real work,
 * each one a sentence a human strategist would say out loud, and then
 * watches six finished pieces of their business materialise out of the
 * dark.
 *
 * The emotional target is not "it loaded". It is:
 *   "I just watched my business come to life."
 */
export default function CreatePage() {
  const [mode, setMode] = useState<Mode>("idle");
  const [prompt, setPrompt] = useState("");
  const [phaseIdx, setPhaseIdx] = useState(-1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setPrompt(text);
      setMode("thinking");
      setPhaseIdx(0);
      inputRef.current?.blur();

      /* Reduced motion still gets the full narrative — it just gets there
         faster. Removing the phases entirely would remove information,
         not just decoration. */
      const scale = reduce ? 0.25 : 1;
      let t = 0;
      timers.current = GEN_PHASES.map((p, i) => {
        t += p.hold * scale;
        return window.setTimeout(() => {
          if (i === GEN_PHASES.length - 1) setMode("done");
          else setPhaseIdx(i + 1);
        }, t);
      });
    },
    [reduce],
  );

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setMode("idle");
    setPhaseIdx(-1);
    setPrompt("");
  }, []);

  /* Textarea grows with content up to 5 lines, then scrolls. A fixed
     single-line input truncates the exact sentence the product asked for. */
  const autoSize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <AnimatePresence mode="wait">
        {mode === "idle" && <IdleScene key="idle" />}
        {mode === "thinking" && <ThinkingScene key="think" prompt={prompt} phaseIdx={phaseIdx} />}
        {mode === "done" && <DoneScene key="done" prompt={prompt} onReset={reset} />}
      </AnimatePresence>

      {/* ---------------- COMPOSER ----------------
          Anchored to the bottom of the viewport on every screen size.
          On a phone this puts it directly above the keyboard and inside
          the thumb arc; a top-anchored input would force a reach on
          every single interaction with the product's core feature. */}
      {mode === "idle" && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOgmj, delay: 0.25 }}
          className="
            sticky bottom-0 z-30 mt-auto
            bg-[linear-gradient(180deg,rgba(5,5,5,0),rgba(5,6,6,0.9)_22%,rgba(5,6,6,0.98))]
            backdrop-blur-xl
            pb-[calc(76px+env(safe-area-inset-bottom))] lg:pb-8 pt-4
          "
        >
          <div className="gutter">
            {/* Suggestions sit ABOVE the field, not below it — below the
                field they'd be under the keyboard and never seen. */}
            <div className="snap-row gap-2 mb-3 -mx-5 px-5 lg:mx-0 lg:px-0 lg:flex-wrap">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => run(s)}
                  className="
                    h-9 px-3.5 rounded-full text-[12px] whitespace-nowrap
                    border border-[var(--color-rule)] bg-[rgba(255,255,255,0.035)]
                    text-[#a3adaa] transition-colors duration-200
                    hover:text-[#f4f6f5] hover:border-[rgba(16,185,129,0.4)]
                    active:bg-[rgba(16,185,129,0.12)]
                  "
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(prompt);
              }}
              className="
                relative flex items-end gap-2 p-2 rounded-[var(--radius-lg)]
                border border-[rgba(255,255,255,0.13)]
                bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))]
                focus-within:border-[rgba(16,185,129,0.5)]
                focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_44px_-14px_rgba(16,185,129,0.7)]
                transition-all duration-300
              "
            >
              <label htmlFor="ogmj-prompt" className="sr-only-ogmj">
                Describe what you want to build
              </label>
              <textarea
                id="ogmj-prompt"
                ref={inputRef}
                rows={1}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  autoSize(e.target);
                }}
                onKeyDown={(e) => {
                  /* Enter sends, Shift+Enter breaks — but only where there
                     is a hardware keyboard. On a touch keyboard Enter must
                     insert a newline or multi-line prompts are impossible. */
                  if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                    e.preventDefault();
                    run(prompt);
                  }
                }}
                placeholder="Describe what you want to build…"
                className="
                  flex-1 resize-none bg-transparent outline-none
                  px-3 py-2.5 text-[15px] leading-[1.45] text-[#f4f6f5]
                  max-h-[132px]
                "
                /* 15px minimum: iOS Safari zooms the viewport on focus for
                   anything below 16px, which yanks the layout sideways.
                   16px on the actual field. */
                style={{ fontSize: "16px" }}
              />

              <motion.button
                type="submit"
                disabled={!prompt.trim()}
                whileTap={reduce ? undefined : { scale: 0.92 }}
                aria-label="Build this"
                className="
                  grid place-items-center h-11 w-11 shrink-0 rounded-[12px]
                  bg-[linear-gradient(160deg,#34d399,#10b981_55%,#0a7f59)] text-[#03150f]
                  shadow-[0_6px_20px_-8px_rgba(16,185,129,0.9)]
                  disabled:opacity-25 disabled:shadow-none
                  transition-opacity duration-200
                "
              >
                <Icon name="send" size={19} strokeWidth={1.6} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ================================================================== */
/* IDLE                                                                */
/* ================================================================== */

function IdleScene() {
  return (
    <motion.section
      variants={stagger(0.09, 0.06)}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.32 } }}
      className="flex-1 flex flex-col justify-center gutter pt-10 pb-6"
    >
      <motion.div variants={reveal} className="mb-8">
        <EnergyOrb size={96} state="idle" />
      </motion.div>

      <motion.div variants={reveal}>
        <Eyebrow tone="em">OGMJ Command</Eyebrow>
      </motion.div>

      <motion.h1
        variants={reveal}
        className="mt-4 text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] leading-[1.0] display-tight text-[#f4f6f5] max-w-[14ch]"
      >
        What are we building today?
      </motion.h1>

      <motion.p
        variants={reveal}
        className="mt-5 text-[13.5px] lg:text-[15px] leading-[1.65] text-[#a3adaa] max-w-[44ch]"
      >
        One sentence is enough. OGMJ turns it into strategy, creative, content, campaigns and
        tracking — connected to everything you already have.
      </motion.p>

      <motion.div variants={reveal} className="mt-8 max-w-[560px]">
        <EnergyRule live speed={3.8} />
      </motion.div>
    </motion.section>
  );
}

/* ================================================================== */
/* THINKING — the cinematic sequence                                   */
/* ================================================================== */

function ThinkingScene({ prompt, phaseIdx }: { prompt: string; phaseIdx: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.4 } }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col justify-center gutter py-10 pb-nav"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springPanel, delay: 0.05 }}
        className="mb-7"
      >
        <EnergyOrb size={88} state="thinking" />
      </motion.div>

      {/* The user's own words, held on screen. It confirms OGMJ heard
          them, and it makes the wait feel like work being done on a
          specific request rather than a generic process. */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOgmj, delay: 0.12 }}
        className="editorial text-[1.375rem] lg:text-[1.75rem] leading-[1.25] text-[#f4f6f5] max-w-[24ch] mb-9"
      >
        “{prompt}”
      </motion.p>

      {/* The ladder. Each phase is a real sentence about real work.
          Completed phases stay visible and dim — the user can see how
          far they have come, which is what makes waiting tolerable. */}
      <ol className="relative space-y-0 max-w-[440px]">
        {GEN_PHASES.map((p, i) => {
          const state = i < phaseIdx ? "done" : i === phaseIdx ? "active" : "pending";
          return (
            <li key={p.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connector between rungs, lit as the work flows down it */}
              {i < GEN_PHASES.length - 1 && (
                <div className="absolute left-[9px] top-[22px] bottom-0 w-px">
                  {state === "done" ? (
                    <div className="h-full w-full bg-[rgba(16,185,129,0.45)]" />
                  ) : state === "active" ? (
                    <EnergyLink vertical />
                  ) : (
                    <div className="h-full w-full bg-[var(--color-rule)]" />
                  )}
                </div>
              )}

              <span className="relative z-10 shrink-0 grid place-items-center h-[19px] w-[19px] mt-[2px]">
                {state === "done" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springPanel}
                    className="grid place-items-center h-[19px] w-[19px] rounded-full bg-[rgba(16,185,129,0.16)] border border-[rgba(16,185,129,0.5)] text-[#34d399]"
                  >
                    <Icon name="check" size={10} strokeWidth={2.4} />
                  </motion.span>
                ) : state === "active" ? (
                  <>
                    <motion.span
                      className="absolute h-[19px] w-[19px] rounded-full bg-[rgba(16,185,129,0.3)]"
                      animate={reduce ? {} : { scale: [1, 1.7], opacity: [0.7, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                    <span className="relative h-[9px] w-[9px] rounded-full bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,1)]" />
                  </>
                ) : (
                  <span className="h-[7px] w-[7px] rounded-full border border-[rgba(255,255,255,0.18)]" />
                )}
              </span>

              <motion.div
                className="min-w-0 flex-1"
                animate={{
                  opacity: state === "pending" ? 0.28 : state === "done" ? 0.5 : 1,
                  x: state === "active" ? 3 : 0,
                }}
                transition={{ duration: 0.35, ease: easeOgmj }}
              >
                <p
                  className={`text-[13.5px] font-medium leading-tight ${
                    state === "active" ? "text-[#f4f6f5]" : "text-[#a3adaa]"
                  }`}
                >
                  {p.label}
                </p>
                <AnimatePresence>
                  {state === "active" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: easeOgmj }}
                      className="text-[11.5px] text-[#8b9491] mt-1.5 overflow-hidden"
                    >
                      {p.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </li>
          );
        })}
      </ol>

      {/* Announced, not shown: the ladder above already displays the active
          phase, so printing it again would be visual noise. Screen-reader
          users get it here because they cannot perceive the ladder's
          highlight state. */}
      <p className="sr-only-ogmj" role="status" aria-live="polite">
        {phaseIdx >= 0 ? GEN_PHASES[Math.min(phaseIdx, GEN_PHASES.length - 1)].label : ""}
      </p>
    </motion.section>
  );
}

/* ================================================================== */
/* DONE — materialisation                                              */
/* ================================================================== */

function DoneScene({ prompt, onReset }: { prompt: string; onReset: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 gutter pt-12 pb-nav"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springPanel}
        className="mb-6"
      >
        <EnergyOrb size={72} state="done" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOgmj, delay: 0.1 }}
      >
        <Eyebrow tone="gold">Built · 6 outputs · 2 min 14s</Eyebrow>
        <h1 className="mt-4 text-[2rem] lg:text-[2.75rem] leading-[1.03] display-tight text-[#f4f6f5] max-w-[15ch]">
          Your business just came to life.
        </h1>
        <p className="mt-3.5 text-[13px] leading-[1.6] text-[#a3adaa] max-w-[46ch]">
          From “{prompt}” — everything below is live in your workspace and already connected to each
          other.
        </p>
      </motion.div>

      {/* Outputs resolve out of the dark one at a time. Blur → sharp is
          the whole point: the asset was always there, it is coming into
          focus. A fade would read as a list loading. */}
      <ul className="mt-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {GEN_OUTPUTS.map((o, i) => {
          const m = MODULES[o.module];
          return (
            <motion.li
              key={o.id}
              variants={materialize}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: easeOgmj, delay: 0.35 + i * 0.16 }}
            >
              <Link
                href={m.href}
                className="
                  group block surface rounded-[var(--radius-md)] p-4 h-full
                  transition-colors duration-300 hover:border-[rgba(16,185,129,0.35)]
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Eyebrow tone="em">{m.name}</Eyebrow>
                    <p className="mt-2.5 text-[14px] font-semibold text-[#f4f6f5] leading-tight">
                      {o.title}
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-[1.5] text-[#8b9491]">{o.detail}</p>
                  </div>
                  <span className="grid place-items-center h-6 w-6 rounded-full bg-[rgba(16,185,129,0.14)] border border-[rgba(16,185,129,0.4)] text-[#34d399] shrink-0">
                    <Icon name="check" size={11} strokeWidth={2.4} />
                  </span>
                </div>
                <span className="mt-4 flex items-center gap-1.5 text-[11.5px] font-medium text-[#8b9491] group-hover:text-[#34d399] transition-colors">
                  Open
                  <Icon
                    name="arrow"
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOgmj, delay: 1.5 }}
        className="mt-9 flex flex-col sm:flex-row gap-2.5"
      >
        <Button href="/" variant="gold" size="lg" icon="arrow">
          Go to your dashboard
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" icon="plus" iconSide="left">
          Build something else
        </Button>
      </motion.div>
    </motion.section>
  );
}
