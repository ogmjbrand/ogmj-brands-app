/**
 * OGMJ demo state.
 *
 * Everything the product shows is real, connected data — one business,
 * flowing across every module. Brand feeds Website feeds Content feeds
 * Marketing feeds CRM feeds Revenue. The user should never sense that
 * these are separate applications.
 */

export type ModuleKey =
  | "brand"
  | "website"
  | "studio"
  | "social"
  | "marketing"
  | "crm"
  | "content"
  | "analytics"
  | "services";

export type Stage = "create" | "build" | "launch" | "market" | "sell" | "grow";

export const JOURNEY: { stage: Stage; label: string; modules: ModuleKey[] }[] = [
  { stage: "create", label: "Create", modules: ["brand"] },
  { stage: "build", label: "Build", modules: ["website", "studio"] },
  { stage: "launch", label: "Launch", modules: ["content"] },
  { stage: "market", label: "Market", modules: ["social", "marketing"] },
  { stage: "sell", label: "Sell", modules: ["crm"] },
  { stage: "grow", label: "Grow", modules: ["analytics", "services"] },
];

export interface ModuleDef {
  key: ModuleKey;
  name: string;
  href: string;
  stage: Stage;
  /** One line. What it does for the business — not what it contains. */
  promise: string;
  /** Live status the dashboard surfaces. */
  status: string;
  health: number;
  accent: "em" | "gold";
}

export const MODULES: Record<ModuleKey, ModuleDef> = {
  brand: {
    key: "brand",
    name: "Brand",
    href: "/brand",
    stage: "create",
    promise: "Positioning, voice, identity — the source of everything downstream.",
    status: "Identity complete",
    health: 94,
    accent: "gold",
  },
  website: {
    key: "website",
    name: "Website",
    href: "/website",
    stage: "build",
    promise: "A site generated from your brand, live on your domain.",
    status: "Live · aurelia.co",
    health: 88,
    accent: "em",
  },
  studio: {
    key: "studio",
    name: "Design Studio",
    href: "/studio",
    stage: "build",
    promise: "Logos, graphics and assets that stay on-brand automatically.",
    status: "42 assets",
    health: 81,
    accent: "em",
  },
  content: {
    key: "content",
    name: "Content",
    href: "/content",
    stage: "launch",
    promise: "Posts, scripts, ads and copy in your brand voice.",
    status: "18 drafts ready",
    health: 76,
    accent: "em",
  },
  social: {
    key: "social",
    name: "Social",
    href: "/social",
    stage: "market",
    promise: "Calendar, captions and scheduling across every channel.",
    status: "9 scheduled",
    health: 72,
    accent: "em",
  },
  marketing: {
    key: "marketing",
    name: "Marketing",
    href: "/marketing",
    stage: "market",
    promise: "Campaigns, funnels, email and automations that compound.",
    status: "2 campaigns live",
    health: 84,
    accent: "em",
  },
  crm: {
    key: "crm",
    name: "CRM",
    href: "/crm",
    stage: "sell",
    promise: "Every lead, deal and customer in one pipeline.",
    status: "1,284 leads",
    health: 69,
    accent: "em",
  },
  analytics: {
    key: "analytics",
    name: "Analytics",
    href: "/analytics",
    stage: "grow",
    promise: "What happened, why it happened, what to do next.",
    status: "+32.8% MoM",
    health: 91,
    accent: "em",
  },
  services: {
    key: "services",
    name: "Services",
    href: "/services",
    stage: "grow",
    promise: "Bring in the OGMJ team when you want it done for you.",
    status: "1 active",
    health: 100,
    accent: "gold",
  },
};

export const MODULE_LIST = Object.values(MODULES);

/* ---------------------------------------------------------------- */

export const BRAND = {
  name: "Aurelia",
  category: "Luxury Skincare",
  tagline: "Skin, restored to its own intelligence.",
  positioning:
    "A clinical-luxury skincare house for women 28–45 who have outgrown drugstore routines but distrust the theatre of prestige beauty. Aurelia sells evidence, not promises.",
  voice: ["Precise", "Unhurried", "Warm", "Unembellished"],
  palette: [
    { name: "Obsidian", hex: "#0D0F0E" },
    { name: "Bone", hex: "#EFE9DE" },
    { name: "Verdigris", hex: "#10B981" },
    { name: "Aureate", hex: "#D4AF37" },
  ],
  founded: "2025",
  health: 87,
};

export interface Metric {
  key: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
  /** 12 points, oldest → newest. Drives the drawn sparkline. */
  series: number[];
  accent: "em" | "gold";
}

export const METRICS: Metric[] = [
  {
    key: "revenue",
    label: "Revenue",
    value: 4820000,
    prefix: "₦",
    delta: 32.8,
    series: [18, 22, 19, 28, 34, 31, 45, 52, 48, 63, 71, 88],
    accent: "gold",
  },
  {
    key: "leads",
    label: "Leads",
    value: 1284,
    delta: 18.4,
    series: [30, 34, 33, 41, 44, 40, 52, 58, 55, 66, 70, 79],
    accent: "em",
  },
  {
    key: "conversion",
    label: "Conversion",
    value: 6.4,
    suffix: "%",
    delta: 1.2,
    series: [40, 42, 38, 45, 47, 44, 50, 49, 54, 57, 55, 61],
    accent: "em",
  },
  {
    key: "health",
    label: "Brand Health",
    value: 87,
    suffix: "",
    delta: 4.0,
    series: [55, 58, 60, 59, 64, 68, 70, 72, 75, 79, 83, 87],
    accent: "gold",
  },
];

/** The dashboard's job: what happened, why, and what to do about it. */
export interface Insight {
  id: string;
  kind: "opportunity" | "risk" | "win";
  headline: string;
  because: string;
  action: string;
  href: string;
  impact: string;
}

export const INSIGHTS: Insight[] = [
  {
    id: "i1",
    kind: "opportunity",
    headline: "Your Thursday posts convert 3.1× better",
    because:
      "Six of your last eight highest-converting sessions began on a Thursday evening post. Your calendar has Thursday empty for the next three weeks.",
    action: "Fill Thursdays",
    href: "/social",
    impact: "Est. +₦340K / mo",
  },
  {
    id: "i2",
    kind: "risk",
    headline: "412 leads have gone 14 days without contact",
    because:
      "Your welcome sequence ends after email three. Leads that stall at that step convert at 0.4% versus 7.1% for leads that reach a human.",
    action: "Build follow-up",
    href: "/marketing",
    impact: "₦1.2M at risk",
  },
  {
    id: "i3",
    kind: "win",
    headline: "The Ritual campaign paid back 4.2× in 11 days",
    because:
      "Ad spend of ₦280K returned ₦1.18M. The winning creative was the founder story, not the product shot.",
    action: "Scale what worked",
    href: "/marketing",
    impact: "4.2× ROAS",
  },
];

export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "New" | "Qualified" | "Proposal" | "Won";
  source: string;
  days: number;
}

export const LEADS: Lead[] = [
  { id: "l1", name: "Adaeze Nwosu", company: "Bloom Retail", value: 1450000, stage: "Proposal", source: "Instagram", days: 2 },
  { id: "l2", name: "Tomiwa Bello", company: "Lagos Wellness", value: 890000, stage: "Qualified", source: "Website", days: 1 },
  { id: "l3", name: "Ife Okonjo", company: "Serene Spa Group", value: 2100000, stage: "Won", source: "Referral", days: 5 },
  { id: "l4", name: "Chidi Eze", company: "Nova Pharmacy", value: 640000, stage: "New", source: "The Ritual campaign", days: 0 },
  { id: "l5", name: "Zainab Yusuf", company: "Kano Beauty Co", value: 1180000, stage: "Qualified", source: "Email", days: 3 },
  { id: "l6", name: "Femi Adeyemi", company: "Highstreet", value: 375000, stage: "New", source: "Instagram", days: 0 },
];

export const PIPELINE_STAGES = ["New", "Qualified", "Proposal", "Won"] as const;

export interface Post {
  id: string;
  channel: "Instagram" | "TikTok" | "LinkedIn" | "X";
  day: string;
  time: string;
  hook: string;
  status: "scheduled" | "draft" | "published";
  reach?: number;
}

export const POSTS: Post[] = [
  { id: "p1", channel: "Instagram", day: "Mon", time: "08:00", hook: "The ingredient nobody markets because it's cheap", status: "published", reach: 24800 },
  { id: "p2", channel: "TikTok", day: "Tue", time: "19:30", hook: "I read 40 skincare labels. Here's what they hide.", status: "published", reach: 61200 },
  { id: "p3", channel: "Instagram", day: "Wed", time: "12:00", hook: "Three weeks of the ritual — unretouched", status: "scheduled" },
  { id: "p4", channel: "LinkedIn", day: "Tue", time: "09:00", hook: "Why we publish our formulation costs", status: "draft" },
  { id: "p5", channel: "TikTok", day: "Fri", time: "18:00", hook: "Founder answers the question everyone DMs", status: "scheduled" },
  { id: "p6", channel: "X", day: "Sat", time: "10:00", hook: "A thread on skin barrier science, without the jargon", status: "draft" },
];

export interface Campaign {
  id: string;
  name: string;
  status: "live" | "scheduled" | "ended";
  spend: number;
  returned: number;
  channel: string;
  progress: number;
}

export const CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "The Ritual", status: "live", spend: 280000, returned: 1180000, channel: "Meta + TikTok", progress: 68 },
  { id: "c2", name: "Founder Story", status: "live", spend: 145000, returned: 402000, channel: "Instagram", progress: 41 },
  { id: "c3", name: "Restock: Serum 02", status: "scheduled", spend: 0, returned: 0, channel: "Email + SMS", progress: 0 },
  { id: "c4", name: "Harmattan Edit", status: "ended", spend: 520000, returned: 1740000, channel: "Meta", progress: 100 },
];

/**
 * `motif` is the composition the tile renders. Every asset in a real studio
 * looks different from its neighbour; four tiles carrying the same artwork
 * reads as placeholder content no matter how well it is set.
 */
export type Motif = "mark" | "statement" | "numeral" | "split" | "card" | "lattice";

export interface Asset {
  id: string;
  name: string;
  kind: "Logo" | "Social" | "Card" | "Flyer" | "Pattern";
  ratio: string;
  tone: "dark" | "bone" | "gold";
  motif: Motif;
  /** Copy set into the composition. */
  line?: string;
  sub?: string;
}

export const ASSETS: Asset[] = [
  { id: "a1", name: "Primary mark", kind: "Logo", ratio: "1 / 1", tone: "gold", motif: "mark" },
  { id: "a2", name: "Serum 02 launch", kind: "Social", ratio: "4 / 5", tone: "dark", motif: "numeral", line: "02", sub: "Barrier Serum · 10% niacinamide" },
  { id: "a3", name: "Founder card", kind: "Card", ratio: "16 / 10", tone: "bone", motif: "card", line: "Amara Okafor", sub: "Founder · Formulation" },
  { id: "a4", name: "Ritual grid", kind: "Social", ratio: "1 / 1", tone: "dark", motif: "statement", line: "Skin, restored to its own intelligence." },
  { id: "a5", name: "Stockist flyer", kind: "Flyer", ratio: "3 / 4", tone: "bone", motif: "split", line: "Now stocking Aurelia", sub: "Lagos · Abuja · Port Harcourt" },
  { id: "a6", name: "Verdigris pattern", kind: "Pattern", ratio: "1 / 1", tone: "dark", motif: "lattice" },
];

export interface ContentPiece {
  id: string;
  type: "Reel script" | "Blog" | "Ad copy" | "Email" | "Product";
  title: string;
  words: number;
  ready: boolean;
}

export const CONTENT: ContentPiece[] = [
  { id: "ct1", type: "Reel script", title: "The 40-label experiment", words: 210, ready: true },
  { id: "ct2", type: "Blog", title: "What 'clinical' actually means on a label", words: 1420, ready: true },
  { id: "ct3", type: "Ad copy", title: "The Ritual — cold audience, v3", words: 96, ready: true },
  { id: "ct4", type: "Email", title: "Welcome 04: the part nobody sends", words: 340, ready: false },
  { id: "ct5", type: "Product", title: "Serum 02 — full description", words: 280, ready: true },
];

export const SERVICES = [
  { id: "s1", name: "Brand Identity", price: "from ₦850K", turnaround: "3 weeks", active: false },
  { id: "s2", name: "Website Development", price: "from ₦1.2M", turnaround: "4 weeks", active: true },
  { id: "s3", name: "Social Management", price: "₦420K / mo", turnaround: "Ongoing", active: false },
  { id: "s4", name: "Business Registration", price: "₦180K", turnaround: "10 days", active: false },
  { id: "s5", name: "Growth Consulting", price: "₦650K / mo", turnaround: "Ongoing", active: false },
];

/* ---------------------------------------------------------------- */
/* Onboarding taxonomy                                              */
/* ---------------------------------------------------------------- */

export const BUSINESS_TYPES = [
  { id: "personal", label: "Personal Brand", note: "You are the product" },
  { id: "startup", label: "Startup", note: "Building something new" },
  { id: "fashion", label: "Fashion", note: "Apparel, accessories, style" },
  { id: "beauty", label: "Beauty", note: "Skincare, cosmetics, wellness" },
  { id: "tech", label: "Technology", note: "Software, hardware, platforms" },
  { id: "ecom", label: "E-commerce", note: "Selling products online" },
  { id: "agency", label: "Agency", note: "Services for other businesses" },
  { id: "creator", label: "Creator Business", note: "Audience-first" },
  { id: "other", label: "Something else", note: "Tell us in your words" },
];

export const AMBITIONS = [
  { id: "launch", label: "Launch it properly", note: "Brand, site and campaign together" },
  { id: "revenue", label: "Grow revenue", note: "More customers, higher value" },
  { id: "audience", label: "Build an audience", note: "Content that compounds" },
  { id: "systemise", label: "Systemise the chaos", note: "One place for everything" },
  { id: "raise", label: "Look fundable", note: "Investor-grade presence" },
];

/* ---------------------------------------------------------------- */
/* The AI generation script — the cinematic sequence.                */
/* ---------------------------------------------------------------- */

export interface GenPhase {
  id: string;
  label: string;
  detail: string;
  /** ms this phase holds before advancing */
  hold: number;
}

export const GEN_PHASES: GenPhase[] = [
  { id: "understand", label: "Understanding your business", detail: "Parsing intent, category and ambition", hold: 1500 },
  { id: "position", label: "Crafting positioning", detail: "Finding the space nobody else owns", hold: 1700 },
  { id: "visual", label: "Defining visual direction", detail: "Palette, type, texture, restraint", hold: 1600 },
  { id: "identity", label: "Building brand identity", detail: "Mark, voice, guidelines", hold: 1800 },
  { id: "site", label: "Creating website", detail: "Structure, copy, sections, domain", hold: 1900 },
  { id: "campaign", label: "Preparing launch campaign", detail: "Audience, creative, channels, timeline", hold: 1700 },
];

/** What materializes at the end of a generation. */
export const GEN_OUTPUTS = [
  { id: "o1", module: "brand" as ModuleKey, title: "Brand identity", detail: "Positioning · voice · palette · mark" },
  { id: "o2", module: "website" as ModuleKey, title: "Launch site", detail: "6 sections · copy written · ready to publish" },
  { id: "o3", module: "content" as ModuleKey, title: "Launch content", detail: "12 posts · 3 scripts · 4 emails" },
  { id: "o4", module: "marketing" as ModuleKey, title: "Campaign", detail: "Audience · creative · 21-day timeline" },
  { id: "o5", module: "studio" as ModuleKey, title: "Visual assets", detail: "Logo set · social kit · business card" },
  { id: "o6", module: "analytics" as ModuleKey, title: "Measurement", detail: "Goals, funnels and attribution wired" },
];

/**
 * The rail on the dashboard. Display only — it says "your business is wired
 * into all of this", which is a breadth claim, not a list anyone needs to
 * read item by item. That is precisely the content a marquee is for.
 */
export const CONNECTED = [
  { name: "Instagram", accent: "em" as const },
  { name: "TikTok", accent: "em" as const },
  { name: "Meta Ads", accent: "em" as const },
  { name: "WhatsApp Business", accent: "em" as const },
  { name: "Paystack", accent: "gold" as const },
  { name: "Shopify", accent: "em" as const },
  { name: "Mailchimp", accent: "em" as const },
  { name: "Google Analytics", accent: "em" as const },
  { name: "Flutterwave", accent: "gold" as const },
  { name: "LinkedIn", accent: "em" as const },
];

/**
 * The capabilities rails on Services. Same rule: breadth, not navigation.
 * Two disjoint sets, because two rails carrying the same words — even
 * reversed — reads as a rendering bug rather than a deliberate pair.
 */
export const CAPABILITIES_CREATIVE = [
  "Brand strategy",
  "Naming",
  "Visual identity",
  "Packaging",
  "Motion design",
  "Photography direction",
];

export const CAPABILITIES_BUILD = [
  "Web development",
  "Paid media",
  "Email systems",
  "Business registration",
  "Trademark filing",
  "Growth consulting",
];

export const SUGGESTIONS = [
  "Build my luxury skincare brand",
  "Create a launch campaign for my fashion label",
  "Write a month of content in my brand voice",
  "Turn my best post into an ad campaign",
  "Find out why my leads stopped converting",
];

/* ---------------------------------------------------------------- */

export function formatMoney(n: number, prefix = "₦"): string {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(0)}K`;
  return `${prefix}${n}`;
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
