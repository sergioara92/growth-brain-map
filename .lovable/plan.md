## Stage 2A — visible roads, working Next button, larger desktop sizes

### `src/components/explorable/Stage2A.tsx`
- Grid: `SPACING` 100 → 116, `PAD` 50 → 58 (footprint ~348×348).
- Level 0 connection style: solid `#3D2F66` width 4, no dasharray (visible "unbuilt road").
- Building SVG: base 24×28 → 30×34, windows scaled proportionally, translate offset adjusted.
- Neuron SVG: body radius 16 → 18, dendrite arm length 22 → 26, axon 18 → 22.
- Left column title: add `md:text-[26px]` (keeps 22px mobile).
- Body paragraphs: `fontSize` 16 → 17, `maxWidth` 380 → 420.
- Progress label: 16px, more top margin.
- Next button: render from start in the left column. Disabled until `level2plus >= 4`. Pulses once when it transitions to enabled.

### `src/components/explorable/Stage2B.tsx`
- Title: add `md:text-[26px]`.
- Body `fontSize` 16 → 17.

No other files touched. All ES/EN copy, animations, banner, particle effects, divider, BrainScanner, other stages remain unchanged.