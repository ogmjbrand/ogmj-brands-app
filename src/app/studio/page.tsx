"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TopBar } from "@/components/shell/TopBar";
import { PageHead } from "@/components/shell/PageHead";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Parallax } from "@/components/ui/Parallax";
import { Icon } from "@/components/ui/Icon";
import { reveal, stagger, materialize, easeOgmj } from "@/lib/motion";
import { ASSETS, type Asset } from "@/lib/data";

type Filter = "all" | "Logo" | "Social" | "Card" | "Flyer";

/* Deliberately irregular so neighbouring tiles never share a rate — a
   repeating pattern would resolve into visible rows and defeat the point. */
const PARALLAX_RATES = [-7, 4, -2, 7, -5, 2];

/**
 * DESIGN STUDIO
 *
 * Assets are shown at their true aspect ratios in a masonry column layout.
 * Forcing every asset into a uniform square — the standard grid move —
 * lies about what the asset is, and a designer spots it instantly.
 *
 * Generation happens in place: the new asset's slot appears immediately
 * and resolves from blur into the finished piece, so the user watches it
 * arrive in the library rather than watching a modal spinner.
 */
export default function StudioPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState<Asset[]>(ASSETS);
  const [generating, setGenerating] = useState(false);
  const timer = useRef<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const shown = useMemo(
    () => (filter === "all" ? items : items.filter((a) => a.kind === filter)),
    [filter, items],
  );

  const generate = useCallback(() => {
    setGenerating(true);
    timer.current = window.setTimeout(
      () => {
        setItems((prev) => [
          {
            id: `gen-${Date.now()}`,
            name: "Serum 02 — carousel",
            kind: "Social",
            ratio: "4 / 5",
            tone: "gold",
            motif: "statement",
            line: "The concentration is the product.",
          },
          ...prev,
        ]);
        setGenerating(false);
      },
      reduce ? 400 : 2200,
    );
  }, [reduce]);

  return (
    <>
      <TopBar />
      <div className="pb-nav">
        <PageHead
          eyebrow="Build · Design Studio"
          title="Design Studio"
          lede="Logos, graphics and assets — generated inside your brand rules, so nothing ever goes off-brand."
          back={{ href: "/build", label: "Build" }}
        />

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
          <motion.div variants={reveal} className="gutter">
            <Segmented
              id="assets"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "Logo", label: "Logos" },
                { value: "Social", label: "Social" },
                { value: "Card", label: "Cards" },
                { value: "Flyer", label: "Flyers" },
              ]}
            />
          </motion.div>

          <motion.div variants={reveal} className="gutter mt-6">
            {shown.length === 0 && !generating ? (
              <EmptyState
                eyebrow={`No ${filter.toLowerCase()}s yet`}
                headline="Every brand needs one of these."
                body={`OGMJ can produce a full ${filter.toLowerCase()} set from your existing palette, type and mark in about ninety seconds.`}
                action={`Generate ${filter.toLowerCase()}s`}
                onAction={generate}
              />
            ) : (
              /* CSS columns give real masonry without a layout library and
                 without JS measuring on every resize. */
              <div className="columns-2 lg:columns-3 xl:columns-4 gap-3 lg:gap-4 [column-fill:balance]">
                <AnimatePresence mode="popLayout">
                  {generating && (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      className="mb-3 break-inside-avoid"
                    >
                      <div
                        className="relative rounded-[var(--radius-md)] overflow-hidden border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.05)] grid place-items-center"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        {/* A sweep of light passing over the surface — the
                            asset is being brought into existence, not
                            downloaded from somewhere. */}
                        {!reduce && (
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(105deg,transparent 32%,rgba(16,185,129,0.28) 50%,transparent 68%)",
                            }}
                            animate={{ x: ["-120%", "120%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <p className="relative eyebrow text-[#34d399]">Composing</p>
                      </div>
                    </motion.div>
                  )}

                  {shown.map((a, i) => (
                    <motion.div
                      key={a.id}
                      layout
                      variants={materialize}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.55, ease: easeOgmj, delay: Math.min(i * 0.045, 0.3) }}
                      whileTap={{ scale: 0.985 }}
                      className="mb-5 break-inside-avoid"
                    >
                      {/* Each tile drifts at its own rate as the gallery
                          passes, so the grid reads as a cluster with depth
                          rather than a slab sliding by. Amplitude is kept at
                          ±7px: the total possible convergence between two
                          tiles stacked in one column is 14px against a 20px
                          gap, so they can never touch, and the effect stays
                          below the threshold that makes text hard to track. */}
                      <Parallax rate={PARALLAX_RATES[i % PARALLAX_RATES.length]}>
                        <AssetTile asset={a} />
                      </Parallax>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {shown.length > 0 && (
            <motion.div variants={reveal} className="gutter mt-7">
              <Button onClick={generate} disabled={generating} size="lg" full icon="spark" iconSide="left">
                {generating ? "Composing…" : "Generate new asset"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

/**
 * Each tile renders a real composition in the brand's own palette — a mark
 * lockup, a product numeral, a business card, a statement post, a stockist
 * split, a pattern. Six different pieces of design, because a studio whose
 * assets all look identical is not a studio.
 */
function AssetTile({ asset }: { asset: Asset }) {
  const bone = asset.tone === "bone";
  const bg = bone
    ? "#EFE9DE"
    : asset.tone === "gold"
      ? "linear-gradient(150deg,#2a2110,#0D0F0E)"
      : "linear-gradient(150deg,#131615,#080a09)";
  const fg = bone ? "#0D0F0E" : "#EFE9DE";
  const rule = bone ? "#0D0F0E" : "#D4AF37";

  return (
    <button className="group block w-full text-left">
      <div
        className="relative rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-rule)] transition-all duration-300 group-hover:border-[rgba(212,175,55,0.4)]"
        style={{ aspectRatio: asset.ratio, background: bg }}
      >
        <div className="absolute inset-0 p-[7%]">
          {asset.motif === "mark" && (
            <div className="h-full w-full grid place-items-center">
              <svg viewBox="0 0 40 40" className="w-[52%]" fill="none" aria-hidden="true">
                <path d="M20 3 37 20 20 37 3 20 20 3Z" stroke="#D4AF37" strokeWidth="1.1" />
                <path d="M20 9.5v5M20 25.5v5M9.5 20h5M25.5 20h5" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round" />
                <circle cx="20" cy="20" r="2.6" fill="#D4AF37" />
              </svg>
            </div>
          )}

          {asset.motif === "statement" && (
            <div className="h-full w-full flex flex-col justify-center items-center text-center">
              <p
                className="leading-[1.12]"
                style={{ color: fg, fontFamily: "var(--font-serif)", fontSize: "clamp(11px,4.4vw,21px)" }}
              >
                {asset.line}
              </p>
              <span className="mt-[9%] block h-px w-[26%]" style={{ background: rule }} />
            </div>
          )}

          {asset.motif === "numeral" && (
            <div className="h-full w-full flex flex-col justify-between">
              <span
                className="tracking-[0.22em] uppercase"
                style={{ color: rule, fontFamily: "var(--font-mono)", fontSize: "clamp(5px,1.9vw,9px)" }}
              >
                Aurelia
              </span>
              <p
                className="leading-[0.8] -ml-[2%]"
                style={{ color: fg, fontFamily: "var(--font-serif)", fontSize: "clamp(46px,19vw,92px)" }}
              >
                {asset.line}
              </p>
              <p style={{ color: fg, opacity: 0.62, fontSize: "clamp(5.5px,2vw,10px)", lineHeight: 1.5 }}>
                {asset.sub}
              </p>
            </div>
          )}

          {asset.motif === "card" && (
            <div className="h-full w-full flex flex-col justify-between">
              <svg viewBox="0 0 40 40" className="w-[13%]" fill="none" aria-hidden="true">
                <path d="M20 3 37 20 20 37 3 20 20 3Z" stroke={fg} strokeWidth="1.6" />
                <circle cx="20" cy="20" r="3.4" fill={fg} />
              </svg>
              <div>
                <p style={{ color: fg, fontFamily: "var(--font-serif)", fontSize: "clamp(10px,3.6vw,17px)", lineHeight: 1.1 }}>
                  {asset.line}
                </p>
                <p
                  className="mt-[3%] tracking-[0.16em] uppercase"
                  style={{ color: fg, opacity: 0.55, fontFamily: "var(--font-mono)", fontSize: "clamp(4.5px,1.6vw,8px)" }}
                >
                  {asset.sub}
                </p>
              </div>
            </div>
          )}

          {asset.motif === "split" && (
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 rounded-[3px]" style={{ background: "#10B981" }} />
              <p
                className="mt-[7%] leading-[1.1]"
                style={{ color: fg, fontFamily: "var(--font-serif)", fontSize: "clamp(10px,4vw,19px)" }}
              >
                {asset.line}
              </p>
              <p
                className="mt-[4%] tracking-[0.14em] uppercase"
                style={{ color: fg, opacity: 0.6, fontFamily: "var(--font-mono)", fontSize: "clamp(4.5px,1.6vw,8px)" }}
              >
                {asset.sub}
              </p>
            </div>
          )}

          {asset.motif === "lattice" && (
            <div className="h-full w-full grid grid-cols-4 grid-rows-4 gap-[6%]">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="rounded-full border"
                  style={{ borderColor: i % 3 === 0 ? "#D4AF37" : "#10B981", opacity: i % 3 === 0 ? 0.9 : 0.45 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Metadata reveals on hover/press rather than sitting on the art
            permanently — the asset is the point, the label is not. */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-[linear-gradient(0deg,rgba(0,0,0,0.88),transparent)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
          <p className="text-[10.5px] font-medium text-white truncate">{asset.name}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11.5px] text-[#a3adaa] truncate">{asset.name}</p>
        <Icon name="chevron" size={12} className="text-[#7c8683] shrink-0" />
      </div>
    </button>
  );
}
