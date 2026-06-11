import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";
import neuronBio from "@/assets/neuron-bio.png";

export default function Stage2B({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <div
      className="mx-auto px-8 fade-in flex flex-col justify-start max-w-7xl h-[calc(100dvh-60px)] min-h-[520px] overflow-hidden pt-2"
    >
      <h2 className="font-bold text-[color:var(--teal)] text-center text-[22px] md:text-[26px] mb-3">
        {t(lang, "Eso tiene un nombre: neuroplasticidad", "That has a name: neuroplasticity")}
      </h2>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-center flex-1 min-h-0">
        <div className="space-y-2" style={{ fontSize: 14.5, lineHeight: 1.5, maxWidth: 520 }}>
          {t(
            lang,
            `Las conexiones entre tus neuronas pueden volverse más fuertes con el tiempo. Cuando te esfuerzas por aprender algo nuevo, esas conexiones se fortalecen. Y entre más practicas, más fuertes se vuelven.|Con el tiempo, esas conexiones más fuertes te hacen más inteligente en esa materia.|Eso no es solo una metáfora — es biología. Los científicos lo llaman neuroplasticidad: la capacidad de tu cerebro de cambiar físicamente en respuesta al aprendizaje.|Y lo mejor es que ese proceso no tiene un límite fijo.`,
            `The connections between your neurons can become stronger over time. When you work hard to learn something new, those connections strengthen. And the more you practice, the stronger they become.|Over time, those stronger connections make you more intelligent in that subject.|That's not just a metaphor — it's biology. Scientists call it neuroplasticity: your brain's ability to physically change in response to learning.|And the best part is that process has no fixed limit.`,
          )
            .split("|")
            .map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="relative flex items-center justify-center min-h-0 h-full">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle, rgba(0,194,199,0.18), transparent 70%)" }}
          />
          <img
            src={neuronBio}
            alt={t(lang, "Ilustración de dos neuronas conectadas", "Illustration of two connected neurons")}
            className="relative max-h-full max-w-[420px] w-auto h-auto object-contain mx-auto"
          />
        </div>
      </div>

      <div
        className="mt-3 mx-auto text-center font-bold"
        style={{
          maxWidth: 720,
          borderRadius: 14,
          border: "1px solid #00C2C7",
          backgroundColor: "#0D2040",
          padding: 12,
          color: "#FFFFFF",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {t(
          lang,
          "Tu cerebro no es fijo. Cada vez que aprendes algo difícil, está cambiando físicamente. Eso es neuroplasticidad.",
          "Your brain is not fixed. Every time you learn something hard, it is physically changing. That is neuroplasticity.",
        )}
      </div>

      <div className="mt-3 flex justify-center">
        <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
      </div>
    </div>
  );
}
