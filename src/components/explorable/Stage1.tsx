import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import Slider6 from "./Slider6";
import { NextButton } from "./buttons";

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
    const ambientDots = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.3;
      const radius = 200 + ((i * 53) % 180);
      const cx = 320 + Math.cos(angle) * radius;
      const cy = 320 + Math.sin(angle) * radius;
      const palette = ["#00C2C7", "#FF6B6B", "#C77DFF"];
      const fill = palette[i % 3];
      const dur = 3 + ((i * 7) % 25) / 10;
      const delay = ((i * 13) % 30) / 10;
      const opacity = 0.25 + ((i * 11) % 15) / 100;
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={1.5}
          fill={fill}
          style={{ opacity, animation: `stage1-blink ${dur}s ease-in-out ${delay}s infinite` }}
        />
      );
    });

    const dendrites = [
      { angle: 0, len: 130, color: "#00C2C7" },
      { angle: 45, len: 115, color: "#FF6B6B" },
      { angle: 90, len: 140, color: "#C77DFF" },
      { angle: 135, len: 120, color: "#00C2C7" },
      { angle: 180, len: 135, color: "#FF6B6B" },
      { angle: 225, len: 110, color: "#C77DFF" },
      { angle: 270, len: 145, color: "#00C2C7" },
      { angle: 315, len: 125, color: "#FF6B6B" },
    ];

    return (
      <>
        <style>{`
          @keyframes stage1-blink {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.55; }
          }
          @keyframes stage1-hero-in {
            from { opacity: 0; transform: scale(0.85); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes stage1-fade-up {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .stage1-hero { animation: stage1-hero-in 600ms ease-out both; }
          .stage1-headline {
            animation: stage1-fade-up 600ms ease-out 400ms both;
            text-shadow: 0 0 24px rgba(0, 194, 199, 0.35), 0 0 2px rgba(0, 194, 199, 0.5);
          }
          .stage1-cta { animation: stage1-fade-up 600ms ease-out 800ms both; }
          .stage1-ghost-btn {
            border: 1px solid #00C2C7;
            color: #E6FFFE;
            background: transparent;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 500;
            transition: all 220ms ease;
            cursor: pointer;
          }
          .stage1-ghost-btn:hover {
            transform: scale(1.04);
            box-shadow: 0 0 28px rgba(0, 194, 199, 0.55), inset 0 0 12px rgba(0, 194, 199, 0.15);
            background: rgba(0, 194, 199, 0.08);
          }
          @media (prefers-reduced-motion: reduce) {
            .stage1-hero, .stage1-headline, .stage1-cta { animation: none !important; }
          }
        `}</style>
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4">
          <div className="stage1-hero relative" style={{ width: 340, height: 340 }}>
            <svg viewBox="0 0 640 640" width="100%" height="100%" style={{ overflow: "visible" }}>
              <defs>
                <radialGradient id="stage1-soma" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a2b4a" />
                  <stop offset="60%" stopColor="#0d1830" />
                  <stop offset="100%" stopColor="#070d1c" />
                </radialGradient>
                <filter id="stage1-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {ambientDots}

              <g filter="url(#stage1-glow)">
                {dendrites.map((d, i) => {
                  const rad = (d.angle * Math.PI) / 180;
                  const x1 = 320 + Math.cos(rad) * 60;
                  const y1 = 320 + Math.sin(rad) * 60;
                  const x2 = 320 + Math.cos(rad) * (60 + d.len);
                  const y2 = 320 + Math.sin(rad) * (60 + d.len);
                  const mx = (x1 + x2) / 2 + Math.cos(rad + Math.PI / 2) * 18 * (i % 2 === 0 ? 1 : -1);
                  const my = (y1 + y2) / 2 + Math.sin(rad + Math.PI / 2) * 18 * (i % 2 === 0 ? 1 : -1);
                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                        stroke={d.color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        fill="none"
                        opacity={0.85}
                      />
                      <circle cx={x2} cy={y2} r={4} fill={d.color}>
                        <animate
                          attributeName="r"
                          values="3;6;3"
                          dur={`${2 + (i % 3) * 0.4}s`}
                          begin={`${i * 0.25}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur={`${2 + (i % 3) * 0.4}s`}
                          begin={`${i * 0.25}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>

              <circle cx={320} cy={320} r={78} fill="#00C2C7" opacity={0.08} />
              <circle cx={320} cy={320} r={64} fill="#00C2C7" opacity={0.14} />
              <circle cx={320} cy={320} r={52} fill="url(#stage1-soma)" stroke="#00C2C7" strokeWidth={1.5} />
              <circle cx={320} cy={320} r={22} fill="#00C2C7" opacity={0.35}>
                <animate attributeName="opacity" values="0.25;0.55;0.25" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={320} cy={320} r={8} fill="#E6FFFE" />
            </svg>
          </div>

          <h1
            className="stage1-headline mt-8 text-[2.5rem] md:text-[3.25rem] font-bold leading-tight"
            style={{ maxWidth: 600, color: "#F5FFFE" }}
          >
            {t(
              lang,
              "¿Crees que puedes volverte más inteligente con el tiempo, o hay un límite que no puedes superar?",
              "Do you think you can become more intelligent over time, or is there a limit you can't surpass?",
            )}
          </h1>

          <div className="stage1-cta mt-10">
            <button className="stage1-ghost-btn" onClick={() => setRevealed(true)}>
              {t(lang, "Decirte qué pienso →", "Tell you what I think →")}
            </button>
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
    <div className="max-w-2xl mx-auto px-4 py-8 slide-up">
      <h2 className="text-xl font-bold text-[color:var(--teal)]">
        {t(lang, "¿Qué tan de acuerdo estás con las siguientes ideas?", "How much do you agree with the following ideas?")}
      </h2>
      <p className="text-sm text-[color:var(--muted)] mt-2">
        {t(
          lang,
          "No hay respuestas correctas. Solo queremos saber qué piensas ahora.",
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
