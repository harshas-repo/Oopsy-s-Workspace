import { describe, it, expect } from 'vitest';
import { canTransition, nextState } from '../machine';

describe('canTransition guards the loop', () => {
  it('allows the intended forward path', () => {
    expect(canTransition('intro', 'diagnostic')).toBe(true);
    expect(canTransition('diagnostic', 'mirror')).toBe(true);
    expect(canTransition('mirror', 'identify')).toBe(true);
    expect(canTransition('identify', 'teach-principle')).toBe(true);
    expect(canTransition('teach-principle', 'teach-rebuild')).toBe(true);
    expect(canTransition('teach-rebuild', 'repair')).toBe(true);
    expect(canTransition('repair', 'transfer')).toBe(true);
    expect(canTransition('transfer', 'recheck')).toBe(true);
    expect(canTransition('recheck', 'wrap')).toBe(true);
  });

  it('blocks skipping the kernel', () => {
    expect(canTransition('diagnostic', 'identify')).toBe(false);
    expect(canTransition('intro', 'wrap')).toBe(false);
    expect(canTransition('identify', 'repair')).toBe(false);
  });

  it('blocks going backwards and leaving wrap', () => {
    expect(canTransition('identify', 'diagnostic')).toBe(false);
    expect(canTransition('wrap', 'intro')).toBe(false);
  });
});

describe('nextState', () => {
  it('returns the single legal next step', () => {
    expect(nextState('mirror')).toBe('identify');
  });
  it('returns null at the end', () => {
    expect(nextState('wrap')).toBeNull();
  });
});
