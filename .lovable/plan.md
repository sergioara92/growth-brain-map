# Stage 2A — desktop layout

## Scope
Only `src/components/explorable/Stage2A.tsx`.

## Problems
- Right panel stacks the City and the Neurons vertically at a tiny ~348px size — wastes the ~700px-wide right column and forces the page to feel cramped + scrollable.
- Left text column is narrow and short; the right side dominates with empty bottom space below the neurons.

## Changes

### 1. Bigger grid art
Bump grid constants so each SVG fills more space:
- `SPACING`: 116 → 140
- `PAD`: 58 → 60
- New `SIZE` = 60·2 + 2·140 = 400px

### 2. Side-by-side City + Neurons
Restructure the right panel to show both visualizations next to each other instead of stacked.

```text
+----------------------+-----------------------------+
|  Headline            |  Ciudad         Neuronas    |
|  Text paragraphs     |  [city svg]     [neurons]   |
|  Progress label      |                             |
|  [Siguiente]         |  Calles: N | Autopistas: N  |
+----------------------+-----------------------------+
```

- Outer: `max-w-7xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] gap-10 items-center min-h-[calc(100vh-100px)]`.
- Right panel: keep the rounded panel + animated `bg` color, but inner layout becomes `grid grid-cols-1 xl:grid-cols-2 gap-6 items-start`. Each half has a small caption header (`Ciudad` / `Neuronas`) above its SVG.
- Delete the horizontal divider with "Lo mismo, visto de dos formas" — the side-by-side framing makes it redundant. (Below md, the two SVGs stack and we keep a single inline caption.)
- Move the "Calles construidas / Autopistas" counter to span the full panel width below both views.

### 3. Hint anchor
The onboarding hint absolutely-positions over the city SVG using raw pixel coordinates. Keep the city SVG container at fixed `width/height: SIZE` (not stretched) so those coordinates stay valid. Center each SVG inside its column with `mx-auto`.

### 4. Text column polish
- Headline `text-[28px] md:text-[32px]`.
- Body `fontSize: 18, lineHeight: 1.65`, drop `maxWidth: 420` (let it fill the column up to ~480px).
- Progress label `mt-5`; Next button block `mt-7`.

### 5. Banner positioning
The success banner currently sits at the top of the right panel. Keep it; it will span the full width of the inner grid (`absolute top-0 left-0 right-0 z-10`).

## What does NOT change
- All copy strings, animation behavior, click-to-build logic, particles, level thresholds, `cityLineProps`, neuron rendering, color tokens.
- Other stages.
