import { stageLabels, pathLabels } from "./i18n";
import type { Lang } from "./i18n";

/**
 * Causal-diagram neuron progress bar.
 *
 * Topology mirrors the conceptual flow students build in their minds:
 *   A → B → C → D → E ─┬─ F1 ─┐
 *                       ├─ F2 ─┤─ G
 *                       └─ F3 ─┘
 *
 * - Stages 1-5 are linear neurons A..E.
 * - Stage 6 is represented by three parallel neurons F1/F2/F3 that share the
 *   same active/done state (the three columns inside Stage5.tsx).
 * - Stage 7 is the converging neuron G.
 *
 * Neurons start dim and light up as the student advances.
 */
export default function ProgressBar({ stage, lang }: { stage: number; lang: Lang }) {
  const VB_W = 1400;
  const VB_H = 220;
  const SOMA_R = 24;

  type Node = {
    id: string;
    stage: number; // logical stage this neuron belongs to
    x: number;
    y: number;
    label: { es: string; en: string };
    numberLabel: string;
  };

  const nodes: Node[] = [
    { id: "A",  stage: 1, x: 80,   y: 110, label: stageLabels[0], numberLabel: "1" },
    { id: "B",  stage: 2, x: 230,  y: 110, label: stageLabels[1], numberLabel: "2" },
    { id: "C",  stage: 3, x: 380,  y: 110, label: stageLabels[2], numberLabel: "3" },
    { id: "D",  stage: 4, x: 530,  y: 110, label: stageLabels[3], numberLabel: "4" },
    { id: "E",  stage: 5, x: 680,  y: 110, label: stageLabels[4], numberLabel: "5" },
    { id: "F1", stage: 6, x: 950,  y: 40,  label: pathLabels[0],  numberLabel: "6a" },
    { id: "F2", stage: 6, x: 950,  y: 110, label: pathLabels[1],  numberLabel: "6b" },
    { id: "F3", stage: 6, x: 950,  y: 180, label: pathLabels[2],  numberLabel: "6c" },
    { id: "G",  stage: 7, x: 1220, y: 110, label: stageLabels[6], numberLabel: "7" },
  ];

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n] as const));

  // Connections (from -> to). toStage drives animated pulse when active.
  const connections: { from: string; to: string }[] = [
    { from: "A",  to: "B"  },
    { from: "B",  to: "C"  },
    { from: "C",  to: "D"  },
    { from: "D",  to: "E"  },
    { from: "E",  to: "F1" },
    { from: "E",  to: "F2" },
    { from: "E",  to: "F3" },
    { from: "F1", to: "G"  },
    { from: "F2", to: "G"  },
    { from: "F3", to: "G"  },
  ];

  // Curved cubic path from one soma rim to another along the line between centers.
  const buildPath = (a: Node, b: Node) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const sx = a.x + ux * SOMA_R;
    const sy = a.y + uy * SOMA_R;
    const ex = b.x - ux * SOMA_R;
    const ey = b.y - uy * SOMA_R;
    // Slight perpendicular bow so axons feel organic.
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const px = -uy * 8;
    const py = ux * 8;
    return `M ${sx} ${sy} Q ${mx + px} ${my + py} ${ex} ${ey}`;
  };

  // 8 synapse dots around each soma rim.
  const synapseDots = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { x: Math.cos(a) * SOMA_R, y: Math.sin(a) * SOMA_R };
  });

  const dendrites = [
    "M -22 0 q -18 -6 -34 -22",
    "M -20 10 q -22 8 -38 26",
    "M 22 0 q 18 6 34 -20",
    "M 20 12 q 24 10 40 28",
    "M 0 -22 q 4 -16 -10 -30",
    "M 0 22 q -4 16 12 30",
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-[color:var(--bg)]/85 backdrop-blur border-b border-[color:var(--stage-upcoming)]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-[120px] sm:h-[170px] block"
          aria-label="Progress"
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
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Axons (rendered first so neurons sit on top) */}
          {connections.map((c, i) => {
            const a = nodeById[c.from];
            const b = nodeById[c.to];
            const d = buildPath(a, b);
            const done = b.stage < stage; // axon fully traversed once target is past
            const active = b.stage === stage; // pulse is heading toward the active neuron
            const stroke = done || active ? "var(--teal)" : "var(--stage-upcoming)";
            const dash = done || active ? undefined : "4 6";
            return (
              <g key={`c-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={done || active ? 2.5 : 1.5}
                  strokeDasharray={dash}
                  opacity={done ? 0.9 : active ? 0.85 : 0.5}
                  style={done || active ? { filter: "drop-shadow(0 0 4px var(--teal))" } : undefined}
                />
                {active && (
                  <circle r="3.5" fill="#7FFCFF" style={{ filter: "drop-shadow(0 0 6px #00E5EA)" }}>
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

            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <g
                  fill="none"
                  stroke={dendriteStroke}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  opacity={isActive ? 0.85 : isDone ? 0.6 : 0.35}
                >
                  {dendrites.map((d, k) => (
                    <path key={k} d={d} />
                  ))}
                </g>

                {isActive && (
                  <circle
                    r={SOMA_R + 6}
                    fill="#3B5BFF"
                    opacity={0.25}
                    style={{ filter: "blur(6px)" }}
                  />
                )}

                <circle
                  r={SOMA_R}
                  fill={fill}
                  stroke={rim}
                  strokeWidth={isActive ? 1.8 : 1.2}
                  style={isActive ? { filter: "drop-shadow(0 0 8px #3B5BFF)" } : undefined}
                />

                <g filter={isActive ? "url(#neuron-glow)" : undefined}>
                  {synapseDots.map((p, k) => (
                    <circle
                      key={k}
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 1.8 : 1.3}
                      fill={dotFill}
                      opacity={isActive ? 0.95 : isDone ? 0.8 : 0.45}
                    />
                  ))}
                </g>

                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight={700}
                  fill="#FFFFFF"
                  style={{ pointerEvents: "none" }}
                >
                  {n.numberLabel}
                </text>

                <text
                  y={SOMA_R + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill={labelColor}
                  className="hidden-on-mobile"
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {lang === "es" ? n.label.es : n.label.en}
                </text>

                {isActive && <title>{lang === "es" ? n.label.es : n.label.en}</title>}
              </g>
            );
          })}

          <style>{`
            @media (max-width: 640px) {
              .hidden-on-mobile { display: none; }
            }
            @media (prefers-reduced-motion: reduce) {
              animateMotion { display: none; }
            }
          `}</style>
        </svg>
      </div>
    </div>
  );
}
