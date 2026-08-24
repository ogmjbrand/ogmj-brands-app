"use client";

/**
 * MARQUEE RAIL
 *
 * Extracted from the luxury-hospitality reference: a bordered rail whose
 * contents drift continuously sideways, used there for the amenities strip.
 * The technique is good — it communicates *breadth* without demanding a
 * scroll, and slow lateral drift reads as confidence rather than urgency.
 *
 * Two rules govern where it is allowed in OGMJ, both learned from how badly
 * marquees usually go wrong:
 *
 *   1. NEVER interactive. A moving tap target is a usability failure — the
 *      user aims and the thing has left. Everything in a rail is display.
 *   2. NEVER load-bearing. If the user must read a specific item, it does
 *      not belong here. Rails say "there are many of these", not "here is
 *      the one you need".
 *
 * Implementation notes:
 *   - The track is duplicated and translated by exactly -50%, so the loop is
 *     seamless with no jump at the boundary.
 *   - Animation is a CSS keyframe on `transform`, which the compositor runs
 *     off the main thread — a JS-driven marquee is the classic cause of
 *     scroll jank on a phone.
 *   - The duplicate copy is aria-hidden: the content exists once for a
 *     screen reader, not twice.
 *   - It pauses on hover and on focus-within, and holds still entirely for
 *     reduced-motion users, where a permanently moving element is not a
 *     stylistic preference but an accessibility problem.
 */
const FEATHER =
  "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)";

export function Marquee({
  items,
  /** Seconds for one full cycle. Slower reads as luxury; faster as a ticker. */
  seconds = 42,
  direction = "left",
  className = "",
  label,
}: {
  items: React.ReactNode[];
  seconds?: number;
  direction?: "left" | "right";
  className?: string;
  /** Describes the rail for assistive tech, e.g. "Channels connected". */
  label: string;
}) {
  const track = (
    <ul className="flex shrink-0 items-center gap-2.5 pr-2.5" role="list">
      {items.map((item, i) => (
        <li key={i} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`group/marquee relative overflow-hidden ${className}`}
      role="group"
      aria-label={label}
      /**
       * Edges are feathered with a real CSS mask, not an overlaid gradient.
       * An overlay has to be painted in the page's background colour, and
       * this page has an ambient emerald bloom behind it — so a flat #050505
       * strip would never quite match, and the seam would show. A mask makes
       * the content itself go transparent, which is correct over any ground.
       *
       * The stops hold full opacity across the middle and fade only the
       * outer ~7%, so an item is genuinely gone before it reaches the edge
       * rather than being sliced mid-word.
       */
      style={{
        WebkitMaskImage: FEATHER,
        maskImage: FEATHER,
      }}
    >
      <div
        className="flex w-max ogmj-marquee motion-reduce:!animate-none group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]"
        style={{
          animationDuration: `${seconds}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {track}
        <div aria-hidden="true" className="flex">
          {track}
        </div>
      </div>
    </div>
  );
}

/** The standard rail item: a hairline pill. Display only — never a button. */
export function RailItem({
  children,
  accent = "em",
}: {
  children: React.ReactNode;
  accent?: "em" | "gold" | "quiet";
}) {
  const tone =
    accent === "gold"
      ? "border-[rgba(212,175,55,0.26)] bg-[rgba(212,175,55,0.055)] text-[#f2e3ae]"
      : accent === "em"
        ? "border-[rgba(16,185,129,0.22)] bg-[rgba(16,185,129,0.05)] text-[#a3adaa]"
        : "border-[var(--color-rule)] bg-[rgba(255,255,255,0.03)] text-[#a3adaa]";

  return (
    <span
      className={`flex h-10 items-center gap-2.5 whitespace-nowrap rounded-full border px-4 text-[12.5px] ${tone}`}
    >
      {children}
    </span>
  );
}
