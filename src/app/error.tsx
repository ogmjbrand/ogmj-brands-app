"use client";

import { useEffect } from "react";
import { EnergyOrb } from "@/components/ui/Energy";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Data";

/**
 * ERROR — "useful recovery", not a dead end.
 *
 * Without this file an unhandled render error falls through to Next's own
 * error page, which is grey, technical and instantly shatters the premium
 * feel the rest of the product is carrying. A failure is one of the moments
 * a user judges a product hardest, so it gets designed like any other screen.
 *
 * Three things it owes the user, in order:
 *   - It is not their fault, said plainly and without grovelling.
 *   - Their business is intact. This is the fear a crash actually creates.
 *   - A way forward they can press right now.
 *
 * The digest is shown because a reference a user can quote is worth more to
 * them than a reassurance they cannot act on.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* The hook a real reporter (Sentry, etc.) attaches to. Logged rather
       than swallowed so a failure is never silent in development. */
    console.error("[ogmj] route error", error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-start justify-center gutter pb-nav">
      <EnergyOrb size={76} state="idle" />

      <div className="mt-8">
        <Eyebrow tone="gold">Something broke on our side</Eyebrow>
      </div>

      <h1 className="mt-4 editorial text-[2rem] lg:text-[2.75rem] leading-[1.06] text-[#f4f6f5] max-w-[17ch]">
        This screen didn&apos;t load. Your business is fine.
      </h1>

      <p className="mt-4 text-[13px] leading-[1.7] text-[#a3adaa] max-w-[44ch]">
        Nothing was lost — your brand, content, campaigns and customers are all exactly where you
        left them. This is a rendering fault on this page only.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
        <Button onClick={reset} size="lg" icon="arrow">
          Try this page again
        </Button>
        <Button href="/" size="lg" variant="outline" icon="home" iconSide="left">
          Back to your dashboard
        </Button>
      </div>

      {error.digest && (
        <p className="mt-7 eyebrow text-[#7c8683]">Reference · {error.digest}</p>
      )}
    </div>
  );
}
