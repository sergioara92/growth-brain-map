export type Lang = "es" | "en";

export const t = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

export const stageLabels = [
  { es: "¿Qué creo?", en: "What do I believe?" },
  { es: "Así funciona el cerebro", en: "How the brain works" },
  { es: "¿Cómo cambiar?", en: "How to change?" },
  { es: "El desafío", en: "The challenge" },
  { es: "El error", en: "The mistake" },
  { es: "Las reacciones", en: "The reactions" },
  { es: "¿Y ahora?", en: "Now what?" },
];
