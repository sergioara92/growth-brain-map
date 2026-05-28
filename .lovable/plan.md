# Stage 1 redesign + no-scroll desktop pass

## Scope
- `src/components/explorable/Stage1.tsx` — replace neuron with brain image, switch to side-by-side layout, fit within viewport.
- New asset: `src/assets/brain-hero.png` — generated neon brain similar to the reference (purple/teal/pink glowing brain on dark cosmic background, with synaptic light points).
- Light no-scroll audit of `Stage2.tsx`, `Stage2A.tsx`, `Stage2B.tsx`, `Stage3.tsx`, `Stage4.tsx`, `Stage5.tsx`, `Stage6.tsx` — cap container height, reduce vertical paddings/margins where they currently push content below the fold on a 1454×887 desktop viewport.

## Stage 1 intro layout

```text
+--------------------------------------------------+
|  ¿Crees que puedes...?           [   BRAIN   ]   |
|  (headline, left, 55%)            (image, 45%)   |
|                                                  |
|  [ Decirte qué pienso → ]                        |
+--------------------------------------------------+
```

- Container: `h-[calc(100vh-<header>)]` with `flex items-center`, `max-w-6xl mx-auto`, `grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12`.
- Left column: headline (`text-3xl md:text-5xl`, white, soft teal glow) + ghost CTA below with `mt-8`. No paragraph subtext (already removed).
- Right column: brain image, `max-h-[60vh] w-auto`, soft drop-shadow glow, gentle float animation (translateY 0→-6px over 6s).
- Mobile (<md): stack — brain on top (smaller, `max-h-[40vh]`), headline below, CTA below.
- Remove the SVG neuron block and its associated `<style>` keyframes for the neuron. Keep only the float + glow keyframes.

## Brain asset

Generate `src/assets/brain-hero.png` with `imagegen` (fast model, transparent background):
- Prompt: "Glowing neon brain illustration with bright synaptic light points, electric blue, magenta and teal nerve pathways outlining the brain, cinematic glow, isolated on a solid white background, vector-style line art with light bloom, ultra-clean, no text" → transparent_background: true, 1024×1024.

## No-scroll audit (other stages)

For each stage component, replace `min-h-[80vh]` / `py-8` patterns that overflow on 887px-tall viewports with `h-[calc(100vh-96px)] flex flex-col justify-center overflow-hidden` containers, and tighten `space-y-10` → `space-y-6`, `mt-12` → `mt-6`. Only touch spacing values; do not restructure content.

## What does NOT change
- Slider screen content / behavior.
- Copy strings (already cleaned).
- Color tokens, language toggle, progress bar, BrainScanner.
