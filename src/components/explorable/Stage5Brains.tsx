import { useMemo, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import { NextButton } from "./buttons";

type ColorKey = "green" | "yellow" | "red";

type NodeStyle = {
  fill: string;
  opacity: number;
  filter?: string;
  animate?: boolean;
  r: number;
};

const BRAIN_PATH =
  "M 40 70 C 30 50, 40 25, 65 22 C 75 10, 100 8, 115 18 C 135 12, 165 25, 165 55 C 175 65, 175 90, 160 100 C 158 120, 135 135, 110 130 C 95 142, 65 138, 55 122 C 38 115, 30 90, 40 70 Z";

const LAYOUTS: Record<ColorKey, { nodes: { x: number; y: number }[]; w: number; h: number; linkAll: boolean }> = {
  green: {
    // 9 nodes in 3x3 grid clipped roughly to brain area
    nodes: [
      { x: 70, y: 45 },
      { x: 100, y: 38 },
      { x: 130, y: 45 },
      { x: 65, y: 78 },
      { x: 100, y: 78 },
      { x: 135, y: 78 },
      { x: 75, y: 112 },
      { x: 100, y: 118 },
      { x: 125, y: 112 },
    ],
    w: 320,
    h: 256,
    linkAll: true,
  },
  yellow: {
    nodes: [
      { x: 100, y: 48 },
      { x: 140, y: 80 },
      { x: 100, y: 112 },
      { x: 60, y: 80 },
    ],
    w: 220,
    h: 176,
    linkAll: true,
  },
  red: {
    nodes: [{ x: 100, y: 80 }],
    w: 140,
    h: 112,
    linkAll: false,
  },
};

function nodeStyleFor(color: ColorKey): NodeStyle {
  switch (color) {
    case "green":
      return {
        fill: "#00C2C7",
        opacity: 1,
        filter: "drop-shadow(0 0 10px #00C2C7)",
        animate: true,
        r: 7,
      };
    case "yellow":
      return {
        fill: "#00C2C7",
        opacity: 0.65,
        filter: "drop-shadow(0 0 4px #00C2C7)",
        r: 8,
      };
    case "red":
      return {
        fill: "#666677",
        opacity: 0.85,
        r: 9,
      };
  }
}

function BrainViewer({ color }: { color: ColorKey }) {
  const layout = LAYOUTS[color];
  const ns = nodeStyleFor(color);
  const linkStroke = color === "green" ? "#00C2C7" : color === "yellow" ? "#00C2C7" : "transparent";
  const linkOpacity = color === "green" ? 0.75 : color === "yellow" ? 0.45 : 0;

  // pairwise links
  const links: { a: number; b: number }[] = [];
  if (layout.linkAll) {
    for (let i = 0; i < layout.nodes.length; i++) {
      for (let j = i + 1; j < layout.nodes.length; j++) {
        links.push({ a: i, b: j });
      }
    }
  }

  return (
    <svg viewBox="0 0 200 160" width={layout.w} height={layout.h} role="img" aria-label={`Brain ${color}`}>
      <path d={BRAIN_PATH} stroke="#444466" strokeWidth={2} fill="none" />
      {links.map((l, i) => {
        const a = layout.nodes[l.a];
        const b = layout.nodes[l.b];
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={linkStroke}
            strokeWidth={1.2}
            opacity={linkOpacity}
          />
        );
      })}
      {layout.nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={ns.r}
          fill={ns.fill}
          opacity={ns.opacity}
          style={{
            filter: ns.filter,
            transformOrigin: `${n.x}px ${n.y}px`,
            animation: ns.animate ? "pulseGlow 2s ease-in-out infinite" : undefined,
            transition: "fill 600ms, opacity 600ms",
          }}
        />
      ))}
    </svg>
  );
}

export default function Stage5Brains({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const [active, setActive] = useState<ColorKey | null>(null);
  const [visited, setVisited] = useState<Set<ColorKey>>(new Set());

  const select = (c: ColorKey) => {
    setActive(c);
    setVisited((prev) => {
      if (prev.has(c)) return prev;
      const n = new Set(prev);
      n.add(c);
      return n;
    });
  };

  const config: Record<ColorKey, {
    bg: string;
    ring: string;
    label: { es: string; en: string };
    caption: { es: string; en: string };
  }> = {
    green: {
      bg: "#10B981",
      ring: "#6EE7B7",
      label: { es: "Útil", en: "Helpful" },
      caption: {
        es: "Cerebro grande, con muchas conexiones nuevas.",
        en: "A bigger brain, with many new connections.",
      },
    },
    yellow: {
      bg: "#EAB308",
      ring: "#FDE68A",
      label: { es: "Sin estrategia", en: "No strategy" },
      caption: {
        es: "Cerebro mediano, con algunas conexiones.",
        en: "A medium brain, with some connections.",
      },
    },
    red: {
      bg: "#EF4444",
      ring: "#FCA5A5",
      label: { es: "No útil", en: "Not helpful" },
      caption: {
        es: "Cerebro pequeño, sin conexiones.",
        en: "A small brain, with no connections.",
      },
    },
  };

  const order: ColorKey[] = ["green", "yellow", "red"];
  const allVisited = useMemo(() => order.every((k) => visited.has(k)), [visited]);
  const current = active ? config[active] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 fade-in h-[calc(100dvh-72px)] min-h-[520px] flex flex-col">
      <p className="text-center max-w-2xl mx-auto text-[14px] md:text-[15px] leading-snug">
        {t(
          lang,
          "Las estrategias útiles activan más regiones de tu cerebro. El esfuerzo sin estrategia activa pocas. Y las actitudes de rendición las apagan.",
          "Helpful strategies activate more regions of your brain. Effort without strategy activates few. And giving-up attitudes shut them down.",
        )}
      </p>

      <p className="text-center mt-2 text-[12.5px] text-[color:var(--muted)]">
        {t(lang, "Tocá cada botón para ver qué pasa con tu cerebro.", "Tap each button to see what happens with your brain.")}
      </p>

      <div className="mt-3 flex justify-center gap-3 flex-wrap">
        {order.map((k) => {
          const c = config[k];
          const isActive = active === k;
          const isVisited = visited.has(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => select(k)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${!isVisited ? "animate-pulse" : ""}`}
              style={{
                backgroundColor: c.bg,
                color: "white",
                boxShadow: isActive ? `0 0 0 3px ${c.ring}, 0 6px 16px rgba(0,0,0,0.35)` : "0 2px 6px rgba(0,0,0,0.25)",
                transform: isActive ? "translateY(-2px)" : "none",
                minWidth: 140,
              }}
            >
              {t(lang, c.label.es, c.label.en)}
            </button>
          );
        })}
      </div>

      <div className="flex-1 mt-3 flex flex-col items-center justify-center min-h-0">
        {current && active ? (
          <div key={active} className="fade-in flex flex-col items-center">
            <BrainViewer color={active} />
            <p className="mt-2 text-center text-sm" style={{ color: current.ring }}>
              {t(lang, current.caption.es, current.caption.en)}
            </p>
          </div>
        ) : (
          <p className="text-[color:var(--muted)] text-sm italic">
            {t(lang, "Elegí un botón para empezar.", "Pick a button to start.")}
          </p>
        )}
      </div>

      <div className="mt-3 flex justify-center min-h-[56px]">
        {allVisited && (
          <div className="fade-in">
            <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
          </div>
        )}
      </div>
    </div>
  );
}
