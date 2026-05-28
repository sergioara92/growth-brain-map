I’ll optimize the Stage 3 desktop view shown in your screenshot so it uses the wide screen better and feels balanced without forcing unnecessary scrolling.

Plan:

1. Rework the Stage 3 desktop layout
- Make the stage occupy the available viewport height below the header/progress area.
- Center the content vertically on desktop instead of leaving a large empty lower half.
- Use a wider two-column composition: task choice panel on the left, brain scanner on the right.

2. Improve desktop sizing and balance
- Increase the brain scanner size on desktop so it feels like an important visual, not a small icon.
- Give the left content a clearer max width and the right visual area more presence.
- Keep the mobile/tablet layout stacked so it remains readable on smaller screens.

3. Reduce unnecessary scroll risk
- Tune padding, gaps, and vertical spacing so the stage fits within the desktop viewport.
- Keep the “Next” button visible after a choice without pushing content too low.

4. Preserve existing behavior
- No copy changes.
- No changes to the task selection logic.
- No changes to other stages unless a shared wrapper is directly causing the desktop spacing issue.

Technical details:
- Update `src/components/explorable/Stage3.tsx` layout classes and inline sizing.
- If needed, add a larger scanner mode or responsive sizing in `src/components/explorable/BrainScanner.tsx` so desktop can render a larger brain cleanly.