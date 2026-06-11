## What's wrong

`Stage2B.tsx` uses `minHeight: calc(100vh - 120px)` but actual chrome above the stage is ~250 px (`pt-[190px]` on `<main>` + progress bar + `pb-12`). The stage centers itself in that oversized box, pushing the highlight callout and the Next button below the fold. The huge centered title (`text-[32px] mb-8`) and `space-y-3` body with `fontSize: 17` push it further.

## Fix (presentation-only, `src/components/explorable/Stage2B.tsx`)

- **Container height**: replace `minHeight: calc(100vh - 120px)` with the same budget used in Stage 2A: `h-[calc(100dvh-240px)] min-h-[480px] overflow-hidden`. Switch from `justify-center` to `justify-start` with a small top pad so content starts near the top instead of being vertically centered into a too-tall box.
- **Title**: `text-[22px] md:text-[26px] mb-3` (down from 28/32 + mb-8), keep teal + centered.
- **Two-column grid**: `gap-6` (down from `gap-10`), `items-center` kept. The grid wrapper becomes `flex-1 min-h-0` so it shares remaining vertical space with the callout.
- **Body copy**: `fontSize: 14.5`, `lineHeight: 1.5`, `space-y-2` (down from 17/1.6/space-y-3). No copy changes.
- **Neuron image**: cap with `max-h-full max-w-[420px] object-contain` and wrap in a `min-h-0` flex container so it scales down when height is tight instead of fixing its own size.
- **Highlight callout**: `mt-3 p-3 text-[13px]` (down from mt-6/p-4/15), keep border + bg.
- **Next button row**: `mt-3` (down from mt-5).

## Out of scope
- No changes to `Explorable.tsx`, `Stage2.tsx`, or any sibling stage.
- No copy / translation changes; no logic changes; image asset stays the same.

## What I need from you

Nothing — the request is specific enough to implement directly. I'll apply these changes once you approve.
