// Notebook / solution panel — renders Oopsy's authored solution as discrete,
// tappable moves for the identify beat. Controlled: the parent owns which move
// was found (wrong) and which was a miss, and decides tap outcomes against the
// authored wrongMoveId, so the answer is never present in this component's DOM.
// Spec ref: spec.md > Notebook / Solution Panel (Identify + Rebuild).
// PRD ref: prd.md > Catch Oopsy's mistake (identify).

import type { Move } from '../content/fractions';
import { motion } from 'framer-motion';
import { shakeX, wobbleRotate } from '../motion/presets';

type NotebookProps = {
  prompt: string;
  moves: Move[];
  /** Tapping is only enabled during the identify step. */
  interactive: boolean;
  foundId: string | null;
  missId: string | null;
  onTap: (move: Move) => void;
};

export function Notebook({ prompt, moves, interactive, foundId, missId, onTap }: NotebookProps) {
  return (
    <div className="notebook">
      <div className="notebook__prompt">Oopsy's work: {prompt}</div>
      <ul className="notebook__moves">
        {moves.map((move) => {
          const isFound = foundId === move.id;
          const isMiss = missId === move.id;
          const className = ['move', isFound ? 'move--wrong' : '', isMiss ? 'move--miss' : '']
            .filter(Boolean)
            .join(' ');
          return (
            <li key={move.id}>
              <motion.button
                type="button"
                className={className}
                disabled={!interactive || foundId !== null}
                aria-pressed={isFound}
                onClick={() => onTap(move)}
                animate={isFound ? wobbleRotate : isMiss ? shakeX : { rotate: 0, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {move.text}
              </motion.button>
            </li>
          );
        })}
      </ul>
      {foundId && (
        <p className="notebook__found" role="status">
          You found the step that went wrong.
        </p>
      )}
    </div>
  );
}
