## Plan

Two small UI fixes in the Explorable component:

### 1. Move "Next" button to the right of "Verify" in Stage 5

In `src/components/explorable/Stage5.tsx`, the "Next" button currently appears in its own centered row below the "Verify" button after all cards are correctly placed.

Change the layout so both buttons sit in the same row: "Verify" on the left, "Next →" on the right, centered as a pair.

### 2. Split the sidebar label "Atribuciones del fracaso" into two lines

The SVG sidebar in `src/components/explorable/ProgressBar.tsx` cuts off the long label for the 3c neuron.

- Update `stageLabels` in `src/components/explorable/i18n.ts` so the Spanish string is `"Atribuciones\ndel fracaso"` and the English string is `"Attributions\nof failure"`.
- Update the SVG `<text>` label renderer in `ProgressBar.tsx` to split on `\n` and emit multiple `<tspan>` elements with a `1.2em` line-height offset, so the text wraps cleanly without being truncated.

No other files or business logic change.