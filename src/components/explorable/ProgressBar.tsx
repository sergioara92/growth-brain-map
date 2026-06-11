import { stageLabels } from "./i18n";
import type { Lang } from "./i18n";

/**
 * Vertical neuron-graph sidebar.
 *
 * Logical neurons (left → top to bottom):
 *   1  Beliefs                       (stage 1)
 *   2  How the brain works           (stage 2)
 *   3  How to change it              (stage 3)
 *      ├ 3a The challenge            (stage 4)
 *      ├ 3b The mistake              (stage 5)
 *      └ 3c Attributions of failure  (stage 6)
 *   F  Now what?                     (stage 7)
 */
export default function ProgressBar({ stage, lang }: { stage: number; lang: Lang }) {
  const VB_W = 220;
  const VB_H = 760;
  const SOMA_R = 18;
  const SUB_R = 13;

  type Node = {
    id: string;
    stage: number;
    x: number;
    y: number;
    r: number;
    label: { es: string; en: string };
    numberLabel: string;
    isSub?: boolean;
  };

  const COL = 52;     // main column x
  const SUB_COL = 92; // sub-neurons indented x

  const nodes: Node[] = [
    { id: "N1", stage: 1, x: COL,     y: 60,  r: SOMA_R, label: stageLabels[0], numberLabel: "1" },
    { id: "N2", stage: 2, x: COL,     y: 170, r: SOMA_R, label: stageLabels[1], numberLabel: "2" },
    { id: "N3", stage: 3, x: COL,     y: 290, r: SOMA_R, label: stageLabels[2], numberLabel: "3" },
    { id: "N3a", stage: 4, x: SUB_COL, y: 380, r: SUB_R, label: stageLabels[3], numberLabel: "3a", isSub: true },
    { id: "N3b", stage: 5, x: SUB_COL, y: 460, r: SUB_R, label: stageLabels[4], numberLabel: "3b", isSub: true },
    { id: "N3c", stage: 6, x: SUB_COL, y: 540, r: SUB_R, label: stageLabels[5], numberLabel: "3c", isSub: true },
    { id: "F",  stage: 7, x: COL,     y: 660, r: SOMA_R, label: stageLabels[6], numberLabel: "★" },
  ];

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n] as const));

  const connections: { from: string; to: string }[] = [
    { from: "N1",  to: "N2"  },
    { from: "N2",  to: "N3"  },
    { from: "N3",  to: "N3a" },
    { from: "N3",  to: "N3b" },
    { from: "N3",  to: "N3c" },
    { from: "N3a", to: "F"   },
    { from: "N3b", to: "F"   },
    { from: "N3c", to: "F"   },
  ];

  const buildPath = (a: Node, b: Node) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const sx = a.x + ux * a.r;
    const sy = a.y + uy * a.r;
    const ex = b.x - ux * b.r;
    const ey = b.y - uy * b.r;
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    // perpendicular bow
    const px = -uy * 6;
    const py = ux * 6;
    return `M ${sx} ${sy} Q ${mx + px} ${my + py} ${ex} ${ey}`;
  };

  const synapseDots = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { x: Math.cos(a), y: Math.sin(a) };
  });

  const dendrites = [
    "M -16 -2 q -10 -4 -18 -12",
    "M -14 6 q -12 4 -20 14",
    "M 16 -2 q 10 -4 18 -12",
    "M 14 6 q 12 4 20 14",
  ];

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 w-[140px] md:w-[220px] bg-[color:var(--bg)]/85 backdrop-blur border-r border-[color:var(--stage-upcoming)] overflow-y-auto"
      aria-label="Progress"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMin meet"
        className="w-full h-auto block"
        role="navigation"
      >
        <defs>
          <radialGradient id="soma-active" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#8FB6FF" />
            <stop offset="55%" stopColor="#3B5BFF" />
            <stop offset="100%" stopColor="#1A0A3B" />
          </radialGradient>
          <radialGradient id="soma-done" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#6E8DFF" />
            <stop offset="60%" stopColor="#2A3FB8" />
            <stop offset="100%" stopColor="#1A0A3B" />
          </radialGradient>
          <radialGradient id="soma-upcoming" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#3A2D6E" />
            <stop offset="100%" stopColor="#1A0A3B" />
          </radialGradient>
          <filter id="neuron-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Axons */}
        {connections.map((c, i) => {
          const a = nodeById[c.from];
          const b = nodeById[c.to];
          const d = buildPath(a, b);
          const done = b.stage < stage;
          const active = b.stage === stage;
          const stroke = done || active ? "var(--teal)" : "var(--stage-upcoming)";
          const dash = done || active ? undefined : "4 6";
          return (
            <g key={`c-${i}`}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={done || active ? 2.2 : 1.4}
                strokeDasharray={dash}
                opacity={done ? 0.9 : active ? 0.85 : 0.5}
                style={done || active ? { filter: "drop-shadow(0 0 4px var(--teal))" } : undefined}
              />
              {active && (
                <circle r="3" fill="#7FFCFF" style={{ filter: "drop-shadow(0 0 6px #00E5EA)" }}>
                  <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Neurons */}
        {nodes.map((n) => {
          const isActive = n.stage === stage;
          const isDone = n.stage < stage;
          const fill = isActive
            ? "url(#soma-active)"
            : isDone
            ? "url(#soma-done)"
            : "url(#soma-upcoming)";
          const rim = isActive ? "#7FFCFF" : isDone ? "#5A77FF" : "#3A2D6E";
          const dotFill = isActive ? "#7FFCFF" : isDone ? "#8FB6FF" : "#5A4A8A";
          const dendriteStroke = isActive ? "#5A77FF" : isDone ? "#3F52B8" : "#2E2454";
          const labelColor = isActive ? "var(--teal)" : isDone ? "#FFFFFF" : "var(--stage-upcoming)";
          const labelX = n.x + n.r + 10;
          const labelFontSize = n.isSub ? 10 : 11;
          const numberFontSize = n.isSub ? 10 : 12;

          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              <g
                fill="none"
                stroke={dendriteStroke}
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={isActive ? 0.85 : isDone ? 0.6 : 0.35}
              >
                {dendrites.map((d, k) => (
                  <path key={k} d={d} />
                ))}
              </g>

              {isActive && (
                <circle
                  r={n.r + 5}
                  fill="#3B5BFF"
                  opacity={0.25}
                  style={{ filter: "blur(6px)" }}
                />
              )}

              <circle
                r={n.r}
                fill={fill}
                stroke={rim}
                strokeWidth={isActive ? 1.8 : 1.2}
                style={isActive ? { filter: "drop-shadow(0 0 6px #3B5BFF)" } : undefined}
              />

              <g filter={isActive ? "url(#neuron-glow)" : undefined}>
                {synapseDots.map((p, k) => (
                  <circle
                    key={k}
                    cx={p.x * n.r}
                    cy={p.y * n.r}
                    r={isActive ? 1.6 : 1.1}
                    fill={dotFill}
                    opacity={isActive ? 0.95 : isDone ? 0.8 : 0.45}
                  />
                ))}
              </g>

              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={numberFontSize}
                fontWeight={700}
                fill="#FFFFFF"
                style={{ pointerEvents: "none" }}
              >
                {n.numberLabel}
              </text>

              {(() => {
                const raw = lang === "es" ? n.label.es : n.label.en;
                const lines = raw.split("\n");
                const yStart = 2 - ((lines.length - 1) * labelFontSize * 1.1) / 2;
                return (
                  <text
                    x={labelX - n.x}
                    y={yStart}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize={labelFontSize}
                    fill={labelColor}
                    className="hidden-on-mobile"
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {lines.map((line, i) => (
                      <tspan key={i} x={labelX - n.x} dy={i === 0 ? 0 : labelFontSize * 1.1}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              })()}

              <title>{lang === "es" ? n.label.es : n.label.en}</title>
            </g>
          );
        })}

        <style>{`
          @media (max-width: 767px) {
            .hidden-on-mobile { display: none; }
          }
          @media (prefers-reduced-motion: reduce) {
            animateMotion { display: none; }
          }
        `}</style>
      </svg>
    </aside>
  );
}
