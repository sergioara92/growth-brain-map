## Goal

Rework the "neuroplasticidad" screen (`src/components/explorable/Stage2B.tsx`) so it fits a desktop viewport without scrolling, drops the "Antes de practicar / Después de practicar" brain panels, and presents the idea like the reference: explanatory text on the left, a biological neuron illustration on the right.

## Changes (only `Stage2B.tsx` + one new asset)

1. **Generate neuron illustration** → `src/assets/neuron-bio.png` (transparent PNG). Two connected neurons with cell body, axon, myelin sheath segments, dendrites, and small teal signal nodes along the axon — styled to match the dark navy/teal palette (not the cartoony purple of the reference, but same anatomical layout).

2. **No-scroll desktop container**
   - Replace `max-w-[640px]` centered column with `h-[calc(100vh-120px)] max-w-7xl mx-auto px-8 flex flex-col justify-center`.
   - Headline centered at top: `text-[28px] md:text-[32px]`, `mb-8`.

3. **Two-column body**: `grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-center`.
   - **Left column**: the 4 paragraphs, left-aligned, `fontSize: 17, lineHeight: 1.6, maxWidth: 520`, `space-y-3`.
   - **Right column**: `<img src={neuronBio} alt="..." className="w-full max-w-[520px] mx-auto" />` with a soft teal radial glow behind it (`bg-[radial-gradient(circle,rgba(0,194,199,0.15),transparent_70%)]`).

4. **Remove**: the entire `BrainScanner` before/after block (lines 22–38) and the `import BrainScanner`.

5. **Keep but compact**: the teal-bordered key takeaway box — move it below the two-column grid, `mt-6`, `maxWidth: 720`, `padding: 16`, `fontSize: 15`. Next button `mt-5`.

6. **Imports**: add `import neuronBio from "@/assets/neuron-bio.png";`. All copy strings unchanged.

## What does NOT change
Copy (Spanish/English), `NextButton`, `i18n` calls, other stages, design tokens.
