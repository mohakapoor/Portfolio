# portfolio_head.md
## Role Selector — Full Design Spec

---

### What This Is

A split-panel hero section. Left side holds a 3D object that rotates to select a role. Right side is a static detail panel that updates when the role changes. The whole page is tinted by whichever role is active via ambient glow and accent color.

Three roles: ML Engineer, Data Scientist, AI Engineer.

---

### Layout

```
[ LEFT 45% ]  [ RIGHT 55% ]
  3D object     Role details
  hint text
  dot nav
```

- Outer container: full viewport width, dark background, `border-radius: 16px`
- No dividers, no borders between left and right — whitespace is the only separator
- Left and right panels are flex children, `align-items: stretch`
- Left: flex column, centered both axes
- Right: flex column, `justify-content: center`, generous padding

---

### Left Panel — 3D Object

**The object**
- A 3D mesh loaded via GLTFLoader (your `.glb` file)
- Flat shading, low poly aesthetic
- Slowly auto-rotates on Y axis
- Click to lock rotation in place, click again to resume
- Subtle Y-axis float animation (sine wave, slow, low amplitude)

**Rotation mechanics**
- Auto-rotation speed: slow and deliberate, not fast
- Three role "faces" spaced evenly at 0°, 120°, 240° on Y axis
- As each face comes forward, it triggers a role switch
- Click to lock: freezes at current angle, lerps to exact target angle
- Dot nav: clicking a dot sets `targetRotY` to that role's angle and locks
- Always lerps smoothly to target, never snaps

**Accent on the 3D object**
- Active role color applied as `emissive` on the mesh material at low multiplier (~0.12)
- A `PointLight` in front of the object takes the active role color at moderate intensity
- The object itself stays dark — the color is a hint, not a flood
- Wireframe overlay on top of solid mesh: white, very low opacity (0.05–0.08), `wireframe: true`

**What not to do**
- Do not make the object spin fast — it looks cheap
- Do not flood the mesh with the role color — emissive should be subtle
- Do not use `MeshBasicMaterial` — it ignores lighting and looks flat in a bad way
- Do not add shadows unless your GLB is high enough quality to warrant it
- Do not place the object too large — it should feel like a considered element, not a hero image

---

### Right Panel — Role Details

Components stacked vertically with consistent gap:

**Counter**
- Format: `01 / 03`
- Very small, uppercase, wide letter-spacing
- Muted — lowest hierarchy element on the panel

**Role Title**
- Largest text on the panel
- Color: primary accent of active role
- Font weight: 700, tight letter-spacing (-0.02em)
- Transitions: color smoothly on role change (0.6s)

**Tagline**
- 1–2 sentences describing the role
- Muted body text, relaxed line-height (1.7+)
- Max-width constrained so it doesn't stretch too wide

**Divider**
- A short horizontal rule (28px wide)
- Color: active role `colorDim` (the dimmed/transparent variant)
- Not a full-width separator — it's a small typographic breath

**Tag Pills**
- Horizontal wrapping row
- First 2 pills: accent styled — role color text, role `colorDim` border
- Remaining pills: muted — low opacity text, barely-there border
- Pill shape: high border-radius (99px)
- No background fill on any pill

**What not to do**
- Do not use a full-width divider — it cuts the panel in half visually
- Do not make all pills the same accent color — the contrast between accented and muted pills is intentional hierarchy
- Do not animate individual pills separately — the whole block fades as one unit

---

### Transition — Role Change

When a role switches, all right panel content crossfades:

1. All content blocks simultaneously fade out + translate down 10px (0.15–0.2s)
2. Content is swapped while invisible
3. All content blocks simultaneously fade in + translate back to 0 (0.35–0.45s)
4. CSS custom properties `--accent` and `--accent-dim` update on the root element
5. Glow elements transition their background color (0.6–0.8s, slow)
6. Role title color transitions (0.6s)
7. Dot nav: active dot scales up and takes role color

**What not to do**
- Do not snap text — always crossfade
- Do not stagger individual lines — the whole block moves together
- Do not make the fade too fast (under 150ms out) — it reads as a glitch not a transition
- Do not animate the counter — it is the lowest priority element and drawing attention to it switching is distracting

---

### Ambient Glow

Two absolutely positioned blurred div elements, pointer-events none:

**Bottom glow**
- Wide short ellipse
- Positioned behind the disc / bottom of page
- Opacity: ~0.3
- Blur: 90px
- Color: active role primary color
- Transition: 0.6–0.8s on color change

**Top glow**
- Smaller circle
- Positioned top-center behind content
- Opacity: ~0.07 (very subtle)
- Same color transition

**What not to do**
- Do not make the glow too bright — it should feel like the page is breathing the color, not lit by a neon sign
- Do not add more than two glow elements — it gets muddy fast
- Do not transition the glow faster than the text — glow should lag slightly behind, feels more natural

---

### Color System

Three roles, three color sets. Each role has two values:

```
color     // primary — used on title, active pills, dot, emissive, point light
colorDim  // dimmed variant — used on divider, pill borders, secondary accents
```

Colors are stored in a `roles[]` config array and applied via CSS custom properties on the root:

```css
--accent      /* active role primary color */
--accent-dim  /* active role dimmed color  */
```

**Primary accent used on:**
- Role title text color
- First 2 tag pill text + border
- Active dot nav indicator
- 3D object point light color
- 3D object mesh emissive (at 0.12 multiplier)
- Bottom and top glow background

**Dimmed accent used on:**
- Divider line
- Non-leading tag pill borders (subtle)

**What not to do**
- Do not use the primary accent on body text or tagline — it competes with the title
- Do not apply accent color to the background of anything — fills kill the restraint
- Do not use more than 2 accent values per role — adding a third creates noise
- Do not hardcode colors anywhere in the component — everything reads from `--accent` and `--accent-dim` so swapping your theme is one change

---

### Dot Navigation

Three dots below the 3D object:

- Inactive: small, low opacity white circle
- Active: same circle scaled up (1.8×), takes role primary color
- Clicking a dot: locks rotation, lerps to that role's Y angle, triggers role switch
- Click on 3D object itself: toggles locked / auto-rotating

---

### Hint Text

Small line below the 3D object:

- `auto-rotating · click to lock` when spinning
- `locked · click to resume` when frozen
- Uppercase, very wide letter-spacing, lowest opacity on the page
- Does not animate — just updates textContent

---

### What We Ruled Out (and Why)

| Idea | Why dropped |
|---|---|
| Particle burst on role change | Looked noisy and distracting — took attention off the content |
| Icon cards floating around the head | Too busy, competed with the detail panel |
| Procedural low poly face | Geometry was never going to look good without a real asset |
| Card-based left panel | Borders and card outlines made it look like a component library demo |
| Drum slot machine | Interesting mechanic but vertical rotation felt disconnected from the role concept |
| Pokémon UI theme | Recognisable reference overwhelmed the personal brand |
| 3D object as the hero | The 3D object is a supporting element — you and your work are the hero |

---

### The Bigger Picture

The role selector is not the point of the portfolio. It is an interactive entry point that communicates range without a wall of text. The actual work — projects, outcomes, writing — lives below the fold.

**The page communicates:** passionate, technical, can build real things.

**It does not communicate this through:** visual complexity, gimmicks, or trying to look like a creative agency.

The restraint is the message.

---

### File Structure (TSX)

```
/components
  RoleSelector.tsx        — root, holds selectedRole state
  ThreeScene.tsx          — Three.js canvas, GLTFLoader, rotation logic
  RoleDetail.tsx          — right panel, counter + title + tagline + tags
  TagPill.tsx             — single pill, accent boolean prop
  AmbientGlow.tsx         — two glow divs, color prop
  DotNav.tsx              — three dots, selected index + onSelect

/data
  roles.ts                — roles config array with color, tagline, tags

/types
  role.ts                 — Role interface

/public
  head.glb                — your low poly head asset (source from Poly Pizza or Sketchfab)
```

---

### Data Shape

```ts
interface Role {
  label:    string        // "ML Engineer"
  counter:  string        // "01 / 03"
  color:    string        // primary hex
  colorDim: string        // rgba dimmed variant
  tagline:  string        // 1–2 sentence description
  tags:     string[]      // skill labels, first 2 get accent treatment
}
```
