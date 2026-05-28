# Redesign Stage 1 intro — neon neuron hero

## Scope
Only `src/components/explorable/Stage1.tsx`. No other files touched.

## Copy changes
- Delete the line: `"Antes de seguir, queremos saber qué pensás vos."` / `"Before we continue, we want to know what you think."` (intro paragraph under the headline).
- Fix remaining voseo on the slider screen: `pensás` → `piensas`.

## Visual overhaul (pre-slider intro view)

Replace the plain centered text with a hero composition built from inline SVG + CSS animations.

### 1. Hero neuron mark (~340×340 SVG, centered)
- Deep navy soma (layered concentric circles, radial gradient core).
- Tri-color dendrites radiating outward: teal `#00C2C7`, coral `#FF6B6B`, magenta `#C77DFF`.
- `feGaussianBlur` + `feMerge` glow filter applied to dendrite strokes.
- Pulsing synaptic dots at dendrite tips using SMIL `<animate>` (opacity + r oscillating, 2–3s loop, staggered).

### 2. Ambient background dots
- ~24 small circles (1.5px, teal/coral, 25–40% opacity) scattered in a wider radius around the neuron.
- Each blinks via CSS `@keyframes` (3–5s loop, random delays, staggered).

### 3. Question headline
- 2.5rem (md: 3.25rem), weight 700, max-width 600px, white with soft teal `text-shadow` glow.

### 4. Ghost CTA button
- Thin teal `#00C2C7` border, transparent fill.
- Hover: soft outer glow + slight scale.

### Motion timing (all respect `prefers-reduced-motion`)
- Hero mark: fade + scale-in, 600ms.
- Background dots: stagger-in over 1.2s.
- Headline: fade-up 400ms after hero.
- Button: fade-in 800ms after hero.

## What does NOT change
- Slider screen (only the voseo fix).
- All other stages, BrainScanner, language toggle, progress bar.
- Color tokens in `src/styles.css` (the new neon accents are inline SVG fills/strokes scoped to this hero only).
