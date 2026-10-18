import { describe, it, expect } from 'vitest';
import {
  addAcrossResult,
  addFractions,
  equivalentFraction,
  fracEquals,
  isValidFrac,
} from '../fraction';

describe('isValidFrac', () => {
  it('accepts a normal fraction', () => {
    expect(isValidFrac({ n: 2, d: 5 })).toBe(true);
  });
  it('rejects a zero denominator', () => {
    expect(isValidFrac({ n: 2, d: 0 })).toBe(false);
  });
  it('rejects non-integer parts', () => {
    expect(isValidFrac({ n: 1.5, d: 2 })).toBe(false);
    expect(isValidFrac({ n: 1, d: NaN })).toBe(false);
  });
});

describe('fracEquals (value comparison by cross-multiplication)', () => {
  it('treats unreduced equivalents as equal', () => {
    expect(fracEquals({ n: 5, d: 6 }, { n: 10, d: 12 })).toBe(true);
  });
  it('distinguishes the correct sum from the add-across value', () => {
    expect(fracEquals({ n: 5, d: 6 }, { n: 2, d: 5 })).toBe(false);
  });
});

describe('addFractions', () => {
  it('adds 1/2 + 1/3 to 5/6 by value', () => {
    const sum = addFractions({ n: 1, d: 2 }, { n: 1, d: 3 });
    expect(fracEquals(sum, { n: 5, d: 6 })).toBe(true);
  });
});

describe('addAcrossResult', () => {
  it('produces 2/5 for 1/2 + 1/3 (the detected misconception)', () => {
    expect(addAcrossResult({ n: 1, d: 2 }, { n: 1, d: 3 })).toEqual({ n: 2, d: 5 });
  });
  it('produces 3/7 for the mirrored 2/3 + 1/4', () => {
    expect(addAcrossResult({ n: 2, d: 3 }, { n: 1, d: 4 })).toEqual({ n: 3, d: 7 });
  });
});

describe('equivalentFraction', () => {
  it('finds 8 for 2/3 = ▢/12', () => {
    expect(equivalentFraction({ n: 2, d: 3 }, 12)).toBe(8);
  });
  it('finds 3 for 1/4 = ▢/12', () => {
    expect(equivalentFraction({ n: 1, d: 4 }, 12)).toBe(3);
  });
  it('returns null when not exactly representable', () => {
    expect(equivalentFraction({ n: 1, d: 3 }, 12)).toBe(4); // exact
    expect(equivalentFraction({ n: 1, d: 5 }, 12)).toBeNull(); // not exact
  });
});
