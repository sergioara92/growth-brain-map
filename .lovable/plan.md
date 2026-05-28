## Goal

Replace Stage 2 entirely with two sequential sub-pages (2A → 2B) while keeping the progress bar as a single dot 2. No other stages, the BrainScanner component, palette, typography, toggle, or progress bar structure change.

## File changes

- **Edit `src/components/explorable/Stage2.tsx`** — becomes a thin wrapper that holds `subStage: '2A' | '2B'`, renders `<Stage2A />` or `<Stage2B />`, handles the 400ms fade-out / 200ms pause / 400ms fade-in transition, and shows a "1 / 2" or "2 / 2" sub-step indicator below the progress bar area (inside the stage container, not in `ProgressBar.tsx`). Receives existing `connections`, `setConnections`, `onNext` props from `Explorable.tsx` — no changes needed in `Explorable.tsx`.
- **Create `src/components/explorable/Stage2A.tsx`** — analogy text + rebuilt simulation. Calls a local `onSubNext()` to advance to 2B.
- **Create `src/components/explorable/Stage2B.tsx`** — neuroplasticity text + static BrainScanner comparison + takeaway card. Calls the existing `onNext` to advance to Stage 3.
- **Edit `src/styles.css`** — add keyframes for `slowPulse` (line opacity 0.85↔1.0, 2s) and `goldArrowPulse` if not reusable from existing `arrowPulse`. Reuse existing `pulseGlow`, `slide-down`, `fade-in`, `scale-in`.

## Stage 2A details

**Layout**: 2-col desktop (text left, sim right), stacked on mobile.

**Text column**: new shortened analogy copy (ES/EN via `t()`), dynamic aria-live label with thresholds 0 / 1–2 / 3–5 / 6–8 / 9+ based on count of connections at level ≥ 1.

**Simulation** — rebuilt from scratch:
- 3×3 node grid, 100px spacing, 12 edges (6 H + 6 V). Edge id scheme: `h-r-c` / `v-r-c`. Reuses the existing `connections: Record<string, number>` state but with new ids; old 5×5 ids are simply unused (state is reset whenever the user re-enters because Explorable state persists — acceptable since user only progresses forward).
- **City panel (top)**:
  - Inline SVG building per node: 24×28 rect base `#2A1A5E`, stroke `#6655AA`, 2–3 window rects `#FFD166`. When the node's active-connection count (level ≥ 2) ≥ 2, windows go full opacity + SVG filter glow `feGaussianBlur stdDeviation="3"` in gold.
  - Edge lines: SVG `<line>` per level using the spec table (dasharray + color + width). Level 4 wrapped with an SVG `<filter>` (feGaussianBlur + feComposite) producing a gold glow. Each visible line has a sibling invisible 20px-wide transparent line as hit area.
  - Particle burst on upgrade: absolutely-positioned div overlay above the SVG, spawns 3 brown circles (level 1) or 5 gold rotated squares (level 4) at the connection midpoint, animated outward via inline keyframes + opacity, cleaned up after 400/600ms via `setTimeout`.
  - Counter line below: `Calles construidas: X | Autopistas: Y`.
- **Divider**: 1px teal line, 80% width, centered label with `#1A0A3B` background masking the line, teal 12px.
- **Neuron panel (bottom)**:
  - Inline SVG neuron per node: circle body r=16 fill `#1A0A3B` stroke `#00C2C7` 1.5, 5 dendrite groups (line + Y-fork) at angles 0/72/144/216/288, axon line. Stroke `#6655AA` at rest. When node active ≥ 2: dendrites switch to `#00C2C7`, body gets inner radial gradient. When ≥ 3: group scales to 1.15 (300ms CSS transition), dendrite groups translated outward 4px.
  - Edge styles per level: hidden / dashed muted / teal solid / teal pulsing (CSS `slowPulse` keyframe) / teal glowing with traveling gold dot. Traveling dot is a `<circle r=4 fill=#FFD166>` with child `<animateMotion dur="1.2s" repeatCount="indefinite" path="M x1 y1 L x2 y2">`.
- **Background**: right column bg interpolates `#1A0A3B → #0D2B3E` linearly over 0–12 total connections.
- **Onboarding hint**: pulsing gold arrow + tooltip pointing at edge `h-0-0`, dismissed permanently on first click (local `hintDismissed` state).
- **Celebration banner**: when (count of connections at level ≥ 2) ≥ 6, slide-down teal banner appears once; auto-dismiss in 4s; then coral Next button fades in (300ms) below the right column, calling `onSubNext()`.

## Stage 2B details

**Layout**: single column max-w 640px, centered.
- Title (teal 22px centered) + body paragraphs (white 16px, max-w 560px) with ES/EN copy.
- Comparison: two `<BrainScanner size="medium">` side-by-side with a teal `→` between, zones spec per prompt (left: Z1 dim, Z2 resting, Z3 resting, Z4 dim; right: all glowing). Stagger fade-in (300ms delays) via inline `animationDelay` on `fade-in` class.
- Takeaway card: rounded-14 border `#00C2C7` bg `#0D2040` p-24 max-w-480 centered, bold white 16px centered.
- Coral "Siguiente / Next →" appears immediately (uses existing `NextButton`), calls `onNext` from props.

## Transition between 2A and 2B

In `Stage2.tsx` wrapper, manage `phase: 'in' | 'out'` and target sub-stage. On `onSubNext`: set phase `out` (400ms), wait 200ms, swap sub-stage, set phase `in` (400ms). Apply opacity transitions via inline style/class.

## Non-technical summary

Stage 2 now has two screens. The first keeps just the city analogy and replaces the emoji grid with a smaller, hand-drawn-looking simulation: actual building shapes you click to upgrade roads, and a mirrored panel of detailed neurons that light up and pulse as the roads grow. Once you've upgraded enough roads, a celebration appears and you advance. The second screen is a calm reading moment that introduces the word "neuroplasticity," shows a before/after brain comparison, and ends with a highlighted takeaway card and a Next button. Everything else in the explorable stays exactly the same.