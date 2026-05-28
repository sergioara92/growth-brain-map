import brainHero from "@/assets/brain-hero.png";

type Particle = { cx: number; cy: number; hue: "teal" | "magenta" | "white"; delay: number; dur: number };

// Coordinates are in the 1024x1024 image space, hand-placed roughly over the brain silhouette.
const PARTICLES: Particle[] = [
  { cx: 380, cy: 340, hue: "teal",    delay: 0.0, dur: 4.2 },
  { cx: 480, cy: 300, hue: "magenta", delay: 0.8, dur: 5.0 },
  { cx: 580, cy: 320, hue: "teal",    delay: 1.6, dur: 4.5 },
  { cx: 680, cy: 360, hue: "white",   delay: 0.4, dur: 3.8 },
  { cx: 760, cy: 430, hue: "magenta", delay: 2.2, dur: 5.4 },
  { cx: 340, cy: 460, hue: "white",   delay: 1.2, dur: 4.0 },
  { cx: 440, cy: 470, hue: "teal",    delay: 2.6, dur: 4.8 },
  { cx: 540, cy: 490, hue: "magenta", delay: 0.6, dur: 5.2 },
  { cx: 640, cy: 500, hue: "teal",    delay: 3.0, dur: 4.4 },
  { cx: 380, cy: 580, hue: "magenta", delay: 1.8, dur: 4.6 },
  { cx: 500, cy: 600, hue: "white",   delay: 0.2, dur: 5.0 },
  { cx: 600, cy: 590, hue: "teal",    delay: 2.4, dur: 4.2 },
  { cx: 720, cy: 540, hue: "magenta", delay: 1.0, dur: 4.8 },
  { cx: 460, cy: 380, hue: "white",   delay: 3.4, dur: 5.0 },
];

const HUE = {
  teal:    { core: "#a5f3fc", mid: "#22d3ee", shock: "#0891b2" },
  magenta: { core: "#fbcfe8", mid: "#e879f9", shock: "#c026d3" },
  white:   { core: "#ffffff", mid: "#bae6fd", shock: "#7dd3fc" },
};

const PATHS = [
  { d: "M 380 340 Q 430 280 480 300",      dur: 3.0, begin: 0.0 },
  { d: "M 480 300 Q 540 280 580 320",      dur: 2.8, begin: 0.6 },
  { d: "M 580 320 Q 640 320 680 360",      dur: 3.2, begin: 1.2 },
  { d: "M 440 470 Q 490 510 540 490",      dur: 2.6, begin: 0.3 },
  { d: "M 540 490 Q 600 530 640 500",      dur: 3.4, begin: 1.0 },
  { d: "M 500 600 Q 560 590 600 590",      dur: 2.4, begin: 1.8 },
];

export default function BrainSupernova({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <style>{`
        @keyframes supernova-core { 0%,100% { opacity: 0.2; transform: scale(0.6); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes supernova-mid  { 0%,100% { opacity: 0;   transform: scale(0.4); } 50% { opacity: 0.7; transform: scale(1.6); } }
        @keyframes supernova-shock{ 0% { opacity: 0.5; transform: scale(0.3); } 80%,100% { opacity: 0; transform: scale(2.4); } }
        @keyframes drift-glow     { 0%,100% { opacity: 0.25; } 50% { opacity: 0.55; } }
        .sn-core, .sn-mid, .sn-shock { transform-box: fill-box; transform-origin: center; }
        .sn-core  { animation: supernova-core  var(--dur,4s) ease-in-out var(--delay,0s) infinite; }
        .sn-mid   { animation: supernova-mid   var(--dur,4s) ease-in-out var(--delay,0s) infinite; }
        .sn-shock { animation: supernova-shock var(--dur,4s) ease-out    var(--delay,0s) infinite; }
        .sn-glow  { animation: drift-glow 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sn-core, .sn-mid, .sn-shock, .sn-glow { animation: none !important; }
          .sn-shock { opacity: 0; }
        }
      `}</style>
      <img
        src={brainHero}
        alt={alt}
        className="w-auto max-h-[42vh] md:max-h-[68vh] object-contain"
        width={1024}
        height={1024}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1024 1024"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="sn-glow-teal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sn-glow-magenta" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient breathing glows */}
        <circle className="sn-glow" cx="460" cy="420" r="220" fill="url(#sn-glow-teal)" style={{ animationDelay: "0s" }} />
        <circle className="sn-glow" cx="620" cy="480" r="200" fill="url(#sn-glow-magenta)" style={{ animationDelay: "3s" }} />
        <circle className="sn-glow" cx="540" cy="560" r="180" fill="url(#sn-glow-teal)" style={{ animationDelay: "6s" }} />

        {/* Supernova bursts */}
        {PARTICLES.map((p, i) => {
          const c = HUE[p.hue];
          const style = { ["--delay" as string]: `${p.delay}s`, ["--dur" as string]: `${p.dur}s` };
          return (
            <g key={i} style={style as React.CSSProperties}>
              <circle className="sn-shock" cx={p.cx} cy={p.cy} r="10" fill="none" stroke={c.shock} strokeWidth="1.5" />
              <circle className="sn-mid"   cx={p.cx} cy={p.cy} r="9"  fill={c.mid} />
              <circle className="sn-core"  cx={p.cx} cy={p.cy} r="2.5" fill={c.core} />
            </g>
          );
        })}

        {/* Travelling neural pulses */}
        {PATHS.map((p, i) => (
          <g key={`path-${i}`}>
            <path id={`sn-path-${i}`} d={p.d} fill="none" stroke="none" />
            <circle r="2.6" fill="#a5f3fc">
              <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite">
                <mpath href={`#sn-path-${i}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
