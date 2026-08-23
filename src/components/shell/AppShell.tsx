"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MobileNav, DesktopRail } from "./Nav";
import { scene, reduced } from "@/lib/motion";

/**
 * Onboarding is deliberately chrome-free. Navigation implies "you already
 * have a business in here"; onboarding is the moment before that is true.
 * Showing tabs during it would undercut the whole scene.
 */
const BARE = ["/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const bare = BARE.some((p) => path.startsWith(p));
  const reduce = useReducedMotion();

  if (bare) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <DesktopRail />
      <div className="lg:pl-[212px] xl:pl-[236px]">
        {/* Ultrawide is a wider workspace, not a wider line of text. Both the
            gutter content and the full-bleed snap rows live inside this box,
            so they stay optically aligned at every width. */}
        <main id="main" className="min-h-dvh mx-auto w-full max-w-[1680px]">
          {/* Route transitions move through depth rather than sliding
              sideways. A horizontal slide implies a sibling relationship
              between every screen; depth implies you are moving deeper
              into one product. mode="wait" prevents the two scenes from
              ever compositing on top of each other mid-flight. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={path}
              variants={reduce ? reduced : scene}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ willChange: "transform, opacity" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </>
  );
}
