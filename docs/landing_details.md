# landing_details.md
## Below-hero sections — full design spec

---

### Context

The hero section (3D object left, role details right) is documented separately in `portfolio_head.md`. Everything in this document starts from the marquee strip and goes down. The hero establishes the accent color and sets the dark background tone — every section below inherits from that. Do not introduce new base colors below the fold. The accent color from the active role bleeds into the rest of the page as a single consistent thread.

---

### Color Roles — How to Think About This

There are only two color values in play across the entire page below the hero:

**Primary accent**
The active role color. Red for ML Engineer, Purple for Data Scientist, Cyan for AI Engineer. This is a high-attention color. Use it sparingly — maximum 1–2 visible uses per section. Every time primary accent appears, it should feel like a deliberate decision, not a decoration.

**Dimmed accent**
The same hue at very low opacity (15–30%). Used for borders, underlines, subtle backgrounds on a single highlighted element. Never use it on text. It exists to carry the color temperature of the active role without competing for attention.

**Everything else is opacity-based white**
All body text, labels, tags, borders — these are `rgba(255,255,255, x)` at varying opacity levels. Never introduce a second hue. The restraint is what makes the primary accent land hard when it appears.

**Opacity hierarchy for white text (do not deviate):**
```
0.85–0.92   primary content    headings, project titles
0.38–0.45   secondary content  taglines, descriptions, body
0.20–0.25   tertiary content   eyebrows, labels, counters
0.08–0.12   structural         borders, dividers, chip outlines
```

---

### Section 1 — Marquee Strip

**Purpose:** Signals technical breadth instantly. Scannable in 2 seconds. No reading required.

**Structure:**
- Two rows of horizontally scrolling text
- Row 1 scrolls left, Row 2 scrolls right (opposite directions)
- Row 1: primary stack — things you use daily
- Row 2: secondary stack — tools, platforms, libraries

**Layout:**
- Full width, no horizontal padding
- Top and bottom border: `1px solid rgba(255,255,255,0.04)` — hairline only, not a divider
- Vertical padding: `1.4rem 0` — tight, this is a transitional element not a hero
- No section label, no heading

**Typography:**
- Font size: 11px
- Font weight: 600
- Letter spacing: 0.12em
- Text transform: uppercase
- Gap between items: 2–2.5rem

**Color usage:**
- Default items: `rgba(255,255,255,0.16)` — barely visible
- Highlighted items (every 2nd or 3rd): `rgba(255,255,255,0.45)` — the ones you want people to notice
- Do NOT use primary accent color here — it would fire too early, before the featured section where it matters
- Do NOT add colored dots or separators between items — the rhythm of the text is enough

**Animation:**
- CSS `animation: marquee linear infinite`
- Row 1 speed: ~24s per cycle — slow enough to read, fast enough to feel alive
- Row 2 speed: ~30s — slightly different to avoid sync
- Pause on hover: optional but nice
- Do NOT use JS for this — pure CSS keyframes only, it never needs to stop or respond to state

**What not to do:**
- Do not add logos or icons — text only, the minimalism is the point
- Do not make it too fast — looks anxious
- Do not make both rows scroll the same direction — kills the visual interest
- Do not add a heading like "My tech stack" — it kills the confidence of the section

---

### Section 2 — Featured / Currently Building

**Purpose:** Shows you ship real things. One project, maximum signal, minimum noise. This is the first place the primary accent color appears below the hero.

**Structure:**
- Two column layout: text left, visual placeholder right
- Text column: eyebrow → title → description → tech chips → CTA link
- Visual column: abstract placeholder (replace with screenshot, mockup, or demo gif)

**Layout:**
- Padding: `4.5rem 3rem` — generous, this section needs room to breathe
- Gap between columns: `3rem`
- Visual column width: fixed `260px`, does not grow
- Text column: flex 1, takes remaining space
- Bottom border: `1px solid rgba(255,255,255,0.04)`

**Eyebrow label:**
- Text: "currently building" or "featured project"
- Font size: 10px, uppercase, letter-spacing 0.16em
- Color: `rgba(255,255,255,0.20)` — tertiary
- A short decorative line before it (`::before` pseudo, 20px, `rgba(255,255,255,0.15)`) adds a nice typographic touch
- Primary accent NOT used here — eyebrow is intentionally muted

**Project title:**
- Font size: 32px, weight 700, letter-spacing -0.02em
- Color: `rgba(255,255,255,0.92)` — near white, primary content level
- Line breaks are intentional — break at a natural pause for visual rhythm
- Primary accent NOT used on the title

**Description:**
- 2 sentences maximum
- Lead with what it does, end with a concrete outcome (number, metric, scale)
- Font size: 13px, line-height 1.72
- Color: `rgba(255,255,255,0.35)` — secondary content, clearly subordinate to title

**Tech chips:**
- Small pill shape, `border-radius: 99px`
- Font size: 10px, weight 500
- Color: `rgba(255,255,255,0.35)`
- Border: `1px solid rgba(255,255,255,0.08)` — structural opacity only
- No background fill
- Primary accent NOT used on chips here — save it for the CTA
- 4–6 chips maximum

**CTA link:**
- Primary accent color used HERE — this is its first appearance in this section
- Text: "View project" with `→` after
- Font size: 11px, weight 600, uppercase, letter-spacing 0.08em
- No button shape — just the text link with the arrow. Restraint.
- On hover: slight opacity drop (0.75)

**Visual placeholder (right column):**
- Background: `rgba(255,255,255,0.03)`
- Border: `1px solid rgba(255,255,255,0.07)`
- Border radius: 12px
- Fill with: project screenshot, a mockup, or an abstract grid of blocks
- If using abstract blocks: 2–3 blocks use `rgba(accent, 0.18)` — dimmed accent
- Rest of blocks: `rgba(255,255,255,0.05)`
- Do NOT use a solid accent fill on the visual

**What not to do:**
- Do not show more than one project here — this section loses power if it becomes a list
- Do not put the tech chips after the CTA — chips come before the CTA always
- Do not write a long description — if it needs more than 2 sentences it belongs on the story page
- Do not make the visual column wider than 280px — it starts competing with the text
- Do not use a button shape for the CTA — a text link with an arrow is more confident

---

### Section 3 — Philosophy / One-liner

**Purpose:** Shows how you think. The most human section on the page. One sentence that a hiring manager or founder reads and thinks "this person gets it."

**Structure:**
- Full width, centered
- Single large quote
- Small attribution below

**Layout:**
- Padding: `5.5rem 3rem` — the most generous padding on the page, this needs white space
- Text centered, `max-width: 540px` on the quote, centered in the container
- Bottom border: `1px solid rgba(255,255,255,0.04)`

**The quote:**
- Font size: 26–28px, weight 700, letter-spacing -0.02em, line-height 1.35
- Color: `rgba(255,255,255,0.92)` for the key words
- The muted portion: `rgba(255,255,255,0.28)` — use this for the less important half of the sentence
- Example pattern: "Good models are [muted: 20% architecture] and 80% knowing your data."
- The contrast between bright and muted text within the quote creates visual hierarchy inside a single line
- Primary accent NOT used here — the quote stands on its own, it does not need color support

**Attribution:**
- "— your name" or nothing at all
- Font size: 10px, uppercase, letter-spacing 0.14em
- Color: `rgba(255,255,255,0.15)` — barely there
- Margin top: 1.5rem

**What not to do:**
- Do not use quotation marks in a large decorative font — it looks like a WordPress theme
- Do not put a colored background behind the quote — it kills the editorial feel
- Do not use primary accent on any word in the quote — it breaks the typographic restraint
- Do not use more than one sentence — if you can't say it in one sentence, keep writing until you can
- Do not make it humble or hedged — "I believe that maybe..." is weak. State it.

---

### Section 4 — Stats

**Purpose:** Quick credibility. Numbers that show scale. Sits low on the page so it doesn't feel like bragging — it's context, not the headline.

**Structure:**
- 4-column grid, equal width columns
- Each cell: one number + one label
- Separated by 1px gaps filled with the page's divider color — creates a grid effect without drawing borders

**Layout technique:**
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
background: rgba(255,255,255,0.04);  /* the gap color */
gap: 1px;                             /* the gap itself */
```
Each cell has `background: #0a0a0a` (page background). The 1px gap between cells filled with the container color creates the grid lines. No `border` properties needed. Clean and precise.

**Cell padding:** `2.5rem 2rem`

**The number:**
- Font size: 38px, weight 700, letter-spacing -0.03em, line-height 1
- Color: `rgba(255,255,255,0.92)`
- Primary accent NOT used — the numbers speak for themselves
- Use `+` suffix for estimates, `∞` is allowed for something tongue-in-cheek (tabs open, coffees, etc.)

**The label:**
- Font size: 11px, uppercase, letter-spacing 0.10em, weight 500
- Color: `rgba(255,255,255,0.22)` — tertiary, clearly subordinate

**What numbers to include:**
- Projects shipped (real number)
- Deployed models or systems (real number)
- Years building / experience
- One human / personality stat — "tabs open", "papers read", "coffees", something that makes it not feel corporate

**What not to do:**
- Do not use primary accent on the numbers — it looks like a dashboard not a portfolio
- Do not use more than 4 stats — it dilutes every one of them
- Do not make up big numbers — 12 real projects beats "50+ projects" that nobody believes
- Do not add icons next to each stat — the number is the icon
- Do not add a section heading like "By the numbers" — the grid is self-explanatory

---

### Section 5 — Status + Socials Footer Strip

**Purpose:** Contact and availability. The lowest-friction path to reaching you. Always visible at the bottom, never the last thing you see — it should feel like a quiet footer not a CTA section.

**Structure:**
- Single row, space-between layout
- Left: availability status with green dot + text
- Right: social links in a row

**Layout:**
- Padding: `2rem 3rem`
- No top border — the stats section's bottom edge is enough separation
- `flex-wrap: wrap` with `gap: 1rem` for smaller viewports

**Status indicator (left):**
- Green dot: `width: 7px`, `background: #22c55e`, `border-radius: 50%`
- Pulse ring: `box-shadow: 0 0 0 3px rgba(34,197,94,0.15)` — subtle glow, no animation needed
- Status text: "Open to work · Based in [city] · ML & AI roles"
- Font size: 12px, weight 500
- "Open to work" in `rgba(255,255,255,0.65)` — slightly elevated
- Rest of text: `rgba(255,255,255,0.35)`
- When NOT open to work: swap dot to amber `#f59e0b`, text to "Building in public · Not actively looking"
- Primary accent NOT used here — green for available, amber for passive, red would imply unavailable

**Social links (right):**
- Labels: GitHub, LinkedIn, Twitter/X, Email
- Font size: 11px, weight 600, uppercase, letter-spacing 0.10em
- Default: `rgba(255,255,255,0.22)`
- Hover: `rgba(255,255,255,0.65)` — transition 0.2s
- No icons — text only, consistent with the rest of the page's typographic approach
- Gap between links: 20px
- No separators between links

**What not to do:**
- Do not use primary accent on the social links — they are utility, not emphasis
- Do not add a big "Get in touch" heading above this — it turns a quiet footer into a CTA section which feels desperate
- Do not add a contact form here — that belongs on the story page
- Do not animate the green dot with a keyframe pulse — the box-shadow ring is enough

---

### Vertical Rhythm — Full Page

```
Hero (3D + role details)
  ↓
Marquee strip          — tight, 1.4rem padding, transitional
  ↓
Featured project       — generous, 4.5rem padding, primary content
  ↓
Philosophy quote       — most generous, 5.5rem padding, editorial moment
  ↓
Stats grid             — no outer padding (grid fills edge to edge)
  ↓
Status + socials       — tight, 2rem padding, utility
```

The padding pattern is intentional. Tight → generous → most generous → edge to edge → tight again. It creates a reading cadence where the page feels like it breathes and then settles.

---

### Where Primary Accent Appears — Full Map

| Section | Element | Usage |
|---|---|---|
| Hero | Role title | Primary text color |
| Hero | Active tag pills | Text + border |
| Hero | Primary CTA button | Background fill |
| Hero | Dot nav active | Fill |
| Hero | Ambient glow | Background (blurred) |
| Marquee | nowhere | Not used |
| Featured | CTA link only | Text color |
| Featured | Visual blocks (1–2) | Dimmed fill (0.18 opacity) |
| Philosophy | nowhere | Not used |
| Stats | nowhere | Not used |
| Footer | nowhere | Not used |

**Total primary accent appearances below hero: 2**
One on the featured CTA link. One as a dimmed hint in the visual placeholder. That's it. Every other section is pure white opacity. The scarcity is what gives the color meaning.

---

### What Changes Per Role

When the 3D object rotates to a new role on the hero, only the hero updates in real time. Below the fold, the sections are static — they do not re-render per role. The featured project, philosophy quote, and stats are the same regardless of which role face is showing. The role-specific story pages (routed to via the CTA button) handle the role-tailored content. The landing page below the hero is your universal baseline.

The one exception: if you want the ambient glow color to persist into the marquee section visually, you can let the bottom glow bleed slightly below the hero border. This softens the hard cut between hero and marquee without any extra implementation work.

---

### Parallax Opportunities (optional enhancement)

These are the only three worth implementing. Do not add more.

**1. Stats count-up on scroll**
Numbers animate from 0 to their value when the stats section enters the viewport. Use `IntersectionObserver`. Duration: 1.2s, easing: ease-out. Adds perceived dynamism without motion sickness.

**2. Marquee speed on scroll**
Slightly increase marquee speed as the user scrolls past it. Subtle — maybe 1.2× at full scroll velocity. Pure CSS can't do this, needs a small scroll event listener.

**3. Featured visual parallax**
The visual placeholder (right column of featured section) scrolls at 0.85× the speed of the text column. Creates a mild depth effect. Implement with `transform: translateY()` driven by scroll position. Keep the offset small — max 20px difference.

Do not add parallax to the philosophy quote, the hero, or the footer strip. Less is more.
