"use client";

/**
 * The last line of defence: an error thrown in the root layout itself, where
 * no provider, font variable or stylesheet from the app can be relied on —
 * global-error replaces the entire document, including <html> and <body>.
 *
 * So this file inlines everything it needs and imports nothing from the
 * design system. A boundary that depends on the thing that just failed is
 * not a boundary.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 20px",
          background: "#050505",
          color: "#f4f6f5",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 1.8 30.2 16 16 30.2 1.8 16 16 1.8Z" stroke="#10B981" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M16 7.4v5.1M16 19.5v5.1M7.4 16h5.1M19.5 16h5.1" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.5" fill="#D4AF37" />
          </svg>

          <p
            style={{
              marginTop: 28,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8b9491",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            OGMJ could not start
          </p>

          <h1 style={{ margin: "16px 0 0", fontSize: 30, lineHeight: 1.1, fontWeight: 500, letterSpacing: "-0.03em" }}>
            Something went wrong loading OGMJ.
          </h1>

          <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.7, color: "#a3adaa" }}>
            Nothing in your business was affected. Reloading usually clears it.
          </p>

          <button
            onClick={reset}
            style={{
              marginTop: 28,
              height: 50,
              padding: "0 24px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: "#03150f",
              background: "linear-gradient(180deg,#34d399,#10b981 55%,#0ea472)",
            }}
          >
            Reload OGMJ
          </button>

          {error.digest && (
            <p
              style={{
                marginTop: 26,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#7c8683",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              Reference · {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
