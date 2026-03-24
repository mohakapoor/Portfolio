# Story Page — Design Decisions
`mohakapoor.in/story` · Redesign Notes

---

## The North Star

**Purpose-first brutalism.** Every design decision had to earn its place. The constraint we kept coming back to: don't add visual complexity unless it makes the content clearer or the page more memorable. Cards are a crutch — they're used when the designer doesn't trust the content to stand on its own. This redesign strips that crutch away wherever the content doesn't need containment.

The reference: your landing page. Big type. Diagonal red scratches as texture. Almost no cards. Full-bleed sections. Stats as raw numbers. That restraint is what gives it authority.

---

## Typography

**Bebas Neue** for all display headings (section titles, hero). It's condensed, aggressive, and editorial — fits the newspaper-noir aesthetic you've built. It's the kind of face that shows up on the front page of a tabloid or a film title card.

**IBM Plex Mono** for everything else — body copy, labels, tags, eyebrows, nav. Monospace enforces a terminal/engineer feel without being try-hard. It also pairs well with Bebas because they're polar opposites in rhythm — condensed display vs. fixed-width body.

The two fonts together say: *editorial intelligence.* Not "look how designed this is." Just authority.

---

## Color Usage

Strictly following your palette rules:

- **Spider Red `#cc2936`** — used only as an accent. Section numbers, eyebrows, dot glows, card border tints, the hero rule. Never as a fill on large areas.
- **Vintage White `#f0ede6`** — primary text. Warm not stark.
- **Muted white** at varying opacities — body copy, secondary labels. Depth through opacity, not new colors.
- **Dev & Infra cluster** uses `#e8e0d0` — near-white, distinct from red but stays in the warm family.
- **MCP & AI Ops cluster** uses `#8c7a6b` — warm gray/tan, recessive. Appropriate since it's the smallest cluster.

**No new accent colors added** to the story page. The constellation uses warm neutrals instead of blue/purple so it doesn't break your palette rules (red is the only accent on story/projects pages).

---

## Section-by-Section Decisions

### Hero
Two-column: big Bebas headline left, focus areas list right divided by a thin red vertical rule.

The diagonal scratch texture (repeating-linear-gradient at -52deg) is inherited from your landing page. It adds depth without adding weight.

"MY STORY" with "STORY" in red — the only place red touches a headline, used once, deliberately.

No stats in the hero. You said you haven't shipped enough to warrant putting numbers up front. The landing page can carry stats; the story page earns credibility through prose and work, not numbers.

### Who Am I (Section 001)
**No card.** Pure prose with a 2px left red border as the only structural element.

The index column (MOHAK / KAPOOR / —— / DELHI / IN) in the far left acts like a newspaper column label — it tells you who's speaking without being a heading. This is editorial layout: the label is part of the typography, not UI chrome.

The text itself uses `strong` for key terms so they pop without needing color. Body stays at 45% opacity — muted, not invisible.

Why one section for Story + Who Am I: you wanted them unified. They're the same thought — this is who I am, this is what I do. Splitting them into two labeled sections breaks the flow. One block, one label, one continuous thought.

### Experience (Section 002)
**Horizontal timeline.**

The key insight: your experience isn't deep — it's four entries. A vertical timeline wastes space and makes four items look sparse. Horizontal makes it feel like a throughline, a career arc you're moving along.

Each entry has:
- Org name in red monospace (eyebrow)
- Year/type below it (dimmer, smaller)
- Role in white (the actual content)
- Body copy in muted white
- Tags at the bottom

The active entry (HumanizeIQ, most recent) has its dot filled red. The rest are hollow. This communicates "current" without needing a label.

**Experience goes above Projects** because it's context for the projects. A recruiter reading top-to-bottom understands who hired you and why before they see what you built.

### Featured Projects (Section 003)
**2×2 grid, Card 2 treatment.**

These needed to stay as cards because they genuinely require containment — each has a category, title, description, divider, and tags. That's a bounded object. Cards are the right tool here.

The Card 2 DNA:
- Red-tinted background at 3% opacity (barely there)
- Red-tinted border at 12% opacity
- Corner glow blob (the signature element from your card_explorations.html)
- On hover: border lifts to 30%, background to 7%, arrow translates

The tint is intentionally minimal — the feedback you gave earlier was "you went too heavy on the tint." So the resting state is almost invisible. The hover reveals it.

### Skills (Section 004)
**Brutalist constellation.**

The original brief: show off creativity, but still brutalist. The constellation idea was right but the first implementation was too soft — sci-fi, glowing, floating.

This version is grounded by:

1. **Grid paper background** — faint graph lines on the canvas. This is the most important change. It gives the constellation a surface to sit on. It stops it looking like outer space and starts it looking like an engineer's notebook or a circuit diagram.

2. **Square nodes instead of circles** — circles are organic and soft. Squares are hard, mechanical, deliberate. One shape change shifts the whole register.

3. **Crosshair center markers** — the cluster centers are marked with crosshairs, not glowing orbs. Crosshairs = targeting, precision, engineering.

4. **Uppercase monospace labels** — labels are only shown on high-weight nodes (w=3) by default, and all labels on hover. They're uppercase IBM Plex Mono. Terminal aesthetic.

5. **Hard straight lines** — no curves. Intra-cluster lines are straight. Cross-cluster lines are straight with a 2/6 dash pattern. Nothing bends.

6. **Dimming on hover** — hovering a node dims the other clusters, highlighting the relationships that matter. The hovered node's label turns red/cluster-colored.

7. **Cursor: crosshair** — not pointer. On a creative brutalist canvas, crosshair is more appropriate than a hand cursor.

**Cluster color choices:**
- ML → Red (your primary accent, your main discipline)
- Dev & Infra → Warm white (neutral, structural)
- MCP & AI Ops → Warm gray/tan (recessive, supporting)

This keeps the page from introducing new colors while still making clusters distinguishable.

### GitHub (Section 005)
**Avatar small left, heatmap large right.**

Avatar at 120×120px only — just enough to humanize the section without dominating it. The heatmap is the content; the avatar is context.

Heatmap uses your red color scale (established in your palette doc): 5 levels from near-black through dark crimson to full spider-red.

Margins on both sides (`padding: 44px 40px`) — consistent with every other section. No full-bleed here because the heatmap isn't a divider element, it's a data display.

---

## What We Deliberately Left Out

**Stats in the hero** — you're not there yet. When you've shipped more, this is where they go.

**Contact section** — inheriting from landing page as discussed.

**Expanding cards** — the click-to-expand mechanic from the original story page felt like a workaround for cards that had too much content. If a project description needs expansion to be understood, the description is too long. The new cards are tighter and stand on their own.

**Gradient backgrounds on sections** — your palette rules say no colored backgrounds. Red glow dividers (the horizontal rules) are the only ambient color on the page.

---

## Full-Width Philosophy

The original page used `max-w-5xl` as a constraint on everything. It made every section feel like it was apologizing for taking up space.

This redesign uses `padding: 44px 40px` on each section — full container width with consistent gutters. The content fills the column. The diagonal textures in the hero go edge-to-edge. The red rules bleed full width. The timeline scrolls horizontally within its section.

Full width doesn't mean no constraints. It means the constraints are gutters and grid, not a max-width box wrapped around everything.

---

## Things to Tune Next

1. The constellation cluster positions — they're hardcoded at `cx/cy` ratios. These can be adjusted if the canvas feels off on mobile.
2. The timeline on mobile collapses to vertical — you'll want a media query for that.
3. The hero "STORY" word in red — if you decide you want the whole headline white (more restrained), easy change.
4. Heatmap data — currently randomized. Swap in your real GitHub contributions API once the design is locked.
