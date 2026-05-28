import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import BrainScanner, { type Zones, type ZoneState } from "./BrainScanner";
import { NextButton } from "./buttons";

function stronger(a: ZoneState, b: ZoneState): ZoneState {
  const order: ZoneState[] = ["resting", "dim", "active", "glowing"];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

export default function Stage4({
  lang,
  challengeChoice,
  attempts,
  setAttempts,
  onNext,
}: {
  lang: Lang;
  challengeChoice: "easy" | "hard" | null;
  attempts: number;
  setAttempts: (n: number) => void;
  onNext: () => void;
}) {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDone, setBannerDone] = useState(false);

  // base from stage 3
  const base: Zones = challengeChoice === "easy"
    ? { Z1: "dim", Z2: "dim", Z3: "resting", Z4: "resting" }
    : challengeChoice === "hard"
    ? { Z1: "glowing", Z2: "glowing", Z3: "active", Z4: "active" }
    : { Z1: "resting", Z2: "resting", Z3: "resting", Z4: "resting" };

  // accumulate per attempt
  let add: Partial<Zones> = {};
  if (attempts >= 1) add.Z4 = "dim";
  if (attempts >= 2) add.Z4 = "active";
  if (attempts >= 3) add.Z3 = "active";
  if (attempts >= 4) add.Z1 = "active";
  if (attempts >= 5) add = { Z1: "glowing", Z2: "glowing", Z3: "glowing", Z4: "glowing" };

  const zones: Zones = {
    Z1: stronger(base.Z1, (add.Z1 ?? "resting") as ZoneState),
    Z2: stronger(base.Z2, (add.Z2 ?? "resting") as ZoneState),
    Z3: stronger(base.Z3, (add.Z3 ?? "resting") as ZoneState),
    Z4: stronger(base.Z4, (add.Z4 ?? "resting") as ZoneState),
  };

  if (attempts >= 5 && !showBanner && !bannerDone) {
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
      setBannerDone(true);
    }, 4000);
  }

  const click = () => setAttempts(attempts + 1);

  const attemptLabel = (() => {
    if (attempts === 0) return "";
    if (attempts === 1) return t(lang, "Primer intento. Normal equivocarse.", "First attempt. Normal to make mistakes.");
    if (attempts === 2) return t(lang, "Segundo intento. Tu cerebro está ajustando.", "Second attempt. Your brain is adjusting.");
    if (attempts === 3) return t(lang, "Tercer intento. Algo está cambiando.", "Third attempt. Something is changing.");
    if (attempts === 4) return t(lang, "Cuarto intento. Las conexiones se fortalecen.", "Fourth attempt. Connections are strengthening.");
    return t(lang, "¡Lo lograste! El error fue parte del proceso.", "You got it! The mistake was part of the process.");
  })();

  const activeCount = Object.values(zones).filter((s) => s === "active" || s === "glowing").length;

  const icons = Array.from({ length: attempts }).map((_, i) => {
    const n = i + 1;
    if (n <= 2) return { ic: "✗", color: "#FF6B6B" };
    if (n <= 4) return { ic: "◑", color: "#FFD166" };
    return { ic: "✓", color: "#00C2C7" };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="fade-in">
          {challengeChoice === "hard"
            ? t(
                lang,
                "Elegiste el problema difícil. Lo que viene con eso es inevitable...",
                "You chose the hard problem. What comes with that is inevitable...",
              )
            : t(
                lang,
                "Imaginá que ahora decidís intentar el problema difícil. Porque en algún momento, vas a tener que hacerlo.",
                "Imagine you now decide to try the hard problem. Because at some point, you'll have to.",
              )}
        </p>
        <p className="text-2xl font-bold fade-in" style={{ animationDelay: "1200ms" }}>
          {t(lang, "Te vas a equivocar.", "You're going to make mistakes.")}
        </p>
        <p className="fade-in" style={{ animationDelay: "2200ms" }}>
          {t(
            lang,
            "Y eso — aunque no lo parezca — es exactamente lo que tu cerebro necesita.",
            "And that — even if it doesn't feel like it — is exactly what your brain needs.",
          )}
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-8 slide-up" style={{ animationDelay: "2800ms" }}>
        <div>
          <div className="rounded-xl border border-[color:var(--stage-upcoming)] p-5">
            <p className="text-sm text-[color:var(--muted)]">{t(lang, "Problema:", "Problem:")}</p>
            <p className="text-xl font-bold mt-2">x² + 5x + 6 = 0</p>
            <button
              type="button"
              onClick={click}
              className="mt-4 w-full rounded-full font-bold text-white"
              style={{ backgroundColor: "var(--coral)", minHeight: 48 }}
            >
              {t(lang, "Intentar de nuevo 🔁", "Try again 🔁")}
            </button>
            <div className="mt-4 flex flex-wrap gap-1.5 min-h-[28px]">
              {icons.map((i, idx) => (
                <span key={idx} className="scale-in text-lg" style={{ color: i.color, width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {i.ic}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm" aria-live="polite">{attemptLabel}</p>
            {attempts >= 2 && (
              <p className="mt-2 text-xs italic text-[color:var(--teal)]/80 fade-in">
                {t(
                  lang,
                  "Cada intento libera neurotransmisores que refuerzan la conexión 🔬",
                  "Each attempt releases neurotransmitters that reinforce the connection 🔬",
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          {showBanner && (
            <div className="absolute -top-4 left-0 right-0 bg-[color:var(--teal)] text-[color:var(--bg)] p-3 text-sm font-bold text-center slide-down rounded-lg z-10">
              {t(
                lang,
                "Esto es lo que se siente aprender de verdad. No la primera vez que lo intentás — sino cuando seguís intentando.",
                "This is what real learning feels like. Not the first time you try — but when you keep trying.",
              )}
            </div>
          )}
          <BrainScanner
            zones={zones}
            label={t(lang, `Conexiones construidas en este intento: ${activeCount}`, `Connections built in this attempt: ${activeCount}`)}
            size="medium"
          />
        </div>
      </div>

      {attempts >= 3 && (
        <div className="mt-10 flex justify-center fade-in">
          <NextButton onClick={onNext}>{t(lang, "Siguiente →", "Next →")}</NextButton>
        </div>
      )}
    </div>
  );
}
