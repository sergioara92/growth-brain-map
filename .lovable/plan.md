# Stage 3 redesign: "Pick a challenge"

Goal: fit everything on one screen (no scrolling), instructions + choices on the left, a single brain visualization on the right showing a small brain nested inside a bigger brain.

## Layout (`src/components/explorable/Stage3.tsx`)

Two-column grid that fills the viewport without scroll:

```text
+----------------------------------------------------+
| h2: Your turn — pick a challenge                   |
+-------------------------+--------------------------+
| LEFT (instructions +    | RIGHT (nested brain)     |
|   choices)              |                          |
|                         |   ___________            |
| • Intro line            |  /           \           |
| • "What to do" box      | |  big brain  |          |
|                         | |   ______    |          |
| [Practice exercises]    | |  /  sm  \   |          |
| [The hard problem]      | | | brain  |  |          |
|                         | |  \______/   |          |
| reflection (after pick) |  \___________/           |
| Next button             |   caption                |
+-------------------------+--------------------------+
```

- Outer container: `h-[calc(100vh-160px)] grid md:grid-cols-2 gap-6 px-6 py-4` so it never overflows. Inner columns use `min-h-0` and condensed text sizes.
- Trim copy and paddings so left column fits without scrolling at typical heights.
- Stack to single column on small widths (mobile only).

## Choice interaction

- Two buttons stacked vertically on the left (compact). Selecting one sets `choice` and immediately lights the corresponding brain (no 1s delay before reflection — show reflection text right under the buttons).
- Next button enabled after a choice is made.

## Brain visualization (right column)

One composite SVG, no stacking of two separate scanners:
- Outer "big" brain silhouette (the bigger brain with many connections).
- Inner "small" brain silhouette drawn inside it, scaled down and centered.
- Both drawn dim/outline by default.
- On `choice === "easy"`: the **small inner brain** lights up with a few connections (4 nodes, 2–3 links).
- On `choice === "hard"`: the **big outer brain** lights up with many more connections (8–10 nodes spread across the silhouette, ~10–12 links forming a dense network). The small brain dims further.
- Caption under the SVG changes based on choice.

Implementation: build the composite inline in `Stage3.tsx` as a single `<svg viewBox="0 0 320 280">` rather than reusing `BrainScanner` (which is a fixed 4-zone layout). Define two node arrays (`SMALL_NODES` ~4 points, `BIG_NODES` ~8–10 points) and corresponding link arrays. Render outline paths always; render nodes + links with opacity driven by `choice`. Reuse the existing `pulseGlow` animation and teal color `#00C2C7`.

`BrainScanner.tsx` is not modified.

## Copy

Keep current ES/EN strings for title, intro, "what to do", and the two option labels/descriptions. Shorten the reflection lines slightly so they fit without scroll. Add new captions for the nested brain:
- default: "Your brain is ready. Make a choice." / "Tu cerebro está listo. Elegí."
- easy: "Small brain, few new connections." / "Cerebro pequeño, pocas conexiones nuevas."
- hard: "Bigger brain, many new connections." / "Cerebro más grande, muchas conexiones nuevas."

## Out of scope

No changes to other stages, `BrainScanner`, `Explorable` wiring, or i18n infrastructure beyond adding the new caption strings inline via `t()`.
