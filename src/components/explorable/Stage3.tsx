import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import BrainScanner, { type Zones } from "./BrainScanner";
import { NextButton } from "./buttons";

const EASY_ZONES: Zones = { Z1: "dim", Z2: "dim", Z3: "resting", Z4: "resting" };
const HARD_ZONES: Zones = { Z1: "glowing", Z2: "glowing", Z3: "active", Z4: "active" };

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

  const easyOpacity = choice === null ? 0.35 : choice === "easy" ? 1 : 0.2;
  const hardOpacity = choice === null ? 0.35 : choice === "hard" ? 1 : 0.2;

  return (
    <div className="min-h-[calc(100vh-160px)] max-w-2xl mx-auto px-6 py-6 flex flex-col items-center text-center fade-in">
      <h2 className="font-bold text-[color:var(--teal)] text-[26px] md:text-[30px] leading-tight">
        {t(lang, "Tu turno: elegí un desafío", "Your turn: pick a challenge")}
      </h2>

      <p className="mt-4 text-base md:text-lg">
        {t(
          lang,
          "Ya sabés que tu cerebro puede cambiar. Pero ¿qué hace que eso ocurra? Empieza con una decisión.",
          "You already know your brain can change. But what makes that happen? It starts with a choice.",
        )}
      </p>

      <div className="mt-5 rounded-lg border border-[color:var(--teal)]/40 bg-[color:var(--teal)]/5 p-4 text-[15px] leading-relaxed w-full">
        <p className="font-bold text-[color:var(--teal)] mb-1">
          {t(lang, "Qué hacer", "What to do")}
        </p>
        <p>
          {t(
            lang,
            "Leé las dos opciones. Elegí la que realmente harías. Después mirá qué le pasa a tu cerebro.",
            "Read both options. Pick the one you'd actually do. Then watch what happens to your brain.",
          )}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-[color:var(--stage-upcoming)] p-5 w-full">
        <p>
          {t(
            lang,
            "Tu profesor acaba de darte dos opciones de tarea para esta semana:",
            "Your teacher just gave you two homework options for this week:",
          )}
        </p>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4 w-full">
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

      {/* Two brains stacked: hard (bigger) on top of easy (medium) */}
      <div className="mt-8 flex flex-col items-center gap-6 w-full">
        <p className="text-[12px] uppercase tracking-[0.15em] text-[color:var(--muted)]">
          {t(lang, "Qué le pasa a tu cerebro", "What happens to your brain")}
        </p>

        {/* Hard brain - bigger, on top */}
        <div
          className="flex flex-col items-center"
          style={{ opacity: hardOpacity, transition: "opacity 400ms ease" }}
        >
          <BrainScanner zones={HARD_ZONES} size="large" />
          <p className="mt-2 text-sm md:text-base max-w-sm text-[color:var(--teal)] font-bold">
            {t(
              lang,
              "El problema difícil → cerebro más grande, muchas conexiones nuevas.",
              "The hard problem → bigger brain, many more new connections.",
            )}
          </p>
        </div>

        {/* Easy brain - medium, below */}
        <div
          className="flex flex-col items-center"
          style={{ opacity: easyOpacity, transition: "opacity 400ms ease" }}
        >
          <BrainScanner zones={EASY_ZONES} size="medium" />
          <p className="mt-2 text-sm md:text-base max-w-sm text-[color:var(--muted)]">
            {t(
              lang,
              "Ejercicios de práctica → cerebro mediano, pocas conexiones nuevas.",
              "Practice exercises → medium brain, few new connections.",
            )}
          </p>
        </div>
      </div>

      {reflectionShown && choice && (
        <p className="mt-6 text-sm md:text-base max-w-md fade-in italic text-[color:var(--muted)]">
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

      {reflectionShown && (
        <div className="mt-8 flex justify-center fade-in">
          <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
        </div>
      )}
    </div>
  );
}
