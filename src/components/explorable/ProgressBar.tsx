import { stageLabels } from "./i18n";
import type { Lang } from "./i18n";

export default function ProgressBar({ stage, lang }: { stage: number; lang: Lang }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-[color:var(--bg)]/90 backdrop-blur border-b border-[color:var(--stage-upcoming)]">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-4" aria-label="Progress">
        {stageLabels.map((s, i) => {
          const idx = i + 1;
          const isActive = idx === stage;
          const isDone = idx < stage;
          const color = isActive ? "var(--teal)" : isDone ? "#FFFFFF" : "var(--stage-upcoming)";
          return (
            <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: isActive || isDone ? color : "transparent",
                  border: `2px solid ${color}`,
                  color: isActive || isDone ? "var(--bg)" : color,
                }}
                aria-current={isActive ? "step" : undefined}
              >
                {idx}
              </div>
              <span
                className="hidden md:block text-xs truncate"
                style={{ color }}
              >
                {lang === "es" ? s.es : s.en}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
