import { useMemo, useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import BrainScanner, { type Zones } from "./BrainScanner";
import { NextButton } from "./buttons";

type ColorKey = "green" | "yellow" | "red";

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
    zones: Zones;
  }> = {
    green: {
      bg: "#10B981",
      ring: "#6EE7B7",
      label: { es: "Útil", en: "Helpful" },
      caption: {
        es: "Cerebro grande, con muchas conexiones nuevas.",
        en: "A bigger brain, with many new connections.",
      },
      zones: { Z1: "glowing", Z2: "glowing", Z3: "glowing", Z4: "glowing" },
    },
    yellow: {
      bg: "#EAB308",
      ring: "#FDE68A",
      label: { es: "Sin estrategia", en: "No strategy" },
      caption: {
        es: "Cerebro mediano, con algunas conexiones.",
        en: "A medium brain, with some connections.",
      },
      zones: { Z1: "dim", Z2: "dim", Z3: "resting", Z4: "resting" },
    },
    red: {
      bg: "#EF4444",
      ring: "#FCA5A5",
      label: { es: "No útil", en: "Not helpful" },
      caption: {
        es: "Cerebro pequeño, sin conexiones.",
        en: "A small brain, with no connections.",
      },
      zones: { Z1: "resting", Z2: "resting", Z3: "resting", Z4: "resting" },
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
        {current ? (
          <div key={active} className="fade-in flex flex-col items-center">
            <BrainScanner size="medium" zones={current.zones} />
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
