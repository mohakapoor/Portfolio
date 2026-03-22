export default function PalettePage() {
  const baseTokens = [
    { name: "--ink-black", hex: "#0d0d0d", label: "Ink Black", use: "Page / body background" },
    { name: "--charcoal", hex: "#1a1a1a", label: "Charcoal", use: "Sidebar, secondary surfaces" },
    { name: "--newsprint-gray", hex: "#2a2a2a", label: "Newsprint Gray", use: "Cards, glass surface base" },
    { name: "--smoke", hex: "#404040", label: "Smoke", use: "Borders, dividers" },
    { name: "--vintage-white", hex: "#f5f5dc", label: "Vintage White", use: "Primary text" },
    { name: "--dust-gray", hex: "#8c8c8c", label: "Dust Gray", use: "Muted / secondary text" },
    { name: "--sepia-tone", hex: "#f4ecd8", label: "Sepia Tone", use: "Decorative callouts (rare)" },
  ];

  const roles = [
    {
      name: "ML Engineer",
      palette: "Black & Red · High-Tech Editorial",
      accent: "#cc2936",
      swatches: [
        { label: "primary", hex: "#cc2936", use: "--accent · Spider Red · glow source, title, CTAs, emissive" },
        { label: "tertiary", hex: "#e84050", use: "Brighter red punch — secondary glow, index numbers" },
        { label: "primary_container", hex: "#a01f2a", use: "Darker red — holographic gradient endpoint (5–10% opacity)" },
        { label: "on_primary", hex: "#ffe8e8", use: "Warm near-white — text on top of primary fills" },
        { label: "secondary_container", hex: "#474746", use: "Secondary button background (no border)" },
        { label: "error", hex: "#ff3333", use: "Bright alert red — validation text only, never as bg fill" },
        { label: "outline_variant", hex: "#484847", use: "Ghost borders at 20% opacity — felt, not seen" },
      ],
    },
    {
      name: "Data Scientist",
      palette: "Black & Pink · High-Tech Editorial",
      accent: "#ec4899",
      swatches: [
        { label: "primary",               hex: "#ec4899", use: "--accent · Pink · glow source, title, CTAs, emissive" },
        { label: "tertiary",              hex: "#ff7ab9", use: "Brighter pink punch — secondary glow, index numbers" },
        { label: "primary_container",     hex: "#b8126b", use: "Darker pink — holographic gradient endpoint (5–10% opacity)" },
        { label: "on_primary",            hex: "#36001a", use: "Deep maroon — text on top of primary fills" },
        { label: "secondary_container",   hex: "#474746", use: "Secondary button background (no border)" },
        { label: "error",                 hex: "#ff3333", use: "Bright alert red — validation text only, never as bg fill" },
        { label: "outline_variant",       hex: "#484847", use: "Ghost borders at 20% opacity — felt, not seen" },
      ],
    },
    {
      name: "AI Engineer",
      palette: "Black & Cyan · High-Tech Editorial",
      accent: "#a1faff",
      swatches: [
        { label: "primary",               hex: "#a1faff", use: "--accent · Cyan · glow source, title, CTAs, emissive" },
        { label: "tertiary",              hex: "#4dedff", use: "Brighter cyan punch — secondary glow, index numbers" },
        { label: "primary_container",     hex: "#00a7b5", use: "Darker cyan — holographic gradient endpoint (5–10% opacity)" },
        { label: "on_primary",            hex: "#003338", use: "Dark teal — text on top of primary fills" },
        { label: "secondary_container",   hex: "#474746", use: "Secondary button background (no border)" },
        { label: "error",                 hex: "#ff3333", use: "Bright alert red — validation text only, never as bg fill" },
        { label: "outline_variant",       hex: "#484847", use: "Ghost borders at 20% opacity — felt, not seen" },
      ],
    },
  ];

  const heatmap = [
    { level: "L0 · No activity", hex: "#0f0f0f" },
    { level: "L1 · Low", hex: "#332428" },
    { level: "L2", hex: "#56252d" },
    { level: "L3", hex: "#7a2b34" },
    { level: "L4 · High", hex: "#cc2936" },
  ];

  return (
    <main style={{ background: "#0d0d0d", color: "#f5f5dc", minHeight: "100vh", fontFamily: "monospace", padding: "48px 32px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-bebas, sans-serif)", fontSize: 56, letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>
        Palette
      </h1>
      <p style={{ color: "#8c8c8c", marginBottom: 48, fontSize: 14 }}>
        All color tokens used across <strong style={{ color: "#f5f5dc" }}>portfolio-noir</strong>. Visit <code style={{ color: "#cc2936" }}>/palette</code> during development only — remove from production.
      </p>

      {/* ── Base Tokens ─────────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          Base Tokens — shared across all pages &amp; palettes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {baseTokens.map((t) => (
            <div key={t.name} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 64, background: t.hex, border: "1px solid rgba(255,255,255,0.04)" }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f5dc", marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: "#cc2936", marginBottom: 4, fontFamily: "monospace" }}>{t.hex}</div>
                <div style={{ fontSize: 10, color: "#8c8c8c" }}>{t.name}</div>
                <div style={{ fontSize: 10, color: "#5c5c5c", marginTop: 4 }}>{t.use}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Palettes ────────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          Role Palettes — landing page only
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {roles.map((role) => (
            <div key={role.name} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a2a2a" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f5f5dc" }}>{role.name}</div>
                <div style={{ fontSize: 11, color: "#8c8c8c", marginTop: 2 }}>{role.palette}</div>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {role.swatches.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: 0, flexShrink: 0,
                      background: s.hex,
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: `0 0 12px ${(s as { displayHex?: string }).displayHex ?? s.hex}40`
                    }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f5dc" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: (s as { displayHex?: string }).displayHex ?? s.hex, fontFamily: "monospace" }}>
                        {s.hex}
                      </div>
                      <div style={{ fontSize: 10, color: "#5c5c5c", marginTop: 2 }}>{s.use}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Surface hierarchy — shown for all roles (obsidian surface stack) */}
              <div style={{ padding: "10px 16px", borderTop: "1px solid #2a2a2a", background: "#0d0d0d" }}>
                <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Surface Hierarchy (real project tokens)</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[
                    { label: "L1 ink-black", hex: "#0d0d0d", token: "--ink-black" },
                    { label: "L2 charcoal", hex: "#1a1a1a", token: "--charcoal" },
                    { label: "L3 newsprint", hex: "#2a2a2a", token: "--newsprint-gray" },
                    { label: "L4 glass", hex: "rgba(255,255,255,0.03)", renderHex: "#0f0f0f", token: ".glass-card" },
                    { label: "L5 smoke", hex: "#404040", token: "--smoke" },
                  ].map((s) => (
                    <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                      <div style={{ width: "100%", height: 28, background: s.renderHex ?? s.hex, border: `1px solid ${role.accent}22` }} />
                      <div style={{ fontSize: 8, color: "#494847", textAlign: "center", lineHeight: 1.3 }}>{s.label}</div>
                      <div style={{ fontSize: 7, color: "#333", fontFamily: "monospace", textAlign: "center" }}>{s.token}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: "#494847", lineHeight: 1.7 }}>
                  <span style={{ color: "#4a4" }}>✓</span> Accent glow: <code style={{ color: role.accent, fontSize: 9 }}>box-shadow: 0 0 20px rgba(accent, 0.15)</code><br />
                  <span style={{ color: "#a44" }}>✗</span> Black shadow: <code style={{ color: "#444", fontSize: 9 }}>box-shadow: 0 10px 24px rgba(0,0,0,0.45)</code>
                </div>
              </div>
              {/* Accent preview bar */}
              <div style={{ height: 4, background: role.accent }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Side-by-side accent comparison ──────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          Accent Comparison — three role primaries side by side
        </h2>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", height: 80, border: "1px solid #2a2a2a" }}>
          {roles.map((role) => (
            <div
              key={role.name}
              style={{
                flex: 1,
                background: role.swatches[0].hex,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 2,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: role.name === "AI Engineer" ? "#006165" : "#ffe8e8", opacity: 0.9 }}>{role.name}</span>
              <span style={{ fontSize: 10, color: role.name === "AI Engineer" ? "#006165" : "#ffe8e8", opacity: 0.6, fontFamily: "monospace" }}>{role.accent}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── GitHub Heatmap ───────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          GitHub Contribution Heatmap Scale
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {heatmap.map((h) => (
            <div key={h.level} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 4, background: h.hex, border: "1px solid rgba(255,255,255,0.05)" }} />
              <div>
                <div style={{ fontSize: 10, color: "#8c8c8c" }}>{h.level}</div>
                <div style={{ fontSize: 10, color: "#5c5c5c", fontFamily: "monospace" }}>{h.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p style={{ color: "#404040", fontSize: 11, textAlign: "center", borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
        /palette · dev reference only
      </p>
    </main>
  );
}
