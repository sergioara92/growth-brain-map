## Goal
Make Stage2A fit within `100dvh` at 1257×887 (and similar) with no vertical scroll. Today the `aspect-square` SVG panels for City/Neurons force ~620px tall blocks, pushing things off-screen. Tighten text, reduce sim padding, and let the SVG panels shrink to available height.

## Changes (only `src/components/explorable/Stage2A.tsx`)

### 1. Container
- `h-[calc(100dvh-60px)] min-h-[560px]` → `h-[calc(100dvh-72px)] min-h-[520px]`
- `gap-6` → `gap-4`, `px-6` → `px-4`
- Left column ratio `0.85fr_1.6fr` → `0.8fr_1.7fr` (give sim more width so squares shrink less vertically)

### 2. Left text column (tighten)
- H2: `text-[20px] md:text-[22px]` → `text-[18px] md:text-[20px]`
- Body paragraphs: `fontSize 13.5 / lineHeight 1.45 / space-y-1.5` → `fontSize 12.5 / lineHeight 1.4 / space-y-1`
- "How to play" card: `p-2.5 text-[12.5px]` → `p-2 text-[11.5px]`, `mb-1` → `mb-0.5`
- Progress label: `text-[13px] mt-1.5` → `text-[12px] mt-1`
- Highways counter + helper: `text-[11px]` → `text-[10.5px]`
- Next button wrapper `mt-2` → `mt-1.5`

### 3. Sim panel (City + Neurons)
- Outer panel padding `p-3` → `p-2`
- Inner grid `gap-4` → `gap-3`
- Section labels `text-[12px] mb-1` → `text-[11px] mb-0.5`
- **Key fix**: drop `aspect-square` on both SVG wrappers and replace `max-w-[400px]` with `max-w-[360px]`. Use `flex-1 min-h-0` only; SVGs use `preserveAspectRatio="xMidYMid meet"` so they scale to the smaller of width/height without forcing a square box. This lets them shrink to ~420px tall on a 887px viewport instead of 400px wide × 400px tall regardless of available height.
- Hint arrow callout `width: 180` → `width: 150`, `text-[11px]` → `text-[10px]`, `text-2xl` arrow → `text-xl`

### 4. Out of scope
No copy changes, no logic changes, no changes to other stages, sidebar, or i18n.

## Verification
After edits, view preview at 1257×887 and confirm Next button is visible without scrolling and both City/Neurons squares remain legible.
