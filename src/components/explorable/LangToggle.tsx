import type { Lang } from "./i18n";

export default function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      className="fixed top-3 right-3 z-40 flex rounded-full border border-[color:var(--teal)] bg-[color:var(--bg)]/80 backdrop-blur p-1"
      role="group"
      aria-label="Language"
    >
      {(["es", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className="px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors"
          style={{
            backgroundColor: lang === l ? "var(--teal)" : "transparent",
            color: lang === l ? "var(--bg)" : "var(--teal)",
            minHeight: 32,
            minWidth: 36,
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
