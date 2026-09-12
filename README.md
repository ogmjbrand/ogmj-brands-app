# OGMJ Brands

**The AI business operating system for ambitious brands.**
Create → Build → Launch → Market → Sell → Grow.

A mobile-first product where a brand, a website, its content, its campaigns,
its customers and its revenue are one connected system rather than nine tools
behind one login.

```bash
npm install
npm run dev      # http://localhost:3000
```

Next.js 15 · React 19 · TypeScript · Tailwind v4 · Motion.
No component library — every element in this product is drawn here.

---

## The rules this was built under

### 1. Mobile is the product, desktop is the expansion

Every screen was designed at 390px and validated up through 430 → 768 → 1024
→ 1440 → ultrawide. Nothing here is a desktop layout stacked vertically.

Where a desktop pattern did not survive a phone, it was **replaced**, not
shrunk:

| Desktop pattern | What OGMJ does on a phone | Why |
| --- | --- | --- |
| Sidebar nav | Bottom bar, 5 thumb-sized targets | The top of a phone is the hardest place to reach |
| Centred modal | Bottom sheet, drag-to-dismiss | A centred dialog lands in the dead zone above the thumb |
| 4-column kanban | One stage per screen, swipe between, next one peeking | 4 columns at 390px is 90px each — fits neither a name nor a number |
| Month calendar grid | Week strip of 7 large day targets | 31 cells at 390px carry no information |
| 4-up metric grid | One headline metric + a snap row | Equal tiles say nothing about what matters |
| Uniform asset grid | Masonry at true aspect ratios | A forced square lies about what the asset is |

Composer inputs are anchored to the bottom of the viewport, above the
keyboard. Text inputs are 16px so iOS Safari never zoom-jumps the layout.
Touch targets are ≥44px — where a control needs to *look* smaller, the
visual disc and the hit area are sized separately.

### 2. Motion is a system, not a garnish

`src/lib/motion.ts` defines six reasons a thing may move. Anything that
cannot be assigned one of them does not ship:

| Question the user is asking | System |
| --- | --- |
| Where am I? | `scene` — route transitions move through depth, not sideways |
| What is this? | `reveal` — content rises into the hierarchy (never a bare fade) |
| Did it work? | `springTap` — immediate, under the finger |
| What's happening? | `materialize` / `phase` — AI resolving out of the dark |
| How are these related? | **OGMJ Energy** — light travelling between connected things |
| What changed? | counters counting, lines drawing, bars growing |
| (nothing — ambient) | `Marquee` / `Parallax`, under the strict rules below |

#### Ambient motion, and why it is fenced off

Two techniques were adapted from a luxury-hospitality reference: a rail whose
contents **drift sideways** continuously, and a gallery whose elements
**travel at different rates** as the section crosses the viewport. Both are
genuinely good — drift states breadth without demanding a scroll, and
differential travel gives a composition depth.

Both are also the two easiest ways to make a product feel cheap, so they are
the only motion in OGMJ with hard rules attached:

- A marquee may contain **nothing interactive**. A moving tap target is a
  usability failure — the user aims and the thing has left.
- A marquee may contain **nothing anyone needs to read**. It states *"there
  are many of these"*, never *"here is the one you want"*. It carries
  connected channels and in-house disciplines; it will never carry a metric.
- It **pauses on hover and on focus**, and its duplicated track is
  `aria-hidden` so a screen reader hears the content once, not twice.
- Parallax travel is capped at **8px** and spring-damped. Large amplitude
  makes text hard to track mid-scroll and makes some people ill; binding
  transform to raw scroll position stutters on a phone.
- Both **stop completely** under reduced motion. Neither ever carries
  information, which is exactly what makes stopping them free.

What was deliberately *not* taken from the reference: its cream-and-gold
hospitality palette, its layout, and its content. Motion technique
transfers between products; a visual identity does not.

### 3. OGMJ Energy — the signature

One recurring metaphor: a hairline of emerald light, warming to gold, that
travels along a path. It means *momentum moving through the business*.

It appears in exactly four situations and nowhere else — connecting stages of
the journey, marking a live surface, showing the system thinking, and marking
a significant completion. Used everywhere it would become wallpaper; the
restraint is what makes it read.

Its clearest expression is the dashboard's journey map: a single line runs
Brand → Website → Content → Campaigns → Customers → Revenue, and the light
**descends as you scroll**. The connection is demonstrated, not captioned.

### 4. Gold is jewellery

Emerald is intelligence, growth and action. Gold marks status, premium and
completion — never a field, never a routine button. If two gold elements are
visible at once, one of them is wrong. Services is the single screen where
gold leads, and it works *because* gold is rationed everywhere else.

### 5. AI is staged, never spun

An eleven-second wait behind a spinner gets abandoned. So the wait is the
show: six named phases, each a sentence a human strategist would say out
loud, then six finished pieces of the business resolving from blur into
focus. The target is not "it loaded" — it is *"I just watched my business
come to life."*

### 6. Analytics that do the analysis

No chart ships without the sentence that says what it means. Every insight
answers three questions in order — what happened, why (one tap away), and
what to do — and the action is a real destination, not an acknowledgement.

### 7. Empty states are the highest-intent moment in a product

"No projects yet" is a dead end dressed as information. Every empty state
here is composed like real content — eyebrow, editorial line, reason,
action — and the pitch is specific to the surface. Thursday's empty calendar
day names the ₦340,000/month it is worth, because the dashboard measured it.

### 8. First run is part of the product

Opening OGMJ for the first time sends you to onboarding, not into someone
else's finished dashboard. The check fails **open**: if `localStorage` throws
— private browsing, blocked site data, an embedded webview — you are treated
as already onboarded and let into your business. Guessing wrong that way
costs one skipped intro; guessing wrong the other way locks someone outside
their own product with no way back. The account sheet (the avatar, top right)
replays onboarding at any time.

### 9. Luxury does not mean inaccessible

Verified, not asserted:

- **Contrast** — all four text steps clear WCAG AA 4.5:1 against the
  *lightest* surface in the system, not merely against black. Measured worst
  case 15.7 / 7.4 / 5.5 / 4.5. Hierarchy below the third step is carried by
  size, weight and casing — dimming text further is how "premium" dark UIs
  quietly become unusable.
- **Direction is never colour alone** — deltas carry an arrow and a label.
- **Keyboard** — skip link, visible focus ring on every interactive element,
  sheets trap focus and return it to the trigger on close.
- **Reduced motion** — motion reduces to state change, never to nothing.
  Preference is applied via CSS, never by rendering a different DOM on the
  server than on the client.
- **Zoom is never disabled.**

### 10. Nothing looks like a component library

The icon set, the mark, the charts, the sheet, the segmented control, the
buttons and the empty states are all drawn in this repo. Surfaces are
structured by hairline registers — editorial rules — rather than a field of
floating rounded cards.

---

## Structure

```
src/
  app/
    page.tsx           Dashboard — the command centre
    create/            AI Command Centre — the defining experience
    onboarding/        Arrival → discovery → intent → personalisation
    build/ grow/ revenue/     Stage hubs
    brand/ website/ studio/   Create + Build modules
    content/ social/ marketing/   Launch + Market modules
    crm/ analytics/ services/     Sell + Grow modules
    globals.css        The design system: tokens, energy, surfaces, a11y
  components/
    ui/        Icon · Button · Energy · Data · Sheet · EmptyState
               Marquee · Parallax  (ambient — see the rules above)
    shell/     AppShell · Nav · TopBar · PageHead · FirstRunGate
    modules/   Pulse · Insights · Journey · Hub
  lib/
    motion.ts   The OGMJ motion system
    firstRun.ts First-run detection (fails open by design)
    data.ts     One connected business, flowing across every module
```

The demo business (Aurelia, a luxury skincare house) is deliberately
consistent end to end: the campaign named on the dashboard is the campaign in
Marketing, the lead it produced is in the CRM with that campaign in its
attribution trail, and the gap the dashboard flags is genuinely empty in the
calendar.

---

## Review standard

No screen was considered finished until every answer was yes:
does it look expensive · is it immediately understandable · does it feel
exceptional at 390px · does the movement communicate something · is it
unmistakably OGMJ · does the intelligence feel alive · does it feel fast ·
can everyone use it · does the user *want* to use it.
