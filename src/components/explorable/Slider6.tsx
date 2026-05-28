import { useId } from "react";

export default function Slider6({
  value,
  onChange,
  leftLabel,
  rightLabel,
  ghost,
}: {
  value: number | null;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  ghost?: number | null;
}) {
  const id = useId();
  const nodes = [1, 2, 3, 4, 5, 6];
  const fillPct = value ? ((value - 1) / 5) * 100 : 0;
  const ghostPct = ghost ? ((ghost - 1) / 5) * 100 : 0;
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-10" role="group" aria-labelledby={id}>
        {/* track */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[color:var(--stage-upcoming)]" />
        {/* fill */}
        {value && (
          <div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[color:var(--teal)] transition-all duration-200"
            style={{ width: `${fillPct}%` }}
          />
        )}
        {/* ghost connector line */}
        {ghost && value && ghost !== value && (
          <div
            className="absolute top-1/2 h-[1px] -translate-y-1/2 bg-[color:var(--gold)] opacity-70"
            style={{
              left: `${Math.min(ghostPct, fillPct)}%`,
              width: `${Math.abs(ghostPct - fillPct)}%`,
            }}
          />
        )}
        {/* ghost marker */}
        {ghost && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${ghostPct}%` }}
          >
            <div className="w-4 h-4 rounded-full border border-[color:var(--gold)]" />
          </div>
        )}
        {/* nodes */}
        {nodes.map((n) => {
          const pct = ((n - 1) / 5) * 100;
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${n} / 6`}
              onClick={() => onChange(n)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" && value && value > 1) onChange(value - 1);
                if (e.key === "ArrowRight" && value && value < 6) onChange(value + 1);
                if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !value) onChange(n);
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
              style={{ left: `${pct}%`, minWidth: 44, minHeight: 44 }}
            >
              <span
                className="block rounded-full transition-all duration-200"
                style={{
                  width: selected ? 28 : 20,
                  height: selected ? 28 : 20,
                  backgroundColor: selected ? "var(--teal)" : "var(--stage-upcoming)",
                  boxShadow: selected ? "0 0 12px rgba(0,194,199,0.5)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-xs text-[color:var(--muted)]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {ghost && (
        <div
          className="relative text-[10px] text-[color:var(--gold)] mt-1 h-3"
          aria-hidden
        >
          <span
            className="absolute -translate-x-1/2"
            style={{ left: `${ghostPct}%` }}
          >
            {leftLabel === "Muy de acuerdo" ? "antes" : "before"}
          </span>
        </div>
      )}
    </div>
  );
}
