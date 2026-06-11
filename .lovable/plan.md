## Problem
The main title in each stage is hidden behind the fixed neuron progress bar because the top padding on `<main>` (`pt-16` = 64px) is smaller than the progress bar height (`88px` mobile / `112px` desktop).

## Fix
In `src/components/explorable/Explorable.tsx`, increase the top padding on the `<main>` element so content starts below the progress bar.

### Change
```
<main className="min-h-dvh pt-16 pb-12">
```
to:
```
<main className="min-h-dvh pt-[100px] sm:pt-[130px] pb-12">
```

This gives ~12px of breathing room below the bar on both mobile and desktop.

## Verification
- Load any stage and confirm the main heading is fully visible below the neuron chain.
- Check both mobile and desktop viewports.