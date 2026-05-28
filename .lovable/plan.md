Add a new bridge stage between current Stage 2 ("How the brain works") and current Stage 3 ("The challenge") that asks the big question and frames the three behaviors the rest of the explorable already teaches.

### What the new stage shows

Headline (ES/EN):
- ES: "Ahora que sabés que tu cerebro puede cambiar… ¿cómo lo hacés cambiar?"
- EN: "Now that you know your brain can change… how do you make it change?"

Subtitle:
- ES: "Tres comportamientos activan ese cambio. Vamos a ver cada uno."
- EN: "Three behaviors activate that change. We'll explore each one."

Three cards, revealed with a small stagger animation. Each one previews a later stage so the structure of the journey is explicit:

1. **Buscar desafíos** / **Seeking challenges**
   - ES: "Elegir tareas difíciles que estiran tu cerebro, en vez de las fáciles."
   - EN: "Picking hard tasks that stretch your brain, instead of easy ones."
   - Icon: 🧗  → maps to current Stage 3 (The challenge)

2. **Replantear el error** / **Reframing mistakes**
   - ES: "Tratar los errores como información, no como fracaso."
   - EN: "Treating mistakes as information, not as failure."
   - Icon: 🔁  → maps to current Stage 4 (The mistake)

3. **A qué le atribuís el fracaso** / **How you explain failure**
   - ES: "Cuando algo no sale, ¿culpás algo fijo o cambiás de estrategia?"
   - EN: "When something doesn't work, do you blame something fixed or change your strategy?"
   - Icon: 🧭  → maps to current Stage 5 (The reactions)

A short bridge line under the cards: "Empecemos por la primera." / "Let's start with the first one." plus the standard Next button (enabled immediately, since this is informational).

### Visual treatment

- Reuse existing card styling from Stage 1 beliefs cards: rounded-2xl, border `border-white/10`, `bg-white/[0.03]`, hover lifts the border to teal.
- Layout: centered column heading, then a responsive grid (1 col mobile, 3 cols md+) sized to fit within the desktop viewport (max-w-6xl, vertically centered like Stage 3).
- Animations: existing `fade-in` and `slide-up` classes, with per-card `animationDelay` for the stagger.

### Wiring

- New file: `src/components/explorable/Stage3Bridge.tsx` (presentational, takes `lang` and `onNext`).
- `Explorable.tsx`: insert the new stage between current 2 and 3, shifting later stages by +1. Total becomes 7. Update the `setStage` clamp from 6 to 7.
- `i18n.ts` `stageLabels`: insert `{ es: "¿Cómo cambiar?", en: "How to change?" }` between index 1 and 2.
- `ProgressBar.tsx`: no code change needed (it maps over `stageLabels`).

### What does NOT change

- Existing Stage 1, 2A/2B, current Stage 3 (challenge), 4 (mistake), 5 (reactions), 6 (now what?) content and behavior.
- Design tokens, animations system, language toggle.
- No new dependencies.

### Files touched

- new: `src/components/explorable/Stage3Bridge.tsx`
- edit: `src/components/explorable/Explorable.tsx`
- edit: `src/components/explorable/i18n.ts`