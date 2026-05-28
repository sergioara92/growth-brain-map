import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import BrainScanner, { type Zones } from "./BrainScanner";
import { NextButton } from "./buttons";

export default function Stage3({
  lang,
  choice,
  setChoice,
  onNext,
}: {
  lang: Lang;
  choice: "easy" | "hard" | null;
  setChoice: (c: "easy" | "hard") => void;
  onNext: () => void;
}) {
  const [reflectionShown, setReflectionShown] = useState(false);

  const handleChoose = (c: "easy" | "hard") => {
    setChoice(c);
    setTimeout(() => setReflectionShown(true), 1000);
  };

  let zones: Zones = { Z1: "resting", Z2: "resting", Z3: "resting", Z4: "resting" };
  let scannerLabel = t(lang, "Tu cerebro en reposo", "Your brain at rest");
  if (choice === "easy") {
    zones = { Z1: "dim", Z2: "dim", Z3: "resting", Z4: "resting" };
    scannerLabel = t(
      lang,
      "Tu cerebro reconoce algo familiar. Pocas conexiones nuevas.",
      "Your brain recognizes something familiar. Few new connections.",
    );
  } else if (choice === "hard") {
    zones = { Z1: "glowing", Z2: "glowing", Z3: "active", Z4: "active" };
    scannerLabel = t(
      lang,
      "Tu cerebro trabaja en algo nuevo. Las conexiones crecen.",
      "Your brain is working on something new. Connections are growing.",
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto px-6 py-6 flex flex-col justify-center fade-in">
      <p className="text-center max-w-2xl mx-auto fade-in text-base md:text-lg">
        {t(
          lang,
          "Ya sabés que tu cerebro puede cambiar. Pero ¿qué hace que eso ocurra? Empieza con una decisión.",
          "You already know your brain can change. But what makes that happen? It starts with a choice.",
        )}
      </p>

      <div className="mt-8 grid md:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          <div className="rounded-xl border border-[color:var(--stage-upcoming)] p-6">
            <p>
              {t(
                lang,
                "Tu profesor acaba de darte dos opciones de tarea para esta semana:",
                "Your teacher just gave you two homework options for this week:",
              )}
            </p>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {(["easy", "hard"] as const).map((k) => {
              const isHard = k === "hard";
              const sel = choice === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleChoose(k)}
                  className="relative rounded-xl p-4 text-left transition-all"
                  style={{
                    backgroundColor: isHard ? "#0D2040" : "var(--easy-bg)",
                    border: sel ? "2px solid var(--teal)" : isHard ? "1px solid var(--teal)" : "1px solid var(--stage-upcoming)",
                    boxShadow: isHard ? "0 0 8px rgba(0,194,199,0.4)" : undefined,
                    minHeight: 120,
                  }}
                >
                  {sel && (
                    <span className="absolute top-2 right-2 text-[color:var(--teal)] text-lg">✓</span>
                  )}
                  <div className="text-2xl">{isHard ? "🧩" : "📋"}</div>
                  <div className="font-bold mt-2">
                    {isHard
                      ? t(lang, "El problema difícil", "The hard problem")
                      : t(lang, "Ejercicios de práctica", "Practice exercises")}
                  </div>
                  <div className="text-sm text-[color:var(--muted)] mt-1">
                    {isHard
                      ? t(
                          lang,
                          "Intentá resolver 5 problemas de álgebra que nunca viste antes.",
                          "Try to solve 5 algebra problems you've never seen before.",
                        )
                      : t(
                          lang,
                          "Resolvé 20 problemas de multiplicación que ya sabés hacer bien.",
                          "Solve 20 multiplication problems you already know how to do well.",
                        )}
                  </div>
                  {!choice && isHard && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl text-[color:var(--gold)]" style={{ animation: "arrowPulse 1.5s ease-in-out infinite" }}>
                      ↓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center" style={{ animation: "slideUp 400ms ease-out" }}>
          <div className="hidden lg:block">
            <BrainScanner zones={zones} label={scannerLabel} size="large" />
          </div>
          <div className="lg:hidden">
            <BrainScanner zones={zones} label={scannerLabel} size="medium" />
          </div>
          {reflectionShown && choice && (
            <p className="mt-4 text-sm md:text-base text-center max-w-sm fade-in italic text-[color:var(--muted)]">
              {choice === "easy"
                ? t(
                    lang,
                    "Tiene sentido elegir lo fácil. Pero tu cerebro necesita esfuerzo para cambiar.",
                    "It makes sense to choose easy. But your brain needs effort to change.",
                  )
                : t(
                    lang,
                    "Elegiste el desafío. Eso es exactamente lo que activa el cambio en tu cerebro.",
                    "You chose the challenge. That's exactly what activates change in your brain.",
                  )}
            </p>
          )}
        </div>
      </div>

      {reflectionShown && (
        <div className="mt-10 flex justify-center fade-in">
          <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
        </div>
      )}
    </div>
  );
}
