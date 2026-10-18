import { describe, it, expect } from 'vitest';
import { fractionAddition } from '../fractions';
import { addFractions, equivalentFraction } from '../../engine/fraction';

const solution = fractionAddition.oopsySolution;

describe('authored rebuild answers are mathematically correct', () => {
  it('2/3 = 8/12', () => {
    expect(equivalentFraction({ n: 2, d: 3 }, 12)).toBe(solution.rebuildSteps[0].answerNum);
  });

  it('1/4 = 3/12', () => {
    expect(equivalentFraction({ n: 1, d: 4 }, 12)).toBe(solution.rebuildSteps[1].answerNum);
  });

  it('8/12 + 3/12 = 11/12', () => {
    const sum = addFractions({ n: 8, d: 12 }, { n: 3, d: 12 });
    expect(equivalentFraction(sum, 12)).toBe(solution.rebuildSteps[2].answerNum);
  });

  it('the repaired value equals the true sum 2/3 + 1/4', () => {
    const trueSum = addFractions({ n: 2, d: 3 }, { n: 1, d: 4 });
    // repaired 11/12 must equal the true sum by value
    expect(solution.repaired.n * trueSum.d).toBe(trueSum.n * solution.repaired.d);
  });
});

describe('principle options', () => {
  it('has exactly one correct option', () => {
    const correct = solution.principleOptions.filter((o) => o.correct);
    expect(correct).toHaveLength(1);
    expect(solution.principleOptions.length).toBeGreaterThan(1);
  });
});

describe('identify beat', () => {
  it('has exactly one invalid move and wrongMoveId points at it', () => {
    const wrong = solution.moves.filter((m) => m.isWrong);
    expect(wrong).toHaveLength(1);
    expect(solution.wrongMoveId).toBe(wrong[0].id);
  });
});
