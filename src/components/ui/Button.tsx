"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { springTap } from "@/lib/motion";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "gold" | "outline" | "quiet" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Sizes are set by touch target first. `md` is 46px tall — comfortably
 * above the 44px floor — and only shrinks to `sm` (38px) where the control
 * sits inside an already-tapped context.
 */
const SIZES: Record<Size, string> = {
  sm: "h-[38px] px-3.5 text-[12px] gap-1.5 rounded-[8px]",
  md: "h-[46px] px-5 text-[13px] gap-2 rounded-[10px]",
  lg: "h-[54px] px-6 text-[14px] gap-2.5 rounded-[12px]",
};

const VARIANTS: Record<Variant, string> = {
  /* Emerald is action. It reads as lit, not filled — the gradient plus the
     inner top highlight give it a physical, dimensional edge. */
  primary:
    "text-[#03150f] font-semibold bg-[linear-gradient(180deg,#34d399,#10b981_55%,#0ea472)] shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_10px_30px_-12px_rgba(16,185,129,0.75)] hover:brightness-[1.07]",
  /* Gold is completion and status. Never for routine actions. */
  gold:
    "text-[#1a1405] font-semibold bg-[linear-gradient(180deg,#f2e3ae,#d4af37_55%,#b4922a)] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_10px_30px_-12px_rgba(212,175,55,0.6)] hover:brightness-[1.06]",
  outline:
    "text-[#f4f6f5] font-medium border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.028)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(16,185,129,0.4)]",
  quiet:
    "text-[#a3adaa] font-medium bg-[rgba(255,255,255,0.045)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f4f6f5]",
  ghost: "text-[#a3adaa] font-medium hover:text-[#f4f6f5]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconSide?: "left" | "right";
  href?: string;
  full?: boolean;
  /** Desktop-only magnetic pull. Off for destructive or precision controls. */
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    icon,
    iconSide = "right",
    href,
    full,
    magnetic = true,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const host = useRef<HTMLElement | null>(null);
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  /**
   * MAGNETIC PULL — pointer-only, and only for devices with a fine pointer.
   * On touch this would fight the finger, so it never runs there.
   * Displacement is capped at 4px: felt, not seen.
   */
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!magnetic || reduce || e.pointerType !== "mouse" || !host.current) return;
      const r = host.current.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setPull({ x: dx * 8, y: dy * 6 });
    },
    [magnetic, reduce],
  );

  const reset = useCallback(() => setPull({ x: 0, y: 0 }), []);

  const cls = [
    "relative inline-flex items-center justify-center select-none isolate",
    "transition-[filter,background-color,border-color,color] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
    SIZES[size],
    VARIANTS[variant],
    full ? "w-full" : "",
    className,
  ].join(" ");

  const inner = (
    <>
      {icon && iconSide === "left" && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      <span className="relative">{children}</span>
      {icon && iconSide === "right" && (
        <Icon
          name={icon}
          size={size === "sm" ? 15 : 17}
          /* The arrow leans into the direction of travel on hover. */
          className="transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[3px]"
        />
      )}
    </>
  );

  const motionProps = {
    animate: { x: pull.x, y: pull.y },
    transition: springTap,
    whileTap: reduce ? undefined : { scale: 0.965 },
    onPointerMove: onMove,
    onPointerLeave: reset,
    className: cls + " group/btn",
  };

  if (href) {
    return (
      <motion.div
        {...motionProps}
        className={`${full ? "w-full" : "inline-flex"}`}
        style={{ display: full ? "block" : "inline-flex" }}
      >
        <Link
          href={href}
          ref={host as React.Ref<HTMLAnchorElement>}
          className={cls + " group/btn"}
          onPointerMove={onMove}
          onPointerLeave={reset}
        >
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={(n) => {
        host.current = n;
        if (typeof ref === "function") ref(n);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = n;
      }}
      {...motionProps}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {inner}
    </motion.button>
  );
});
