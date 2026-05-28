import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import Slider6 from "./Slider6";
import { NextButton } from "./buttons";
import brainHero from "@/assets/brain-hero.png";

type Beliefs = { b1: number | null; b2: number | null; b3: number | null };

const items = [
  {
    es: "Siempre puedes cambiar mucho qué tan inteligente sos.",
    en: "You can always greatly change how intelligent you are.",
  },
  {
    es: "Sin importar quién seas, puedes cambiar mucho tu inteligencia.",
    en: "No matter who you are, you can change your intelligence a lot.",
  },
  {
    es: "Sin importar cuánta inteligencia tengas, siempre puedes cambiarla bastante.",
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
      <>
        <style>{`
          @keyframes stage1-fade-up {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes stage1-float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
          @keyframes stage1-brain-in {
            from { opacity: 0; transform: scale(0.92); }
            to   { opacity: 1; transform: scale(1); }
          }
          .stage1-headline {
            animation: stage1-fade-up 600ms ease-out 200ms both;
            text-shadow: 0 0 28px rgba(0, 194, 199, 0.35), 0 0 2px rgba(0, 194, 199, 0.45);
          }
          .stage1-cta { animation: stage1-fade-up 600ms ease-out 500ms both; }
          .stage1-brain-wrap {
            animation: stage1-brain-in 700ms ease-out both;
          }
          .stage1-brain {
            animation: stage1-float 6s ease-in-out infinite;
            filter: drop-shadow(0 0 40px rgba(199, 125, 255, 0.35))
                    drop-shadow(0 0 80px rgba(0, 194, 199, 0.25));
          }
          .stage1-ghost-btn {
            border: 1px solid #00C2C7;
            color: #E6FFFE;
            background: transparent;
            padding: 0.85rem 1.75rem;
            border-radius: 9999px;
            font-weight: 500;
            font-size: 1.05rem;
            transition: all 220ms ease;
            cursor: pointer;
          }
          .stage1-ghost-btn:hover {
            transform: scale(1.04);
            box-shadow: 0 0 28px rgba(0, 194, 199, 0.55), inset 0 0 12px rgba(0, 194, 199, 0.15);
            background: rgba(0, 194, 199, 0.08);
          }
          @media (prefers-reduced-motion: reduce) {
            .stage1-headline, .stage1-cta, .stage1-brain-wrap, .stage1-brain { animation: none !important; }
          }
        `}</style>
        <div className="h-[calc(100vh-120px)] max-w-6xl mx-auto px-6 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-10 md:gap-14 items-center w-full">
            <div className="text-center md:text-left order-2 md:order-1">
              <h1
                className="stage1-headline font-bold leading-[1.1] text-[2rem] md:text-[3rem] lg:text-[3.4rem]"
                style={{ color: "#F5FFFE" }}
              >
                {t(
                  lang,
                  "¿Crees que puedes volverte más inteligente con el tiempo, o hay un límite que no puedes superar?",
                  "Do you think you can become more intelligent over time, or is there a limit you can't surpass?",
                )}
              </h1>
              <div className="stage1-cta mt-8 flex md:justify-start justify-center">
                <button className="stage1-ghost-btn" onClick={() => setRevealed(true)}>
                  {t(lang, "Decirte qué pienso →", "Tell you what I think →")}
                </button>
              </div>
            </div>
            <div className="stage1-brain-wrap order-1 md:order-2 flex justify-center">
              <img
                src={brainHero}
                alt={t(lang, "Cerebro neon brillante", "Glowing neon brain")}
                className="stage1-brain w-auto max-h-[42vh] md:max-h-[68vh] object-contain"
                width={1024}
                height={1024}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  const setters = [
    (v: number) => setBeliefs({ ...beliefs, b1: v }),
    (v: number) => setBeliefs({ ...beliefs, b2: v }),
    (v: number) => setBeliefs({ ...beliefs, b3: v }),
  ];
  const values = [beliefs.b1, beliefs.b2, beliefs.b3];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 slide-up">
      <h2 className="text-xl font-bold text-[color:var(--teal)]">
        {t(lang, "¿Qué tan de acuerdo estás con las siguientes ideas?", "How much do you agree with the following ideas?")}
      </h2>
      <p className="text-sm text-[color:var(--muted)] mt-1">
        {t(
          lang,
          "No hay respuestas correctas. Solo queremos saber qué piensas ahora.",
          "There are no right answers. We just want to know what you think right now.",
        )}
      </p>
      <div className="mt-5 space-y-5">
        {items.map((it, i) => (
          <div key={i} className="fade-in" style={{ animationDelay: `${i * 200}ms` }}>
            <p className="font-bold text-center mb-2">{t(lang, it.es, it.en)}</p>
            <Slider6
              value={values[i]}
              onChange={setters[i]}
              leftLabel={t(lang, "Muy de acuerdo", "Strongly agree")}
              rightLabel={t(lang, "Muy en desacuerdo", "Strongly disagree")}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <NextButton onClick={onNext} disabled={!allSet} pulse={!!allSet}>
          {t(lang, "Siguiente →", "Next →")}
        </NextButton>
      </div>
    </div>
  );
}
