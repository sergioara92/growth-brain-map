## Goal

Replace the horizontal neuron-graph top bar with a vertical neuron-graph on the left side, restructured into 5 logical neurons (with neuron 3 branching into three sub-neurons). Reclaim the ~190 px of top space the old bar consumed.

## New structure

```text
Neuron 1 — Beliefs                       (stage 1)
   │
Neuron 2 — This is how the brain         (stage 2)
   │       actually works
   │
Neuron 3 — How to change it              (stage 3)
   │
   ├─ 3a — The challenge                 (stage 4)
   ├─ 3b — The mistake                   (stage 5)
   └─ 3c — Attributions of failure       (stage 6)
   │
Final — Now what?                        (stage 7)
```

Stage numbers in `Explorable.tsx` are unchanged — only the visual grouping and label of stage 6 ("Las reacciones" → "Attributions of failure" / "Atribuciones del fracaso") shifts to fit the new narrative.

## Files

### 1. `src/components/explorable/ProgressBar.tsx` — rewrite as a vertical SVG sidebar

- Container becomes `fixed left-0 top-0 bottom-0 z-30 w-[220px] bg-[color:var(--bg)]/85 backdrop-blur border-r border-[color:var(--stage-upcoming)] overflow-y-auto`.
- SVG uses a tall `viewBox` (e.g. `200 × 720`) with neurons stacked vertically:
  - Neuron 1 at top, Neuron 2 below, Neuron 3 below.
  - From Neuron 3, three short axons branch right-down to 3a/3b/3c arranged as a vertical sub-cluster slightly indented.
  - Three axons converge from 3a/3b/3c into the Final neuron at the bottom.
- Label placement: label sits to the right of each soma (`textAnchor="start"`, `x = soma_x + soma_r + 10`), not below. Sub-neurons indented further right with smaller soma radius and smaller font.
- Active/done/upcoming visual treatment (gradients, glow, pulsing axons, synapse dots, dendrites) preserved from the current implementation.
- Below `768px` viewport width: collapse the sidebar to an icon strip (`w-14`, hide labels) and reveal labels via `<title>` tooltips. Keep it always visible — no toggle button for now.

### 2. `src/components/explorable/Explorable.tsx` — adjust layout

- Remove the `pt-[130px] sm:pt-[190px] pb-12` padding from `<main>`; replace with `pl-[220px] md:pl-[220px] pl-[56px] pb-6 pt-3` (left padding to clear the sidebar, narrower on mobile).
- `LangToggle` stays floating top-right.

### 3. Stage height budgets — relax now that the top bar is gone

Each stage was sized to `100dvh - 240px` to compensate for the old top bar. With the sidebar layout the available height is roughly `100dvh - 40px`. Update in:
- `Stage2A.tsx`: `h-[calc(100dvh-240px)] min-h-[520px]` → `h-[calc(100dvh-60px)] min-h-[560px]`.
- `Stage2B.tsx`: same swap.
- `Stage3.tsx`: `h-[calc(100vh-140px)]` → `h-[calc(100dvh-60px)]`.
- `Stage4.tsx`: same family of values, audit and bump to `100dvh-60px`.
- `max-w-*` containers stay; only the height calc changes. No copy or logic changes.

### 4. `src/components/explorable/i18n.ts` — relabel for the new narrative

`stageLabels` becomes:
```
0: Creencias / Beliefs
1: Así funciona el cerebro / This is how the brain actually works
2: Cómo cambiarlo / How to change it
3: El desafío / The challenge
4: El error / The mistake
5: Atribuciones del fracaso / Attributions of failure
6: ¿Y ahora? / Now what?
```
`pathLabels` is no longer used by the bar (stage 6's three paths were collapsed into a single neuron in the previous design; the new sidebar uses 3a/3b/3c referring to stages 4/5/6 directly). Keep `pathLabels` exported for `Stage5.tsx` which still uses it internally.

## What I need from you

Only a confirmation before I build:

1. **Sidebar always visible, or collapsible?** Default: always visible at 220 px on desktop, 56 px icon-only strip on mobile, no toggle button.
2. **Stage 6 rename**: change the label from "Las reacciones / The reactions" to "Atribuciones del fracaso / Attributions of failure". The Stage 6 *component* copy (the actual screen content) — leave untouched, or also rewrite to match? I'll leave it untouched unless you say otherwise.

If both defaults are fine, reply "go" and I'll implement.

## Out of scope
- No changes to the Stage 6 (`Stage5.tsx`) content.
- No changes to LangToggle or the underlying state machine.
- No new components other than what fits inside the rewritten `ProgressBar.tsx`.
