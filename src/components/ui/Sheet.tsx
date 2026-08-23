"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { sheet, scrim, springPanel } from "@/lib/motion";

/**
 * BOTTOM SHEET — mobile's primary secondary surface.
 *
 * A modal dialog centred on screen is a desktop pattern. On a phone it
 * lands in the dead zone above the thumb and forces a reach. The sheet
 * rises from where the hand already is, is dismissed by pushing it back
 * down, and never covers more than it needs.
 *
 * On ≥1024px the same component recomposes into a right-hand panel —
 * a slide-over reads as spatial on a wide screen where a bottom sheet
 * would read as a phone UI stretched sideways.
 */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  /* Scroll lock without layout shift. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Focus management: trap inside, return focus on close. */
  useEffect(() => {
    if (!open) {
      restoreTo.current?.focus?.();
      return;
    }
    restoreTo.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      (first ?? panel.current)?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /**
   * Dismissal is velocity-aware, not distance-only. A quick flick should
   * dismiss even from 40px, because the user's intent was unambiguous;
   * a slow drag past halfway is equally unambiguous. Anything else
   * springs back — the sheet resists, so the gesture feels physical.
   */
  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const flicked = info.velocity.y > 520;
      const dragged = info.offset.y > 130;
      if (flicked || dragged) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[var(--z-sheet)] flex items-end lg:items-stretch lg:justify-end">
          <motion.button
            variants={scrim}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            aria-label="Close"
            className="absolute inset-0 bg-[rgba(3,5,4,0.72)] cursor-default"
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            variants={sheet}
            initial="hidden"
            animate="show"
            exit="exit"
            drag={reduce ? false : "y"}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={onDragEnd}
            className="
              relative w-full max-h-[90dvh] flex flex-col outline-none
              rounded-t-[var(--radius-sheet)] lg:rounded-none lg:rounded-l-[var(--radius-xl)]
              lg:max-w-[440px] lg:max-h-none lg:h-full
              border-t border-x lg:border-x-0 lg:border-l border-[rgba(255,255,255,0.12)]
              bg-[linear-gradient(180deg,#161a18,#0b0d0c_38%)]
              shadow-[0_-28px_70px_-24px_rgba(0,0,0,0.95)]
            "
          >
            {/* Emerald hairline across the lip — the sheet arrives lit. */}
            <div
              className="absolute inset-x-6 top-0 h-px lg:hidden"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(16,185,129,0.55),rgba(212,175,55,0.4),transparent)",
              }}
            />

            {/* Grab handle. Present on mobile only — there is nothing to
                grab with a mouse, and a vestigial handle is a tell. */}
            <div className="pt-3 pb-1 grid place-items-center lg:hidden shrink-0">
              <div className="h-[3px] w-9 rounded-full bg-[rgba(255,255,255,0.2)]" />
            </div>

            {(title || eyebrow) && (
              <header className="px-5 pt-3 pb-4 lg:pt-7 shrink-0">
                {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
                {title && (
                  <h2 className="text-[var(--text-h2)] leading-[1.2] display-tight text-[#f4f6f5]">
                    {title}
                  </h2>
                )}
              </header>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>

            {footer && (
              <footer
                className="
                  shrink-0 px-5 pt-4 border-t border-[var(--color-rule)]
                  bg-[rgba(11,13,12,0.9)] backdrop-blur-xl
                  pb-[max(20px,env(safe-area-inset-bottom))]
                "
              >
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * SEGMENTED — the mobile tab. The active pill is a single shared element
 * that MOVES between slots (layoutId) rather than fading out here and in
 * there. Movement preserves the user's sense of where they were.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  id: string;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex p-[3px] rounded-[11px] bg-[rgba(255,255,255,0.045)] border border-[var(--color-rule)] w-full no-scrollbar overflow-x-auto"
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`
              relative flex-1 min-w-max h-[36px] px-3.5 rounded-[8px] text-[12px] font-medium
              transition-colors duration-200 whitespace-nowrap
              ${on ? "text-[#03150f]" : "text-[#a3adaa] hover:text-[#f4f6f5]"}
            `}
          >
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={springPanel}
                className="absolute inset-0 rounded-[8px] bg-[linear-gradient(180deg,#34d399,#10b981)]"
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
