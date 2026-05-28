import { useState } from "react";
import type { Lang } from "./i18n";
import { t } from "./i18n";
import Stage2A from "./Stage2A";
import Stage2B from "./Stage2B";

export default function Stage2({
  lang,
  connections,
  setConnections,
  onNext,
}: {
  lang: Lang;
  connections: Record<string, number>;
  setConnections: (c: Record<string, number>) => void;
  onNext: () => void;
}) {
  const [sub, setSub] = useState<"2A" | "2B">("2A");
  const [phase, setPhase] = useState<"in" | "out">("in");

  const goB = () => {
    setPhase("out");
    setTimeout(() => {
      setSub("2B");
      setTimeout(() => setPhase("in"), 200);
    }, 400);
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-2 text-center">
        <span className="text-xs text-[color:var(--muted)]">
          {sub === "2A" ? "1 / 2" : "2 / 2"} — {t(lang, "Así funciona el cerebro", "How the brain works")}
        </span>
      </div>
      <div
        style={{
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        {sub === "2A" ? (
          <Stage2A lang={lang} connections={connections} setConnections={setConnections} onSubNext={goB} />
        ) : (
          <Stage2B lang={lang} onNext={onNext} />
        )}
      </div>
    </div>
  );
}
