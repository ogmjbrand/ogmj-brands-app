"use client";

import { useEffect, useRef, useState, useId } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { easeOgmj } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* EYEBROW — the mono label. Structures every screen in the product.   */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  tone = "low",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "low" | "em" | "gold";
  className?: string;
}) {
  const c =
    tone === "em" ? "text-[#34d399]" : tone === "gold" ? "text-[#d4af37]" : "text-[#8b9491]";
  return <p className={`eyebrow ${c} ${className}`}>{children}</p>;
}

/* ------------------------------------------------------------------ */
/* COUNTER — numbers arrive by counting, because a business metric     */
/* that simply appears reads as decoration. Counting reads as *live*.  */
/* ------------------------------------------------------------------ */

export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
  className = "",
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: easeOgmj,
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  const fmt = (v: number) => {
    if (compact) {
      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
      if (v >= 1_000) return `${(v / 1_000).toFixed(v >= 10_000 ? 0 : 1)}K`;
    }
    return v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span ref={ref} className={`numeral ${className}`}>
      {prefix}
      {fmt(n)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* DELTA — direction is carried by an arrow AND colour, never colour   */
/* alone. Colour-blind users read the same information.                */
/* ------------------------------------------------------------------ */

export function Delta({ value, className = "" }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 numeral text-[11px] font-medium ${
        up ? "text-[#34d399]" : "text-[#e05555]"
      } ${className}`}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path
          d={up ? "M5 8.5V1.5M1.8 4.7 5 1.5l3.2 3.2" : "M5 1.5v7M1.8 5.3 5 8.5l3.2-3.2"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {up ? "+" : ""}
      {value.toFixed(1)}%
      <span className="sr-only-ogmj">{up ? "increase" : "decrease"}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SPARKLINE — the line DRAWS itself. A chart that fades in is a       */
/* picture; a chart that draws is a measurement being taken.           */
/* ------------------------------------------------------------------ */

export function Sparkline({
  data,
  accent = "em",
  height,
  className = "",
  area = true,
}: {
  data: number[];
  accent?: "em" | "gold";
  /** Omit to let the className own the height (so it can be responsive). */
  height?: number;
  className?: string;
  area?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();

  const W = 100;
  const H = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / span) * (H - 5) - 2.5;
    return [x, y] as const;
  });

  /* Catmull-Rom → cubic Bézier. A polyline reads as cheap; smooth
     curvature reads as a considered instrument. */
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }

  const stroke = accent === "gold" ? "#d4af37" : "#10b981";
  const glow = accent === "gold" ? "rgba(212,175,55,0.28)" : "rgba(16,185,129,0.28)";
  const last = pts[pts.length - 1];

  return (
    <div ref={ref} className={`relative ${className}`} style={height ? { height } : undefined}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glow} />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </linearGradient>
        </defs>

        {area && (
          <motion.path
            d={`${d} L ${W},${H} L 0,${H} Z`}
            fill={`url(#fill-${id})`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.55 }}
          />
        )}

        <motion.path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: reduce ? 0 : 1.15, ease: easeOgmj }}
        />

      </svg>

      {/* Terminal node — where the business is right now.
          Rendered outside the SVG: `preserveAspectRatio="none"` stretches the
          viewBox non-uniformly, which would squash a <circle> into an ellipse
          at any aspect ratio but 100:36. A DOM node scales uniformly. */}
      <motion.span
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${(last[0] / W) * 100}%`,
          top: `${(last[1] / H) * 100}%`,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          background: stroke,
          boxShadow: `0 0 8px ${glow}`,
        }}
        initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.36, delay: reduce ? 0 : 1.05, ease: easeOgmj }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RING — brand health and completion. Draws clockwise from 12.        */
/* ------------------------------------------------------------------ */

export function Ring({
  value,
  size = 56,
  accent = "gold",
  label,
}: {
  value: number;
  size?: number;
  accent?: "em" | "gold";
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const r = 20;
  const c = 2 * Math.PI * r;
  const stroke = accent === "gold" ? "#d4af37" : "#10b981";

  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c - (value / 100) * c : c }}
          animate={inView ? { strokeDashoffset: c - (value / 100) * c } : {}}
          transition={{ duration: reduce ? 0 : 1.3, ease: easeOgmj }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="numeral text-[13px] font-semibold text-[#f4f6f5]">{value}</span>
      </div>
      {label && <span className="sr-only-ogmj">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BARS — comparison. Grows from the baseline, staggered left → right. */
/* ------------------------------------------------------------------ */

export function Bars({
  data,
  labels,
  accent = "em",
  height = 108,
}: {
  data: number[];
  labels?: string[];
  accent?: "em" | "gold";
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const max = Math.max(...data) || 1;
  const fill =
    accent === "gold"
      ? "linear-gradient(180deg,#f2e3ae,#d4af37)"
      : "linear-gradient(180deg,#34d399,#0a7f59)";

  return (
    <div ref={ref}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((v, i) => (
          <motion.div
            key={i}
            /* h-full matters: these are flex children in an `items-end`
               row with no intrinsic height, so scaleY would be scaling
               a zero-height box and the chart would render empty. */
            className="flex-1 h-full rounded-t-[3px] origin-bottom min-w-0"
            style={{ background: fill }}
            initial={{ scaleY: reduce ? v / max : 0, opacity: reduce ? 1 : 0.3 }}
            animate={inView ? { scaleY: v / max, opacity: 1 } : {}}
            transition={{
              duration: reduce ? 0 : 0.65,
              delay: reduce ? 0 : i * 0.045,
              ease: easeOgmj,
            }}
          />
        ))}
      </div>
      {labels && (
        <div className="flex gap-1.5 mt-2">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center eyebrow text-[9px] tracking-[0.12em] min-w-0 truncate">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
