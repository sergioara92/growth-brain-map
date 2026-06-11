## Goal

Split the current Stage 5 (Attributions of failure) into two screens so the user no longer has to scroll to reach the brain reveal:

- **Screen A** — the existing sorting exercise + "Verificar / Check". When all placements are correct (or revealed after 3 tries), a "Siguiente →" button appears that advances to Screen B. The narrative line and the three stacked brains are removed from this screen.
- **Screen B** — a new, compact interactive screen with the message and three colored buttons that swap a single brain visualization.

## Screen B behavior

1. Narrative line at top: *"Las estrategias útiles activan más regiones de tu cerebro. El esfuerzo sin estrategia activa pocas. Y las actitudes de rendición las apagan."* / English equivalent.
2. Instruction line: *"Tocá cada botón para ver qué pasa con tu cerebro."* / *"Tap each button to see what happens with your brain."*
3. Row of three pill buttons, centered:
   - 🟢 Green — *Útil / Helpful*
   - 🟡 Yellow — *Sin estrategia / No strategy*
   - 🔴 Red — *No útil / Not helpful*
   The active button gets a ring/raised state; unvisited buttons gently pulse.
4. Single centered `BrainScanner` (size `medium`) that updates based on the active button:
   - Green → all 4 zones `glowing`, all links shown (biggest, many connections)
   - Yellow → 2 zones `dim`, 2 `resting`, faint/few links (medium, some connections)
   - Red → all `resting`, no links (small, no connections)
5. A short caption under the brain echoing the button label.
6. "Siguiente →" appears only after the user has clicked all three buttons at least once, and advances to Stage 6 (*Now what?*).

## Layout / sizing

- Whole Screen B fits in `100dvh - 60px` at 1257×887 with no scrolling: title (~2 lines), instruction (~1 line), buttons row (~48px), brain viewer (~240px), caption (~24px), Next button.

## Files

- `src/components/explorable/Explorable.tsx`
  - Bump max stage from 7 to 8 in `next()`.
  - Insert a new stage between current Stage5 and Stage6: `stage === 6` → `Stage5` (sorting), `stage === 7` → new `Stage5Brains`, `stage === 8` → `Stage6`.
  - Add local state for which color buttons have been visited (or keep that inside the new component).
- `src/components/explorable/Stage5.tsx`
  - Remove the narrative + 3-brain block inside `{canShowNext && (...)}`.
  - Replace with just a "Siguiente →" `NextButton` that calls `onNext`.
- `src/components/explorable/Stage5Brains.tsx` *(new)*
  - Implements Screen B as described above. Props: `{ lang, onNext }`. Internal state: `active: "green"|"yellow"|"red"|null`, `visited: Set<string>`.
- `src/components/explorable/ProgressBar.tsx`
  - Update the mapping so both the sorting screen and the new brains screen highlight the *3c — Attributions of failure* neuron as active (no new neuron added; the sidebar narrative stays at 7 neurons).
- `src/components/explorable/i18n.ts`
  - Add the new strings (instruction line, three button labels, three captions). No changes to `stageLabels` / `pathLabels`.

## Out of scope

- No changes to BrainScanner internals, Stage1–4, Stage6, drag/drop verification logic, or sidebar narrative structure.
- No copy changes to existing strings beyond what's listed.
