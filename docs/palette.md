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

---

#### Palette 1 — ML Engineer · Black & Red

The primary palette. Uses the existing Spider-Man Noir color system — no new colors introduced.

```
Base:    --ink-black  #0d0d0d
Surface: --newsprint-gray  #2a2a2a
Accent:  #cc2936   (HSL 354°, 67%, 48%)
Dim:     rgba(204, 41, 54, 0.25)
Depth:   #8b0000   (--deep-crimson, hover/depth states)
```

| Slot | Value |
|---|---|
| `--accent` | `#cc2936` |
| `--accent-dim` | `rgba(204,41,54,0.25)` |
| Role title text | `--accent` |
| Active dot | `--accent` |
| Tag pill border (first 2) | `--accent-dim` |
| Divider line | `--accent-dim` |
| Mesh emissive | `--accent` at 0.12 multiplier |
| Point light | `--accent` |
| Bottom glow | `--accent` at 0.3 opacity |
| Top glow | `--accent` at 0.07 opacity |

---

#### Palette 2 — Data Scientist · Black & Purple

Derived from Palette 1 by rotating hue to 270° (purple), keeping saturation and lightness identical.

```
Base:    --ink-black  #0d0d0d
Surface: --newsprint-gray  #2a2a2a
Accent:  #7c29cc   (HSL 270°, 67%, 48%)
Dim:     rgba(124, 41, 204, 0.25)
Depth:   #4a0080   (deep purple, hover/depth states)
```

| Slot | Value |
|---|---|
| `--accent` | `#7c29cc` |
| `--accent-dim` | `rgba(124,41,204,0.25)` |
| All other slots | Same as Palette 1, values just swap to purple |

---

#### Palette 3 — AI Engineer · Black & Cyan

Derived from Palette 1 by rotating hue to 183° (cyan), keeping saturation and lightness identical.

```
Base:    --ink-black  #0d0d0d
Surface: --newsprint-gray  #2a2a2a
Accent:  #29b8cc   (HSL 183°, 67%, 48%)
Dim:     rgba(41, 184, 204, 0.25)
Depth:   #006b7a   (deep teal, hover/depth states)
```

| Slot | Value |
|---|---|
| `--accent` | `#29b8cc` |
| `--accent-dim` | `rgba(41,184,204,0.25)` |
| All other slots | Same as Palette 1, values just swap to cyan |

---

#### Role → Palette Quick Reference

| Role | `--accent` | `--accent-dim` | Depth |
|---|---|---|---|
| ML Engineer | `#cc2936` | `rgba(204,41,54,0.25)` | `#8b0000` |
| Data Scientist | `#7c29cc` | `rgba(124,41,204,0.25)` | `#4a0080` |
| AI Engineer | `#29b8cc` | `rgba(41,184,204,0.25)` | `#006b7a` |

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
