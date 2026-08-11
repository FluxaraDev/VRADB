# VR ADB Command Key Mapper — Design Brainstorm

## Three Stylistic Approaches

### 1. Crimson Terminal
**Theme Name:** Crimson Terminal
**Brief:** A hacker-terminal aesthetic with pure black background, blood-red accents, monospace type, and cascading red particle rain. Feels like a war room console for VR power users.
**Probability:** 0.07

### 2. Neon Void
**Theme Name:** Neon Void
**Brief:** Deep space black with electric red glow, glassmorphism cards, and shooting-star particle trails. Cinematic, immersive, premium.
**Probability:** 0.02

### 3. Industrial Forge
**Theme Name:** Industrial Forge
**Brief:** Matte black with steel-red riveted panels, bold condensed type, and ember-spark particle effects. Feels like heavy machinery for serious VR devs.
**Probability:** 0.01

---

## Chosen Approach: **Crimson Terminal** (selected)

### Design Movement
Dark terminal / hacker console — inspired by classic CRT terminals and modern cybersecurity dashboards.

### Core Principles
1. Pure black (#000000) as the absolute base — no grey backgrounds, no softening.
2. Blood-red (#DC2626 / #EF4444) as the single accent color — used for glows, borders, highlights, and particles.
3. Monospace typography for all code and commands — reinforces the terminal feel.
4. Information density without clutter — commands are scannable, grouped, and immediately copyable.

### Color Philosophy
- Background: `#000000` (pure black)
- Primary accent: `#DC2626` (red-600) — danger, power, precision
- Glow accent: `#EF4444` (red-500) — for hover states and glows
- Dim text: `#6B7280` (gray-500) — secondary labels
- Card surface: `rgba(255,255,255,0.03)` — barely-there glass
- Border: `rgba(220,38,38,0.3)` — red-tinted borders

### Layout Paradigm
Asymmetric sidebar + main content grid. Left rail anchors navigation/category filters; right panel shows command cards in a masonry-style grid. Header spans full width with animated logo.

### Signature Elements
1. **Red shooting stars canvas** — animated particles falling diagonally across the full viewport background.
2. **Glowing red copy button** — pulses on hover with a red ring glow.
3. **Terminal-style command blocks** — monospace code with a red left border and subtle scanline texture.

### Interaction Philosophy
Every interaction feels like a keypress on a physical terminal. Copy actions trigger a brief flash + "COPIED" confirmation. Hover states illuminate the card border in red.

### Animation
- Shooting stars: diagonal fall from top-right to bottom-left, varying speed (2–5s), red with white head and fading tail.
- Card entrance: stagger 40ms per card, slide up 12px + fade in, 200ms ease-out.
- Copy flash: 150ms red flash on the card border, then "COPIED ✓" text swap for 1.5s.
- Nav hover: underline slides in from left, 150ms ease-out.

### Typography System
- Display: `Orbitron` (Google Fonts) — for the site title and section headers. Bold, geometric, futuristic.
- Body/UI: `JetBrains Mono` — for all command text, labels, and descriptions.
- Scale: 48px hero title → 20px section headers → 14px command text → 12px labels.

### Brand Essence
**"The fastest way to ADB your VR headset — no docs needed."** — Precise, Powerful, Unapologetic.

### Brand Voice
Headlines sound like a system boot sequence. CTAs are direct commands.
- Example: `> INITIALIZING ADB COMMAND LIBRARY...`
- Example: `COPY & EXECUTE`

### Wordmark & Logo
A stylized `>_` terminal cursor mark in red, bold, with a subtle glow — no wordmark text in the logo itself.

### Signature Brand Color
`#DC2626` — Crimson Red. Unmistakably this brand's.

---

## Style Decisions
(Appended from style review)
