import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

/**
 * TYPE
 *
 * Inter Tight — the UI voice. Tighter apertures and negative default
 *   tracking at display sizes; it holds a 40px headline without the
 *   airy, generic feel of stock Inter.
 * Instrument Serif — reserved for brand storytelling moments only.
 *   High contrast, editorial, slightly literary. It appears perhaps
 *   six times in the entire product, which is what gives it weight.
 * JetBrains Mono — labels, eyebrows and figures. Wide-tracked uppercase
 *   mono is the single strongest signal that a surface is an instrument
 *   rather than a brochure.
 */
const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--f-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--f-serif",
  display: "swap",
  weight: ["400"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OGMJ Brands — The AI business operating system",
  description:
    "Create, build, launch, market, sell and grow. Your entire business, connected, in one place.",
  applicationName: "OGMJ Brands",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "OGMJ" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  /* Zoom is never disabled. Accessibility is not negotiable, and a
     locked viewport is the most common accessibility failure in
     "premium" mobile products. */
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="
            sr-only-ogmj focus:not-sr-only
            focus:fixed focus:top-3 focus:left-3 focus:z-[200]
            focus:h-11 focus:w-auto focus:px-4 focus:m-0 focus:clip-auto
            focus:grid focus:place-items-center focus:rounded-[10px]
            focus:bg-[#10b981] focus:text-[#03150f] focus:font-semibold focus:text-[13px]
          "
          style={{ clipPath: "none" }}
        >
          Skip to content
        </a>
        <div id="ogmj-root">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
