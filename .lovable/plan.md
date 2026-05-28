## Goal

Make the brain on the first page (Stage1 hero) feel alive — overlay animated "supernova" lights that pulse and travel along neural pathways, evoking neurons firing inside the brain. The existing static `brain-hero.png` stays as the base; the animation sits on top.

## Approach

Build a new presentational component `BrainSupernova` (`src/components/explorable/BrainSupernova.tsx`) that renders the brain image plus an SVG overlay of animated light particles. No new dependencies — pure inline SVG + CSS keyframes (respects `prefers-reduced-motion`).

### What renders

```
┌─ relative container (size of brain) ─┐
│  <img brain-hero.png />              │  ← base layer
│  <svg absolute inset-0>              │  ← overlay
│    radial glow halos (3, slow drift) │
│    ~14 supernova particles           │
│    ~6 travelling pulses on paths     │
│  </svg>                              │
└──────────────────────────────────────┘
```

### Supernova particle (×~14, scattered across brain area)

Each particle = 3 concentric SVG circles sharing one center:
- Bright core (r 2 → 3, white/teal)
- Mid halo (r 4 → 14, teal `#22d3ee` or magenta `#e879f9`, opacity 0.6 → 0)
- Outer shockwave (r 8 → 28, same hue, opacity 0.3 → 0, stroke only)

Animated via a single `@keyframes supernova` (3.5–6s, infinite) that scales radii and fades opacity, producing a "burst → fade" cycle. Each particle gets a random `animation-delay` (0–5s) and `animation-duration` (3.5–6s) so they fire asynchronously. Colors alternate teal / magenta / cyan-white to match the reference image's palette.

Positions are hand-placed across the brain silhouette (cortex curves, frontal lobe, temporal lobe) — roughly 14 `{cx, cy, hue, delay, dur}` entries in a const array.

### Travelling pulses (×~6)

Short curved SVG `<path>` segments (invisible stroke) following neural-pathway-like curves between supernova points. A small bright dot (`<circle>`) animates along each path using SMIL `<animateMotion>` with `dur="2.5s"` to `4s`, `repeatCount="indefinite"`, staggered `begin`. This reads as a signal traveling neuron-to-neuron.

### Ambient glow

3 large soft radial gradients (`<radialGradient>` + `<circle>`) drift in opacity (`@keyframes drift-glow` 8–12s) behind the particles to give the brain a "breathing" inner light.

### Stage1.tsx changes

Replace lines 107–115 with `<BrainSupernova alt={...} />`. The wrapper keeps the existing `stage1-brain-wrap` entrance animation and the same `max-h-[42vh] md:max-h-[68vh]` sizing. The component internally wraps the `<img>` in `relative` and absolutely positions the overlay SVG with `viewBox="0 0 1024 1024"` so coordinates match the source image.

## Accessibility

- The image keeps its `alt`.
- The SVG overlay has `aria-hidden="true"`.
- A `@media (prefers-reduced-motion: reduce)` block disables the supernova + travel animations (particles still render statically as soft dots).

## What does NOT change

- Image asset (`brain-hero.png`) — reused as-is.
- All copy, layout, headline, CTA, beliefs flow, other stages.
- No new npm packages.

## Files touched

- **new**: `src/components/explorable/BrainSupernova.tsx`
- **edit**: `src/components/explorable/Stage1.tsx` (swap the `<img>` for `<BrainSupernova />`, drop now-unused `brainHero` import)
