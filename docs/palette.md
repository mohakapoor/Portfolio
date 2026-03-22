# Palette Reference

## Color Tokens

All colors live as CSS custom properties on `:root` in `globals.css`.
Nothing is hardcoded anywhere — always use the variable.

```css
--ink-black:     #0d0d0d   /* Deepest background */
--charcoal:      #1a1a1a   /* Secondary backgrounds */
--newsprint-gray:#2a2a2a   /* Cards, surface layer */
--smoke:         #404040   /* Borders, dividers, subtle edges */
--vintage-white: #f5f5dc   /* Primary text, headings */
--dust-gray:     #8c8c8c   /* Secondary / muted text */
--spider-red:    #cc2936   /* Primary accent — CTAs, highlights, links */
--deep-crimson:  #8b0000   /* Emphasis, hover depth, danger states */
--sepia-tone:    #f4ecd8   /* Warm highlight text (rarely used) */
```

---

## What Goes Where

### Backgrounds

| Layer | Token | Use |
|---|---|---|
| Page / body | `--ink-black` | All page backgrounds |
| Secondary surfaces | `--charcoal` | Sidebar drawer bg, nested sections |
| Cards / glass surfaces | `--newsprint-gray` at opacity | `.glass-card` base |
| Buttons (default state) | `--newsprint-gray` | `.spider-noir-button` resting state |

> Never use `--vintage-white` or `--spider-red` as a background fill on anything large. Fills kill the restraint.

---

### Text

| Role | Token | Use |
|---|---|---|
| Primary text | `--vintage-white` | All body copy, card content, default `<p>` |
| Muted / secondary text | `--dust-gray` | Subtitles, descriptions, `.text-dust-gray` |
| Headlines | `--vintage-white` (+ white on `.newspaper-headline`) | Section titles via `.newspaper-headline` class |
| Accent text | `--spider-red` | Hover states, emphasis, active nav items |
| Warm highlight | `--sepia-tone` | Use very sparingly — only for decorative callouts |

> Do not put `--spider-red` on large blocks of body text. It's an accent, not a body color.

---

### Borders & Dividers

| Role | Token | Notes |
|---|---|---|
| Card borders | `rgba(204,41,54, 0.25)` | Spider red at low opacity — keeps the red theme without screaming |
| Sidebar border | `rgba(204,41,54, 0.35)` | Slightly more present than card |
| Tag pill borders | `rgba(204,41,54, 0.4)` | `.tag` class |
| Smoke dividers | `--smoke` | Between sections that need a harder edge |
| Input focus border | `--spider-red` (full opacity) | Form elements on focus |

---

### Interactive Elements

| Element | Default | Hover / Active |
|---|---|---|
| `.spider-noir-button` | `bg: --newsprint-gray`, `border: --spider-red` | `bg: --spider-red`, red glow shadow |
| `.glass-card` (clickable) | Subtle red border, glass bg | Lifts with `translateY(-3px)`, lighter bg |
| Nav links | `--vintage-white` | `--spider-red` underline or color |
| Tags / pills | `--vintage-white` text, red-tinted border | No hover state — static |
| Header social icons | `bg: --newsprint-gray` | `bg: --spider-red` |
| Hamburger button | `border: --spider-red`, `bg: --newsprint-gray` | `bg: --spider-red` |
| Custom cursor dot | `--spider-red` | Turns white when locked on a target |

---

### GitHub Contribution Heatmap

The heatmap uses a 5-level scale mapped to red shades:

| Level | Color | Hex |
|---|---|---|
| 0 (no activity) | Near-black | `#0f0f0f` |
| 1 (low) | Dark crimson tint | `#332428` |
| 2 | Mid crimson | `#56252d` |
| 3 | Deep red | `#7a2b34` |
| 4 (high) | Spider red | `#cc2936` |

---

### Glow Effects

Only two ambient glow elements should ever exist on a page at once.

| Glow | Color | Opacity | Blur | Position |
|---|---|---|---|---|
| Primary / bottom | `--spider-red` | ~0.3 | 90px | Behind content, bottom-center |
| Secondary / top | `--spider-red` | ~0.07 | 60px | Top-center, very subtle |

> Do not make glows brighter than this. The page should breathe the color, not be lit by a neon sign.

---

### Role Selector Palette System (Landing Page Only)

The landing page role selector uses three distinct palette families. All three share the same dark base — only the accent color swaps. Accents are color-matched at the same saturation (67%) and lightness (48%) so they feel like siblings, not random picks.

The active palette is applied via two CSS custom properties on the root element:

```css
--accent      /* active role primary color */
--accent-dim  /* active role dimmed variant — rgba at 0.25 opacity */
```

> These two variables are **landing page only**. Story and projects pages always use `--spider-red` directly.

### Shared Surface Hierarchy (from `globals.css`)

All three role palettes use the same dark base. The surface stack is already in the project — these are the real tokens.

```
L1 — Page / body      --ink-black  #0d0d0d    html, body background
L2 — Drawer / nav     --charcoal   #1a1a1a    .glass-nav (rgba(42,42,42,0.85) + backdrop-blur)
L3 — Button resting   --newsprint-gray  #2a2a2a   .spider-noir-button default bg, solid
L4 — Glass surface    rgba(255,255,255,0.03)   .glass-card — frosted lift above L1
                      backdrop-filter: blur(10px) saturate(120%)
                      border: 1px solid rgba(--accent, 0.25)
L5 — Hard borders     --smoke  #404040   use sparingly — only for hard section breaks
```

**Shadow rule — no pure black shadows:**
```css
/* ✓ Correct — accent-tinted glow (ML Engineer example) */
box-shadow: 0 0 20px rgba(204, 41, 54, 0.15), 0 10px 40px rgba(204, 41, 54, 0.08);

/* ✗ Wrong — dead grey/black shadow */
box-shadow: 0 10px 24px rgba(0,0,0,0.45);
```

Each role's glow just swaps the RGB values to match its `--accent`.

---

#### Palette 1 — ML Engineer · Black & Red (High-Tech Editorial)

Obsidian foundation with **Spider Red** (`#cc2936`) as the neon glow source. All supporting tokens derived from the same red family — no hue deviation. The design language: precise, cold, editorial. A live terminal into an intelligence network.

**Design North Star:** High contrast, intentional asymmetry. Depth through glows, not shadows.

##### Color Tokens

```
primary:                  #cc2936   ← --accent · Spider Red · glow source, title, CTAs, emissive
tertiary:                 #e84050   ← brighter red punch — secondary glow, index numbers (001, 002)
primary_container:        #a01f2a   ← darker red — holographic gradient endpoint (5–10% opacity)
on_primary:               #ffe8e8   ← warm near-white — text on top of primary fills
secondary_container:      #474746   ← neutral dark — secondary button background (no border)
error:                    #ff3333   ← bright alert red — validation text only, distinct from pink/red accents
outline_variant:          #484847   ← ghost borders at 20% opacity (felt, not seen)

Surface hierarchy: → see shared surface hierarchy above. Same tokens, accent color swaps.
```

##### Role Selector Slots

| Slot | Value |
|---|---|
| `--accent` | `#cc2936` |
| `--accent-dim` | `rgba(204,41,54,0.25)` |
| Depth (hover/glow) | `#a01f2a` (primary_container) |
| Mesh emissive | `#cc2936` at 0.12 multiplier |
| Point light | `#cc2936` |
| Bottom glow | `#cc2936` at 0.3 opacity + 90px blur |
| Top glow | `#cc2936` at 0.07 opacity |
| Active dot | `#cc2936` |
| Role title | `#cc2936` |
| Divider line | `rgba(204,41,54,0.25)` |
| Tag pill border (first 2) | `rgba(204,41,54,0.25)` |

##### Key Rules (High-Tech Editorial)

- **No grey/black shadows** — floating elements use accent glow: `box-shadow: 0 0 20px rgba(accent, 0.15)`. No `rgba(0,0,0)` shadows.
- **Ghost border** on inputs: `outline_variant` (#484847) at 20% opacity — a hairline, not a wall.
- **Signature Texture** — radial gradients from `primary` → `primary_container` at 5–10% opacity behind key text.
- **`error` (#ff3333) must be clearly distinct from primary** — bright alert red so it reads as validation, not an accent.

---

#### Palette 2 — Data Scientist · Black & Pink (High-Tech Editorial)

Obsidian foundation with **Pink** (`#ec4899`) as the neon glow source. All supporting tokens derived from the same pink family — no hue deviation.

**Design North Star:** High contrast, intentional asymmetry. Depth through glows, not shadows.

##### Color Tokens

```
primary:                  #ec4899   ← --accent · Pink · glow source, title, CTAs, emissive
tertiary:                 #ff7ab9   ← brighter pink punch — secondary glow, index numbers (001, 002)
primary_container:        #b8126b   ← darker pink — holographic gradient endpoint (5–10% opacity)
on_primary:               #36001a   ← deep maroon — text on top of primary fills
secondary_container:      #474746   ← neutral dark — secondary button background (no border)
error:                    #ff3333   ← bright alert red — validation text only, distinct from pink/red accents
outline_variant:          #484847   ← ghost borders at 20% opacity (felt, not seen)

Surface hierarchy: → see shared surface hierarchy above. Same tokens, accent color swaps.
```

##### Role Selector Slots

| Slot | Value |
|---|---|
| `--accent` | `#ec4899` |
| `--accent-dim` | `rgba(236,72,153,0.20)` |
| Depth (hover/glow) | `#b8126b` (primary_container) |
| Mesh emissive | `#ec4899` at 0.12 multiplier |
| Point light | `#ec4899` |
| Bottom glow | `#ec4899` at 0.3 opacity + 90px blur |
| Top glow | `#ec4899` at 0.07 opacity |
| Active dot | `#ec4899` |
| Role title | `#ec4899` |
| Divider line | `rgba(236,72,153,0.20)` |

---

#### Palette 3 — AI Engineer · Black & Cyan (High-Tech Editorial)

Obsidian foundation with **Cyan** (`#a1faff`) as the neon glow source. All supporting tokens derived from the same cyan family — no hue deviation.

**Design North Star:** High contrast, intentional asymmetry. Depth through glows, not shadows.

##### Color Tokens

```
primary:                  #a1faff   ← --accent · Cyan · glow source, title, CTAs, emissive
tertiary:                 #4dedff   ← brighter cyan punch — secondary glow, index numbers (001, 002)
primary_container:        #00a7b5   ← darker cyan — holographic gradient endpoint (5–10% opacity)
on_primary:               #003338   ← dark teal — text on top of primary fills
secondary_container:      #474746   ← neutral dark — secondary button background (no border)
error:                    #ff3333   ← bright alert red — validation text only, distinct from pink/red accents
outline_variant:          #484847   ← ghost borders at 20% opacity (felt, not seen)

Surface hierarchy: → see shared surface hierarchy above. Same tokens, accent color swaps.
```

##### Role Selector Slots

| Slot | Value |
|---|---|
| `--accent` | `#a1faff` |
| `--accent-dim` | `rgba(161,250,255,0.20)` |
| Depth (hover/glow) | `#00a7b5` (primary_container) |
| Mesh emissive | `#a1faff` at 0.12 multiplier |
| Point light | `#a1faff` |
| Bottom glow | `#a1faff` at 0.3 opacity + 90px blur |
| Top glow | `#a1faff` at 0.07 opacity |
| Active dot | `#a1faff` |
| Role title | `#a1faff` |
| Divider line | `rgba(161,250,255,0.20)` |
| Tag pill border (first 2) | `rgba(161,250,255,0.20)` |

##### Key Rules (High-Tech Editorial)

- **No grey/black shadows** — floating elements use accent glow: `box-shadow: 0 0 20px rgba(accent, 0.15)`. No `rgba(0,0,0)` shadows.
- **Ghost border** on inputs: `outline_variant` (#484847) at 20% opacity — a hairline, not a wall.
- **Signature Texture** — radial gradients from `primary` → `primary_container` at 5–10% opacity behind key text.
- **`error` (#ff3333) must be clearly distinct from primary** — bright alert red so it reads as validation, not an accent.

---

#### Role → Palette Quick Reference

| Role | `--accent` | `--accent-dim` | Depth |
|---|---|---|---|
| ML Engineer | `#cc2936` | `rgba(204,41,54,0.25)` | `#a01f2a` |
| Data Scientist | `#ec4899` | `rgba(236,72,153,0.20)` | `#b8126b` |
| AI Engineer | `#a1faff` | `rgba(161,250,255,0.20)` | `#00a7b5` |

---

## Rules

1. **All colors from variables** — no hex literals in component files.
2. **Red is the only accent on story/projects** — purple and cyan exist only on the landing page role selector. Never bleed them into other pages.
3. **`--accent` / `--accent-dim` are landing-page-only** — story and projects always use `--spider-red` directly.
4. **Opacity over new colors** — need something subtle? Use the existing color at lower opacity with `rgba()`.
5. **No colored backgrounds** — accent colors never appear as `background-color` on anything wider than a button or a glow div.
6. **Dark stays dark** — the ink-black / charcoal / newsprint-gray base never changes between palettes, only the accent swaps.
7. **Glow max 2** — two ambient glow divs per page, maximum.
8. **Palette transitions must lag** — when the role switches, glow should transition 200–300ms slower than the text, making the color shift feel physical.
