export default function PalettePage() {
  const baseTokens = [
    { name: "--ink-black",      hex: "#0d0d0d", label: "Ink Black",      use: "Page / body background" },
    { name: "--charcoal",       hex: "#1a1a1a", label: "Charcoal",       use: "Sidebar, secondary surfaces" },
    { name: "--newsprint-gray", hex: "#2a2a2a", label: "Newsprint Gray", use: "Cards, glass surface base" },
    { name: "--smoke",          hex: "#404040", label: "Smoke",           use: "Borders, dividers" },
    { name: "--vintage-white",  hex: "#f5f5dc", label: "Vintage White",  use: "Primary text" },
    { name: "--dust-gray",      hex: "#8c8c8c", label: "Dust Gray",      use: "Muted / secondary text" },
    { name: "--sepia-tone",     hex: "#f4ecd8", label: "Sepia Tone",     use: "Decorative callouts (rare)" },
  ];

  const roles = [
    {
      name: "ML Engineer",
      palette: "Black & Red",
      swatches: [
        { label: "Accent",       hex: "#cc2936", use: "--accent · title, dots, glow, emissive" },
        { label: "Accent Dim",   hex: "rgba(204,41,54,0.25)", displayHex: "#cc2936", opacity: 0.25, use: "--accent-dim · pill borders, divider" },
        { label: "Depth",        hex: "#8b0000", use: "hover / depth states" },
      ],
    },
    {
      name: "Data Scientist",
      palette: "Black & Purple",
      swatches: [
        { label: "Accent",       hex: "#7c29cc", use: "--accent · title, dots, glow, emissive" },
        { label: "Accent Dim",   hex: "rgba(124,41,204,0.25)", displayHex: "#7c29cc", opacity: 0.25, use: "--accent-dim · pill borders, divider" },
        { label: "Depth",        hex: "#4a0080", use: "hover / depth states" },
      ],
    },
    {
      name: "AI Engineer",
      palette: "Black & Cyan",
      swatches: [
        { label: "Accent",       hex: "#29b8cc", use: "--accent · title, dots, glow, emissive" },
        { label: "Accent Dim",   hex: "rgba(41,184,204,0.25)", displayHex: "#29b8cc", opacity: 0.25, use: "--accent-dim · pill borders, divider" },
        { label: "Depth",        hex: "#006b7a", use: "hover / depth states" },
      ],
    },
  ];

  const heatmap = [
    { level: "L0 · No activity", hex: "#0f0f0f" },
    { level: "L1 · Low",         hex: "#332428" },
    { level: "L2",               hex: "#56252d" },
    { level: "L3",               hex: "#7a2b34" },
    { level: "L4 · High",        hex: "#cc2936" },
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
                      width: 48, height: 48, borderRadius: 6, flexShrink: 0,
                      background: s.hex,
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: `0 0 12px ${s.displayHex ?? s.hex}40`
                    }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f5dc" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: s.displayHex ?? s.hex, fontFamily: "monospace" }}>
                        {s.hex}
                      </div>
                      <div style={{ fontSize: 10, color: "#5c5c5c", marginTop: 2 }}>{s.use}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Accent preview bar */}
              <div style={{ height: 4, background: role.swatches[0].hex }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Side-by-side accent comparison ──────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          Accent Comparison — same HSL saturation &amp; lightness, hue only changes
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
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0d0d0d", opacity: 0.85 }}>{role.name}</span>
              <span style={{ fontSize: 10, color: "#0d0d0d", opacity: 0.6, fontFamily: "monospace" }}>{role.swatches[0].hex}</span>
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

      {/* ── Glass card preview ──────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8c8c8c", marginBottom: 20, borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          Component Previews
        </h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Glass card */}
          <div className="glass-card" style={{ padding: "20px 24px", minWidth: 200 }}>
            <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>glass-card</div>
            <div style={{ fontSize: 15, color: "#f5f5dc" }}>Surface layer</div>
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="tag">tag pill</span>
              <span className="tag">another tag</span>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="spider-noir-button" style={{ padding: "10px 24px", border: "2px solid", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
              spider-noir-button
            </button>
            {roles.map((role) => (
              <button
                key={role.name}
                style={{
                  padding: "8px 20px", border: `2px solid ${role.swatches[0].hex}`,
                  borderRadius: 4, background: "#2a2a2a", color: role.swatches[0].hex,
                  cursor: "pointer", fontSize: 12, fontFamily: "monospace",
                }}
              >
                {role.name} accent
              </button>
            ))}
          </div>
          {/* Glow preview */}
          <div style={{ position: "relative", width: 160, height: 120, background: "#0d0d0d", borderRadius: 8, border: "1px solid #2a2a2a", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "#cc2936", opacity: 0.3, filter: "blur(40px)", borderRadius: "50%", transform: "scale(0.6) translateY(30px)" }} />
            <span style={{ position: "relative", fontSize: 11, color: "#8c8c8c" }}>glow preview</span>
          </div>
        </div>
      </section>

      <p style={{ color: "#404040", fontSize: 11, textAlign: "center", borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
        /palette · dev reference only
      </p>
    </main>
  );
}
