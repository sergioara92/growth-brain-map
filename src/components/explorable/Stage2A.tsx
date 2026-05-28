import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

const GRID = 3;
const SPACING = 116;
const PAD = 58;
const SIZE = PAD * 2 + (GRID - 1) * SPACING;

type Edge = { id: string; from: [number, number]; to: [number, number] };

function buildEdges(): Edge[] {
  const out: Edge[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (c < GRID - 1) out.push({ id: `s2a-h-${r}-${c}`, from: [r, c], to: [r, c + 1] });
      if (r < GRID - 1) out.push({ id: `s2a-v-${r}-${c}`, from: [r, c], to: [r + 1, c] });
    }
  }
  return out;
}

function pos(r: number, c: number) {
  return { x: PAD + c * SPACING, y: PAD + r * SPACING };
}

type Particle = { id: number; x: number; y: number; dx: number; dy: number; kind: "dirt" | "gold" };

export default function Stage2A({
  lang,
  connections,
  setConnections,
  onSubNext,
}: {
  lang: Lang;
  connections: Record<string, number>;
  setConnections: (c: Record<string, number>) => void;
  onSubNext: () => void;
}) {
  const edges = useMemo(buildEdges, []);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [banner, setBanner] = useState<"hidden" | "show" | "done">("hidden");
  const [particles, setParticles] = useState<Particle[]>([]);
  const pidRef = useRef(0);

  const built = edges.filter((e) => (connections[e.id] ?? 0) >= 1).length;
  const highways = edges.filter((e) => (connections[e.id] ?? 0) >= 4).length;
  const level2plus = edges.filter((e) => (connections[e.id] ?? 0) >= 2).length;

  useEffect(() => {
    if (level2plus >= 6 && banner === "hidden") {
      setBanner("show");
      const t = setTimeout(() => setBanner("done"), 4000);
      return () => clearTimeout(t);
    }
  }, [level2plus, banner]);

  const spawnParticles = (mx: number, my: number, kind: "dirt" | "gold") => {
    const n = kind === "dirt" ? 3 : 5;
    const news: Particle[] = [];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const r = 18 + Math.random() * 10;
      news.push({
        id: ++pidRef.current,
        x: mx,
        y: my,
        dx: Math.cos(a) * r,
        dy: Math.sin(a) * r,
        kind,
      });
    }
    setParticles((p) => [...p, ...news]);
    const dur = kind === "dirt" ? 400 : 600;
    setTimeout(() => {
      setParticles((p) => p.filter((x) => !news.find((n) => n.id === x.id)));
    }, dur + 50);
  };

  const handleClick = (e: Edge) => {
    const cur = connections[e.id] ?? 0;
    if (cur >= 4) return;
    const nxt = cur + 1;
    setConnections({ ...connections, [e.id]: nxt });
    if (!hintDismissed) setHintDismissed(true);
    const p1 = pos(...e.from);
    const p2 = pos(...e.to);
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    if (nxt === 1) spawnParticles(mx, my, "dirt");
    if (nxt === 4) spawnParticles(mx, my, "gold");
  };

  const progressLabel = (() => {
    if (built === 0) return t(lang, "Hacé clic en una calle para empezar.", "Click a street to get started.");
    if (built <= 2) return t(lang, "Estás construyendo caminos de tierra...", "You're building dirt roads...");
    if (built <= 5) return t(lang, "Las calles se están pavimentando 🧠", "The streets are getting paved 🧠");
    if (built <= 8) return t(lang, "¡Las conexiones se están fortaleciendo!", "The connections are getting stronger!");
    return t(lang, "Tu cerebro está construyendo autopistas ⚡", "Your brain is building highways ⚡");
  })();

  const ratio = Math.min(built / 12, 1);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * ratio);
  const bg = `rgb(${lerp(0x1a, 0x0d)}, ${lerp(0x0a, 0x2b)}, ${lerp(0x3b, 0x3e)})`;

  // count active connections per node (level >= 2)
  const nodeActive = (r: number, c: number) =>
    edges.filter(
      (e) =>
        (connections[e.id] ?? 0) >= 2 &&
        ((e.from[0] === r && e.from[1] === c) || (e.to[0] === r && e.to[1] === c)),
    ).length;

  const cityLineProps = (lvl: number) => {
    switch (lvl) {
      case 0: return { stroke: "#3D2F66", strokeWidth: 4 };
      case 1: return { stroke: "#8B6914", strokeWidth: 3, strokeDasharray: "8 4" };
      case 2: return { stroke: "#AAAAAA", strokeWidth: 3 };
      case 3: return { stroke: "#FFFFFF", strokeWidth: 4 };
      case 4: return { stroke: "#FFD166", strokeWidth: 5, filter: "url(#goldGlow)" };
      default: return {};
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid md:grid-cols-2 gap-8 fade-in">
      {/* TEXT */}
      <div>
        <h2 className="font-bold text-[color:var(--teal)]" style={{ fontSize: 22 }}>
          {t(lang, "Tu cerebro funciona como una ciudad", "Your brain works like a city")}
        </h2>
        <div className="mt-4 space-y-4" style={{ maxWidth: 380, fontSize: 16, lineHeight: 1.6 }}>
          {t(
            lang,
            `Cada vez que aprendés algo nuevo, se construye una nueva calle entre dos lugares que antes no estaban conectados.|Al principio esa calle es un camino de tierra — lento y difícil. Pero cada vez que practicás, se pavimenta, se ensancha, y con el tiempo se convierte en una autopista.|Ahora reemplazá los barrios por neuronas y las calles por conexiones entre ellas — y tenés exactamente lo que pasa en tu cerebro cuando aprendés.`,
            `Every time you learn something new, a new street is built between two places that weren't connected before.|At first that street is a dirt road — slow and hard to travel. But every time you practice, it gets paved, widened, and over time becomes a highway.|Now replace the neighborhoods with neurons and the streets with connections between them — and you have exactly what happens in your brain when you learn.`,
          )
            .split("|")
            .map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="mt-6 font-bold text-[color:var(--teal)]" aria-live="polite">{progressLabel}</p>

        {banner === "done" && (
          <div className="mt-8 fade-in">
            <NextButton onClick={onSubNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
          </div>
        )}
      </div>

      {/* SIM */}
      <div className="relative rounded-2xl p-4 transition-colors duration-500" style={{ backgroundColor: bg }}>
        {banner === "show" && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-[color:var(--teal)] text-[color:var(--bg)] p-3 text-sm font-bold text-center slide-down rounded-t-2xl">
            {t(
              lang,
              "¡Tu cerebro acaba de cambiar! Cada vez que practicás algo difícil, esto es lo que pasa.",
              "Your brain just changed! Every time you practice something hard, this is what happens.",
            )}
          </div>
        )}

        {/* CITY */}
        <div className="flex flex-col items-center relative">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="max-w-full">
              <defs>
                <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bldgGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* edges */}
              {edges.map((e) => {
                const lvl = connections[e.id] ?? 0;
                const p1 = pos(...e.from);
                const p2 = pos(...e.to);
                const lp = cityLineProps(lvl);
                return (
                  <line key={e.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...lp} style={{ transition: "all 300ms" }} />
                );
              })}
              {/* hit areas */}
              {edges.map((e) => {
                const p1 = pos(...e.from);
                const p2 = pos(...e.to);
                return (
                  <line
                    key={`hit-${e.id}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke="transparent" strokeWidth={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClick(e)}
                  />
                );
              })}
              {/* buildings */}
              {Array.from({ length: GRID }).map((_, r) =>
                Array.from({ length: GRID }).map((_, c) => {
                  const p = pos(r, c);
                  const act = nodeActive(r, c) >= 2;
                  const winOp = act ? 1 : 0.55;
                  return (
                    <g key={`b-${r}-${c}`} transform={`translate(${p.x - 12} ${p.y - 14})`} filter={act ? "url(#bldgGlow)" : undefined}>
                      <rect x={0} y={0} width={24} height={28} fill="#2A1A5E" stroke="#6655AA" strokeWidth={1} />
                      <rect x={4} y={4} width={5} height={5} fill="#FFD166" opacity={winOp} />
                      <rect x={15} y={4} width={5} height={5} fill="#FFD166" opacity={winOp} />
                      <rect x={4} y={13} width={5} height={5} fill="#FFD166" opacity={winOp} />
                      <rect x={15} y={13} width={5} height={5} fill="#FFD166" opacity={winOp} />
                      <rect x={9} y={20} width={6} height={8} fill="#FFD166" opacity={winOp} />
                    </g>
                  );
                }),
              )}
            </svg>

            {/* Particles overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.kind === "dirt" ? 6 : 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    background: p.kind === "dirt" ? "#8B6914" : "#FFD166",
                    borderRadius: p.kind === "dirt" ? "50%" : 0,
                    transform: p.kind === "gold" ? "rotate(45deg)" : undefined,
                    "--dx": `${p.dx}px`,
                    "--dy": `${p.dy}px`,
                    animation: `particleOut ${p.kind === "dirt" ? 400 : 600}ms ease-out forwards`,
                  } as React.CSSProperties}
                />
              ))}
            </div>

            {/* Onboarding hint */}
            {!hintDismissed && (
              <div
                className="absolute pointer-events-none text-center"
                style={{
                  left: (pos(0, 0).x + pos(0, 1).x) / 2 - 60,
                  top: pos(0, 0).y - 50,
                  width: 120,
                  animation: "arrowPulse 1.5s ease-in-out infinite",
                }}
              >
                <div className="text-2xl text-[color:var(--gold)]">↓</div>
                <div className="text-[11px] bg-[color:var(--gold)] text-[color:var(--bg)] px-2 py-1 rounded">
                  {t(lang, "Hacé clic en una calle para empezar a construir", "Click a street to start building")}
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-[13px] text-[color:var(--muted)]" aria-live="polite">
            {t(lang, `Calles construidas: ${built} | Autopistas: ${highways}`, `Streets built: ${built} | Highways: ${highways}`)}
          </p>
        </div>

        {/* Divider */}
        <div className="my-4 relative" style={{ height: 1 }}>
          <div className="absolute left-[10%] right-[10%] top-1/2 bg-[color:var(--teal)]" style={{ height: 1 }} />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2 px-2 text-[12px] text-[color:var(--teal)]" style={{ backgroundColor: "#1A0A3B" }}>
            {t(lang, "Lo mismo, visto de dos formas", "The same thing, seen two ways")}
          </span>
        </div>

        {/* NEURONS */}
        <div className="flex flex-col items-center">
          <svg width={SIZE} height={SIZE} className="max-w-full">
            <defs>
              <filter id="teaLineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="neuronBodyGlow">
                <stop offset="0%" stopColor="#00C2C7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00C2C7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* neuron edges */}
            {edges.map((e) => {
              const lvl = connections[e.id] ?? 0;
              if (lvl === 0) return null;
              const p1 = pos(...e.from);
              const p2 = pos(...e.to);
              const path = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
              if (lvl === 1) return <line key={`nl-${e.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#554488" strokeWidth={1} opacity={0.25} strokeDasharray="4 3" />;
              if (lvl === 2) return <line key={`nl-${e.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#00C2C7" strokeWidth={1.5} opacity={0.55} />;
              if (lvl === 3) return <line key={`nl-${e.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#00C2C7" strokeWidth={2.5} style={{ animation: "slowPulse 2s ease-in-out infinite" }} />;
              return (
                <g key={`nl-${e.id}`}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#00C2C7" strokeWidth={3} opacity={1} filter="url(#teaLineGlow)" />
                  <circle r={4} fill="#FFD166">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}

            {/* neurons */}
            {Array.from({ length: GRID }).map((_, r) =>
              Array.from({ length: GRID }).map((_, c) => {
                const p = pos(r, c);
                const act = nodeActive(r, c);
                const lit = act >= 2;
                const expanded = act >= 3;
                const dendStroke = lit ? "#00C2C7" : "#6655AA";
                const scale = expanded ? 1.15 : 1;
                const armOffset = expanded ? 4 : 0;
                return (
                  <g key={`nr-${r}-${c}`} style={{ transform: `scale(${scale})`, transformOrigin: `${p.x}px ${p.y}px`, transition: "transform 300ms" }}>
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                      const a = (deg * Math.PI) / 180;
                      const startX = p.x + Math.cos(a) * (16 + armOffset);
                      const startY = p.y + Math.sin(a) * (16 + armOffset);
                      const endX = p.x + Math.cos(a) * (16 + armOffset + 22);
                      const endY = p.y + Math.sin(a) * (16 + armOffset + 22);
                      const fork1A = a - 0.45;
                      const fork2A = a + 0.45;
                      const f1x = endX + Math.cos(fork1A) * 10;
                      const f1y = endY + Math.sin(fork1A) * 10;
                      const f2x = endX + Math.cos(fork2A) * 10;
                      const f2y = endY + Math.sin(fork2A) * 10;
                      return (
                        <g key={i}>
                          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={dendStroke} strokeWidth={1.2} style={{ transition: "stroke 300ms" }} />
                          <line x1={endX} y1={endY} x2={f1x} y2={f1y} stroke={dendStroke} strokeWidth={1} />
                          <line x1={endX} y1={endY} x2={f2x} y2={f2y} stroke={dendStroke} strokeWidth={1} />
                        </g>
                      );
                    })}
                    {/* axon */}
                    <line x1={p.x} y1={p.y + 16} x2={p.x + 4} y2={p.y + 34} stroke={dendStroke} strokeWidth={2} />
                    {lit && <circle cx={p.x} cy={p.y} r={22} fill="url(#neuronBodyGlow)" />}
                    <circle cx={p.x} cy={p.y} r={16} fill="#1A0A3B" stroke="#00C2C7" strokeWidth={1.5} />
                  </g>
                );
              }),
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
