// Loop state machine — the controller's rules for which step comes next.
// Explicit states mirroring prd.md > The Core Journey; guards block illegal
// jumps so the loop can never skip the kernel or land in a broken state.
// Spec ref: spec.md > Loop State Machine (Controller).

export type LoopState =
  | 'intro'
  | 'diagnostic'
  | 'mirror'
  | 'identify'
  | 'teach-principle'
  | 'teach-rebuild'
  | 'repair'
  | 'transfer'
  | 'recheck'
  | 'wrap';

/** Legal forward transitions. Retries are self-loops (handled by not advancing). */
const transitions: Record<LoopState, LoopState[]> = {
  intro: ['diagnostic'],
  // Both the add-across path and the correct-first-answer branch (A3) lead to
  // the mirror, where Oopsy demonstrates its OWN mistake.
  diagnostic: ['mirror'],
  mirror: ['identify'],
  identify: ['teach-principle'],
  'teach-principle': ['teach-rebuild'],
  'teach-rebuild': ['repair'],
  repair: ['transfer'],
  transfer: ['recheck'],
  recheck: ['wrap'],
  wrap: [],
};

/** True when moving from `from` to `to` is a legal step. */
export function canTransition(from: LoopState, to: LoopState): boolean {
  return transitions[from].includes(to);
}

/** The single legal next state, or null when there isn't exactly one. */
export function nextState(from: LoopState): LoopState | null {
  const options = transitions[from];
  return options.length === 1 ? options[0] : null;
}
