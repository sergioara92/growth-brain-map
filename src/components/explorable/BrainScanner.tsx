import { useId } from "react";

export type ZoneState = "resting" | "dim" | "active" | "glowing";
export type Zones = { Z1: ZoneState; Z2: ZoneState; Z3: ZoneState; Z4: ZoneState };

const ZONE_POS: Record<keyof Zones, { cx: number; cy: number }> = {
  Z1: { cx: 60, cy: 40 },
  Z2: { cx: 110, cy: 30 },
  Z3: { cx: 130, cy: 90 },
  Z4: { cx: 75, cy: 110 },
};

const LINKS: [keyof Zones, keyof Zones][] = [
  ["Z1", "Z2"],
  ["Z2", "Z3"],
  ["Z3", "Z4"],
  ["Z1", "Z4"],
];

const sizes = {
  small: { w: 100, h: 80 },
  medium: { w: 200, h: 160 },
  large: { w: 300, h: 240 },
};

function zoneStyle(state: ZoneState): { fill: string; opacity: number; filter?: string; animate?: boolean } {
  switch (state) {
    case "resting":
      return { fill: "transparent", opacity: 0 };
    case "dim":
      return { fill: "#444466", opacity: 0.4 };
    case "active":
      return { fill: "#00C2C7", opacity: 0.7, filter: "drop-shadow(0 0 4px #00C2C7)" };
    case "glowing":
      return { fill: "#00C2C7", opacity: 1, filter: "drop-shadow(0 0 12px #00C2C7)", animate: true };
  }
}

function linkOpacity(a: ZoneState, b: ZoneState): number {
  const active = (s: ZoneState) => s === "active" || s === "glowing";
  if (active(a) && active(b)) {
    return a === "glowing" && b === "glowing" ? 1 : 0.6;
  }
  return 0;
}

export default function BrainScanner({
  zones,
  label,
  size = "medium",
}: {
  zones: Zones;
  label?: string;
  size?: "small" | "medium" | "large";
}) {
  const { w, h } = sizes[size];
  const uid = useId();
  return (
    <div className="flex flex-col items-center gap-2" aria-live="polite">
      <svg
        viewBox="0 0 200 160"
        width={w}
        height={h}
        role="img"
        aria-label={label ?? "Brain scanner"}
      >
        {/* Brain silhouette path - stylized */}
        <path
          d="M 40 70 C 30 50, 40 25, 65 22 C 75 10, 100 8, 115 18 C 135 12, 165 25, 165 55 C 175 65, 175 90, 160 100 C 158 120, 135 135, 110 130 C 95 142, 65 138, 55 122 C 38 115, 30 90, 40 70 Z"
          stroke="#444466"
          strokeWidth="2"
          fill="none"
        />
        {/* Links */}
        {LINKS.map(([a, b], i) => {
          const op = linkOpacity(zones[a], zones[b]);
          if (op === 0) return null;
          return (
            <line
              key={i}
              x1={ZONE_POS[a].cx}
              y1={ZONE_POS[a].cy}
              x2={ZONE_POS[b].cx}
              y2={ZONE_POS[b].cy}
              stroke="#00C2C7"
              strokeWidth={1.5}
              opacity={op}
            />
          );
        })}
        {/* Zones */}
        {(Object.keys(ZONE_POS) as (keyof Zones)[]).map((k) => {
          const { cx, cy } = ZONE_POS[k];
          const s = zoneStyle(zones[k]);
          return (
            <circle
              key={k}
              cx={cx}
              cy={cy}
              r={18}
              fill={s.fill}
              opacity={s.opacity}
              style={{
                filter: s.filter,
                transformOrigin: `${cx}px ${cy}px`,
                animation: s.animate ? "pulseGlow 2s ease-in-out infinite" : undefined,
                transition: "fill 600ms, opacity 600ms",
              }}
            />
          );
        })}
        <title>{uid}</title>
      </svg>
      {label && <div className="text-sm text-[color:var(--muted)] text-center max-w-[260px]">{label}</div>}
    </div>
  );
}
