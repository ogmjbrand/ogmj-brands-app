"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { OgmjMark } from "@/components/ui/Icon";
import { hasOnboarded } from "@/lib/firstRun";

/**
 * Sends a first-time visitor to onboarding instead of dropping them into
 * someone else's finished dashboard.
 *
 * The children render underneath from the very first paint, so the page is
 * still statically prerendered and nothing about load performance changes.
 * A brand hold sits on top only while the check runs — one effect tick —
 * which prevents the dashboard from flashing before a first-timer is moved
 * on. The hold is identical on server and client (state always starts as
 * "checking"), so it cannot cause a hydration mismatch.
 */
export function FirstRunGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "open" | "leaving">("checking");

  useEffect(() => {
    if (hasOnboarded()) {
      setState("open");
      return;
    }
    setState("leaving");
    router.replace("/onboarding");
  }, [router]);

  return (
    <>
      {children}
      <AnimatePresence>
        {state !== "open" && (
          <motion.div
            key="hold"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[var(--z-overlay)] grid place-items-center bg-[#050505]"
            aria-hidden="true"
          >
            <OgmjMark size={30} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
