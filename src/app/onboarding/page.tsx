"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon, OgmjMark } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Data";
import { EnergyOrb, EnergyRule } from "@/components/ui/Energy";
import { Button } from "@/components/ui/Button";
import { reveal, stagger, easeOgmj, springPanel, springTap } from "@/lib/motion";
import { BUSINESS_TYPES, AMBITIONS } from "@/lib/data";

/**
 * ONBOARDING
 *
 * Nobody's first impression of a product they may pay for should be a
 * form. This is staged as an arrival: a held beat, two real questions,
 * and a moment where the product visibly reconfigures itself around the
 * answers.
 *
 *   ARRIVAL → DISCOVERY → INTENT → PERSONALISATION
 *
 * Two questions is the entire budget. Every additional question measurably
 * costs completions, and OGMJ can infer far more from the first prompt in
 * the command centre than it can extract from a wizard.
 */

const STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string | null>(null);
  const [aims, setAims] = useState<string[]>([]);
  const reduce = useReducedMotion();
  const timer = useRef<number | null>(null);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, STEPS - 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const toggleAim = useCallback((id: string) => {
    setAims((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  }, []);

  /* The final scene auto-advances. Making the user tap "Enter" after
     watching their workspace assemble would break the moment. */
  useEffect(() => {
    if (step !== 3) return;
    timer.current = window.setTimeout(() => router.push("/"), reduce ? 900 : 3600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [step, router, reduce]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const chosen = BUSINESS_TYPES.find((b) => b.id === type);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* ---------------- PROGRESS ----------------
          The OGMJ energy line doubles as the progress indicator, so the
          product's signature element is the first thing that behaves
          like a system rather than a decoration. */}
      <header className="shrink-0 pt-[max(16px,env(safe-area-inset-top))]">
        <div className="gutter flex items-center gap-3 h-12">
          <OgmjMark size={20} />
          <span className="text-[13px] font-semibold tracking-[-0.02em]">OGMJ</span>
          {step > 0 && step < 3 && (
            <button
              onClick={back}
              className="ml-auto h-9 px-3 -mr-3 text-[12px] text-[#8b9491] hover:text-[#f4f6f5] transition-colors"
            >
              Back
            </button>
          )}
        </div>
        <div className="gutter mt-1">
          <div className="relative h-px w-full bg-[var(--color-rule)] overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                background: "linear-gradient(90deg,rgba(16,185,129,0.9),rgba(212,175,55,0.85))",
                boxShadow: "0 0 10px rgba(16,185,129,0.6)",
              }}
              animate={{ width: `${((step + 1) / STEPS) * 100}%` }}
              transition={springPanel}
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* ============ 0 · ARRIVAL ============ */}
        {step === 0 && (
          <Scene key="welcome" className="justify-center">
            <motion.div variants={reveal} className="mb-9">
              <EnergyOrb size={104} state="idle" />
            </motion.div>
            <motion.div variants={reveal}>
              <Eyebrow tone="em">Welcome to OGMJ</Eyebrow>
            </motion.div>
            <motion.h1
              variants={reveal}
              className="mt-5 editorial text-[2.5rem] sm:text-[3rem] lg:text-[3.75rem] leading-[1.02] text-gradient-em max-w-[13ch]"
            >
              Let&apos;s build something remarkable.
            </motion.h1>
            <motion.p
              variants={reveal}
              className="mt-5 text-[14px] lg:text-[15px] leading-[1.65] text-[#a3adaa] max-w-[42ch]"
            >
              Brand, website, content, campaigns, customers and revenue — one system, built around
              what you&apos;re actually trying to do.
            </motion.p>
            <motion.div variants={reveal} className="mt-9 w-full max-w-[300px]">
              <EnergyRule live speed={3.2} />
            </motion.div>
            <motion.div variants={reveal} className="mt-8 w-full sm:w-auto">
              <Button onClick={next} size="lg" icon="arrow" full>
                Begin
              </Button>
            </motion.div>
          </Scene>
        )}

        {/* ============ 1 · DISCOVERY ============ */}
        {step === 1 && (
          <Scene key="type" className="justify-start pt-10">
            <motion.div variants={reveal}>
              <Eyebrow>Question 1 of 2</Eyebrow>
            </motion.div>
            <motion.h1
              variants={reveal}
              className="mt-4 text-[2rem] lg:text-[2.75rem] leading-[1.05] display-tight text-[#f4f6f5] max-w-[13ch]"
            >
              What are you building?
            </motion.h1>

            {/* Two columns at 390px. Each tile is 84px tall — a target you
                can hit without looking. A nine-item dropdown would fit,
                but it would feel like paperwork. */}
            <motion.ul variants={reveal} className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2.5 w-full">
              {BUSINESS_TYPES.map((b) => {
                const on = type === b.id;
                return (
                  <li key={b.id}>
                    <motion.button
                      whileTap={reduce ? undefined : { scale: 0.97 }}
                      transition={springTap}
                      onClick={() => {
                        setType(b.id);
                        /* Advance on selection, with a beat so the user
                           sees their choice register before the screen
                           changes. Instant advance feels like a glitch. */
                        window.setTimeout(next, reduce ? 60 : 340);
                      }}
                      aria-pressed={on}
                      className={`
                        relative w-full min-h-[86px] p-3.5 rounded-[var(--radius-md)] text-left
                        border transition-all duration-300 overflow-hidden
                        ${
                          on
                            ? "border-[rgba(16,185,129,0.55)] bg-[rgba(16,185,129,0.1)]"
                            : "border-[var(--color-rule)] bg-[rgba(255,255,255,0.028)] hover:border-[rgba(16,185,129,0.32)] hover:bg-[rgba(255,255,255,0.05)]"
                        }
                      `}
                    >
                      {on && (
                        <motion.span
                          layoutId="onb-pick"
                          transition={springPanel}
                          className="absolute inset-0 rounded-[var(--radius-md)] border border-[rgba(16,185,129,0.6)] shadow-[0_0_30px_-8px_rgba(16,185,129,0.8)]"
                        />
                      )}
                      <span className="relative block text-[13.5px] font-semibold text-[#f4f6f5] leading-tight">
                        {b.label}
                      </span>
                      <span className="relative block mt-1.5 text-[11px] leading-[1.4] text-[#8b9491]">
                        {b.note}
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </motion.ul>
          </Scene>
        )}

        {/* ============ 2 · INTENT ============ */}
        {step === 2 && (
          <Scene key="aim" className="justify-start pt-10">
            <motion.div variants={reveal}>
              <Eyebrow>Question 2 of 2</Eyebrow>
            </motion.div>
            <motion.h1
              variants={reveal}
              className="mt-4 text-[2rem] lg:text-[2.75rem] leading-[1.05] display-tight text-[#f4f6f5] max-w-[14ch]"
            >
              What are you trying to achieve?
            </motion.h1>
            <motion.p variants={reveal} className="mt-3 text-[13px] text-[#a3adaa]">
              Pick as many as are true. This sets what OGMJ puts in front of you first.
            </motion.p>

            <motion.ul variants={stagger(0.05)} className="mt-7 space-y-2.5 w-full max-w-[520px]">
              {AMBITIONS.map((a) => {
                const on = aims.includes(a.id);
                return (
                  <motion.li key={a.id} variants={reveal}>
                    <motion.button
                      whileTap={reduce ? undefined : { scale: 0.985 }}
                      transition={springTap}
                      onClick={() => toggleAim(a.id)}
                      aria-pressed={on}
                      className={`
                        w-full flex items-center gap-3.5 min-h-[62px] px-4 rounded-[var(--radius-md)] text-left
                        border transition-all duration-300
                        ${
                          on
                            ? "border-[rgba(16,185,129,0.5)] bg-[rgba(16,185,129,0.09)]"
                            : "border-[var(--color-rule)] bg-[rgba(255,255,255,0.028)] hover:border-[rgba(255,255,255,0.16)]"
                        }
                      `}
                    >
                      <span
                        className={`
                          grid place-items-center h-[22px] w-[22px] rounded-[7px] shrink-0
                          border transition-all duration-200
                          ${on ? "border-[#10b981] bg-[#10b981] text-[#03150f]" : "border-[rgba(255,255,255,0.2)]"}
                        `}
                      >
                        <AnimatePresence>
                          {on && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={springTap}
                            >
                              <Icon name="check" size={12} strokeWidth={2.6} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold text-[#f4f6f5] leading-tight">
                          {a.label}
                        </span>
                        <span className="block mt-1 text-[11.5px] text-[#8b9491] leading-tight">
                          {a.note}
                        </span>
                      </span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Sticky footer CTA: on a phone the list scrolls past the fold,
                and a CTA at the bottom of the document would be invisible
                exactly when the user is ready to press it. */}
            <div className="sticky bottom-0 mt-auto w-full pt-8 pb-[max(20px,env(safe-area-inset-bottom))] bg-[linear-gradient(180deg,transparent,rgba(5,6,6,0.95)_28%)]">
              <Button onClick={next} size="lg" icon="arrow" full disabled={aims.length === 0}>
                {aims.length ? "Personalise OGMJ" : "Choose at least one"}
              </Button>
            </div>
          </Scene>
        )}

        {/* ============ 3 · PERSONALISATION ============ */}
        {step === 3 && (
          <motion.section
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-start justify-center gutter py-12"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springPanel}
              className="mb-8"
            >
              <EnergyOrb size={96} state="thinking" />
            </motion.div>

            <Eyebrow tone="em">Configuring your workspace</Eyebrow>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOgmj, delay: 0.15 }}
              className="mt-5 editorial text-[2.25rem] lg:text-[3rem] leading-[1.05] text-gradient-em max-w-[15ch]"
            >
              Built for {chosen?.label.toLowerCase() ?? "your business"}.
            </motion.h1>

            {/* Personalisation is shown, not claimed. Each line names a real
                consequence of an answer the user just gave. */}
            <ul className="mt-8 space-y-3 w-full max-w-[440px]">
              {[
                `Modules ordered around ${aims.length} goal${aims.length === 1 ? "" : "s"}`,
                `${chosen?.label ?? "Business"} benchmarks loaded`,
                "Brand voice and palette primed",
                "Command centre ready",
              ].map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.42, ease: easeOgmj, delay: 0.5 + i * 0.28 }}
                  className="flex items-center gap-3 text-[13px] text-[#a3adaa]"
                >
                  <span className="grid place-items-center h-[18px] w-[18px] rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.45)] text-[#34d399] shrink-0">
                    <Icon name="check" size={10} strokeWidth={2.5} />
                  </span>
                  {line}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 w-full max-w-[300px]">
              <EnergyRule live speed={1.6} />
            </div>
            <p className="mt-4 eyebrow text-[#7c8683]" role="status" aria-live="polite">
              Opening OGMJ
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Scene({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={stagger(0.08, 0.05)}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -18, filter: "blur(8px)", transition: { duration: 0.3 } }}
      className={`flex-1 flex flex-col items-start gutter pb-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}
