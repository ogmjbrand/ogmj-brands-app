"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "./Icon";
import { springPanel, easeOgmj } from "@/lib/motion";

/**
 * TOASTS
 *
 * The product's answer to "saving → subtle confirmation". Three rules decide
 * what a toast is allowed to be here:
 *
 *   1. It confirms, it does not inform. A toast is the receipt for an action
 *      the user just took. Anything they did not just do belongs on the
 *      surface it concerns, not in a strip that vanishes.
 *   2. It never carries the only copy of something. If a message must be
 *      read, it cannot be on a four-second timer.
 *   3. An error toast does not auto-dismiss, and offers the retry. Dismissing
 *      a failure on a timer is how a product loses someone's work quietly.
 *
 * Placement is bottom-anchored above the tab bar, because that is where the
 * thumb already is and where the user's attention lands after a tap. A
 * top-anchored toast on a phone appears in the one region the hand cannot
 * reach and the eye is not looking.
 */

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
  /** Only offered on failures — the recovery, not a second chance to agree. */
  action?: { label: string; onClick: () => void };
}

interface ToastApi {
  show: (message: string, tone?: ToastTone, action?: Toast["action"]) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const DURATION = 4200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef(new Map<number, number>());
  const nextId = useRef(1);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const show = useCallback<ToastApi["show"]>(
    (message, tone = "success", action) => {
      const id = nextId.current++;
      /* Three is the ceiling: a taller stack covers the content the toasts
         are reporting on, and nobody reads the fourth one. */
      setToasts((list) => [...list.slice(-2), { id, message, tone, action }]);

      if (tone !== "error") {
        timers.current.set(id, window.setTimeout(() => dismiss(id), DURATION));
      }
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {mounted && createPortal(<ToastViewport toasts={toasts} onDismiss={dismiss} />, document.body)}
    </Ctx.Provider>
  );
}

const TONE: Record<ToastTone, { icon: "check" | "alert" | "spark"; accent: string; rule: string }> = {
  success: {
    icon: "check",
    accent: "text-[#34d399]",
    rule: "linear-gradient(90deg,transparent,rgba(16,185,129,0.8),transparent)",
  },
  error: {
    icon: "alert",
    accent: "text-[#e0a355]",
    rule: "linear-gradient(90deg,transparent,rgba(224,163,85,0.85),transparent)",
  },
  info: {
    icon: "spark",
    accent: "text-[#a3adaa]",
    rule: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
  },
};

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="
        fixed z-[var(--z-toast)] pointer-events-none
        inset-x-0 bottom-0
        px-4 pb-[calc(76px+env(safe-area-inset-bottom))]
        lg:left-[212px] xl:left-[236px] lg:right-auto lg:max-w-[420px] lg:pb-7 lg:px-10
        flex flex-col gap-2
      "
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const tone = TONE[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={springPanel}
              /* Errors interrupt; confirmations do not. */
              role={t.tone === "error" ? "alert" : "status"}
              aria-live={t.tone === "error" ? "assertive" : "polite"}
              className="
                pointer-events-auto relative overflow-hidden
                rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.13)]
                bg-[linear-gradient(180deg,rgba(25,29,27,0.98),rgba(11,13,12,0.98))]
                backdrop-blur-xl
                shadow-[0_18px_44px_-18px_rgba(0,0,0,0.95)]
              "
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: tone.rule }} />

              <div className="flex items-start gap-3 p-3.5">
                <span className={`mt-[1px] shrink-0 ${tone.accent}`}>
                  <Icon name={tone.icon} size={16} />
                </span>

                <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#f4f6f5]">{t.message}</p>

                {t.action && (
                  <button
                    onClick={() => {
                      t.action!.onClick();
                      onDismiss(t.id);
                    }}
                    className="shrink-0 h-7 px-2.5 -my-0.5 rounded-[7px] text-[12px] font-semibold text-[#34d399] hover:bg-[rgba(16,185,129,0.12)] transition-colors"
                  >
                    {t.action.label}
                  </button>
                )}

                <button
                  onClick={() => onDismiss(t.id)}
                  aria-label="Dismiss"
                  className="shrink-0 grid place-items-center h-7 w-7 -my-0.5 -mr-1 rounded-[7px] text-[#8b9491] hover:text-[#f4f6f5] transition-colors"
                >
                  <Icon name="close" size={13} />
                </button>
              </div>

              {/* The remaining time, shown. A toast that vanishes without
                  warning reads as a glitch; a visible countdown reads as a
                  decision the product made. Errors have none, because they
                  do not expire. */}
              {t.tone !== "error" && !reduce && (
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-[rgba(16,185,129,0.55)]"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CONFIRM — "deleting → clear consequence"                            */
/* ------------------------------------------------------------------ */

/**
 * A destructive action names what will be lost, in the user's own terms,
 * and puts the dangerous verb on the button rather than on "OK". Nobody has
 * ever been saved by a dialog that says "Are you sure?" and offers "Yes".
 */
export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title,
  consequence,
  confirmLabel = "Delete",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  consequence: string;
  confirmLabel?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* Focus lands on Cancel, never on the destructive control: a stray
       Enter should not delete anything. */
    const t = window.setTimeout(() => {
      panel.current?.querySelector<HTMLButtonElement>("[data-cancel]")?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[var(--z-overlay)] flex items-end lg:items-center lg:justify-center">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Cancel"
            className="absolute inset-0 bg-[rgba(3,5,4,0.76)] backdrop-blur-xl cursor-default"
          />

          <motion.div
            ref={panel}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-consequence"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ ...springPanel, ease: easeOgmj }}
            className="
              relative w-full lg:max-w-[420px] m-3 lg:m-0
              rounded-[var(--radius-lg)] border border-[rgba(224,85,85,0.22)]
              bg-[linear-gradient(180deg,#191d1b,#0b0d0c)]
              p-5 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.95)]
              pb-[max(20px,env(safe-area-inset-bottom))] lg:pb-5
            "
          >
            <div
              className="absolute inset-x-5 top-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(224,85,85,0.6),transparent)" }}
            />

            <h2 id="confirm-title" className="text-[17px] font-semibold text-[#f4f6f5] leading-tight">
              {title}
            </h2>
            <p id="confirm-consequence" className="mt-2.5 text-[12.5px] leading-[1.65] text-[#a3adaa]">
              {consequence}
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                data-cancel
                onClick={onClose}
                className="flex-1 h-[46px] rounded-[10px] border border-[rgba(255,255,255,0.14)] text-[13px] font-medium text-[#f4f6f5] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 h-[46px] rounded-[10px] text-[13px] font-semibold text-[#2a0a0a] bg-[linear-gradient(180deg,#f08a8a,#e05555)] hover:brightness-[1.06] transition-[filter]"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
