// Deterministic answer classification — no AI call is ever made.
// Distinguishes a correct *equivalent* fraction (e.g. 10/12 for 5/6) from the
// authored add-across value, which is a different value for every chosen
// unlike-denominator problem.
// Spec ref: spec.md > Fraction & Misconception Engine.
// PRD ref: prd.md > Answer input & deterministic detection.

import { fracEquals, isValidFrac, type Frac } from './fraction';
import type { Problem } from '../content/fractions';

export type DetectionResult =
  /** Zero denominator or otherwise unusable input. */
  | { kind: 'invalid' }
  /** Value equals the correct sum (reduced or equivalent). */
  | { kind: 'correct' }
  /** Value equals an authored misconception result. */
  | { kind: 'misconception'; misconceptionId: string }
  /** Neither correct nor a mapped misconception — bounded retry. */
  | { kind: 'other' };

/**
 * Classify a child's answer against a problem, purely by value.
 * Correct wins first (so equivalent fractions are accepted), then authored
 * misconceptions, then 'other'. Invalid input is rejected up front.
 */
export function detectAnswer(problem: Problem, answer: Frac): DetectionResult {
  if (!isValidFrac(answer)) return { kind: 'invalid' };

  if (fracEquals(answer, problem.correct)) return { kind: 'correct' };

  for (const m of problem.misconceptions) {
    if (fracEquals(answer, m.result)) {
      return { kind: 'misconception', misconceptionId: m.id };
    }
  }

  return { kind: 'other' };
}

/** True when the detected result is the add-across misconception specifically. */
export function isAddAcross(result: DetectionResult, addAcrossId: string): boolean {
  return result.kind === 'misconception' && result.misconceptionId === addAcrossId;
}
