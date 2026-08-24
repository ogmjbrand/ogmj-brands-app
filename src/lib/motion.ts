import type { Transition, Variants } from "motion/react";

/**
 * THE OGMJ MOTION SYSTEM
 *
 * Motion is not decoration. Every transition in this file exists to answer
 * one of six questions the user is asking without words:
 *
 *   WHERE AM I?      → route / scene transitions        (SCENE)
 *   WHAT IS THIS?    → element entering the hierarchy   (REVEAL)
 *   DID IT WORK?     → direct manipulation feedback     (TAP)
 *   WHAT'S HAPPENING?→ system thinking / generating     (THINK)
 *   HOW ARE THESE    → connection between objects       (ENERGY)
 *   RELATED?
 *   WHAT CHANGED?    → value / state mutation           (SHIFT)
 *
 * If a motion cannot be assigned one of these, it should not exist.
 */

/* ------------------------------------------------------------------ */
/* SPRINGS — physical constants. Named for feel, tuned for 60fps.      */
/* ------------------------------------------------------------------ */

/** Direct manipulation. Responds *now*. Under a finger. */
export const springTap: Transition = {
  type: "spring",
  stiffness: 620,
  damping: 34,
  mass: 0.6,
};

/** Panels, sheets, drawers. Weighted — it has physical presence. */
export const springPanel: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 38,
  mass: 0.95,
};

/** Content arriving. Settles confidently with a whisper of overshoot. */
export const springSettle: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.8,
};

/** Shared-element / morph. Slower, so the eye can track identity. */
export const springMorph: Transition = {
  type: "spring",
  stiffness: 190,
  damping: 28,
  mass: 1,
};

/* ------------------------------------------------------------------ */
/* EASES — for anything measured in time rather than force             */
/* ------------------------------------------------------------------ */

export const easeOgmj = [0.22, 1, 0.36, 1] as const;
export const easeOgmjIn = [0.55, 0, 0.65, 0.2] as const;
export const easeEnergy = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  tap: 0.09,
  quick: 0.18,
  base: 0.32,
  panel: 0.46,
  scene: 0.72,
} as const;

/* ------------------------------------------------------------------ */
/* REVEAL — the house entrance. Content rises INTO the hierarchy.      */
/* Never a bare fade: a fade alone communicates nothing about origin.  */
/* ------------------------------------------------------------------ */

export const reveal: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.base, ease: easeOgmj },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: DUR.quick, ease: easeOgmjIn },
  },
};

/** Stagger container. `delayChildren` buys a beat so the eye lands first. */
export const stagger = (step = 0.055, delay = 0.04): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
  exit: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
});

/* ------------------------------------------------------------------ */
/* SCENE — route-level. Depth, not slide. You move THROUGH OGMJ.       */
/* ------------------------------------------------------------------ */

export const scene: Variants = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.scene, ease: easeOgmj },
  },
  exit: {
    opacity: 0,
    scale: 1.008,
    transition: { duration: DUR.quick, ease: easeOgmjIn },
  },
};

/* ------------------------------------------------------------------ */
/* SHEET — mobile's primary surface. Rises from the thumb.             */
/* ------------------------------------------------------------------ */

export const sheet: Variants = {
  hidden: { y: "100%" },
  show: { y: 0, transition: springPanel },
  exit: { y: "100%", transition: { duration: DUR.base, ease: easeOgmjIn } },
};

export const scrim: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  show: {
    opacity: 1,
    backdropFilter: "blur(14px)",
    transition: { duration: DUR.base, ease: easeOgmj },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: DUR.quick },
  },
};

/* ------------------------------------------------------------------ */
/* THINK — AI generation. Materialization, not a spinner.              */
/* Assets don't "load"; they resolve out of the dark.                  */
/* ------------------------------------------------------------------ */

export const materialize: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(14px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: easeOgmj },
  },
};

/** Generation phases advancing in a vertical ladder. */
export const phase: Variants = {
  pending: { opacity: 0.24, x: 0 },
  active: {
    opacity: 1,
    x: 4,
    transition: { duration: DUR.base, ease: easeOgmj },
  },
  done: {
    opacity: 0.55,
    x: 0,
    transition: { duration: DUR.base, ease: easeOgmj },
  },
};

/* ------------------------------------------------------------------ */
/* TAP — every interactive surface. Immediate, unmissable, restrained. */
/* ------------------------------------------------------------------ */

export const pressable = {
  whileTap: { scale: 0.965 },
  transition: springTap,
} as const;

/** For large touch cards — less scale, they're heavier objects. */
export const pressableCard = {
  whileTap: { scale: 0.985 },
  transition: springTap,
} as const;

/* ------------------------------------------------------------------ */
/* AMBIENT — content that moves with no user input at all.             */
/*                                                                     */
/* This is the most dangerous category in the system, so it has the    */
/* tightest rules. Two techniques live here, both adapted from a       */
/* luxury-hospitality reference:                                       */
/*                                                                     */
/*   MARQUEE  (components/ui/Marquee) — a rail drifting sideways.      */
/*     Permitted only for content that is non-interactive AND that     */
/*     nobody needs to read item by item. It states breadth. A moving  */
/*     tap target is a usability failure; a moving fact is worse.      */
/*                                                                     */
/*   PARALLAX (components/ui/Parallax) — elements in one section       */
/*     travelling at different rates as it crosses the viewport.       */
/*     Amplitude stays in the low tens of pixels and is spring-damped; */
/*     large or raw-scroll-bound parallax reads as cheap and makes     */
/*     some people ill.                                                */
/*                                                                     */
/* Both stop completely under reduced motion. Neither ever carries     */
/* information, which is what makes stopping them free.                */
/* ------------------------------------------------------------------ */

/** One full marquee cycle, in seconds. Slow enough to read as drift. */
export const MARQUEE_SLOW = 52;
export const MARQUEE_BASE = 46;

/** Parallax travel ceiling. Nothing in OGMJ may exceed this. */
export const PARALLAX_MAX_PX = 8;

/* ------------------------------------------------------------------ */
/* Reduced motion: we strip transform + blur but KEEP opacity, so      */
/* state changes remain perceivable. Motion reduces; it never vanishes.*/
/* ------------------------------------------------------------------ */

export const reduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.14 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};
