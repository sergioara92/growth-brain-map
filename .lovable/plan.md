## Plan

In Stage 5B (Atribuciones del fracaso, second screen), the brain currently renders with the same `medium` size for all three colors. Make each color show a distinctly sized brain with the requested node counts.

### Changes

**`src/components/explorable/Stage5Brains.tsx`** — replace the single `<BrainScanner size="medium" zones={...} />` with a new local renderer driven by the active color:

- **Green (Útil)** → large brain, **9 nodes** glowing teal, fully interconnected (every node linked to every other node).
- **Yellow (Sin estrategia)** → medium brain, **4 nodes** dim/teal, connected to each other (4-node mesh).
- **Red (No útil)** → small brain, **1 grey resting node**, no links.

Implementation details:
- Add a small inline `<BrainShape>`-style SVG (reuse the same stylized brain path from `BrainScanner.tsx`) sized per color: small ≈ 140×112, medium ≈ 220×176, large ≈ 320×256.
- Place nodes inside the brain silhouette using fixed layouts per count:
  - 1 node: centered.
  - 4 nodes: a small diamond (top, right, bottom, left) inside the silhouette.
  - 9 nodes: 3×3 grid clipped to the brain area.
- Render all pairwise `<line>` connections between nodes (full mesh) using the teal stroke for green/yellow; no lines for red.
- Node visual styling:
  - Green nodes: teal fill with glow (matches existing `glowing` style).
  - Yellow nodes: teal fill, mid opacity, lighter glow.
  - Red node: grey (`#666677`), no glow.
- Keep the existing pulse animation only on the green (glowing) state.
- Keep the caption text and color logic the same; only the brain visual block changes.

**No changes** to `BrainScanner.tsx` itself (it stays available for other stages), to button row, instructions, visited tracking, NextButton gating, or i18n.

### Layout

The new visual block stays inside the same `flex-1 ... justify-center` container so the screen still fits without scroll at 1257×887.