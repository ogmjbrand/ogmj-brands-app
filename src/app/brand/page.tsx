"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Ring } from "@/components/ui/Data";
import { EnergyRule } from "@/components/ui/Energy";
import { reveal, stagger, pressableCard } from "@/lib/motion";
import { BRAND } from "@/lib/data";

/**
 * BRAND
 *
 * This is the one screen in OGMJ that is allowed to be a piece of
 * editorial design rather than an instrument. A brand is the thing the
 * founder is emotionally invested in; presenting it as a settings form
 * with colour pickers would be a category error.
 *
 * So: serif positioning statement set at reading size, palette as physical
 * swatches, voice as four words with room around them. It reads like the
 * first spread of a brand book, because that is what it is.
 */
export default function BrandPage() {
  const [guidelines, setGuidelines] = useState(false);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Create · Brand"
          title={BRAND.name}
          lede={`${BRAND.category} · Founded ${BRAND.founded}`}
          back={{ href: "/build", label: "Build" }}
          action={<Ring value={BRAND.health} size={48} accent="gold" label="Brand health" />}
        />

        <motion.div variants={stagger(0.07)} initial="hidden" animate="show">
          {/* ---- POSITIONING: the serif moment ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow tone="gold">Positioning</Eyebrow>
            <p className="mt-4 editorial text-[1.5rem] sm:text-[1.875rem] lg:text-[2.25rem] leading-[1.28] text-[#f4f6f5] max-w-[30ch]">
              {BRAND.tagline}
            </p>
            <p className="mt-5 text-[13px] lg:text-[14px] leading-[1.7] text-[#a3adaa] max-w-[58ch] text-pretty">
              {BRAND.positioning}
            </p>
          </motion.section>

          <div className="gutter my-9">
            <EnergyRule />
          </div>

          {/* ---- PALETTE: swatches with real weight ---- */}
          <motion.section variants={reveal} className="gutter">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Palette</Eyebrow>
              <span className="eyebrow text-[#7c8683]">4 colours</span>
            </div>

            {/* A snap row on mobile keeps each swatch large enough to judge
                the colour. Four shrunken chips in a grid tells you nothing
                about how a colour actually feels. */}
            <ul className="snap-row gap-2.5 mt-4 -mx-5 px-5 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
              {BRAND.palette.map((c) => (
                <motion.li key={c.hex} {...pressableCard} className="w-[124px] lg:w-auto">
                  <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-rule)]">
                    <div
                      className="h-[104px] lg:h-[132px] w-full"
                      style={{
                        background: `linear-gradient(155deg, ${c.hex}, ${c.hex}dd)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14)`,
                      }}
                    />
                    <div className="p-3 bg-[rgba(255,255,255,0.028)]">
                      <p className="text-[12px] font-semibold text-[#f4f6f5]">{c.name}</p>
                      <p className="mt-1 eyebrow text-[9px] text-[#8b9491]">{c.hex}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <div className="gutter my-9">
            <EnergyRule />
          </div>

          {/* ---- VOICE ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>Voice</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-2">
              {BRAND.voice.map((v) => (
                <li
                  key={v}
                  className="h-10 px-4 grid place-items-center rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.06)] text-[13px] text-[#f2e3ae]"
                >
                  {v}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12.5px] leading-[1.7] text-[#8b9491] max-w-[52ch]">
              Every caption, email and page OGMJ writes for you is generated against these four
              words. Change one and the whole library re-tunes.
            </p>
          </motion.section>

          <div className="gutter my-9">
            <EnergyRule />
          </div>

          {/* ---- TYPOGRAPHY specimen ---- */}
          <motion.section variants={reveal} className="gutter">
            <Eyebrow>Typography</Eyebrow>
            <div className="mt-4 surface rounded-[var(--radius-md)] p-5 lg:p-7">
              <p className="eyebrow text-[#7c8683]">Display · Instrument Serif</p>
              <p className="mt-3 editorial text-[2rem] lg:text-[2.75rem] leading-[1.05] text-[#f4f6f5]">
                Aa Bb Cc
              </p>
              <div className="my-5">
                <EnergyRule />
              </div>
              <p className="eyebrow text-[#7c8683]">Body · Inter Tight</p>
              <p className="mt-3 text-[15px] lg:text-[17px] leading-[1.6] text-[#a3adaa]">
                The quick brown fox jumps over the lazy dog — 0123456789
              </p>
            </div>
          </motion.section>

          {/* ---- ACTIONS ---- */}
          <motion.section variants={reveal} className="gutter mt-9">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button onClick={() => setGuidelines(true)} size="lg" variant="gold" icon="arrow">
                Open brand guidelines
              </Button>
              <Button href="/create" size="lg" variant="outline" icon="spark" iconSide="left">
                Evolve this brand
              </Button>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <Sheet
        open={guidelines}
        onClose={() => setGuidelines(false)}
        eyebrow="Brand guidelines"
        title={`${BRAND.name} — how to use it`}
        footer={
          <Button full size="lg" variant="gold" icon="arrow" onClick={() => setGuidelines(false)}>
            Share with your team
          </Button>
        }
      >
        <div className="space-y-6">
          {[
            {
              t: "The mark",
              b: "Minimum clear space is equal to the height of the mark on all four sides. Never place it on a background between 30% and 60% luminance — it loses its edge and reads as grey.",
            },
            {
              t: "Gold",
              b: "Aureate is jewellery. It marks status, completion and premium tiers — never a background, never a button for a routine action. If more than one gold element is visible at once, one of them is wrong.",
            },
            {
              t: "Voice in practice",
              b: "Precise, unhurried, warm, unembellished. Never use “glow”, “radiance” or “miracle”. State what a formulation does and at what concentration. If a claim can't be sourced, it doesn't ship.",
            },
            {
              t: "Photography",
              b: "Unretouched skin, single directional light source, deep shadow. No lifestyle stock. The product may be out of focus; the skin may not.",
            },
          ].map((g) => (
            <div key={g.t}>
              <h3 className="text-[14px] font-semibold text-[#f4f6f5]">{g.t}</h3>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-[#a3adaa]">{g.b}</p>
              <div className="mt-4">
                <EnergyRule />
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] border border-[rgba(16,185,129,0.16)] bg-[rgba(16,185,129,0.05)]">
            <span className="mt-[2px] text-[#34d399] shrink-0">
              <Icon name="spark" size={15} />
            </span>
            <p className="text-[12px] leading-[1.65] text-[#a3adaa]">
              These rules are enforced automatically. Design Studio will not generate an asset that
              breaks them, and Content will not write copy that uses a banned word.
            </p>
          </div>
        </div>
      </Sheet>
    </>
  );
}
