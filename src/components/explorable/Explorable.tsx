import { useState } from "react";
import type { Lang } from "./i18n";
import LangToggle from "./LangToggle";
import ProgressBar from "./ProgressBar";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3Bridge from "./Stage3Bridge";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";
import Stage5 from "./Stage5";
import Stage5Brains from "./Stage5Brains";
import Stage6 from "./Stage6";

type Col = "util" | "no-util" | "sin-estrategia";

export default function Explorable() {
  const [lang, setLang] = useState<Lang>("es");
  const [stage, setStage] = useState(1);

  const [beliefs, setBeliefs] = useState<{ b1: number | null; b2: number | null; b3: number | null }>({ b1: null, b2: null, b3: null });
  const [connections, setConnections] = useState<Record<string, number>>({});
  const [challengeChoice, setChallengeChoice] = useState<"easy" | "hard" | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [placements, setPlacements] = useState<Record<string, Col | null>>({});
  const [verificarCount, setVerificarCount] = useState(0);
  const [finalBeliefs, setFinalBeliefs] = useState<{ b1: number | null; b2: number | null; b3: number | null }>({ b1: null, b2: null, b3: null });

  const next = () => setStage((s) => Math.min(8, s + 1));

  // Sidebar shows 7 logical neurons; stages 6 and 7 both map to neuron 3c.
  const displayStage = stage <= 6 ? stage : stage === 7 ? 6 : 7;

  return (
    <main className="min-h-dvh pl-[140px] md:pl-[220px] pr-2 sm:pr-4 pt-3 pb-6">
      <LangToggle lang={lang} setLang={setLang} />
      <ProgressBar stage={displayStage} lang={lang} />

      {stage === 1 && <Stage1 lang={lang} beliefs={beliefs} setBeliefs={setBeliefs} onNext={next} />}
      {stage === 2 && <Stage2 lang={lang} connections={connections} setConnections={setConnections} onNext={next} />}
      {stage === 3 && <Stage3Bridge lang={lang} onNext={next} />}
      {stage === 4 && <Stage3 lang={lang} choice={challengeChoice} setChoice={setChallengeChoice} onNext={next} />}
      {stage === 5 && <Stage4 lang={lang} challengeChoice={challengeChoice} attempts={attempts} setAttempts={setAttempts} onNext={next} />}
      {stage === 6 && <Stage5 lang={lang} placements={placements} setPlacements={setPlacements} verificarCount={verificarCount} setVerificarCount={setVerificarCount} onNext={next} />}
      {stage === 7 && <Stage5Brains lang={lang} onNext={next} />}
      {stage === 8 && <Stage6 lang={lang} originalBeliefs={beliefs} finalBeliefs={finalBeliefs} setFinalBeliefs={setFinalBeliefs} />}
    </main>
  );
}
