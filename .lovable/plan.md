## Goal

Turn the progress bar at the top of the explorable into a visual replica of the causal neuron diagram. Instead of 7 neurons in a straight line, the network mirrors the conceptual flow students are building in their minds:

- 4 neurons in a linear chain (the "what is happening / evidence" arc)
- 1 branching neuron (the "now that you know, how can you change it" bridge)
- 3 parallel neurons spreading out (the three behavioural paths)
- 1 converging final neuron (the closing reflection)

Neurons start dim/off and "turn on" as the student finishes each section, so by the end the full causal diagram is illuminated.

## Mapping stages → neurons

Current app has 7 stages. They map onto the diagram as follows:

```text
 A ── B ── C ── D ── E ──┬── F1 ──┐
                          ├── F2 ──┤── G
                          └── F3 ──┘
```

| Diagram node | Stage | Section title (short)                              |
| ------------ | ----- | -------------------------------------------------- |
| A            | 1     | Do you think you can become smarter?               |
| B            | 2     | Let us know what you think                         |
| C            | 3     | The evidence: how the brain works                  |
| D            | 4     | It's called neuroplasticity                        |
| E (branch)   | 5     | Now that you know, how can you change it           |
| F1 / F2 / F3 | 6     | Three behavioural paths (the 3 columns in Stage5)  |
| G (converge) | 7     | Now tell us what you think                         |

The three F-neurons are a visual representation of the three columns inside stage 6; the student still advances through one logical stage, but the bar shows all three lit at once when that stage is active/done.

## What changes

Only the progress bar. No stage content, no routing, no state changes elsewhere.

### `src/components/explorable/ProgressBar.tsx` (rewrite)

- Replace the equally-spaced 7-soma row with a hand-laid topology in a wider SVG viewBox (e.g. `0 0 1400 200`) that fits A–D on the left, the E fan in the middle, F1/F2/F3 stacked vertically, and G on the right.
- Hard-coded coordinates for each of the 9 visual neurons (A, B, C, D, E, F1, F2, F3, G).
- Axon paths:
  - Straight curved connectors A→B→C→D→E (linear chain).
  - Three diverging curves E→F1, E→F2, E→F3 (fan-out).
  - Three converging curves F1→G, F2→G, F3→G.
- State per neuron driven by current `stage`:
  - `done` (stage already passed) → fully lit soma, solid teal axons leaving it.
  - `active` (current stage) → glowing soma + animated synaptic pulse on the incoming axon, matching the existing `animateMotion` pattern.
  - `upcoming` → dim outline, dashed axons.
  - F1/F2/F3 share the state of stage 6 — they light up together (and the three diverging axons from E animate together).
  - G's three incoming axons go solid once stage 7 is reached.
- Each soma keeps the current visual language (radial gradient, cyan rim, synapse dots around the rim, decorative dendrites) so it stays consistent with the existing aesthetic and the uploaded reference SVG.
- Stage number stays inside each soma (1–7). For F1/F2/F3 we use `6a / 6b / 6c` labels or short column names from `i18n` so students can still read them.
- Title label below each soma stays on desktop, hidden on mobile (same `hidden-on-mobile` rule).
- Bar height grows to fit the vertical fan: roughly `h-[140px] sm:h-[180px]`. `Explorable.tsx` `<main>` top padding bumps to `pt-[150px] sm:pt-[200px]` so titles stay clear of the bar.

### `src/components/explorable/Explorable.tsx`

- Only adjustment: increase top padding on `<main>` to clear the taller bar (no logic changes).

### `src/components/explorable/i18n.ts`

- Add labels for the three parallel paths (e.g. `path1`, `path2`, `path3`) in ES + EN so F1/F2/F3 can show meaningful sub-titles. Names will mirror the three columns already used in Stage5 (`útil`, `no útil`, `sin estrategia` / English equivalents).

## Out of scope

- No changes to stage components, copy, routing, beliefs, or scoring.
- No animation on the stage content itself — only the progress bar animates/lights up.
- No new dependencies.

## Open question (not blocking the plan)

The current Stage 6 (`Stage5.tsx`) treats the three columns as part of a single screen. The plan represents them as three parallel neurons that all share the "active" state when stage 6 is current. If you'd rather have students step through each path one-by-one (turning F1, then F2, then F3 on individually), say the word and I'll split stage 6 into 6a/6b/6c stages instead.
