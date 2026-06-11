## Goal
Both Stage 2A ("Así funciona el cerebro / Tu cerebro funciona como una ciudad") and Stage 3 ("Tu turno: elegí un desafío") should fit on screen without scrolling, and Stage 3's pieces (title → instructions → choices → brain → Next) should feel like a single, guided flow instead of disconnected blocks floating in the viewport.

## Scope
Two files, presentation-only:
- `src/components/explorable/Stage2A.tsx`
- `src/components/explorable/Stage3.tsx`

No business logic, no new components, no changes to `Explorable`, `Stage4`, or any other stage.

---

## Stage 2A — make it fit on one screen

The text column is what overflows. Trim sizing only; keep all copy and the city/neurons simulation untouched.

- Container: switch from `min-h-[calc(100vh-100px)]` (which can exceed the viewport) to `h-[calc(100vh-140px)] overflow-hidden`, keep the 2-column grid.
- Heading: `text-[22px] md:text-[26px]` (was 28/32), tighter `leading-tight`.
- Body paragraphs: drop from `fontSize: 18 / lineHeight: 1.65` to `fontSize: 14.5 / lineHeight: 1.5`, reduce `space-y-4` → `space-y-2`, top margin `mt-5` → `mt-3`.
- "Cómo jugar" card: `p-4 text-[15px]` → `p-3 text-[13px]`, `mt-5` → `mt-3`, list `space-y-1` kept.
- Progress label + highways counter: `text-[16px]` → `text-[14px]`, `text-[14px]` → `text-[12px]`, `mt-4` → `mt-2`.
- Next button block: `mt-6` → `mt-3`.
- Right column padding `p-5` → `p-3` and reduce the inner gap (`gap-6` → `gap-4`) so the SVGs don't push height past the viewport at common laptop sizes.

No copy changes, no SVG/logic changes.

---

## Stage 3 — unify the desafío section

The current layout (per the screenshot) has the title floating at top center, instructions/choices crammed top-left, the brain isolated far right, and the Next button stranded in the page corner. Fix by collapsing it into a single visually connected card with clear vertical rhythm, while keeping the existing two-column structure.

### Layout

- Wrap the whole stage in one bordered card: `rounded-2xl border border-[color:var(--teal)]/25 bg-[color:var(--teal)]/5 p-5`, centered with `max-w-5xl mx-auto`, `h-[calc(100vh-140px)] flex flex-col`.
- Title moves inside the card, smaller and left-aligned to match the rest: `text-[22px] md:text-[24px]`, no longer centered.
- Two-column grid stays (`md:grid-cols-2 gap-6 flex-1 min-h-0`), but both columns share the same card background so they read as one unit instead of two islands.

### Left column (instructions + choices)

- Keep all current copy (intro, "Qué hacer" callout, "Tu profe te da dos opciones…", easy/hard buttons, post-choice reflection line).
- Tighten spacing: gaps of `mt-2` between blocks, buttons stack with `gap-2`.
- The reflection line ("Elegiste el desafío…" / "Tiene sentido elegir lo fácil…") stays directly under the buttons.
- The Next button lives at the bottom of this column via `mt-auto`, so it sits inside the card next to the brain — not at the far bottom-left of the page.

### Right column (brain)

- Wrap `NestedBrain` in a centered container with `flex-1 min-h-0 flex flex-col items-center justify-center`.
- Add a thin divider (`md:border-l md:border-[color:var(--teal)]/20 md:pl-6`) between the columns so the eye reads left → right within one card.
- Keep the existing `NestedBrain` component, the small/large brain SVGs, the lighting behavior on choice, and the caption underneath. Caption font drops to `text-[13px]` so the right column never grows taller than the left.

### Result

- One framed card holds the title, instructions, choices, the brain, and the Next button.
- No vertical scroll on a standard laptop viewport.
- Visual flow is: read title → read "Qué hacer" → pick option → see brain change → press Next, all inside one bounded surface.

---

## Technical notes
- Pure Tailwind / inline-style changes. No new dependencies, no new files.
- `NestedBrain` internals (paths, nodes, links, animations) are not modified.
- Translations (`t(lang, …)`) and the `choice` state machine are untouched.
