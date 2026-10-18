// Reusable fraction answer builder: bounded number tiles for numerator and
// denominator (A2), validated deterministically by the engine. Used by the
// diagnostic (Slice 1) and reused by the transfer + delayed re-check (Slice 4).
// Spec ref: spec.md > Number Tile Input, spec.md > Fraction & Misconception Engine.
// PRD ref: prd.md > Answer input & deterministic detection.

import { useState } from 'react';
import { NumberTiles } from './NumberTiles';
import { detectAnswer, type DetectionResult } from '../engine/detection';
import type { Problem } from '../content/fractions';
import { lines } from '../content/lines';
import { playSfx } from '../audio/sound';

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type FractionAnswerProps = {
  problem: Problem;
  /** Called with the engine's classification once both tiles are chosen. */
  onClassified: (result: DetectionResult) => void;
};

export function FractionAnswer({ problem, onClassified }: FractionAnswerProps) {
  const [num, setNum] = useState<number | null>(null);
  const [den, setDen] = useState<number | null>(null);
  const [incomplete, setIncomplete] = useState(false);

  function check() {
    if (num === null || den === null) {
      setIncomplete(true);
      return;
    }
    setIncomplete(false);
    playSfx('write');
    onClassified(detectAnswer(problem, { n: num, d: den }));
  }

  return (
    <div className="answer">
      <p className="answer__prompt">
        {problem.surface === 'word' ? problem.prompt : `${problem.prompt} = ?`}
      </p>
      <NumberTiles label="Top number" options={OPTIONS} value={num} onSelect={setNum} />
      <div className="answer__bar" aria-hidden="true" />
      <NumberTiles label="Bottom number" options={OPTIONS} value={den} onSelect={setDen} />

      <div className="answer__preview" aria-live="polite">
        Your answer: {num ?? '\u25a2'}/{den ?? '\u25a2'}
      </div>

      <button type="button" className="check-btn" onClick={check}>
        Check
      </button>

      {incomplete && <p className="answer__hint">{lines.pickBoth.caption}</p>}
    </div>
  );
}
