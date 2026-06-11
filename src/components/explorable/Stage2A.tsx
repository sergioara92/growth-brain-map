import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

const GRID = 3;
const SPACING = 140;
const PAD = 60;
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

  const HIGHWAY_GOAL = 4;
  const progressLabel = (() => {
    if (built === 0) return t(lang, "Haz clic en una calle para empezar.", "Click a street to get started.");
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
      case 0: return { stroke: "#4A3B7A", strokeWidth: 1.5 };
      case 1: return { stroke: "#A0743A", strokeWidth: 4 };
      case 2: return { stroke: "#BBBBBB", strokeWidth: 5 };
      case 3: return { stroke: "#FFFFFF", strokeWidth: 6 };
      case 4: return { stroke: "#FFD166", strokeWidth: 7, filter: "url(#goldGlow)" };
      default: return {};
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] gap-4 items-stretch h-[calc(100dvh-72px)] min-h-[520px] overflow-hidden fade-in">
      {/* TEXT */}
      <div className="flex flex-col min-h-0 overflow-hidden">
        <h2 className="font-bold text-[color:var(--teal)] text-[18px] md:text-[20px] leading-tight">
          {t(lang, "Tu cerebro funciona como una ciudad", "Your brain works like a city")}
        </h2>
        <div className="mt-2 space-y-1" style={{ fontSize: 12.5, lineHeight: 1.4, maxWidth: 480 }}>
          {t(
            lang,
            `Cada vez que aprendes algo nuevo, se construye una nueva calle entre dos lugares que antes no estaban conectados.|Al principio esa calle es un camino de tierra — lento y difícil. Pero cada vez que practicas, se pavimenta, se ensancha, y con el tiempo se convierte en una autopista.|Ahora reemplaza los barrios por neuronas y las calles por conexiones entre ellas — y tienes exactamente lo que pasa en tu cerebro cuando aprendes.`,
            `Every time you learn something new, a new street is built between two places that weren't connected before.|At first that street is a dirt road — slow and hard to travel. But every time you practice, it gets paved, widened, and over time becomes a highway.|Now replace the neighborhoods with neurons and the streets with connections between them — and you have exactly what happens in your brain when you learn.`,
          )
            .split("|")
            .map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div
          className="mt-2 rounded-lg border border-[color:var(--teal)]/40 bg-[color:var(--teal)]/5 p-2 text-[11.5px] leading-snug"
          style={{ maxWidth: 480 }}
        >
          <p className="font-bold text-[color:var(--teal)] mb-0.5">
            {t(lang, "Cómo jugar", "How to play")}
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>
              {t(
                lang,
                "Haz clic en la misma calle varias veces para pavimentarla: tierra → pavimento → ancha → autopista (4 clics).",
                "Click the same street several times to pave it: dirt → paved → wide → highway (4 clicks).",
              )}
            </li>
            <li>
              {t(
                lang,
                `Construye al menos ${HIGHWAY_GOAL} autopistas para continuar.`,
                `Build at least ${HIGHWAY_GOAL} highways to continue.`,
              )}
            </li>
          </ul>
        </div>

        <p className="mt-1 font-bold text-[color:var(--teal)] text-[12px]" aria-live="polite">{progressLabel}</p>
        <p className="mt-0.5 text-[10.5px] text-[color:var(--muted)]" aria-live="polite">
          {t(
            lang,
            `Autopistas: ${highways} / ${HIGHWAY_GOAL}`,
            `Highways: ${highways} / ${HIGHWAY_GOAL}`,
          )}
        </p>

        <div className="mt-1.5">
          <NextButton onClick={onSubNext} disabled={highways < HIGHWAY_GOAL} pulse={highways === HIGHWAY_GOAL}>
            {t(lang, "Siguiente →", "Next →")}
          </NextButton>
          {highways < HIGHWAY_GOAL && (
            <p className="mt-1 text-[10.5px] text-[color:var(--muted)]">
              {t(
                lang,
                `Necesitás ${HIGHWAY_GOAL} autopistas para continuar.`,
                `You need ${HIGHWAY_GOAL} highways to continue.`,
              )}
            </p>
          )}
        </div>
      </div>


      {/* SIM */}
      <div className="relative rounded-2xl p-3 transition-colors duration-500 flex flex-col min-h-0 h-full" style={{ backgroundColor: bg }}>
        {banner === "show" && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-[color:var(--teal)] text-[color:var(--bg)] p-3 text-sm font-bold text-center slide-down rounded-t-2xl">
            {t(
              lang,
              "¡Tu cerebro acaba de cambiar! Cada vez que practicas algo difícil, esto es lo que pasa.",
              "Your brain just changed! Every time you practice something hard, this is what happens.",
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch flex-1 min-h-0">
          {/* CITY */}
          <div className="flex flex-col items-center min-h-0">
            <p className="text-[12px] uppercase tracking-[0.15em] text-[color:var(--teal)] mb-1 shrink-0">
              {t(lang, "Ciudad", "City")}
            </p>
            <div className="relative w-full flex-1 min-h-0 max-w-[400px] aspect-square mx-auto">
              <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
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
                {edges.map((e) => {
                  const lvl = connections[e.id] ?? 0;
                  const p1 = pos(...e.from);
                  const p2 = pos(...e.to);
                  if (lvl === 4) {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const len = Math.hypot(dx, dy);
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    return (
                      <g key={e.id} transform={`translate(${p1.x} ${p1.y}) rotate(${angle})`} style={{ transition: "all 300ms" }}>
                        {/* asphalt */}
                        <rect x={0} y={-9} width={len} height={18} fill="#2A2A33" stroke="#1A1A22" strokeWidth={0.5} />
                        {/* curbs */}
                        <rect x={0} y={-9} width={len} height={1.5} fill="#FFD166" filter="url(#goldGlow)" />
                        <rect x={0} y={7.5} width={len} height={1.5} fill="#FFD166" filter="url(#goldGlow)" />
                        {/* dashed center line */}
                        <line x1={0} y1={0} x2={len} y2={0} stroke="#FFE699" strokeWidth={1.4} strokeDasharray="7 5" opacity={0.95} />
                      </g>
                    );
                  }
                  const lp = cityLineProps(lvl);
                  return (
                    <line key={e.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...lp} style={{ transition: "all 300ms" }} />
                  );
                })}
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
                {Array.from({ length: GRID }).map((_, r) =>
                  Array.from({ length: GRID }).map((_, c) => {
                    const p = pos(r, c);
                    const act = nodeActive(r, c) >= 2;
                    const winOp = act ? 1 : 0.55;
                    return (
                      <g key={`b-${r}-${c}`} transform={`translate(${p.x - 15} ${p.y - 17})`} filter={act ? "url(#bldgGlow)" : undefined}>
                        <rect x={0} y={0} width={30} height={34} fill="#2A1A5E" stroke="#6655AA" strokeWidth={1} />
                        <rect x={5} y={5} width={6} height={6} fill="#FFD166" opacity={winOp} />
                        <rect x={19} y={5} width={6} height={6} fill="#FFD166" opacity={winOp} />
                        <rect x={5} y={16} width={6} height={6} fill="#FFD166" opacity={winOp} />
                        <rect x={19} y={16} width={6} height={6} fill="#FFD166" opacity={winOp} />
                        <rect x={11} y={24} width={8} height={10} fill="#FFD166" opacity={winOp} />
                      </g>
                    );
                  }),
                )}
              </svg>

              <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                  <rect
                    key={p.id}
                    x={p.x - 3}
                    y={p.y - 3}
                    width={6}
                    height={6}
                    fill={p.kind === "dirt" ? "#8B6914" : "#FFD166"}
                    rx={p.kind === "dirt" ? 3 : 0}
                    style={{
                      "--dx": `${p.dx}px`,
                      "--dy": `${p.dy}px`,
                      animation: `particleOut ${p.kind === "dirt" ? 400 : 600}ms ease-out forwards`,
                      transform: p.kind === "gold" ? "rotate(45deg)" : undefined,
                      transformOrigin: `${p.x}px ${p.y}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </svg>

              {!hintDismissed && (
                <div
                  className="absolute pointer-events-none text-center"
                  style={{
                    left: `${((pos(0, 0).x + pos(0, 1).x) / 2 / SIZE) * 100}%`,
                    top: `${(pos(0, 0).y / SIZE) * 100 - 8}%`,
                    transform: "translateX(-50%)",
                    width: 180,
                    animation: "arrowPulse 1.5s ease-in-out infinite",
                  }}
                >
                  <div className="text-2xl text-[color:var(--gold)]">↓</div>
                  <div className="text-[11px] bg-[color:var(--gold)] text-[color:var(--bg)] px-2 py-1 rounded">
                    {t(lang, "Haz clic varias veces en la misma calle para pavimentarla", "Click the same street several times to pave it")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NEURONS */}
          <div className="flex flex-col items-center min-h-0">
            <p className="text-[12px] uppercase tracking-[0.15em] text-[color:var(--teal)] mb-1 shrink-0">
              {t(lang, "Neuronas", "Neurons")}
            </p>
            <div className="w-full flex-1 min-h-0 max-w-[400px] aspect-square mx-auto">
              <svg width="100%" height="100%" viewBox={`-30 -30 ${SIZE + 60} ${SIZE + 60}`} preserveAspectRatio="xMidYMid meet">
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
                          const startX = p.x + Math.cos(a) * (18 + armOffset);
                          const startY = p.y + Math.sin(a) * (18 + armOffset);
                          const endX = p.x + Math.cos(a) * (18 + armOffset + 26);
                          const endY = p.y + Math.sin(a) * (18 + armOffset + 26);
                          const fork1A = a - 0.45;
                          const fork2A = a + 0.45;
                          const f1x = endX + Math.cos(fork1A) * 12;
                          const f1y = endY + Math.sin(fork1A) * 12;
                          const f2x = endX + Math.cos(fork2A) * 12;
                          const f2y = endY + Math.sin(fork2A) * 12;
                          return (
                            <g key={i}>
                              <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={dendStroke} strokeWidth={1.4} style={{ transition: "stroke 300ms" }} />
                              <line x1={endX} y1={endY} x2={f1x} y2={f1y} stroke={dendStroke} strokeWidth={1.1} />
                              <line x1={endX} y1={endY} x2={f2x} y2={f2y} stroke={dendStroke} strokeWidth={1.1} />
                            </g>
                          );
                        })}
                        <line x1={p.x} y1={p.y + 18} x2={p.x + 5} y2={p.y + 40} stroke={dendStroke} strokeWidth={2.2} />
                        {lit && <circle cx={p.x} cy={p.y} r={26} fill="url(#neuronBodyGlow)" />}
                        <circle cx={p.x} cy={p.y} r={18} fill="#1A0A3B" stroke="#00C2C7" strokeWidth={1.5} />
                      </g>
                    );
                  }),
                )}
              </svg>
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-[12px] text-[color:var(--muted)] shrink-0" aria-live="polite">
          {t(lang, `Calles: ${built} · Autopistas: ${highways} / ${HIGHWAY_GOAL}`, `Streets: ${built} · Highways: ${highways} / ${HIGHWAY_GOAL}`)}
        </p>
      </div>
    </div>
  );
}
