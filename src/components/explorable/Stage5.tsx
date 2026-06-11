import { useEffect, useMemo, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";

import { NextButton } from "./buttons";

type Col = "util" | "no-util" | "sin-estrategia";

type Card = {
  id: string;
  es: string;
  en: string;
  correct: Col;
  feedbackEs?: string;
  feedbackEn?: string;
};

const CARDS: Card[] = [
  { id: "C1", es: "Le pido ayuda al profe para que me explique.", en: "I ask the teacher to explain it to me.", correct: "util" },
  { id: "C2", es: "Reviso el examen para encontrar en qué me equivoqué.", en: "I review the test to find where I went wrong.", correct: "util" },
  { id: "C3", es: "Busco un video que explique el tema de otra manera.", en: "I look for a video that explains the topic differently.", correct: "util" },
  { id: "C4", es: "Hago los ejercicios que me salieron mal otra vez, con cuidado.", en: "I redo the exercises I got wrong, carefully.", correct: "util" },
  { id: "C5", es: "Pienso que no soy lo suficientemente inteligente para esto.", en: "I think I'm not smart enough for this.", correct: "no-util", feedbackEs: "Atribuir el problema a algo fijo bloquea el aprendizaje.", feedbackEn: "Attributing the problem to something fixed blocks learning." },
  { id: "C6", es: "Me rindo. Nunca voy a poder hacer esto.", en: "I give up. I'll never be able to do this.", correct: "no-util", feedbackEs: "Rendirse detiene el proceso antes de que el cerebro pueda cambiar.", feedbackEn: "Giving up stops the process before the brain can change." },
  { id: "C7", es: "Evito hablar del tema para no sentirme mal.", en: "I avoid the topic so I don't feel bad.", correct: "no-util", feedbackEs: "Evitar el tema no construye ninguna conexión nueva.", feedbackEn: "Avoiding the topic builds no new connections." },
  { id: "C8", es: "Digo que el profe explica mal y no hago nada diferente.", en: "I say the teacher explains badly and don't do anything different.", correct: "sin-estrategia", feedbackEs: "Culpar al profe sin cambiar tu enfoque no genera nuevas conexiones.", feedbackEn: "Blaming the teacher without changing your approach builds no new connections." },
  { id: "C9", es: "Hago los mismos ejercicios de la misma manera que antes.", en: "I do the same exercises the same way as before.", correct: "sin-estrategia", feedbackEs: "El esfuerzo importa, pero sin cambiar la estrategia, el resultado es el mismo.", feedbackEn: "Effort matters, but without changing strategy, the result is the same." },
  { id: "C10", es: "Estudio más horas pero sin cambiar cómo estudio.", en: "I study more hours without changing how I study.", correct: "sin-estrategia", feedbackEs: "Más tiempo con el mismo método no activa nuevas regiones del cerebro.", feedbackEn: "More time with the same method doesn't activate new brain regions." },
];

const COLS: { id: Col; bg: string; titleColor: string; icon: string; esTitle: string; enTitle: string; esDesc: string; enDesc: string }[] = [
  { id: "util", bg: "#0D2B2B", titleColor: "var(--teal)", icon: "🧠⚡", esTitle: "Útil para aprender", enTitle: "Helpful for learning", esDesc: "Cambiás lo que hacés. Tu cerebro construye nuevas conexiones.", enDesc: "You change what you do. Your brain builds new connections." },
  { id: "no-util", bg: "#2B0D0D", titleColor: "var(--coral)", icon: "🚫", esTitle: "No útil", enTitle: "Not helpful", esDesc: "Le atribuís el problema a algo fijo. Tu cerebro se bloquea.", enDesc: "You attribute the problem to something fixed. Your brain blocks." },
  { id: "sin-estrategia", bg: "var(--effort-bg)", titleColor: "var(--gold)", icon: "🔄❓", esTitle: "Esfuerzo sin estrategia", enTitle: "Effort without strategy", esDesc: "Te esfuerzas, pero sin cambiar el método. Pocas conexiones nuevas.", enDesc: "You try hard, but without changing the method. Few new connections." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Stage5({
  lang,
  placements,
  setPlacements,
  verificarCount,
  setVerificarCount,
  onNext,
}: {
  lang: Lang;
  placements: Record<string, Col | null>;
  setPlacements: (p: Record<string, Col | null>) => void;
  verificarCount: number;
  setVerificarCount: (n: number) => void;
  onNext: () => void;
}) {
  const shuffled = useMemo(() => shuffle(CARDS.map((c) => c.id)), []);
  const [selected, setSelected] = useState<string | null>(null); // tap-to-place
  const [dragOver, setDragOver] = useState<Col | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const placedAll = CARDS.every((c) => placements[c.id]);

  const place = (cardId: string, col: Col | null) => {
    setPlacements({ ...placements, [cardId]: col });
    setShowFeedback(false);
    setSelected(null);
  };

  const verificar = () => {
    setShowFeedback(true);
    setVerificarCount(verificarCount + 1);
  };

  const allCorrect = CARDS.every((c) => placements[c.id] === c.correct);
  const canShowNext = (showFeedback && allCorrect) || revealed;

  useEffect(() => {
    if (showFeedback && verificarCount >= 3 && !allCorrect && !revealed) {
      // reveal
      const fixed: Record<string, Col | null> = { ...placements };
      CARDS.forEach((c) => (fixed[c.id] = c.correct));
      setTimeout(() => {
        setPlacements(fixed);
        setRevealed(true);
      }, 600);
    }
    // eslint-disable-next-line
  }, [showFeedback]);

  const cardById = (id: string) => CARDS.find((c) => c.id === id)!;
  const holding = shuffled.filter((id) => !placements[id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <p className="text-center text-[color:var(--muted)]">{t(lang, "Imaginate esto:", "Imagine this:")}</p>

      <div className="mt-4 mx-auto max-w-xl rounded-2xl border border-[color:var(--gold)] p-6 text-center slide-up">
        <div className="text-3xl mb-2">📄</div>
        <p>
          {t(
            lang,
            "Recibís tu examen de matemáticas. La nota es mala. ¿Qué hacés después?",
            "You get your math test back. The grade is bad. What do you do next?",
          )}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {COLS.map((c, i) => (
          <div key={c.id} className="rounded-xl p-4 fade-in" style={{ backgroundColor: c.bg, animationDelay: `${i * 200}ms` }}>
            <div className="text-2xl text-center">{c.icon}</div>
            <div className="font-bold text-sm mt-2" style={{ color: c.titleColor }}>
              {t(lang, c.esTitle, c.enTitle)}
            </div>
            <p className="text-xs text-[color:var(--muted)] mt-1">{t(lang, c.esDesc, c.enDesc)}</p>
          </div>
        ))}
      </div>

      <p className="text-center mt-6 text-sm">
        <span className="hidden sm:inline">{t(lang, "Arrastrá cada reacción a la columna que corresponde.", "Drag each reaction to the correct column.")}</span>
        <span className="sm:hidden">
          {t(lang, "Tocá una reacción y luego tocá una columna para colocarla.", "Tap a reaction and then tap a column to place it.")}
        </span>
      </p>

      {/* Holding area */}
      <div className="mt-4 min-h-[60px] flex flex-wrap gap-2 justify-center p-2 rounded-lg border border-dashed border-[color:var(--stage-upcoming)]">
        {holding.map((id) => {
          const c = cardById(id);
          const isSel = selected === id;
          return (
            <button
              key={id}
              type="button"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
              onClick={() => setSelected(isSel ? null : id)}
              className="rounded-lg px-3 py-2 text-sm text-left transition-all"
              style={{
                backgroundColor: "var(--easy-bg)",
                border: isSel ? "2px solid var(--teal)" : "1px solid var(--stage-upcoming)",
                color: "white",
                maxWidth: 260,
              }}
            >
              {t(lang, c.es, c.en)}
            </button>
          );
        })}
        {selected && (
          <p className="basis-full text-center text-xs text-[color:var(--teal)] mt-1">
            {t(lang, "Ahora tocá una columna para colocarla", "Now tap a column to place it")}
          </p>
        )}
      </div>

      {/* Columns with drop zones */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {COLS.map((c) => (
          <div
            key={c.id}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(c.id);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id) place(id, c.id);
              setDragOver(null);
            }}
            onClick={() => {
              if (selected) place(selected, c.id);
            }}
            className="rounded-xl p-3 min-h-[140px] transition-all"
            style={{
              backgroundColor: c.bg,
              border: dragOver === c.id ? "2px dashed var(--teal)" : "1px dashed var(--stage-upcoming)",
              cursor: selected ? "pointer" : undefined,
            }}
          >
            <div className="text-xs font-bold mb-2" style={{ color: c.titleColor }}>
              {t(lang, c.esTitle, c.enTitle)}
            </div>
            <div className="space-y-2">
              {CARDS.filter((card) => placements[card.id] === c.id).map((card) => {
                const correct = card.correct === c.id;
                const wrong = showFeedback && !correct;
                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      place(card.id, null);
                    }}
                    className="relative rounded-lg px-3 py-2 text-xs cursor-pointer"
                    style={{
                      backgroundColor: "var(--easy-bg)",
                      border: showFeedback
                        ? correct
                          ? "2px solid var(--teal)"
                          : "2px solid var(--coral)"
                        : "1px solid var(--stage-upcoming)",
                      animation: wrong ? "shake 300ms" : undefined,
                    }}
                  >
                    {showFeedback && correct && (
                      <span className="absolute top-1 right-2 text-[color:var(--teal)]">✓</span>
                    )}
                    {t(lang, card.es, card.en)}
                    {wrong && card.feedbackEs && (
                      <p className="mt-1 italic text-[color:var(--muted)] text-[11px]">
                        {t(lang, card.feedbackEs, card.feedbackEn!)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={verificar}
          disabled={!placedAll}
          className="px-6 py-3 rounded-full font-bold w-full max-w-sm"
          style={{
            backgroundColor: placedAll ? "var(--coral)" : "var(--stage-upcoming)",
            color: placedAll ? "white" : "var(--muted)",
            cursor: placedAll ? "pointer" : "not-allowed",
            minHeight: 48,
          }}
        >
          {t(lang, "Verificar", "Check")}
        </button>
      </div>

      {canShowNext && (
        <div className="mt-6 flex justify-center fade-in">
          <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
        </div>
      )}
    </div>
  );
}
