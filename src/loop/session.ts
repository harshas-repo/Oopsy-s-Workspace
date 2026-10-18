// In-memory session + progress state. No localStorage, no backend — reload
// resets everything (PRD A5). Feeds the Wrap summary.
// Spec ref: spec.md > Session State & Progress Recorder, spec.md > Data Model.

import type { LoopState } from './machine';

/** The five observable success criteria (prd.md > Proof of success). */
export type Results = {
  /** The child's incorrect answer mapped to the intended (add-across) misconception. */
  mapped: boolean;
  /** Oopsy reproduced that misconception in its authored wrong solution. */
  mirrored: boolean;
  /** The child identified AND corrected Oopsy's mistake. */
  identifiedAndCorrected: boolean;
  /** The child solved a fresh same-concept question (immediate transfer). */
  transferCorrect: boolean;
  /** The child solved the delayed re-check (observed), regardless of outcome. */
  recheckDone: boolean;
  /** On the delayed re-check, the add-across error returned (true = returned). */
  recheckErrorReturned: boolean;
};

export type Session = {
  step: LoopState;
  /** Per-interactive-step wrong-attempt counts; drives the hint ladder. */
  attempts: Record<string, number>;
  detectedMisconception?: string;
  results: Results;
};

export function createSession(): Session {
  return {
    step: 'intro',
    attempts: {},
    results: {
      mapped: false,
      mirrored: false,
      identifiedAndCorrected: false,
      transferCorrect: false,
      recheckDone: false,
      recheckErrorReturned: false,
    },
  };
}

/** Immutably increment the wrong-attempt counter for a step (hint ladder). */
export function bumpAttempt(session: Session, key: string): Session {
  return {
    ...session,
    attempts: { ...session.attempts, [key]: (session.attempts[key] ?? 0) + 1 },
  };
}

/**
 * Deterministic hint ladder (prd.md > Hint ladder): a per-step wrong-attempt
 * counter. 0 = nothing, 1 = gentle hint at 2 misses, 2 = Oopsy models the
 * sub-step at the 3rd miss. There is never a global reveal.
 */
export type HintLevel = 0 | 1 | 2;

export function hintLevel(misses: number): HintLevel {
  if (misses >= 3) return 2;
  if (misses === 2) return 1;
  return 0;
}
