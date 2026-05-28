import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";
import BrainScanner from "./BrainScanner";

export default function Stage2B({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <div className="mx-auto px-4 py-6 fade-in" style={{ maxWidth: 640 }}>
      <h2 className="font-bold text-[color:var(--teal)] text-center" style={{ fontSize: 22 }}>
        {t(lang, "Eso tiene un nombre: neuroplasticidad", "That has a name: neuroplasticity")}
      </h2>
      <div className="mt-4 mx-auto space-y-4 text-center" style={{ maxWidth: 560, fontSize: 16, lineHeight: 1.6 }}>
        {t(
          lang,
          `Las conexiones entre tus neuronas pueden volverse más fuertes con el tiempo. Cuando te esforzás por aprender algo nuevo, esas conexiones se fortalecen. Y entre más practicás, más fuertes se vuelven.|Con el tiempo, esas conexiones más fuertes te hacen más inteligente en esa materia.|Eso no es solo una metáfora — es biología. Los científicos lo llaman neuroplasticidad: la capacidad de tu cerebro de cambiar físicamente en respuesta al aprendizaje.|Y lo mejor es que ese proceso no tiene un límite fijo.`,
          `The connections between your neurons can become stronger over time. When you work hard to learn something new, those connections strengthen. And the more you practice, the stronger they become.|Over time, those stronger connections make you more intelligent in that subject.|That's not just a metaphor — it's biology. Scientists call it neuroplasticity: your brain's ability to physically change in response to learning.|And the best part is that process has no fixed limit.`,
        )
          .split("|")
          .map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <div className="fade-in" style={{ animationDelay: "0ms" }}>
          <BrainScanner
            zones={{ Z1: "dim", Z2: "resting", Z3: "resting", Z4: "dim" }}
            label={t(lang, "Antes de practicar", "Before practicing")}
            size="medium"
          />
        </div>
        <div className="fade-in text-[color:var(--teal)]" style={{ animationDelay: "300ms", fontSize: 24 }}>→</div>
        <div className="fade-in" style={{ animationDelay: "600ms" }}>
          <BrainScanner
            zones={{ Z1: "glowing", Z2: "glowing", Z3: "glowing", Z4: "glowing" }}
            label={t(lang, "Después de practicar", "After practicing")}
            size="medium"
          />
        </div>
      </div>

      <div
        className="mt-8 mx-auto text-center font-bold"
        style={{
          maxWidth: 480,
          borderRadius: 14,
          border: "1px solid #00C2C7",
          backgroundColor: "#0D2040",
          padding: 24,
          color: "#FFFFFF",
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        {t(
          lang,
          "Tu cerebro no es fijo. Cada vez que aprendés algo difícil, está cambiando físicamente. Eso es neuroplasticidad.",
          "Your brain is not fixed. Every time you learn something hard, it is physically changing. That is neuroplasticity.",
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
      </div>
    </div>
  );
}
