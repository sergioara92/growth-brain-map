# Stage 2A — "Your brain works like a city"

File: `src/components/explorable/Stage2A.tsx`

Goal: make the activity self-explanatory. Tell the student exactly what to do, how many clicks per street, and how many highways are needed to advance.

Changes:
- Add an explicit instruction block under the existing paragraphs:
  - "Click each street **4 times** to pave it into a highway."
  - "Build at least **4 highways** to continue."
- Replace the current dynamic `progressLabel` with a progress line that shows live counters against goals:
  - "Highways built: X / 4"
  - "Keep clicking the same street to upgrade it: dirt → paved → wide → highway."
- Update the bottom status line (currently `Streets built: X | Highways: Y`) to include the highway goal: `Streets: X · Highways: Y / 4`.
- Update the initial hint tooltip from "Click a street to start building" to "Click the same street several times to pave it."
- Gate `NextButton` on `highways >= 4` (instead of the current `level2plus < 4`), and add a small helper line under it: "You need 4 highways to continue." that disappears once met.
- Bilingual strings (ES/EN) via the existing `t(lang, ..., ...)` helper.

No layout/visual restructuring of the city/neuron SVGs — only text, counters, hint, and the gating threshold change.

# Stage 3 — Challenge ("hard problem vs. practice exercises")

File: `src/components/explorable/Stage3.tsx` (BrainScanner stays as-is and is reused).

Goal: center the whole stage in one column, make the instructions explicit, and show the two possible brains stacked so the student can compare easy vs. hard.

Layout changes:
- Replace the current two-column grid with a single centered column (`max-w-2xl mx-auto text-center`). Order, top to bottom:
  1. Section title (new): "Your turn: pick a challenge".
  2. Intro paragraph (kept, centered).
  3. Instruction block (new): "Read both options. Pick the one you'd actually do. Then watch what happens to your brain."
  4. The teacher prompt card (centered, full width of the column).
  5. The two option buttons in a centered 2-column grid (same buttons, just centered).
  6. The brain visualization area (see below).
  7. Reflection line (kept, shown after choice).
  8. `NextButton` (kept, centered, appears after a choice).

Brain visualization (replaces the single `BrainScanner` on the right):
- Render TWO brains in the same centered slot, stacked vertically with the "hard" brain drawn ON TOP of the "easy" brain so the size/connection contrast is obvious:
  - Bottom brain = "easy" choice result: **medium-sized**, **few connections** (BrainScanner zones `Z1: dim, Z2: dim, Z3: resting, Z4: resting`, size `medium`).
  - Top brain = "hard" choice result: **larger** than the easy one, **many more glowing connections** (zones `Z1: glowing, Z2: glowing, Z3: active, Z4: active`, size `large`, with extra emphasis — see "Brain size differentiation" below).
- Each brain gets a caption directly under it: "Practice exercises → medium brain, few new connections" / "The hard problem → bigger brain, many new connections".
- Before any choice: both brains shown dimmed (≈30% opacity) as a preview of "these are your two possible outcomes".
- After choosing "easy": the easy brain becomes fully opaque and highlighted; the hard brain dims further.
- After choosing "hard": the hard brain becomes fully opaque and highlighted; the easy brain dims further.

Brain size differentiation:
- `BrainScanner` already supports `size="medium" | "large"`. Use `medium` for the easy brain and `large` for the hard brain so the hard-choice brain is visually bigger.
- Wrap each brain in a `<div>` that controls opacity transitions (300ms) based on `choice`.

Copy additions (ES/EN, via `t`):
- Title: "Tu turno: elegí un desafío" / "Your turn: pick a challenge".
- Instructions: "Leé las dos opciones. Elegí la que realmente harías. Después mirá qué le pasa a tu cerebro." / "Read both options. Pick the one you'd actually do. Then watch what happens to your brain."
- Easy caption: "Ejercicios de práctica → cerebro mediano, pocas conexiones nuevas." / "Practice exercises → medium brain, few new connections."
- Hard caption: "El problema difícil → cerebro más grande, muchas conexiones nuevas." / "The hard problem → bigger brain, many more new connections."

# Out of scope

- No changes to `Stage4`, `Stage5`, `Stage6`, `ProgressBar`, `BrainScanner` internals, or `Explorable` wiring.
- No new dependencies; uses existing `BrainScanner`, `NextButton`, `t`, and Tailwind utilities.
