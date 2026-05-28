import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import Slider6 from "./Slider6";
import { NextButton, GhostButton } from "./buttons";

type Beliefs = { b1: number | null; b2: number | null; b3: number | null };

const items = [
  {
    es: "Siempre podés cambiar mucho qué tan inteligente sos.",
    en: "You can always greatly change how intelligent you are.",
  },
  {
    es: "Sin importar quién seas, podés cambiar mucho tu inteligencia.",
    en: "No matter who you are, you can change your intelligence a lot.",
  },
  {
    es: "Sin importar cuánta inteligencia tengas, siempre podés cambiarla bastante.",
    en: "No matter how much intelligence you have, you can always change it quite a bit.",
  },
];

export default function Stage1({
  lang,
  beliefs,
  setBeliefs,
  onNext,
}: {
  lang: Lang;
  beliefs: Beliefs;
  setBeliefs: (b: Beliefs) => void;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const allSet = beliefs.b1 && beliefs.b2 && beliefs.b3;

  if (!revealed) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold fade-in">
          {t(
            lang,
            "¿Crees que puedes volverte más inteligente con el tiempo, o hay un límite que no puedes superar?",
            "Do you think you can become more intelligent over time, or is there a limit you can't surpass?",
          )}
        </h1>
        <p className="mt-6 text-[color:var(--muted)] fade-in" style={{ animationDelay: "800ms" }}>
          {t(lang, "Antes de seguir, queremos saber qué pensás vos.", "Before we continue, we want to know what you think.")}
        </p>
        <div className="mt-8 fade-in" style={{ animationDelay: "1400ms" }}>
          <GhostButton onClick={() => setRevealed(true)}>
            {t(lang, "Decirte qué pienso →", "Tell you what I think →")}
          </GhostButton>
        </div>
      </div>
    );
  }

  const setters = [
    (v: number) => setBeliefs({ ...beliefs, b1: v }),
    (v: number) => setBeliefs({ ...beliefs, b2: v }),
    (v: number) => setBeliefs({ ...beliefs, b3: v }),
  ];
  const values = [beliefs.b1, beliefs.b2, beliefs.b3];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 slide-up">
      <h2 className="text-xl font-bold text-[color:var(--teal)]">
        {t(lang, "¿Qué tan de acuerdo estás con las siguientes ideas?", "How much do you agree with the following ideas?")}
      </h2>
      <p className="text-sm text-[color:var(--muted)] mt-2">
        {t(
          lang,
          "No hay respuestas correctas. Solo queremos saber qué pensás ahora.",
          "There are no right answers. We just want to know what you think right now.",
        )}
      </p>
      <div className="mt-8 space-y-10">
        {items.map((it, i) => (
          <div key={i} className="fade-in" style={{ animationDelay: `${i * 200}ms` }}>
            <p className="font-bold text-center mb-4">{t(lang, it.es, it.en)}</p>
            <Slider6
              value={values[i]}
              onChange={setters[i]}
              leftLabel={t(lang, "Muy de acuerdo", "Strongly agree")}
              rightLabel={t(lang, "Muy en desacuerdo", "Strongly disagree")}
            />
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <NextButton onClick={onNext} disabled={!allSet} pulse={!!allSet}>
          {t(lang, "Siguiente →", "Next →")}
        </NextButton>
      </div>
    </div>
  );
}
