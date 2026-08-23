/**
 * OGMJ ICONOGRAPHY
 *
 * Drawn on a 24×24 grid, 1.5 stroke, round caps, geometric construction.
 * Not sourced from an icon library — a borrowed icon set is the fastest
 * way to make a product look like everyone else's product.
 *
 * Rules: no icon carries detail below 1.5px at 20px render. Optical
 * weight is matched by eye, not by grid.
 */

export type IconName =
  | "home"
  | "build"
  | "spark"
  | "grow"
  | "revenue"
  | "brand"
  | "website"
  | "studio"
  | "social"
  | "marketing"
  | "crm"
  | "content"
  | "analytics"
  | "services"
  | "arrow"
  | "arrowUp"
  | "chevron"
  | "plus"
  | "check"
  | "close"
  | "alert"
  | "send"
  | "user"
  | "grip";

const P: Record<IconName, React.ReactNode> = {
  /* Journey / navigation ------------------------------------------------ */
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 12.2V19a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-6.8" />
    </>
  ),
  build: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
    </>
  ),
  /* The OGMJ mark: four rays converging — energy meeting at a centre. */
  spark: (
    <>
      <path d="M12 3v5.2M12 15.8V21M3 12h5.2M15.8 12H21" />
      <path d="M12 9.4A2.6 2.6 0 1 1 12 14.6a2.6 2.6 0 0 1 0-5.2Z" />
    </>
  ),
  grow: (
    <>
      <path d="M4 18.5c3.4 0 5.1-2.6 6.6-6.1C12.3 8.4 14.1 5.5 20 5.5" />
      <path d="M15.6 5.5H20v4.4" />
      <path d="M4 12.5h2.2" />
    </>
  ),
  revenue: (
    <>
      <path d="M12 3.5v17" />
      <path d="M16.2 7.4c-.7-1.4-2.2-2.2-4.2-2.2-2.4 0-3.9 1.2-3.9 3s1.4 2.6 4 3.2c2.7.6 4.2 1.5 4.2 3.4 0 1.9-1.7 3.2-4.3 3.2-2.2 0-3.8-.9-4.5-2.4" />
    </>
  ),

  /* Modules ------------------------------------------------------------- */
  brand: (
    <>
      <path d="M12 3.5 14.5 9l6 .6-4.5 4 1.3 5.9-5.3-3.1-5.3 3.1L8 13.6l-4.5-4L9.5 9 12 3.5Z" />
    </>
  ),
  website: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9h17" />
      <path d="M6.6 6.75h.01M9.1 6.75h.01" />
    </>
  ),
  studio: (
    <>
      <path d="M4.5 19.5V6a1.5 1.5 0 0 1 1.5-1.5h5.6L19.5 12v7.5a0 0 0 0 1 0 0Z" />
      <path d="M11.6 4.5V11a1 1 0 0 0 1 1h6.9" />
      <path d="M8.2 15.6h6" />
    </>
  ),
  social: (
    <>
      <circle cx="7" cy="12" r="2.6" />
      <circle cx="17" cy="6.6" r="2.6" />
      <circle cx="17" cy="17.4" r="2.6" />
      <path d="m9.3 10.8 5.4-2.9M9.3 13.2l5.4 2.9" />
    </>
  ),
  marketing: (
    <>
      <path d="M4 9.6v4.8a1 1 0 0 0 1 1h3l6 4.1V4.5l-6 4.1H5a1 1 0 0 0-1 1Z" />
      <path d="M17.6 9.2a4 4 0 0 1 0 5.6" />
    </>
  ),
  crm: (
    <>
      <circle cx="9.2" cy="8.4" r="3.1" />
      <path d="M3.6 19.4c.5-3.1 2.8-5 5.6-5s5.1 1.9 5.6 5" />
      <path d="M16.4 6.2a3 3 0 0 1 0 5.9M18 14.9c1.5.8 2.4 2.4 2.6 4.5" />
    </>
  ),
  content: (
    <>
      <path d="M5.5 4.5h9L19 9v10.5H5.5z" />
      <path d="M14.2 4.5V9H19" />
      <path d="M8.4 12.6h7M8.4 16h4.6" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8.2 16.6v-4.2M12.4 16.6V7.8M16.6 16.6v-6.4" />
    </>
  ),
  services: (
    <>
      <path d="M12 3.4 4.6 6.9v5.2c0 4.1 3 7.3 7.4 8.5 4.4-1.2 7.4-4.4 7.4-8.5V6.9L12 3.4Z" />
      <path d="m9.3 11.9 1.9 2 3.5-3.8" />
    </>
  ),

  /* Controls ------------------------------------------------------------ */
  arrow: (
    <>
      <path d="M4.5 12h14" />
      <path d="m13.2 6.8 5.3 5.2-5.3 5.2" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V5.6" />
      <path d="m6.6 10.8 5.4-5.2 5.4 5.2" />
    </>
  ),
  chevron: <path d="m9 5.8 6 6.2-6 6.2" />,
  plus: <path d="M12 5.4v13.2M5.4 12h13.2" />,
  check: <path d="m5.2 12.6 4.4 4.4L18.8 7.4" />,
  close: <path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8" />,
  alert: (
    <>
      <path d="M12 4.4 2.9 19.6h18.2L12 4.4Z" />
      <path d="M12 10.2v3.6M12 16.6h.01" />
    </>
  ),
  send: (
    <>
      <path d="M20 12 4.4 5.2l2.4 6.8-2.4 6.8L20 12Z" />
      <path d="M6.8 12H20" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5.2 20c.6-3.6 3.3-5.8 6.8-5.8s6.2 2.2 6.8 5.8" />
    </>
  ),
  grip: (
    <>
      <path d="M5 9.2h14M5 14.8h14" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      {P[name]}
    </svg>
  );
}

/**
 * The OGMJ wordmark lockup. Four converging rays inside a rotated square —
 * the mark reads as a compass, an aperture, and a convergence point.
 */
export function OgmjMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ogmj-mark-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="0.55" stopColor="#10B981" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path
        d="M16 1.8 30.2 16 16 30.2 1.8 16 16 1.8Z"
        stroke="url(#ogmj-mark-g)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 7.4v5.1M16 19.5v5.1M7.4 16h5.1M19.5 16h5.1" stroke="url(#ogmj-mark-g)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.5" fill="url(#ogmj-mark-g)" />
    </svg>
  );
}
