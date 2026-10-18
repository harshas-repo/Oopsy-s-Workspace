// Principle choice — the ONE multiple-choice moment in the loop (the pivot that
// keeps this from being a quiz-with-mascot). Wrong picks retry with the hint
// ladder; there is no reveal of the rebuild answer here.
// Spec ref: spec.md > Notebook / Solution Panel, spec.md > Hint Ladder.
// PRD ref: prd.md > Teach Oopsy (correct), prd.md > Hint ladder (deterministic).

import type { PrincipleOption } from '../content/fractions';
import type { HintLevel } from '../loop/session';

type PrincipleChoiceProps = {
  prompt: string;
  options: PrincipleOption[];
  level: HintLevel;
  hint: string;
  model: string;
  onChoose: (option: PrincipleOption) => void;
};

export function PrincipleChoice({
  prompt,
  options,
  level,
  hint,
  model,
  onChoose,
}: PrincipleChoiceProps) {
  return (
    <div className="principle">
      <p className="principle__prompt">{prompt}</p>
      <div className="principle__options">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="principle__opt"
            onClick={() => onChoose(option)}
          >
            {option.text}
          </button>
        ))}
      </div>
      {level >= 1 && <p className="hint">{hint}</p>}
      {level >= 2 && <p className="hint hint--model">{model}</p>}
    </div>
  );
}
