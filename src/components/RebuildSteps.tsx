// Rebuild — the tactile correction. The child fills bounded blanks with number
// tiles to reconstruct the equivalent fractions and the repaired sum, one step
// at a time. There is NO "reveal answer" control; the hint ladder only narrows
// or models a sub-step while the child still picks the tile.
// Spec ref: spec.md > Notebook / Solution Panel, > Number Tile Input, > Hint Ladder.
// PRD ref: prd.md > Teach Oopsy (correct), prd.md > Hint ladder (deterministic).

import { useState } from 'react';
import { NumberTiles } from './NumberTiles';
import type { RebuildStep } from '../content/fractions';
import { hintLevel } from '../loop/session';
import { playSfx } from '../audio/sound';

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const BLANK = '\u25a2';

type RebuildStepsProps = {
  steps: RebuildStep[];
  /** Session attempt counts, keyed `rebuild-<index>`; drives the hint ladder. */
  attempts: Record<string, number>;
  onMiss: (index: number) => void;
  onComplete: () => void;
};

export function RebuildSteps({ steps, attempts, onMiss, onComplete }: RebuildStepsProps) {
  const [picks, setPicks] = useState<(number | null)[]>(() => steps.map(() => null));
  const [solved, setSolved] = useState<boolean[]>(() => steps.map(() => false));
  const [missMsg, setMissMsg] = useState<string | null>(null);

  const activeIndex = solved.findIndex((s) => !s);

  function pick(i: number, n: number) {
    if (solved[i]) return;
    setPicks((p) => {
      const copy = [...p];
      copy[i] = n;
      return copy;
    });
    if (n === steps[i].answerNum) {
      playSfx('write');
      const next = [...solved];
      next[i] = true;
      setSolved(next);
      setMissMsg(null);
      if (next.every(Boolean)) onComplete();
    } else {
      setMissMsg('Not quite \u2014 try that blank again.');
      onMiss(i);
    }
  }

  return (
    <div className="rebuild">
      <p className="rebuild__intro">Rebuild Oopsy's solution the right way — fill in each blank.</p>
      <ol className="rebuild__steps">
        {steps.map((step, i) => {
          const isSolved = solved[i];
          const isActive = i === activeIndex;
          const label = isSolved ? step.label.replace(BLANK, String(picks[i])) : step.label;
          const level = hintLevel(attempts[`rebuild-${i}`] ?? 0);
          const stepClass = isSolved
            ? 'step step--solved'
            : isActive
              ? 'step step--active'
              : 'step step--locked';
          return (
            <li key={step.label} className={stepClass}>
              <div className="step__label">
                {label}
                {isSolved ? ' \u2713' : ''}
              </div>
              {isActive && (
                <div className="step__input">
                  <NumberTiles
                    label={`Top number for step ${i + 1}`}
                    options={OPTIONS}
                    value={picks[i]}
                    onSelect={(n) => pick(i, n)}
                  />
                  {missMsg && <p className="step__miss">{missMsg}</p>}
                  {level >= 1 && <p className="hint">{step.hint}</p>}
                  {level >= 2 && <p className="hint hint--model">{step.model}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
