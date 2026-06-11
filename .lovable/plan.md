# Stage 4 (Mistake section) redesign

Rewrites `src/components/explorable/Stage4.tsx` only. No changes to other stages, `BrainScanner`, `Explorable` wiring, or i18n infrastructure beyond adding new strings via inline `t(lang, ...)` calls.

## Layout (no-scroll, centered)

Mirror Stage 3's pattern:
- Outer: `h-[calc(100vh-160px)] max-w-6xl mx-auto px-4 py-3 grid md:grid-cols-2 gap-6 items-center`
- Condense the intro copy ("You're going to make mistakes." block) into a single compact header above the grid so the two columns fit on one screen at 892×575.

## Left column — interactive problem

- Problem statement: `x² + 5x + 6 = 0` (kept).
- **Answer input**: large, very visible `<input type="text">` (placeholder "x = ?"), teal border, big font. Accepts `-2`, `-3`, `x=-2`, `-2,-3`, etc. Correct if the parsed value(s) include `-2` or `-3`.
- **Verify button** right next to / under the input ("Check answer" / "Verificar"), coral background, equally prominent.
- **Countdown timer**: prominent badge (large mono digits, teal) showing `5…0`. Starts at 5s when stage mounts and after every attempt. When it reaches 0 without a click, it auto-counts as a missed attempt (same as a wrong answer) and resets to 5.
- Each click of Verify (or timer expiry):
  - increments `attempts`
  - resets the timer to 5
  - clears the input
  - shows the same per-attempt message currently in `attemptLabel` (1st…5th attempt strings preserved)
  - shows the same ✗ / ◑ / ✓ icon row
  - shows the "Each attempt releases neurotransmitters…" italic line from attempt ≥ 2
- If the answer is correct, mark success (still counts as an attempt, switches the badge to ✓ and stops the timer).

## Right column — nested triple brain

New inline `TripleNestedBrain` SVG component (same approach as Stage 3's `NestedBrain`), centered in the column:
- **Large** outer brain silhouette: ~12 nodes / 16 links
- **Medium** brain inscribed inside it: ~7 nodes / 9 links
- **Small** brain inscribed inside the medium: ~4 nodes / 3 links
- Default: all three drawn as dim outlines (teal stroke, low opacity), no glow.
- Lighting rule (cumulative, teal `#00C2C7` + `pulseGlow` + drop-shadow):
  - `attempts ≥ 1` → small brain lights up
  - `attempts ≥ 3` → medium brain lights up (small stays lit)
  - `attempts ≥ 5` → large brain lights up (all three lit, strongest glow on large)
- Caption under the SVG: short dynamic label, e.g. "Connections built: N" (kept from current).

## Next button + banner

- Keep the success banner ("This is what real learning feels like…") at `attempts ≥ 5`, repositioned so it doesn't push layout (absolute overlay on the right column).
- Keep `NextButton` appearing at `attempts ≥ 3`, placed in the left column under the messages so it stays in-viewport.

## Strings (added via `t(lang, es, en)`)

- "Tu respuesta" / "Your answer"
- "Verificar" / "Check"
- "Tiempo" / "Time"
- "Se acabó el tiempo — cuenta como intento" / "Time's up — counts as an attempt"

## Out of scope

- No business-logic changes to `Explorable` (still uses `attempts` / `setAttempts` / `onNext` props).
- No changes to `BrainScanner` — Stage 4 stops using it and renders its own nested SVG, like Stage 3 does.
- No new files; everything lives in `Stage4.tsx`.
