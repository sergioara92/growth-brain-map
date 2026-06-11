## Why scrolling still happens

Two compounding issues in Stage 2A:

1. **Vertical budget is wrong.** `<main>` in `Explorable.tsx` has `pt-[190px] pb-12` plus a progress bar — that's roughly 250 px of chrome above the stage content. Stage 2A's wrapper uses `h-[calc(100vh-140px)]`, which assumes only 140 px of chrome. On a typical laptop (~887 px tall) that overshoots the viewport by ~100 px, forcing a scrollbar.
2. **Fixed-size SVGs.** Both the City and Neurons diagrams use `width={SIZE}` / `height={SIZE}` with `SIZE = 400`. That hard-pins each diagram to 400 px tall regardless of viewport, and on top of a heading + 3 paragraphs + a "How to play" box + a progress label + the Next button, it doesn't fit.

## Fix

Presentation-only changes to `src/components/explorable/Stage2A.tsx`. No copy or logic changes.

### 1. Correct the height budget

- Replace `h-[calc(100vh-140px)] overflow-hidden` with `h-[calc(100dvh-240px)] min-h-[520px] overflow-hidden` on the outer grid wrapper.
  - `100dvh` uses the dynamic viewport so mobile browser chrome doesn't push content offscreen.
  - `-240px` accounts for the `pt-[190px]`, the progress-bar row, and `pb-12`.
  - `min-h-[520px]` keeps it usable on very short windows (the diagrams stay legible; only then a scroll is acceptable).

### 2. Make the SVG diagrams shrink to fit

Currently each SVG renders at a fixed 400×400. Change both the City and the Neurons SVGs to scale with the available column height:

- Wrap each SVG in a flex container with `flex-1 min-h-0` so the SIM column hands the SVGs whatever height remains.
- Set `width="100%"` and `height="100%"` on the `<svg>` elements, keep their existing `viewBox`, and add `preserveAspectRatio="xMidYMid meet"`.
- Remove the fixed `style={{ width: SIZE, height: SIZE }}` on the wrapper `<div>` around the City SVG; replace with `className="relative w-full h-full max-w-[400px] aspect-square mx-auto"`.
- The particle/hint overlays inside the City wrapper continue to use absolute positioning in the same coordinate space — since the wrapper is now `aspect-square`, the math holds.

Result: on a tall window the diagrams render close to their natural 400 px; on a short window they shrink in lockstep with the left column, instead of overflowing.

### 3. Tighten the left column one more notch

So the text column never out-grows the right column on short screens:

- Heading: `text-[20px] md:text-[22px]` (down from 22/26).
- Body paragraphs: `fontSize: 13.5` (down from 14.5), `space-y-1.5` (down from `space-y-2`).
- "Cómo jugar" card: `p-2.5 text-[12.5px]` (down from `p-3 text-[13px]`), `mt-2` (down from `mt-3`).
- Progress label `text-[13px]`, counter `text-[11px]`, `mt-1.5`.
- Next button block `mt-2`, helper line `text-[11px]`.

### 4. Make the SIM column itself flex-fit

- The SIM container becomes `flex flex-col min-h-0 h-full p-3`.
- Inside, the `grid grid-cols-1 xl:grid-cols-2 gap-4` becomes `flex-1 min-h-0`, and each column inside that grid uses `flex flex-col items-center min-h-0`, so the SVGs receive a concrete height to fill via flex.

## Out of scope
- No changes to `Explorable.tsx`'s padding (would affect every stage).
- No changes to `Stage2.tsx`, `Stage2B.tsx`, `Stage3.tsx`, or any other file.
- No copy / translation changes; no logic, particle, or interaction changes; SVG drawing code is untouched aside from the `width/height/preserveAspectRatio` attributes.
