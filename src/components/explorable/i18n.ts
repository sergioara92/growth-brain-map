export type Lang = "es" | "en";

export const t = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

export const stageLabels = [
  { es: "Creencias", en: "Beliefs" },
  { es: "Así funciona el cerebro", en: "How the brain works" },
  { es: "Cómo cambiarlo", en: "How to change it" },
  { es: "El desafío", en: "The challenge" },
  { es: "El error", en: "The mistake" },
  { es: "Atribuciones del fracaso", en: "Attributions of failure" },
  { es: "¿Y ahora?", en: "Now what?" },
];

export const pathLabels = [
  { es: "Útil", en: "Useful" },
  { es: "No útil", en: "Not useful" },
  { es: "Sin estrategia", en: "No strategy" },
];
