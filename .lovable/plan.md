## Goal

Replace the current pill-style `ProgressBar` at the top of the explorable with a horizontal **chain of neurons** — one neuron per stage (7 total), each containing its number and title, connected to the next via glowing axon-like lines with traveling synapse pulses. Visual reference: the uploaded neuron image (deep navy background, electric-blue soma with bright cyan synapse dots, branching dendrites/axons).

## What changes

**Single file rewrite:** `src/components/explorable/ProgressBar.tsx`

Everything else stays the same — `Explorable.tsx` keeps calling `<ProgressBar stage={s} lang={lang} />`, `stageLabels` is unchanged, the existing color tokens (`--teal`, `--bg`, `--gold`) are reused so it blends with the rest of the explorable.

## Design

```text
 ╭───╮        ╭───╮        ╭───╮              ╭───╮
( 1 )═══●═══( 2 )═══●═══( 3 )═══ … ═══( 7 )
 ╰───╯        ╰───╯        ╰───╯              ╰───╯
  ¿Qué      Así funciona  ¿Cómo                ¿Y ahora?
  creo?     el cerebro    cambiar?
```

- **Neuron soma**: SVG `<circle>` with a radial gradient (deep `#1A0A3B` core → electric blue `#3B5BFF` rim), rimmed with bright cyan synapse dots (small filled circles around the perimeter). Number rendered as `<text>` centered inside (bold, white).
- **Dendrites**: 3–4 short irregular `<path>` strokes emerging from each soma at angles that don't intersect the connector — purely decorative, gives the "neuron" silhouette from the reference image.
- **Axon connectors**: a single curved `<path>` between consecutive somas, stroked in teal with a soft glow (`filter: drop-shadow`). For completed stages, the connector is solid bright teal; upcoming, it's dim `--stage-upcoming` dashed.
- **Synapse pulse**: a small cyan circle animated along the active connector (CSS `@keyframes` translating `cx` or using `<animateMotion>`) to signal "current signal traveling here."
- **Title labels**: rendered as `<text>` below each soma (hidden on small screens, like today), color follows active/done/upcoming state (teal / white / muted).

### States (mapped from existing logic)
- `idx < stage` → **done**: soma filled bright blue, number white, label white, outgoing connector solid teal.
- `idx === stage` → **active**: soma glows (larger drop-shadow, animated synapse dots), label teal, pulse animates along *incoming* connector.
- `idx > stage` → **upcoming**: soma dim outline only, number/label muted, connector dashed.

### Layout & responsiveness
- Single full-width SVG with `viewBox="0 0 1200 140"` + `preserveAspectRatio="xMidYMid meet"` so it scales cleanly on desktop and mobile.
- Container keeps the existing `fixed top-0` + backdrop-blur shell so page offset doesn't shift.
- On `< md` screens, hide the title `<text>` elements (keep numbers + neurons) so 7 nodes still fit.
- `prefers-reduced-motion`: disable the synapse-pulse animation.

## Out of scope

- No changes to stage content, navigation logic, `Explorable.tsx`, or `i18n.ts`.
- The uploaded reference image is used only as visual inspiration — not embedded as an `<img>` or background.
- No new dependencies; pure inline SVG + CSS.
