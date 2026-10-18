// Pure fraction math — the deterministic correctness core.
// No AI, no side effects. Everything here is unit-tested (see __tests__).
// Spec ref: spec.md > Fraction & Misconception Engine.

/** A fraction n/d. The denominator must be nonzero (guarded by isValidFrac). */
export type Frac = { n: number; d: number };

/**
 * True when the fraction is usable: both parts are finite numbers and the
 * denominator is nonzero. Enforces the PRD's nonzero-denominator rule (A4).
 */
export function isValidFrac(f: Frac): boolean {
  return Number.isInteger(f.n) && Number.isInteger(f.d) && f.d !== 0;
}

/**
 * Value equality by cross-multiplication, so unreduced equivalents count as
 * equal: 5/6 === 10/12 because 5*12 === 10*6. Assumes both denominators are
 * nonzero (callers validate input first).
 */
export function fracEquals(a: Frac, b: Frac): boolean {
  return a.n * b.d === b.n * a.d;
}

/** Proper sum a + b = (a.n*b.d + b.n*a.d) / (a.d*b.d). */
export function addFractions(a: Frac, b: Frac): Frac {
  return { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
}

/**
 * The add-across mistake: (tops + tops) / (bottoms + bottoms).
 * For 1/2 + 1/3 this yields 2/5 — the value we detect as the misconception.
 */
export function addAcrossResult(a: Frac, b: Frac): Frac {
  return { n: a.n + b.n, d: a.d + b.d };
}

/**
 * The numerator that makes `frac` equal to ?/targetDen, or null when it is not
 * exactly representable as an integer. Used by the rebuild step:
 * equivalentFraction(2/3, 12) === 8, equivalentFraction(1/4, 12) === 3.
 */
export function equivalentFraction(frac: Frac, targetDen: number): number | null {
  if (frac.d === 0 || targetDen === 0) return null;
  const scaled = frac.n * targetDen;
  if (scaled % frac.d !== 0) return null;
  return scaled / frac.d;
}
