import { stageLabels } from "./i18n";
import type { Lang } from "./i18n";

/**
 * Neuron-chain progress bar: each stage is a glowing neuron soma with
 * decorative dendrites, connected by axon paths that carry a synaptic pulse
 * along the currently-active link.
 */
export default function ProgressBar({ stage, lang }: { stage: number; lang: Lang }) {
  const count = stageLabels.length;

  // Layout in SVG user-space
  const VB_W = 1200;
  const VB_H = 140;
  const PAD_X = 70;
  const SOMA_R = 22;
  const innerW = VB_W - PAD_X * 2;
  const step = innerW / (count - 1);
  const cy = 58;

  // 8 synapse dots around each soma
  const synapseDots = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { x: Math.cos(a) * SOMA_R, y: Math.sin(a) * SOMA_R };
  });

  // Decorative dendrites (relative to soma center)
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
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-[88px] sm:h-[112px] block"
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

          {/* Axon connectors */}
          {Array.from({ length: count - 1 }).map((_, i) => {
            const idx = i + 1;
            const x1 = PAD_X + step * i + SOMA_R;
            const x2 = PAD_X + step * (i + 1) - SOMA_R;
            const mx = (x1 + x2) / 2;
            const d = `M ${x1} ${cy} C ${mx} ${cy - 14}, ${mx} ${cy + 14}, ${x2} ${cy}`;
            const done = idx < stage;
            const active = idx === stage - 1 || idx === stage; // incoming to active
            const stroke = done ? "var(--teal)" : "var(--stage-upcoming)";
            const dash = done ? undefined : "4 6";
            return (
              <g key={`c-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={done ? 2.5 : 1.5}
                  strokeDasharray={dash}
                  opacity={done ? 0.9 : 0.55}
                  style={done ? { filter: "drop-shadow(0 0 4px var(--teal))" } : undefined}
                />
                {active && idx === stage - 1 && (
                  <circle r="3.5" fill="#7FFCFF" style={{ filter: "drop-shadow(0 0 6px #00E5EA)" }}>
                    <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Neurons */}
          {stageLabels.map((s, i) => {
            const idx = i + 1;
            const cx = PAD_X + step * i;
            const isActive = idx === stage;
            const isDone = idx < stage;
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
              <g key={i} transform={`translate(${cx} ${cy})`}>
                {/* Dendrites */}
                <g
                  fill="none"
                  stroke={dendriteStroke}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  opacity={isActive ? 0.85 : isDone ? 0.65 : 0.45}
                >
                  {dendrites.map((d, k) => (
                    <path key={k} d={d} />
                  ))}
                </g>

                {/* Soma glow (active only) */}
                {isActive && (
                  <circle
                    r={SOMA_R + 6}
                    fill="#3B5BFF"
                    opacity={0.25}
                    style={{ filter: "blur(6px)" }}
                  />
                )}

                {/* Soma body */}
                <circle
                  r={SOMA_R}
                  fill={fill}
                  stroke={rim}
                  strokeWidth={isActive ? 1.8 : 1.2}
                  style={isActive ? { filter: "drop-shadow(0 0 8px #3B5BFF)" } : undefined}
                />

                {/* Synapse dots around rim */}
                <g filter={isActive ? "url(#neuron-glow)" : undefined}>
                  {synapseDots.map((p, k) => (
                    <circle
                      key={k}
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 1.8 : 1.3}
                      fill={dotFill}
                      opacity={isActive ? 0.95 : isDone ? 0.8 : 0.5}
                    />
                  ))}
                </g>

                {/* Stage number */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="15"
                  fontWeight={700}
                  fill="#FFFFFF"
                  style={{ pointerEvents: "none" }}
                >
                  {idx}
                </text>

                {/* Title label below */}
                <text
                  y={SOMA_R + 32}
                  textAnchor="middle"
                  fontSize="11"
                  fill={labelColor}
                  className="hidden-on-mobile"
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {lang === "es" ? s.es : s.en}
                </text>

                {isActive && <title>{lang === "es" ? s.es : s.en}</title>}
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
