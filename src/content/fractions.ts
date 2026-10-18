// Content library — all authored, deterministic data for the PoC.
// One concept (fraction addition, unlike denominators), one misconception
// (add-across). The schema is built to extend: adding a topic means adding
// data here, not rewriting the app.
// Spec ref: spec.md > Content Library, spec.md > Data Model.
// PRD ref: prd.md > The Core Journey, prd.md > Answer input & deterministic detection.

import type { Frac } from '../engine/fraction';

/** How a problem is presented. The delayed re-check uses the 'word' surface. */
export type Surface = 'plain' | 'word';

export type Misconception = {
  id: string;
  label: string;
  /** The value this misconception produces for the problem (authored, exact). */
  result: Frac;
};

export type Problem = {
  id: string;
  prompt: string;
  a: Frac;
  b: Frac;
  correct: Frac;
  misconceptions: Misconception[];
  surface: Surface;
};

/** One discrete line of Oopsy's written work; exactly one is the invalid step. */
export type Move = { id: string; text: string; isWrong: boolean };

export type PrincipleOption = { id: string; text: string; correct: boolean };

/** A fill-in-the-blank rebuild row: `label` shows `▢/den`; answer is answerNum.
 *  `hint` is the gentle nudge at 2 misses; `model` is the worked sub-step at the
 *  3rd miss (partial reveal — the child still picks the tile). */
export type RebuildStep = {
  label: string;
  answerNum: number;
  den: number;
  hint: string;
  model: string;
};

export type OopsySolution = {
  problemId: string;
  prompt: string;
  introLine: string;
  moves: Move[];
  wrongMoveId: string;
  principlePrompt: string;
  principleOptions: PrincipleOption[];
  principleHint: string;
  principleModel: string;
  rebuildSteps: RebuildStep[];
  /** Oopsy's wrong result (3/7), shown striking through into `repaired`. */
  wrong: Frac;
  repaired: Frac;
};

export type Concept = {
  id: string;
  title: string;
  problems: Problem[];
  oopsySolution: OopsySolution;
};

export const ADD_ACROSS = 'add-across';

const addAcross = (result: Frac): Misconception => ({
  id: ADD_ACROSS,
  label: 'Add the tops and the bottoms',
  result,
});

export const fractionAddition: Concept = {
  id: 'fraction-addition-unlike',
  title: 'Adding fractions with unlike denominators',
  problems: [
    {
      id: 'q1-diagnostic',
      prompt: '1/2 + 1/3',
      a: { n: 1, d: 2 },
      b: { n: 1, d: 3 },
      correct: { n: 5, d: 6 },
      misconceptions: [addAcross({ n: 2, d: 5 })],
      surface: 'plain',
    },
    {
      id: 'q3-transfer',
      prompt: '1/4 + 1/3',
      a: { n: 1, d: 4 },
      b: { n: 1, d: 3 },
      correct: { n: 7, d: 12 },
      misconceptions: [addAcross({ n: 2, d: 7 })],
      surface: 'plain',
    },
    {
      id: 'q4-recheck',
      prompt: 'A recipe needs 1/2 cup + 1/4 cup of oil. How much oil in total?',
      a: { n: 1, d: 2 },
      b: { n: 1, d: 4 },
      correct: { n: 3, d: 4 },
      misconceptions: [addAcross({ n: 2, d: 6 })],
      surface: 'word',
    },
  ],
  // Oopsy's mirrored mistake on a DIFFERENT problem: 2/3 + 1/4 = 3/7.
  // The invalid step is adding the bottoms; the tops step is fine, and the
  // final line is just the consequence of the wrong method.
  oopsySolution: {
    problemId: 'q2-mirror',
    prompt: '2/3 + 1/4',
    introLine: 'Easy! I\u2019ll just add the tops and the bottoms!',
    moves: [
      { id: 'm1', text: 'Tops: 2 + 1 = 3', isWrong: false },
      { id: 'm2', text: 'Bottoms: 3 + 4 = 7', isWrong: true },
      { id: 'm3', text: 'So 2/3 + 1/4 = 3/7', isWrong: false },
    ],
    wrongMoveId: 'm2',
    principlePrompt: 'What should Oopsy do first to fix this?',
    principleOptions: [
      { id: 'p1', text: 'Make the denominators the same first', correct: true },
      { id: 'p2', text: 'Add the tops and the bottoms', correct: false },
      { id: 'p3', text: 'Make the numerators the same first', correct: false },
    ],
    principleHint: 'You can only add fractions directly when the bottoms match. Which option gets the bottoms ready?',
    principleModel: 'To add these, make the denominators the same first \u2014 pick the option that says exactly that.',
    rebuildSteps: [
      {
        label: '2/3 = \u25a2/12',
        answerNum: 8,
        den: 12,
        hint: 'The bottom went 3 \u2192 12. What did we multiply it by?',
        model: '3 \u00d7 4 = 12, so multiply the top by 4 too: 2 \u00d7 4 = \u25a2.',
      },
      {
        label: '1/4 = \u25a2/12',
        answerNum: 3,
        den: 12,
        hint: '4 \u2192 12 is \u00d73. Do the same to the top.',
        model: '4 \u00d7 3 = 12, so 1 \u00d7 3 = \u25a2.',
      },
      {
        label: '8/12 + 3/12 = \u25a2/12',
        answerNum: 11,
        den: 12,
        hint: 'Now the bottoms match — just add the tops.',
        model: '8 + 3 = ▢, over 12.',
      },
    ],
    wrong: { n: 3, d: 7 },
    repaired: { n: 11, d: 12 },
  },
};

/** Convenience lookups used across the loop. */
export const problemsById: Record<string, Problem> = Object.fromEntries(
  fractionAddition.problems.map((p) => [p.id, p]),
);
