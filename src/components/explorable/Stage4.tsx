import { useEffect, useRef, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

const TEAL = "#00C2C7";

function TripleNestedBrain({ attempts }: { attempts: number }) {
  const smallLit = attempts >= 1;
  const mediumLit = attempts >= 3;
  const largeLit = attempts >= 5;

  // Brain-ish silhouette path (lobe shape)
  const lobePath = (cx: number, cy: number, r: number) => {
    // simple cloud-like brain silhouette using cubic bezier
    const r1 = r;
    const r2 = r * 0.78;
    return `
      M ${cx - r1} ${cy}
      C ${cx - r1} ${cy - r1 * 1.05}, ${cx - r1 * 0.3} ${cy - r1 * 1.15}, ${cx} ${cy - r1 * 0.95}
      C ${cx + r1 * 0.3} ${cy - r1 * 1.15}, ${cx + r1} ${cy - r1 * 1.05}, ${cx + r1} ${cy}
      C ${cx + r1 * 1.05} ${cy + r2 * 0.6}, ${cx + r1 * 0.5} ${cy + r2 * 1.1}, ${cx} ${cy + r2}
      C ${cx - r1 * 0.5} ${cy + r2 * 1.1}, ${cx - r1 * 1.05} ${cy + r2 * 0.6}, ${cx - r1} ${cy}
      Z
    `;
  };

  // Nodes & links per layer (positions relative to center 160,140)
  const cx = 160;
  const cy = 140;

  const largeNodes = [
    [60, 110], [80, 70], [120, 50], [165, 45], [210, 50], [250, 70], [270, 110],
    [255, 160], [220, 195], [165, 210], [110, 195], [75, 160],
  ];
  const largeLinks: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 0],
    [1, 11], [5, 7], [3, 9], [2, 10],
  ];

  const mediumNodes = [
    [110, 115], [135, 90], [165, 85], [195, 90], [220, 115],
    [200, 165], [165, 180], [130, 165],
  ];
  const mediumLinks: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [2, 6],
  ];

  const smallNodes = [
    [148, 130], [180, 130], [165, 155], [165, 110],
  ];
  const smallLinks: [number, number][] = [
    [0, 1], [0, 2], [1, 2],
  ];

  const renderLayer = (
    nodes: number[][],
    links: [number, number][],
    lit: boolean,
    glowDelay = 0,
  ) => {
    const stroke = lit ? TEAL : TEAL;
    const opacity = lit ? 1 : 0.22;
    return (
      <g
        opacity={opacity}
        style={{
          filter: lit ? `drop-shadow(0 0 6px ${TEAL})` : "none",
          transition: "opacity 600ms ease",
          animation: lit ? `pulseGlow 2.4s ease-in-out ${glowDelay}ms infinite` : "none",
        }}
      >
        {links.map(([a, b], i) => (
          <line
            key={`l-${i}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke={stroke}
            strokeWidth={lit ? 1.5 : 1}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={`n-${i}`}
            cx={x}
            cy={y}
            r={lit ? 5 : 3.5}
            fill={lit ? TEAL : "transparent"}
            stroke={TEAL}
            strokeWidth={1.2}
          />
        ))}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-[420px]" aria-hidden>
      {/* Large outline */}
      <path d={lobePath(cx, cy, 110)} fill="none" stroke={TEAL} strokeWidth={1.5} opacity={largeLit ? 0.9 : 0.35} />
      {/* Medium outline */}
      <path d={lobePath(cx, cy, 65)} fill="none" stroke={TEAL} strokeWidth={1.3} opacity={mediumLit ? 0.9 : 0.3} />
      {/* Small outline */}
      <path d={lobePath(cx, cy + 5, 32)} fill="none" stroke={TEAL} strokeWidth={1.1} opacity={smallLit ? 0.9 : 0.28} />

      {renderLayer(largeNodes, largeLinks, largeLit, 200)}
      {renderLayer(mediumNodes, mediumLinks, mediumLit, 100)}
      {renderLayer(smallNodes, smallLinks, smallLit, 0)}
    </svg>
  );
}

function isCorrect(input: string): boolean {
  if (!input) return false;
  // Extract integers (with optional sign)
  const nums = input.match(/-?\d+(?:\.\d+)?/g);
  if (!nums) return false;
  const vals = nums.map((n) => parseFloat(n));
  // Correct if includes -2 or -3
  return vals.includes(-2) || vals.includes(-3);
}

export default function Stage4({
  lang,
  challengeChoice,
  attempts,
  setAttempts,
  onNext,
}: {
  lang: Lang;
  challengeChoice: "easy" | "hard" | null;
  attempts: number;
  setAttempts: (n: number) => void;
  onNext: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);
  const [solved, setSolved] = useState(false);
  const [lastWasTimeout, setLastWasTimeout] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const bannerShown = useRef(false);
  const attemptsRef = useRef(attempts);
  attemptsRef.current = attempts;

  // countdown
  useEffect(() => {
    if (solved) return;
    if (timeLeft <= 0) {
      // timeout counts as attempt
      setLastWasTimeout(true);
      setAttempts(attemptsRef.current + 1);
      setAnswer("");
      setTimeLeft(5);
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, solved, setAttempts]);

  // banner at >= 5 attempts (once)
  useEffect(() => {
    if (attempts >= 5 && !bannerShown.current) {
      bannerShown.current = true;
      setShowBanner(true);
      const id = setTimeout(() => setShowBanner(false), 4500);
      return () => clearTimeout(id);
    }
  }, [attempts]);

  const handleVerify = () => {
    if (solved) return;
    setLastWasTimeout(false);
    const ok = isCorrect(answer);
    setAttempts(attempts + 1);
    if (ok) {
      setSolved(true);
    } else {
      setAnswer("");
      setTimeLeft(5);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };

  const attemptLabel = (() => {
    if (solved) return t(lang, "¡Lo lograste! El error fue parte del proceso.", "You got it! The mistake was part of the process.");
    if (attempts === 0) return "";
    if (lastWasTimeout) return t(lang, "Se acabó el tiempo — cuenta como intento.", "Time's up — counts as an attempt.");
    if (attempts === 1) return t(lang, "Primer intento. Normal equivocarse.", "First attempt. Normal to make mistakes.");
    if (attempts === 2) return t(lang, "Segundo intento. Tu cerebro está ajustando.", "Second attempt. Your brain is adjusting.");
    if (attempts === 3) return t(lang, "Tercer intento. Algo está cambiando.", "Third attempt. Something is changing.");
    if (attempts === 4) return t(lang, "Cuarto intento. Las conexiones se fortalecen.", "Fourth attempt. Connections are strengthening.");
    return t(lang, "Sigue intentando — cada intento construye conexión.", "Keep going — each attempt builds connection.");
  })();

  const icons = Array.from({ length: attempts }).map((_, i) => {
    const n = i + 1;
    if (solved && i === attempts - 1) return { ic: "✓", color: TEAL };
    if (n <= 2) return { ic: "✗", color: "#FF6B6B" };
    if (n <= 4) return { ic: "◑", color: "#FFD166" };
    return { ic: "✓", color: TEAL };
  });

  const timerColor = timeLeft <= 2 ? "#FF6B6B" : TEAL;

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 fade-in" style={{ minHeight: "calc(100dvh - 60px)" }}>
      {/* Compact header */}
      <div className="text-center max-w-3xl mx-auto space-y-1 mb-4">
        <p className="text-sm text-[color:var(--muted)]">
          {challengeChoice === "hard"
            ? t(lang, "Elegiste el problema difícil. Lo que viene es inevitable…", "You chose the hard problem. What comes next is inevitable…")
            : t(lang, "Imaginá que intentás el problema difícil.", "Imagine you try the hard problem.")}
        </p>
        <p className="text-xl md:text-2xl font-bold">
          {t(lang, "Te vas a equivocar.", "You're going to make mistakes.")}
        </p>
        <p className="text-sm">
          {t(lang, "Y eso es exactamente lo que tu cerebro necesita.", "And that is exactly what your brain needs.")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* LEFT — interactive */}
        <div className="rounded-xl border border-[color:var(--stage-upcoming)] p-5 bg-[color:var(--easy-bg)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">{t(lang, "Problema", "Problem")}</p>
            <div
              className="rounded-full px-3 py-1 font-mono font-bold text-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                color: timerColor,
                border: `1.5px solid ${timerColor}`,
                minWidth: 70,
                textAlign: "center",
                transition: "color 200ms",
              }}
              aria-live="polite"
            >
              ⏱ {timeLeft}s
            </div>
          </div>
          <p className="text-2xl font-bold mb-4">x² + 5x + 6 = 0</p>

          <label className="block text-sm text-[color:var(--muted)] mb-1">
            {t(lang, "Tu respuesta (valor de x)", "Your answer (value of x)")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="text"
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKey}
              disabled={solved}
              placeholder="x = ?"
              className="flex-1 rounded-lg px-4 py-3 text-lg font-bold bg-[color:var(--bg)] text-white outline-none"
              style={{ border: `2px solid ${TEAL}` }}
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={solved}
              className="rounded-lg px-5 font-bold text-white"
              style={{ backgroundColor: "var(--coral)", minHeight: 48, opacity: solved ? 0.6 : 1 }}
            >
              {t(lang, "Verificar", "Check")}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 min-h-[24px]">
            {icons.map((i, idx) => (
              <span
                key={idx}
                className="scale-in text-lg"
                style={{ color: i.color, width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                {i.ic}
              </span>
            ))}
          </div>

          <p className="mt-2 text-sm font-semibold" aria-live="polite">{attemptLabel}</p>
          {attempts >= 2 && (
            <p className="mt-1 text-xs italic text-[color:var(--teal)]/80 fade-in">
              {t(
                lang,
                "Cada intento libera neurotransmisores que refuerzan la conexión 🔬",
                "Each attempt releases neurotransmitters that reinforce the connection 🔬",
              )}
            </p>
          )}

          {attempts >= 3 && (
            <div className="mt-4 flex justify-center fade-in">
              <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
            </div>
          )}
        </div>

        {/* RIGHT — nested brains */}
        <div className="flex flex-col items-center relative">
          {showBanner && (
            <div className="absolute -top-2 left-0 right-0 bg-[color:var(--teal)] text-[color:var(--bg)] p-2 text-xs font-bold text-center slide-down rounded-lg z-10">
              {t(
                lang,
                "Esto es lo que se siente aprender de verdad. No la primera vez — sino cuando seguís intentando.",
                "This is what real learning feels like. Not the first try — but when you keep trying.",
              )}
            </div>
          )}
          <TripleNestedBrain attempts={attempts} />
          <p className="mt-2 text-sm text-[color:var(--muted)] text-center">
            {t(lang, `Intentos: ${attempts} — cuantos más, más conexiones.`, `Attempts: ${attempts} — the more you try, the more connections.`)}
          </p>
        </div>
      </div>
    </div>
  );
}
