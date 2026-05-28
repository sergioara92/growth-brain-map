import type { ReactNode } from "react";

export function NextButton({
  onClick,
  disabled,
  children,
  pulse,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  pulse?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-bold transition-all ${pulse ? "cta-pulse" : ""}`}
      style={{
        backgroundColor: disabled ? "var(--stage-upcoming)" : "var(--coral)",
        color: disabled ? "var(--muted)" : "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 48,
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 rounded-full font-bold border-2 border-[color:var(--teal)] text-[color:var(--teal)] hover:bg-[color:var(--teal)] hover:text-[color:var(--bg)] transition-colors"
      style={{ minHeight: 48 }}
    >
      {children}
    </button>
  );
}
