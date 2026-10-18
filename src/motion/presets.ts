// Purposeful motion presets — one place for the loop's animation language so
// every beat moves consistently and supports the learning (never decorates).
// Reduced-motion is handled globally by <MotionConfig reducedMotion="user">.
// Spec ref: spec.md > Animation Layer.

import type { Transition } from 'framer-motion';

/** Shared spring so reveals and reactions feel like one physical world. */
export const springy: Transition = { type: 'spring', stiffness: 320, damping: 26 };

/** A new challenge/step slides up into the workbench. */
export const panelReveal = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
};

/** The repaired answer pops into place. */
export const popIn = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
};

/** The wrong solution is struck and fades as it is erased. */
export const eraseOut = {
  initial: { opacity: 1, rotate: 0 },
  animate: { opacity: 0.35, rotate: -3, scale: 0.94 },
};

/** Keyframe wobble for the mistaken number / step. */
export const wobbleRotate = { rotate: [0, -6, 6, -4, 4, 0] };

/** Keyframe nudge for a tapped-but-fine step. */
export const shakeX = { x: [0, -6, 6, -4, 4, 0] };

/** Oopsy's physical react when his expression changes. */
export const reactIn = {
  initial: { scale: 0.9, y: 8 },
  animate: { scale: 1, y: 0 },
};
