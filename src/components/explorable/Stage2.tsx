import { useMemo, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

const GRID = 5;
const SPACING = 56;
const OFFSET = 30;

type Edge = { id: string; from: [number, number]; to: [number, number] };

function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (c < GRID - 1) edges.push({ id: `h-${r}-${c}`, from: [r, c], to: [r, c + 1] });
      if (r < GRID - 1) edges.push({ id: `v-${r}-${c}`, from: [r, c], to: [r + 1, c] });
    }
  }
  return edges;
}

function pos(r: number, c: number) {
  return { x: OFFSET + c * SPACING, y: OFFSET + r * SPACING };
}

const cityStyles = [
  { stroke: "#666688", w: 1, dash: "4 2" },
  { stroke: "#8B6914", w: 2, dash: "4 2" },
  { stroke: "#AAAAAA", w: 2, dash: "" },
  { stroke: "#FFFFFF", w: 3, dash: "" },
  { stroke: "#FFD166", w: 4, dash: "", glow: true },
];

export default function Stage2({
  lang,
  connections,
  setConnections,
  onNext,
}: {
  lang: Lang;
  connections: Record<string, number>;
  setConnections: (c: Record<string, number>) => void;
  onNext: () => void;
}) {
  const edges = useMemo(buildEdges, []);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const total = Object.values(connections).filter((v) => v >= 1).length;
  const highways = Object.values(connections).filter((v) => v >= 4).length;
  const level2plus = Object.values(connections).filter((v) => v >= 2).length;

  // Show banner once at 8+
  if (level2plus >= 8 && !showBanner && !bannerDismissed) {
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
      setBannerDismissed(true);
    }, 4000);
  }

  const handleClick = (id: string) => {
    const cur = connections[id] ?? 0;
    if (cur >= 4) return;
    setConnections({ ...connections, [id]: cur + 1 });
  };

  const progressLabel = (() => {
    if (total === 0) return t(lang, "Tu cerebro está en reposo. ¡Empezá a aprender!", "Your brain is at rest. Start learning!");
    if (total <= 3) return t(lang, "Estás construyendo caminos de tierra...", "You're building dirt roads...");
    if (total <= 6) return t(lang, "Las calles se están pavimentando 🧠", "The streets are getting paved 🧠");
    if (total <= 9) return t(lang, "¡Las conexiones se están fortaleciendo!", "The connections are getting stronger!");
    if (total <= 12) return t(lang, "Tu cerebro está construyendo autopistas ⚡", "Your brain is building highways ⚡");
    return t(lang, "¡Neuroplasticidad en acción! Tu cerebro ha cambiado.", "Neuroplasticity in action! Your brain has changed.");
  })();

  const neuronLabel = (() => {
    if (level2plus === 0) return t(lang, "Neurona en reposo", "Neuron at rest");
    if (level2plus <= 3) return t(lang, "Primeras conexiones formándose...", "First connections forming...");
    if (level2plus <= 8) return t(lang, "La red neuronal crece 🔬", "The neural network grows 🔬");
    return t(lang, "¡Red neuronal activa! Así se forma la inteligencia.", "Neural network active! This is how intelligence forms.");
  })();

  // Interpolate bg
  const ratio = Math.min(total / 20, 1);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * ratio);
  const r = lerp(0x1a, 0x0d), g = lerp(0x0a, 0x2b), b = lerp(0x3b, 0x3e);
  const bgColor = `rgb(${r}, ${g}, ${b})`;

  const totalSize = OFFSET * 2 + (GRID - 1) * SPACING;

  const totalConnections = Object.values(connections).filter((v) => v > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8 fade-in">
      <div>
        <h2 className="text-xl font-bold text-[color:var(--teal)]">
          {t(lang, "Las conexiones más fuertes hacen un cerebro más inteligente", "Stronger connections make a smarter brain")}
        </h2>
        <div className="mt-4 space-y-4 text-sm">
          {t(
            lang,
            `Imagina que tu cerebro es una ciudad. Cada vez que aprendés algo nuevo, se construye una nueva calle entre dos barrios que antes no estaban conectados. Al principio esa calle es un camino de tierra — lento y difícil de transitar. Pero cada vez que practicás, esa calle se pavimenta, se ensancha, y con el tiempo se convierte en una autopista.|Ahora reemplazá los barrios por neuronas y las calles por conexiones entre ellas — y tenés exactamente lo que está pasando en tu cerebro cuando aprendés.|Las conexiones entre tus neuronas pueden ser débiles o fuertes. Cuando te esforzás por aprender algo nuevo, esas conexiones se vuelven más fuertes. Y entre más practicás, más fuertes se vuelven.|Con el tiempo, esas conexiones más fuertes te hacen más inteligente en una materia.|Eso no es solo una metáfora — es biología. Los científicos lo llaman neuroplasticidad: la capacidad de tu cerebro de cambiar físicamente en respuesta al aprendizaje. Y lo mejor es que ese proceso no tiene un límite fijo.`,
            `Imagine your brain is a city. Every time you learn something new, a new street is built between two neighborhoods that weren't connected before. At first that street is a dirt road — slow and hard to travel. But every time you practice, the street gets paved, widened, and over time it becomes a highway.|Now replace the neighborhoods with neurons and the streets with connections between them — and you have exactly what is happening in your brain when you learn.|Connections between your neurons can be weak or strong. When you work hard to learn something new, those connections grow stronger. And the more you practice, the stronger they become.|Over time, those stronger connections make you more intelligent in a subject.|That's not just a metaphor — it's biology. Scientists call it neuroplasticity: your brain's ability to physically change in response to learning. And the best part is that process has no fixed limit.`,
          )
            .split("|")
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
        <p className="mt-6 font-bold text-[color:var(--teal)]" aria-live="polite">
          {progressLabel}
        </p>
        {totalConnections >= 1 && (
          <div className="mt-8 flex justify-start">
            <NextButton onClick={onNext} disabled={level2plus < 4}>
              {t(lang, "Siguiente →", "Next →")}
            </NextButton>
          </div>
        )}
      </div>

      <div
        className="relative rounded-2xl p-4 transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      >
        {showBanner && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-[color:var(--teal)] text-[color:var(--bg)] p-3 text-sm font-bold text-center slide-down rounded-t-2xl">
            {t(
              lang,
              "¡Tu cerebro acaba de cambiar! Cada vez que practicás algo difícil, esto es lo que pasa en tu mente.",
              "Your brain just changed! Every time you practice something hard, this is what happens in your mind.",
            )}
          </div>
        )}

        {/* TOP: City */}
        <div className="flex flex-col items-center">
          <svg width={totalSize} height={totalSize} className="max-w-full">
            {edges.map((e) => {
              const lvl = connections[e.id] ?? 0;
              const s = cityStyles[lvl];
              const p1 = pos(...e.from);
              const p2 = pos(...e.to);
              return (
                <line
                  key={e.id}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={s.stroke}
                  strokeWidth={s.w}
                  strokeDasharray={s.dash || undefined}
                  style={{
                    cursor: "pointer",
                    filter: s.glow ? "drop-shadow(0 0 6px #FFD166)" : undefined,
                    transition: "all 300ms",
                  }}
                  onClick={() => handleClick(e.id)}
                />
              );
            })}
            {/* invisible clickable overlays for thin lines */}
            {edges.map((e) => {
              const p1 = pos(...e.from);
              const p2 = pos(...e.to);
              return (
                <line
                  key={`hit-${e.id}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="transparent"
                  strokeWidth={14}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(e.id)}
                />
              );
            })}
            {Array.from({ length: GRID }).map((_, r) =>
              Array.from({ length: GRID }).map((_, c) => {
                const p = pos(r, c);
                return (
                  <g key={`n-${r}-${c}`}>
                    <circle cx={p.x} cy={p.y} r={14} fill="#444466" />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12">
                      🏘️
                    </text>
                  </g>
                );
              }),
            )}
          </svg>
          <p className="mt-2 text-sm text-[color:var(--muted)]" aria-live="polite">
            {t(lang, `Calles construidas: ${total} | Autopistas: ${highways}`, `Streets built: ${total} | Highways: ${highways}`)}
          </p>
        </div>

        <div className="my-4 h-px bg-[color:var(--teal)] relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[color:var(--bg)] px-2 text-xs text-[color:var(--teal)]">
            {t(lang, "Lo mismo, visto de dos formas", "The same thing, seen two ways")}
          </span>
        </div>

        {/* BOTTOM: Neurons */}
        <div className="flex flex-col items-center">
          <svg width={totalSize} height={totalSize} className="max-w-full">
            {edges.map((e) => {
              const lvl = connections[e.id] ?? 0;
              if (lvl === 0) return null;
              const p1 = pos(...e.from);
              const p2 = pos(...e.to);
              const styles = [
                null,
                { stroke: "#888", w: 1, op: 0.2 },
                { stroke: "#00C2C7", w: 1, op: 0.6 },
                { stroke: "#00C2C7", w: 2, op: 0.9, glow: true },
                { stroke: "#00C2C7", w: 3, op: 1, glow: true, travel: true },
              ];
              const s = styles[lvl]!;
              return (
                <g key={`nl-${e.id}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={s.stroke}
                    strokeWidth={s.w}
                    opacity={s.op}
                    style={{
                      filter: s.glow ? "drop-shadow(0 0 4px #00C2C7)" : undefined,
                    }}
                  />
                  {s.travel && (
                    <circle r={3} fill="#FFD166" style={{ filter: "drop-shadow(0 0 4px #FFD166)" }}>
                      <animateMotion dur="1.2s" repeatCount="indefinite" path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`} />
                    </circle>
                  )}
                </g>
              );
            })}
            {Array.from({ length: GRID }).map((_, r) =>
              Array.from({ length: GRID }).map((_, c) => {
                const p = pos(r, c);
                // count active connections for this node
                let active = 0;
                edges.forEach((e) => {
                  const lvl = connections[e.id] ?? 0;
                  if (lvl >= 2 && ((e.from[0] === r && e.from[1] === c) || (e.to[0] === r && e.to[1] === c))) active++;
                });
                const scale = active >= 3 ? 1.15 : 1;
                return (
                  <g key={`neuron-${r}-${c}`} style={{ transform: `scale(${scale})`, transformOrigin: `${p.x}px ${p.y}px`, transition: "transform 300ms" }}>
                    {[0, 72, 144, 216, 288].map((a, i) => {
                      const rad = (a * Math.PI) / 180;
                      const len = active >= 3 ? 14 : 10;
                      return (
                        <line
                          key={i}
                          x1={p.x}
                          y1={p.y}
                          x2={p.x + Math.cos(rad) * len}
                          y2={p.y + Math.sin(rad) * len}
                          stroke="#00C2C7"
                          strokeWidth={1}
                          opacity={0.7}
                        />
                      );
                    })}
                    <circle cx={p.x} cy={p.y} r={12} fill="#1A0A3B" stroke="#00C2C7" strokeWidth={1} />
                  </g>
                );
              }),
            )}
          </svg>
          <p className="mt-2 text-sm text-[color:var(--muted)]" aria-live="polite">
            {neuronLabel}
          </p>
        </div>

        {totalConnections === 0 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ animation: "arrowPulse 1.5s ease-in-out infinite" }}>
            <div className="text-3xl text-[color:var(--gold)]">↓</div>
            <div className="text-xs bg-[color:var(--gold)] text-[color:var(--bg)] px-2 py-1 rounded">
              {t(lang, "Hacé clic en una calle para empezar a pavimentarla", "Click a street to start paving it")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
