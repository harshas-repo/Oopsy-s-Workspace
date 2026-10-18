import { describe, it, expect } from 'vitest';
import { detectAnswer } from '../detection';
import { ADD_ACROSS, problemsById } from '../../content/fractions';

const q1 = problemsById['q1-diagnostic'];

describe('detectAnswer on 1/2 + 1/3 (Q1)', () => {
  it('maps 2/5 to the add-across misconception', () => {
    expect(detectAnswer(q1, { n: 2, d: 5 })).toEqual({
      kind: 'misconception',
      misconceptionId: ADD_ACROSS,
    });
  });

  it('maps 5/6 to correct', () => {
    expect(detectAnswer(q1, { n: 5, d: 6 })).toEqual({ kind: 'correct' });
  });

  it('accepts an unreduced equivalent (10/12) as correct', () => {
    expect(detectAnswer(q1, { n: 10, d: 12 })).toEqual({ kind: 'correct' });
  });

  it('maps an unrelated value (1/5) to other (bounded retry)', () => {
    expect(detectAnswer(q1, { n: 1, d: 5 })).toEqual({ kind: 'other' });
  });

  it('rejects a zero denominator as invalid', () => {
    expect(detectAnswer(q1, { n: 2, d: 0 })).toEqual({ kind: 'invalid' });
  });
});

describe('detection generalizes to the other problems', () => {
  it('transfer 1/4 + 1/3: 7/12 correct, 2/7 add-across', () => {
    const q3 = problemsById['q3-transfer'];
    expect(detectAnswer(q3, { n: 7, d: 12 })).toEqual({ kind: 'correct' });
    expect(detectAnswer(q3, { n: 2, d: 7 })).toEqual({
      kind: 'misconception',
      misconceptionId: ADD_ACROSS,
    });
  });

  it('re-check 1/2 + 1/4: 3/4 correct, 2/6 add-across', () => {
    const q4 = problemsById['q4-recheck'];
    expect(detectAnswer(q4, { n: 3, d: 4 })).toEqual({ kind: 'correct' });
    expect(detectAnswer(q4, { n: 2, d: 6 })).toEqual({
      kind: 'misconception',
      misconceptionId: ADD_ACROSS,
    });
  });
});
