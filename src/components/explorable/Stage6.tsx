import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import Slider6 from "./Slider6";
import { NextButton } from "./buttons";
import BrainScanner from "./BrainScanner";

const items = [
  { es: "Siempre podés cambiar mucho qué tan inteligente sos.", en: "You can always greatly change how intelligent you are." },
  { es: "Sin importar quién seas, podés cambiar mucho tu inteligencia.", en: "No matter who you are, you can change your intelligence a lot." },
  { es: "Sin importar cuánta inteligencia tengas, siempre podés cambiarla bastante.", en: "No matter how much intelligence you have, you can always change it quite a bit." },
];

export default function Stage6({
  lang,
  originalBeliefs,
  finalBeliefs,
  setFinalBeliefs,
}: {
  lang: Lang;
  originalBeliefs: { b1: number | null; b2: number | null; b3: number | null };
  finalBeliefs: { b1: number | null; b2: number | null; b3: number | null };
  setFinalBeliefs: (b: { b1: number | null; b2: number | null; b3: number | null }) => void;
}) {
  const [done, setDone] = useState(false);

  const orig = [originalBeliefs.b1, originalBeliefs.b2, originalBeliefs.b3];
  const finals = [finalBeliefs.b1, finalBeliefs.b2, finalBeliefs.b3];
  const setters = [
    (v: number) => setFinalBeliefs({ ...finalBeliefs, b1: v }),
    (v: number) => setFinalBeliefs({ ...finalBeliefs, b2: v }),
    (v: number) => setFinalBeliefs({ ...finalBeliefs, b3: v }),
  ];

  if (done) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 fade-in"
        style={{ backgroundColor: "#0D2B3E" }}
      >
        <h2 className="text-3xl font-bold">{t(lang, "Gracias por explorar.", "Thanks for exploring.")}</h2>
        <p className="mt-4 max-w-lg">
          {t(
            lang,
            "Lo que acabás de ver no es solo una metáfora. Es lo que pasa físicamente en tu cerebro cada vez que te esforzás por aprender algo difícil.",
            "What you just saw isn't just a metaphor. It's what physically happens in your brain every time you push yourself to learn something hard.",
          )}
        </p>
        <div className="mt-8">
          <BrainScanner size="large" zones={{ Z1: "glowing", Z2: "glowing", Z3: "glowing", Z4: "glowing" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
      <h2 className="text-xl font-bold text-[color:var(--teal)] text-center">
        {t(lang, "¿Y vos? ¿Qué pensás ahora?", "And you? What do you think now?")}
      </h2>
      <p className="text-sm text-[color:var(--muted)] text-center mt-2">
        {t(
          lang,
          "Estas son las mismas preguntas de antes. ¿Cambió algo en lo que pensás?",
          "These are the same questions as before. Did anything shift in what you think?",
        )}
      </p>
      <div className="mt-8 space-y-10">
        {items.map((it, i) => (
          <div key={i}>
            <p className="font-bold text-center mb-4">{t(lang, it.es, it.en)}</p>
            <Slider6
              value={finals[i] ?? orig[i]}
              onChange={setters[i]}
              leftLabel={t(lang, "Muy de acuerdo", "Strongly agree")}
              rightLabel={t(lang, "Muy en desacuerdo", "Strongly disagree")}
              ghost={orig[i]}
            />
          </div>
        ))}
      </div>
      <p className="mt-8 italic text-sm text-[color:var(--muted)] text-center">
        {t(
          lang,
          "¿Cambió algo en lo que pensás? No hay respuesta correcta — solo curiosidad.",
          "Did anything shift in what you think? There's no right answer — just curiosity.",
        )}
      </p>
      <div className="mt-8 flex justify-center">
        <NextButton onClick={() => setDone(true)}>{t(lang, "Finalizar", "Finish")}</NextButton>
      </div>
    </div>
  );
}
