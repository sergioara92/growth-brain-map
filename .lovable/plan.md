# Stage 1 beliefs screen — desktop layout

## Scope
Only `src/components/explorable/Stage1.tsx`, the slider screen (the `revealed === true` branch). Intro screen is not touched.

## Problem
The three belief statements stack vertically in a narrow `max-w-2xl` column. On a 1454×887 desktop everything bunches at the top and the bottom half is empty — wastes the horizontal space, and the three statements feel cramped together.

## Layout

Use a 3-column card layout that fills the desktop width and is vertically centered in the viewport.

```text
+------------------------------------------------------------+
|   ¿Qué tan de acuerdo estás con las siguientes ideas?      |
|   No hay respuestas correctas...                           |
|                                                            |
|   +----------+     +----------+     +----------+           |
|   | Idea 1   |     | Idea 2   |     | Idea 3   |           |
|   | slider   |     | slider   |     | slider   |           |
|   +----------+     +----------+     +----------+           |
|                                                            |
|                    [ Siguiente → ]                         |
+------------------------------------------------------------+
```

### Container
- Wrap in `h-[calc(100vh-120px)] flex flex-col justify-center max-w-6xl mx-auto px-6`.
- Header block (title + subtitle) centered, `mb-12`.

### Cards (3-column grid)
- `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8`.
- Each card: subtle panel — `rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm`, with hover lift (`hover:border-[color:var(--teal)]/40 hover:bg-white/[0.05]`, `transition`).
- Card content: statement text (centered, `text-base lg:text-lg font-semibold min-h-[5rem]` so cards align even with different text lengths) + slider below with `mt-6`.
- Stagger the fade-in animation: 0ms / 150ms / 300ms.

### CTA
- `mt-12 flex justify-center`, keeps existing `NextButton`.

### Mobile (<md)
- Stack to single column, keep cards.

## What does NOT change
- Slider component itself (`Slider6`), copy strings, `beliefs` state shape, `NextButton` behavior, `allSet` logic.
- Intro screen (already redesigned).
- Other stages.
