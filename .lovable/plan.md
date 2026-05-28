## Execute

### 1. Stage2A road progression (monotonic, no dashing)
`src/components/explorable/Stage2A.tsx` — replace `cityLineProps`:
- L0 `#4A3B7A` w1.5 · L1 `#A0743A` w4 · L2 `#BBBBBB` w5 · L3 `#FFFFFF` w6 · L4 `#FFD166` w7 + goldGlow

### 2. Neutral Spanish sweep
Replace voseo with tuteo in all ES strings across:
- i18n.ts, Stage1.tsx, Stage2.tsx, Stage2A.tsx, Stage2B.tsx, Stage3.tsx, Stage4.tsx, Stage5.tsx, Stage6.tsx, ProgressBar.tsx

Conversions: Hacé→Haz, Reemplazá→Reemplaza, Elegí→Elige, Mirá→Mira, Probá→Prueba, Pensá→Piensa, Buscá→Busca, Acordate→Recuerda, Tomate→Tómate; aprendés→aprendes, tenés→tienes, practicás→practicas, podés→puedes, querés→quieres, sos→eres, construís→construyes, pavimentás→pavimentas, ensanchás→ensanchas, esforzás→esfuerzas, andás→andas; vos→tú. English untouched.