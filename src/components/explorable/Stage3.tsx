import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

// Small brain nodes (inside the inner silhouette) — few connections
const SMALL_NODES: { cx: number; cy: number }[] = [
  { cx: 145, cy: 120 },
  { cx: 175, cy: 115 },
  { cx: 180, cy: 145 },
  { cx: 150, cy: 150 },
];
const SMALL_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

// Big brain nodes spread across the outer silhouette — dense network
const BIG_NODES: { cx: number; cy: number }[] = [
  { cx: 90, cy: 80 },
  { cx: 130, cy: 55 },
  { cx: 180, cy: 50 },
  { cx: 225, cy: 75 },
  { cx: 245, cy: 130 },
  { cx: 225, cy: 185 },
  { cx: 175, cy: 215 },
  { cx: 115, cy: 210 },
  { cx: 75, cy: 165 },
  { cx: 160, cy: 130 },
];
const BIG_LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0],
  [9, 0], [9, 2], [9, 4], [9, 6], [9, 8],
  [1, 9], [3, 5], [7, 9], [0, 4],
];

function NestedBrain({ choice }: { choice: "easy" | "hard" | null }) {
  const showSmall = choice === "easy";
  const showBig = choice === "hard";

  const bigOutlineOpacity = choice === null ? 0.5 : showBig ? 1 : 0.25;
  const smallOutlineOpacity = choice === null ? 0.6 : showSmall ? 1 : 0.3;

  return (
    <svg viewBox="0 0 320 280" width="100%" style={{ maxHeight: "100%", maxWidth: 420 }} role="img" aria-label="Brain">
      {/* Big outer brain silhouette */}
      <path
        d="M 60 120 C 45 85, 65 40, 110 35 C 125 18, 165 14, 185 28 C 220 18, 270 40, 270 85 C 285 100, 285 145, 265 165 C 260 200, 220 230, 180 222 C 160 240, 110 235, 90 210 C 60 200, 45 160, 60 120 Z"
        stroke="#00C2C7"
        strokeWidth="2"
        fill="none"
        opacity={bigOutlineOpacity}
        style={{ transition: "opacity 500ms" }}
      />
      {/* Small inner brain silhouette */}
      <path
        d="M 135 110 C 130 100, 142 90, 155 92 C 163 85, 178 86, 183 95 C 195 95, 200 115, 192 125 C 195 138, 182 152, 168 150 C 158 158, 142 152, 140 142 C 130 138, 128 120, 135 110 Z"
        stroke="#00C2C7"
        strokeWidth="1.5"
        fill="none"
        opacity={smallOutlineOpacity}
        style={{ transition: "opacity 500ms" }}
      />

      {/* Big brain links */}
      {BIG_LINKS.map(([a, b], i) => (
        <line
          key={`bl-${i}`}
          x1={BIG_NODES[a].cx}
          y1={BIG_NODES[a].cy}
          x2={BIG_NODES[b].cx}
          y2={BIG_NODES[b].cy}
          stroke="#00C2C7"
          strokeWidth={1.5}
          opacity={showBig ? 0.85 : 0}
          style={{ transition: "opacity 600ms" }}
        />
      ))}
      {/* Big brain nodes */}
      {BIG_NODES.map((n, i) => (
        <circle
          key={`bn-${i}`}
          cx={n.cx}
          cy={n.cy}
          r={9}
          fill="#00C2C7"
          opacity={showBig ? 1 : 0}
          style={{
            filter: showBig ? "drop-shadow(0 0 8px #00C2C7)" : undefined,
            transformOrigin: `${n.cx}px ${n.cy}px`,
            animation: showBig ? "pulseGlow 2s ease-in-out infinite" : undefined,
            transition: "opacity 600ms",
          }}
        />
      ))}

      {/* Small brain links */}
      {SMALL_LINKS.map(([a, b], i) => (
        <line
          key={`sl-${i}`}
          x1={SMALL_NODES[a].cx}
          y1={SMALL_NODES[a].cy}
          x2={SMALL_NODES[b].cx}
          y2={SMALL_NODES[b].cy}
          stroke="#00C2C7"
          strokeWidth={1.5}
          opacity={showSmall ? 0.8 : 0}
          style={{ transition: "opacity 600ms" }}
        />
      ))}
      {/* Small brain nodes */}
      {SMALL_NODES.map((n, i) => (
        <circle
          key={`sn-${i}`}
          cx={n.cx}
          cy={n.cy}
          r={6}
          fill="#00C2C7"
          opacity={showSmall ? 1 : showBig ? 0.15 : 0.3}
          style={{
            filter: showSmall ? "drop-shadow(0 0 6px #00C2C7)" : undefined,
            transformOrigin: `${n.cx}px ${n.cy}px`,
            animation: showSmall ? "pulseGlow 2s ease-in-out infinite" : undefined,
            transition: "opacity 600ms",
          }}
        />
      ))}
    </svg>
  );
}

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
  return (
    <div className="h-[calc(100vh-160px)] max-w-6xl mx-auto px-4 py-3 flex flex-col fade-in">
      <h2 className="font-bold text-[color:var(--teal)] text-[22px] md:text-[26px] leading-tight text-center">
        {t(lang, "Tu turno: elegí un desafío", "Your turn: pick a challenge")}
      </h2>

      <div className="mt-3 grid md:grid-cols-2 gap-5 flex-1 min-h-0">
        {/* LEFT: instructions + choices */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          <p className="text-sm md:text-base">
            {t(
              lang,
              "Ya sabés que tu cerebro puede cambiar. ¿Qué hace que eso ocurra? Empieza con una decisión.",
              "You already know your brain can change. What makes it happen? It starts with a choice.",
            )}
          </p>

          <div className="mt-2 rounded-lg border border-[color:var(--teal)]/40 bg-[color:var(--teal)]/5 p-2.5 text-[13px] leading-snug">
            <span className="font-bold text-[color:var(--teal)]">
              {t(lang, "Qué hacer: ", "What to do: ")}
            </span>
            {t(
              lang,
              "Elegí la opción que realmente harías y mirá qué le pasa a tu cerebro.",
              "Pick the option you'd actually do and watch what happens to your brain.",
            )}
          </div>

          <p className="mt-2 text-[13px] text-[color:var(--muted)]">
            {t(
              lang,
              "Tu profe te da dos opciones de tarea:",
              "Your teacher gives you two homework options:",
            )}
          </p>

          <div className="mt-2 flex flex-col gap-2">
            {(["easy", "hard"] as const).map((k) => {
              const isHard = k === "hard";
              const sel = choice === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setChoice(k)}
                  className="relative rounded-xl p-3 text-left transition-all"
                  style={{
                    backgroundColor: isHard ? "#0D2040" : "var(--easy-bg)",
                    border: sel
                      ? "2px solid var(--teal)"
                      : isHard
                        ? "1px solid var(--teal)"
                        : "1px solid var(--stage-upcoming)",
                    boxShadow: isHard ? "0 0 6px rgba(0,194,199,0.35)" : undefined,
                  }}
                >
                  {sel && (
                    <span className="absolute top-1.5 right-2 text-[color:var(--teal)]">✓</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{isHard ? "🧩" : "📋"}</span>
                    <span className="font-bold text-sm">
                      {isHard
                        ? t(lang, "El problema difícil", "The hard problem")
                        : t(lang, "Ejercicios de práctica", "Practice exercises")}
                    </span>
                  </div>
                  <div className="text-[12px] text-[color:var(--muted)] mt-1 leading-snug">
                    {isHard
                      ? t(
                          lang,
                          "Resolvé 5 problemas de álgebra que nunca viste.",
                          "Solve 5 algebra problems you've never seen.",
                        )
                      : t(
                          lang,
                          "Resolvé 20 multiplicaciones que ya sabés hacer.",
                          "Solve 20 multiplications you already know.",
                        )}
                  </div>
                </button>
              );
            })}
          </div>

          {choice && (
            <p className="mt-2 text-[12px] italic text-[color:var(--muted)] fade-in">
              {choice === "easy"
                ? t(
                    lang,
                    "Tiene sentido elegir lo fácil. Pero tu cerebro necesita esfuerzo para cambiar.",
                    "Easy is comfortable. But your brain needs effort to change.",
                  )
                : t(
                    lang,
                    "Elegiste el desafío — eso activa el cambio en tu cerebro.",
                    "You chose the challenge — that activates change in your brain.",
                  )}
            </p>
          )}

          {choice && (
            <div className="mt-auto pt-2 flex justify-start fade-in">
              <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
            </div>
          )}
        </div>

        {/* RIGHT: nested brain */}
        <div className="flex flex-col items-center justify-center min-h-0">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[color:var(--muted)] mb-1">
            {t(lang, "Tu cerebro", "Your brain")}
          </p>
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            <NestedBrain choice={choice} />
          </div>
          <p
            className="mt-1 text-sm text-center max-w-sm font-bold"
            style={{
              color:
                choice === null
                  ? "var(--muted)"
                  : "var(--teal)",
            }}
          >
            {choice === null
              ? t(lang, "Tu cerebro está listo. Elegí.", "Your brain is ready. Make a choice.")
              : choice === "easy"
                ? t(
                    lang,
                    "Cerebro pequeño, pocas conexiones nuevas.",
                    "Small brain, few new connections.",
                  )
                : t(
                    lang,
                    "Cerebro más grande, muchas conexiones nuevas.",
                    "Bigger brain, many new connections.",
                  )}
          </p>
        </div>
      </div>
    </div>
  );
}
