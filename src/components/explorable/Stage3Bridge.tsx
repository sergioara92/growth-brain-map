import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

const CARDS = [
  {
    icon: "🧗",
    es: { title: "Buscar desafíos", desc: "Elegir tareas difíciles que estiran tu cerebro, en vez de las fáciles." },
    en: { title: "Seeking challenges", desc: "Picking hard tasks that stretch your brain, instead of easy ones." },
  },
  {
    icon: "🔁",
    es: { title: "Replantear el error", desc: "Tratar los errores como información, no como fracaso." },
    en: { title: "Reframing mistakes", desc: "Treating mistakes as information, not as failure." },
  },
  {
    icon: "🧭",
    es: { title: "A qué le atribuís el fracaso", desc: "Cuando algo no sale, ¿culpás algo fijo o cambiás de estrategia?" },
    en: { title: "How you explain failure", desc: "When something doesn't work, do you blame something fixed or change your strategy?" },
  },
];

export default function Stage3Bridge({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <div className="min-h-[calc(100dvh-60px)] max-w-6xl mx-auto px-6 py-6 flex flex-col justify-center fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[color:var(--fg)]">
          {t(
            lang,
            "Ahora que sabés que tu cerebro puede cambiar… ¿cómo lo hacés cambiar?",
            "Now that you know your brain can change… how do you make it change?",
          )}
        </h2>
        <p className="mt-3 text-base md:text-lg text-[color:var(--muted)]">
          {t(
            lang,
            "Tres comportamientos activan ese cambio. Vamos a ver cada uno.",
            "Three behaviors activate that change. We'll explore each one.",
          )}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {CARDS.map((c, i) => {
          const copy = lang === "es" ? c.es : c.en;
          return (
            <div
              key={i}
              className="slide-up rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 lg:p-7 transition-all duration-300 hover:border-[color:var(--teal)]/50 hover:bg-white/[0.06] hover:-translate-y-1"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-4xl mb-3" aria-hidden="true">{c.icon}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[color:var(--teal)]">{i + 1}.</span>
                <h3 className="text-lg lg:text-xl font-bold leading-snug">{copy.title}</h3>
              </div>
              <p className="mt-2 text-sm lg:text-base text-[color:var(--muted)] leading-relaxed">{copy.desc}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm md:text-base text-[color:var(--muted)] italic fade-in" style={{ animationDelay: "500ms" }}>
        {t(lang, "Empecemos por la primera.", "Let's start with the first one.")}
      </p>

      <div className="mt-6 flex justify-center">
        <NextButton onClick={onNext} pulse>
          {t(lang, "Siguiente →", "Next →")}
        </NextButton>
      </div>
    </div>
  );
}
